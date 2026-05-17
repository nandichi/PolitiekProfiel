/**
 * Server-only helpers voor het lezen van de seed-bestanden in `src/data/`.
 *
 * Belangrijk: dit is een statische, in-process data-source. Het Payload-CMS
 * blijft de editorial bron-van-waarheid (handmatige wijzigingen overschrijven
 * deze waardes), maar voor SSG/SSR feature-pages werken we hier direct
 * uit de seed zodat de site ook bouwt zonder werkende database.
 */
import "server-only";

import { POLITICIANS, type SeedPolitician } from "@/data/politicians";
import { PARTIES, type SeedParty } from "@/data/parties";
import { IDEOLOGIES, type SeedIdeology } from "@/data/ideologies";
import { COUNTRIES, type SeedCountry } from "@/data/countries";
import type { SeedQuestion } from "@/data/questions";
import { getAllSeedQuestions } from "@/data/questions";
import { tagQuestion } from "@/data/question-tagger";
import type { DimensionId } from "@/lib/dimensions";
import type { ThemeId } from "@/lib/themes";

export type { SeedPolitician, SeedParty, SeedIdeology, SeedCountry, SeedQuestion };

// ============== POLITICI ==============

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export interface PoliticianRecord extends SeedPolitician {
  slug: string;
}

export function getAllPoliticiansSeed(): PoliticianRecord[] {
  return POLITICIANS.map((p) => ({ ...p, slug: slugifyName(p.name) }));
}

export function getPoliticianBySlugSeed(
  slug: string,
): PoliticianRecord | null {
  return getAllPoliticiansSeed().find((p) => p.slug === slug) ?? null;
}

// ============== PARTIJEN ==============

export function getAllPartiesSeed(): SeedParty[] {
  return PARTIES;
}

export function getPartyBySlugSeed(slug: string): SeedParty | null {
  return PARTIES.find((p) => p.slug === slug) ?? null;
}

/**
 * Nederlandse partijen die op 17 mei 2026 een zetel hebben in de Tweede Kamer.
 * Geordend op zetelaantal aflopend.
 */
export function getActiveDutchParties(): SeedParty[] {
  return PARTIES.filter(
    (p) =>
      p.region === "NL" &&
      p.regionType === "national" &&
      (p.seatsTK2025 ?? 0) > 0,
  ).sort((a, b) => (b.seatsTK2025 ?? 0) - (a.seatsTK2025 ?? 0));
}

// ============== IDEOLOGIEËN ==============

export function getAllIdeologiesSeed(): SeedIdeology[] {
  return IDEOLOGIES;
}

export function getIdeologyBySlugSeed(slug: string): SeedIdeology | null {
  return IDEOLOGIES.find((i) => i.slug === slug) ?? null;
}

// ============== LANDEN ==============

export function getAllCountriesSeed(): SeedCountry[] {
  return COUNTRIES;
}

export function getCountryByCodeSeed(code: string): SeedCountry | null {
  const upper = code.toUpperCase();
  return COUNTRIES.find((c) => c.countryCode.toUpperCase() === upper) ?? null;
}

// ============== STELLINGEN ==============

export interface QuestionRecord extends SeedQuestion {
  /** Stabiele id: `dimension-letter + sequence` voor leesbare URL's. */
  id: string;
  themes: ThemeId[];
  depth: "broad" | "deep";
  discriminator: number;
}

let _cachedQuestions: QuestionRecord[] | null = null;

const DIMENSION_PREFIX: Record<DimensionId, string> = {
  economic: "e",
  social: "s",
  civil: "c",
  governance: "g",
  trust: "t",
};

export async function getAllQuestionsSeed(): Promise<QuestionRecord[]> {
  if (_cachedQuestions) return _cachedQuestions;
  const raw = await getAllSeedQuestions();
  const counters: Record<DimensionId, number> = {
    economic: 0,
    social: 0,
    civil: 0,
    governance: 0,
    trust: 0,
  };
  const records: QuestionRecord[] = raw.map((q) => {
    counters[q.dimension] += 1;
    const id = `${DIMENSION_PREFIX[q.dimension]}${String(
      counters[q.dimension],
    ).padStart(3, "0")}`;
    const tags = tagQuestion(q);
    return {
      ...q,
      id,
      themes: tags.themes,
      depth: tags.depth,
      discriminator: tags.discriminator,
    };
  });
  _cachedQuestions = records;
  return records;
}

export async function getQuestionByIdSeed(
  id: string,
): Promise<QuestionRecord | null> {
  const all = await getAllQuestionsSeed();
  return all.find((q) => q.id === id) ?? null;
}

export async function getRelatedQuestions(
  id: string,
  limit = 4,
): Promise<QuestionRecord[]> {
  const all = await getAllQuestionsSeed();
  const target = all.find((q) => q.id === id);
  if (!target) return [];
  return all
    .filter((q) => q.id !== id)
    .map((q) => {
      const sameDim = q.dimension === target.dimension ? 2 : 0;
      const overlap = (q.themes ?? []).filter((t) =>
        (target.themes ?? []).includes(t),
      ).length;
      return { q, score: sameDim + overlap };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.q);
}
