import "server-only";

import { COUNTRIES } from "@/data/countries";
import { IDEOLOGY_READING } from "@/data/ideology-reading";
import { IDEOLOGIES } from "@/data/ideologies";
import { PARTIES } from "@/data/parties";
import { POLITICIANS } from "@/data/politicians";
import type { DimensionScores } from "@/lib/scoring";

/**
 * Resultaatpagina's lezen uit dezelfde versiebeheerde brondata als de publieke
 * naslagpagina's. Zo kan een oud CMS-record geen andere partij, politicus of
 * ideologie tonen dan de rest van de site.
 */
export interface FurtherReading {
  title: string;
  author: string;
  publisher?: string;
  url: string;
  note: string;
}

export interface IdeologyDoc {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  spectrumPosition: string;
  profileVector: DimensionScores;
  examplePeople: { text: string }[];
  furtherReading: FurtherReading[];
  sources: { label: string; url: string }[];
}

export interface PoliticianDoc {
  id: number;
  name: string;
  role: string;
  country: string;
  party: string;
  bio: string;
  positionVector: DimensionScores;
  isInternational: boolean;
  ideologySlugs?: string[];
  sources: { label: string; url: string }[];
}

export interface PartyDoc {
  id: number;
  name: string;
  abbreviation: string;
  slug: string;
  region: "NL" | "EU" | "US";
  regionType: "national" | "family" | "faction";
  country?: string;
  description: string;
  ideologySlugs: string[];
  positionVector: DimensionScores;
  founded?: string;
  leader?: string;
  factionLeader?: string;
  websiteUrl?: string;
  lastReviewed?: string;
  seatsTK2025?: number;
  coalitionStatus?: string;
  sources: { label: string; url: string }[];
}

export interface CountryDoc {
  id: number;
  name: string;
  countryCode: string;
  description: string;
  positionVector: DimensionScores;
  sources: { label: string; url: string }[];
}

const ideologies: IdeologyDoc[] = IDEOLOGIES.map((ideology, index) => ({
  ...ideology,
  id: index + 1,
  examplePeople: ideology.examplePeople.map((text) => ({ text })),
  furtherReading: IDEOLOGY_READING[ideology.slug] ?? [],
  sources: ideology.sources ?? [],
}));

const politicians: PoliticianDoc[] = POLITICIANS.map((politician, index) => ({
  ...politician,
  id: index + 1,
}));

const parties: PartyDoc[] = PARTIES.map((party, index) => ({
  ...party,
  id: index + 1,
}));

const countries: CountryDoc[] = COUNTRIES.map((country, index) => ({
  ...country,
  id: index + 1,
}));

export async function getIdeologyBySlug(slug: string): Promise<IdeologyDoc | null> {
  return ideologies.find((ideology) => ideology.slug === slug) ?? null;
}

export async function getAllIdeologies(): Promise<IdeologyDoc[]> {
  return ideologies;
}

export async function getAllPoliticians(): Promise<PoliticianDoc[]> {
  return politicians;
}

export async function getAllCountries(): Promise<CountryDoc[]> {
  return countries;
}

export async function getAllParties(): Promise<PartyDoc[]> {
  return parties;
}

export async function getPartiesByIdeology(ideologySlug: string): Promise<PartyDoc[]> {
  return parties.filter((party) => party.ideologySlugs.includes(ideologySlug));
}
