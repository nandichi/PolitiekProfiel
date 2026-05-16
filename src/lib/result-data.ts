import "server-only";

import { payload } from "@/lib/payload";
import type { DimensionScores } from "@/lib/scoring";

export interface IdeologyDoc {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: unknown;
  spectrumPosition: string;
  profileVector: DimensionScores;
  examplePeople: { text: string }[];
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

export async function getIdeologyBySlug(
  slug: string,
): Promise<IdeologyDoc | null> {
  const p = await payload();
  const res = await p.find({
    collection: "ideologies",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  if (res.docs.length === 0) return null;
  return res.docs[0] as unknown as IdeologyDoc;
}

export async function getAllIdeologies(): Promise<IdeologyDoc[]> {
  const p = await payload();
  const res = await p.find({
    collection: "ideologies",
    limit: 100,
    depth: 0,
    pagination: false,
  });
  return res.docs as unknown as IdeologyDoc[];
}

export async function getAllPoliticians(): Promise<PoliticianDoc[]> {
  const p = await payload();
  const res = await p.find({
    collection: "politicians",
    limit: 200,
    depth: 0,
    pagination: false,
  });
  return res.docs as unknown as PoliticianDoc[];
}

export async function getAllCountries(): Promise<CountryDoc[]> {
  const p = await payload();
  const res = await p.find({
    collection: "countries",
    limit: 200,
    depth: 0,
    pagination: false,
  });
  return res.docs as unknown as CountryDoc[];
}
