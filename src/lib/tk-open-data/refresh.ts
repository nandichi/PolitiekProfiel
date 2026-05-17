/**
 * Wekelijkse refresh van TK Open Data stemgedrag.
 *
 * Stappen:
 *  1. Haal stemmingen op sinds `since` (default = 8 dagen terug).
 *  2. Haal de besluiten op die bij die stemmingen horen.
 *  3. Haal de zaken op die bij die besluiten horen.
 *  4. Bepaal per zaak het thema (heuristische mapping).
 *  5. Aggregeer per (partij, thema) → voor/tegen/onthouding.
 *  6. Schrijf naar Firestore via `voting-store`.
 *
 * Tijdsbesteding: voor ~600 stemmingen per week is dit < 30s.
 */
import "server-only";

import {
  fetchRecenteStemmingen,
  fetchBesluitenByIds,
  fetchZakenByIds,
} from "@/lib/tk-open-data/client";
import { inferThemeFromText } from "@/lib/tk-open-data/theme-mapping";
import { tkFractieToSlug } from "@/lib/tk-open-data/party-aliases";
import {
  upsertPartyVoting,
  upsertMotions,
  loadPartyVoting,
  type PartyThemeVoting,
  type MotionRecord,
} from "@/lib/tk-open-data/voting-store";
import type { ThemeId } from "@/lib/themes";

const SOORT_TO_VOTE: Record<string, "voor" | "tegen" | "onthouding"> = {
  Voor: "voor",
  Tegen: "tegen",
  Onthouding: "onthouding",
};

export interface RefreshSummary {
  stemmingen: number;
  besluiten: number;
  zaken: number;
  motions: number;
  partyTotals: number;
  startedAt: string;
  finishedAt: string;
  errors: string[];
}

export async function refreshTkVoting(
  options: { since?: Date } = {},
): Promise<RefreshSummary> {
  const startedAt = new Date().toISOString();
  const since = options.since ?? new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  const errors: string[] = [];

  let stemmingenCount = 0;
  let besluitenCount = 0;
  let zakenCount = 0;
  let motionsWritten = 0;
  let partyTotalsWritten = 0;

  try {
    const stemmingen = await fetchRecenteStemmingen(since);
    stemmingenCount = stemmingen.length;
    if (stemmingen.length === 0) {
      return {
        stemmingen: 0,
        besluiten: 0,
        zaken: 0,
        motions: 0,
        partyTotals: 0,
        startedAt,
        finishedAt: new Date().toISOString(),
        errors,
      };
    }

    const besluitIds = Array.from(
      new Set(stemmingen.map((s) => s.Besluit_Id).filter(Boolean)),
    );
    const besluiten = await fetchBesluitenByIds(besluitIds);
    besluitenCount = besluiten.length;
    const besluitById = new Map(besluiten.map((b) => [b.Id, b]));

    const zaakIds = Array.from(
      new Set(
        besluiten
          .map((b) => b.Zaak_Id)
          .filter((id): id is string => Boolean(id)),
      ),
    );
    const zaken = await fetchZakenByIds(zaakIds);
    zakenCount = zaken.length;
    const zaakById = new Map(zaken.map((z) => [z.Id, z]));

    // Bepaal per besluit het thema (op basis van bijbehorende zaak)
    const themeByBesluit = new Map<string, ThemeId | "overig">();
    for (const b of besluiten) {
      const z = b.Zaak_Id ? zaakById.get(b.Zaak_Id) : null;
      const theme = z
        ? inferThemeFromText({ titel: z.Titel, onderwerp: z.Onderwerp })
        : null;
      themeByBesluit.set(b.Id, theme ?? "overig");
    }

    // Bouw motie-records: per besluit één entry met partij-stemmen
    const motionAccum = new Map<string, MotionRecord>();
    for (const s of stemmingen) {
      const fractieAfk = (s.ActorFractie ?? "").toUpperCase();
      const slug = fractieAfk ? tkFractieToSlug(fractieAfk) : null;
      if (!slug) continue;
      const vote = SOORT_TO_VOTE[s.Soort];
      if (!vote) continue;
      const besluit = besluitById.get(s.Besluit_Id);
      if (!besluit) continue;
      const zaak = besluit.Zaak_Id ? zaakById.get(besluit.Zaak_Id) : null;

      const existing = motionAccum.get(s.Besluit_Id) ?? {
        besluitId: s.Besluit_Id,
        zaakNummer: zaak?.Nummer,
        titel: zaak?.Titel ?? besluit.BesluitTekst ?? "Onbekend besluit",
        onderwerp: zaak?.Onderwerp,
        datum: s.GewijzigdOp,
        theme: themeByBesluit.get(s.Besluit_Id) ?? "overig",
        stemmen: {},
      };
      existing.stemmen[slug] = vote;
      motionAccum.set(s.Besluit_Id, existing);
    }

    const motions = Array.from(motionAccum.values());
    motionsWritten = motions.length;
    await upsertMotions(motions);

    // Aggregeer naar party-totals (alleen voor deze refresh-periode)
    type Acc = { voor: number; tegen: number; onthouding: number };
    const accumulator = new Map<string, Acc>();

    for (const m of motions) {
      for (const [slug, vote] of Object.entries(m.stemmen)) {
        const key = `${slug}__${m.theme}`;
        const existing = accumulator.get(key) ?? {
          voor: 0,
          tegen: 0,
          onthouding: 0,
        };
        existing[vote] += 1;
        accumulator.set(key, existing);
      }
    }

    // Merge met bestaande totalen
    const currentTotals = await loadPartyVoting();
    const totalsMap = new Map<string, PartyThemeVoting>(
      currentTotals.map((t) => [`${t.partySlug}__${t.theme}`, t]),
    );

    for (const [key, acc] of accumulator.entries()) {
      const [partySlug, themeRaw] = key.split("__");
      const theme = themeRaw as PartyThemeVoting["theme"];
      const existing = totalsMap.get(key);
      const voor = (existing?.voor ?? 0) + acc.voor;
      const tegen = (existing?.tegen ?? 0) + acc.tegen;
      const onthouding = (existing?.onthouding ?? 0) + acc.onthouding;
      const totaal = voor + tegen + onthouding;
      totalsMap.set(key, {
        partySlug,
        theme,
        voor,
        tegen,
        onthouding,
        totaal,
        voorPct: totaal > 0 ? Math.round((voor / totaal) * 100) : 0,
        updatedAt: new Date().toISOString(),
      });
    }

    await upsertPartyVoting(Array.from(totalsMap.values()));
    partyTotalsWritten = totalsMap.size;
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }

  return {
    stemmingen: stemmingenCount,
    besluiten: besluitenCount,
    zaken: zakenCount,
    motions: motionsWritten,
    partyTotals: partyTotalsWritten,
    startedAt,
    finishedAt: new Date().toISOString(),
    errors,
  };
}
