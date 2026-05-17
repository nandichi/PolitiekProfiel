/**
 * Persistente cache voor TK-stemgedrag aggregaties.
 *
 * Backend: Neon Postgres (één database voor alles). Tabellen:
 *  - `tk_voting_party`  – per (party_slug, theme): voor/tegen/onthouding totaal
 *  - `tk_voting_motion` – per motie: titel, datum, thema, partij-stemmen
 *
 * Als er geen `DATABASE_URL` is (bv. tijdens preview build zonder env), valt
 * alles terug op een in-memory cache. Dat is alleen geldig binnen één
 * serverless invocation, maar voorkomt build- en lint-failures.
 */
import "server-only";

import { getNeonSql, isNeonConfigured } from "@/lib/neon-client";
import type { ThemeId } from "@/lib/themes";

export interface PartyThemeVoting {
  partySlug: string;
  theme: ThemeId | "overig";
  voor: number;
  tegen: number;
  onthouding: number;
  totaal: number;
  /** Percentage 'voor' van totaal (afgerond op 0 decimalen). */
  voorPct: number;
  /** Updated-stempel ISO. */
  updatedAt: string;
}

export interface MotionRecord {
  besluitId: string;
  zaakNummer?: string;
  titel: string;
  onderwerp?: string;
  datum: string;
  theme: ThemeId | "overig";
  stemmen: Record<string, "voor" | "tegen" | "onthouding">;
}

let memoryParty: Map<string, PartyThemeVoting> | null = null;
let memoryMotions: Map<string, MotionRecord> | null = null;

function partyKey(slug: string, theme: PartyThemeVoting["theme"]): string {
  return `${slug}__${theme}`;
}

function rowToPartyVoting(row: Record<string, unknown>): PartyThemeVoting {
  return {
    partySlug: String(row.party_slug),
    theme: row.theme as PartyThemeVoting["theme"],
    voor: Number(row.voor ?? 0),
    tegen: Number(row.tegen ?? 0),
    onthouding: Number(row.onthouding ?? 0),
    totaal: Number(row.totaal ?? 0),
    voorPct: Number(row.voor_pct ?? 0),
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : String(row.updated_at),
  };
}

function rowToMotion(row: Record<string, unknown>): MotionRecord {
  const stemmen =
    typeof row.stemmen === "string"
      ? (JSON.parse(row.stemmen) as MotionRecord["stemmen"])
      : (row.stemmen as MotionRecord["stemmen"]);
  return {
    besluitId: String(row.besluit_id),
    zaakNummer: row.zaak_nummer ? String(row.zaak_nummer) : undefined,
    titel: String(row.titel),
    onderwerp: row.onderwerp ? String(row.onderwerp) : undefined,
    datum:
      row.datum instanceof Date ? row.datum.toISOString() : String(row.datum),
    theme: row.theme as MotionRecord["theme"],
    stemmen,
  };
}

export async function loadPartyVoting(): Promise<PartyThemeVoting[]> {
  if (isNeonConfigured()) {
    const sql = getNeonSql();
    const rows = (await sql`SELECT * FROM tk_voting_party`) as Record<
      string,
      unknown
    >[];
    return rows.map(rowToPartyVoting);
  }
  if (!memoryParty) memoryParty = new Map();
  return Array.from(memoryParty.values());
}

export async function loadPartyVotingByTheme(
  partySlug: string,
): Promise<PartyThemeVoting[]> {
  if (isNeonConfigured()) {
    const sql = getNeonSql();
    const rows = (await sql`SELECT * FROM tk_voting_party WHERE party_slug = ${partySlug}`) as Record<
      string,
      unknown
    >[];
    return rows.map(rowToPartyVoting);
  }
  if (!memoryParty) memoryParty = new Map();
  return Array.from(memoryParty.values()).filter(
    (v) => v.partySlug === partySlug,
  );
}

export async function upsertPartyVoting(
  records: PartyThemeVoting[],
): Promise<void> {
  if (records.length === 0) return;
  if (isNeonConfigured()) {
    const sql = getNeonSql();
    // Bulk insert via single query met UNNEST-pattern is sneller, maar HTTP
    // driver houdt het simpel: sequentiële prepared statements binnen één
    // batch zijn snel genoeg voor < 1000 records per refresh.
    for (const r of records) {
      await sql`
        INSERT INTO tk_voting_party
          (party_slug, theme, voor, tegen, onthouding, totaal, voor_pct, updated_at)
        VALUES
          (${r.partySlug}, ${r.theme}, ${r.voor}, ${r.tegen}, ${r.onthouding},
           ${r.totaal}, ${r.voorPct}, ${r.updatedAt})
        ON CONFLICT (party_slug, theme) DO UPDATE SET
          voor = EXCLUDED.voor,
          tegen = EXCLUDED.tegen,
          onthouding = EXCLUDED.onthouding,
          totaal = EXCLUDED.totaal,
          voor_pct = EXCLUDED.voor_pct,
          updated_at = EXCLUDED.updated_at
      `;
    }
    return;
  }
  if (!memoryParty) memoryParty = new Map();
  for (const r of records) {
    memoryParty.set(partyKey(r.partySlug, r.theme), r);
  }
}

export async function loadRecentMotions(
  limit = 30,
  theme?: ThemeId,
): Promise<MotionRecord[]> {
  if (isNeonConfigured()) {
    const sql = getNeonSql();
    const rows = (theme
      ? await sql`
          SELECT * FROM tk_voting_motion
          WHERE theme = ${theme}
          ORDER BY datum DESC
          LIMIT ${limit}
        `
      : await sql`
          SELECT * FROM tk_voting_motion
          ORDER BY datum DESC
          LIMIT ${limit}
        `) as Record<string, unknown>[];
    return rows.map(rowToMotion);
  }
  if (!memoryMotions) memoryMotions = new Map();
  const all = Array.from(memoryMotions.values());
  const filtered = theme ? all.filter((m) => m.theme === theme) : all;
  return filtered.sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, limit);
}

export async function upsertMotions(records: MotionRecord[]): Promise<void> {
  if (records.length === 0) return;
  if (isNeonConfigured()) {
    const sql = getNeonSql();
    for (const m of records) {
      await sql`
        INSERT INTO tk_voting_motion
          (besluit_id, zaak_nummer, titel, onderwerp, datum, theme, stemmen, updated_at)
        VALUES
          (${m.besluitId}, ${m.zaakNummer ?? null}, ${m.titel},
           ${m.onderwerp ?? null}, ${m.datum}, ${m.theme},
           ${JSON.stringify(m.stemmen)}::jsonb, now())
        ON CONFLICT (besluit_id) DO UPDATE SET
          zaak_nummer = EXCLUDED.zaak_nummer,
          titel = EXCLUDED.titel,
          onderwerp = EXCLUDED.onderwerp,
          datum = EXCLUDED.datum,
          theme = EXCLUDED.theme,
          stemmen = EXCLUDED.stemmen,
          updated_at = now()
      `;
    }
    return;
  }
  if (!memoryMotions) memoryMotions = new Map();
  for (const m of records) memoryMotions.set(m.besluitId, m);
}
