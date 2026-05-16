import "server-only";

import { payload } from "@/lib/payload";
import type { DimensionId, Tier } from "@/lib/dimensions";

export interface QuizQuestion {
  id: number;
  statement: string;
  dimension: DimensionId;
  direction: 1 | -1;
  weight: number;
  tiers: Tier[];
  info: {
    context?: string;
    argumentsFor: string[];
    argumentsAgainst: string[];
    sources: { label: string; url: string }[];
  };
}

export async function getQuestionsForTier(tier: Tier): Promise<QuizQuestion[]> {
  const p = await payload();
  const res = await p.find({
    collection: "questions",
    where: { tiers: { contains: tier } },
    limit: 200,
    depth: 0,
    pagination: false,
  });

  const docs = res.docs as unknown as Array<{
    id: number;
    statement: string;
    dimension: DimensionId;
    direction: "positive" | "negative";
    weight?: number;
    tiers: Tier[];
    info?: {
      context?: string;
      argumentsFor?: { text: string }[];
      argumentsAgainst?: { text: string }[];
      sources?: { label: string; url: string }[];
    };
  }>;

  const mapped: QuizQuestion[] = docs.map((d) => ({
    id: d.id,
    statement: d.statement,
    dimension: d.dimension,
    direction: d.direction === "positive" ? 1 : -1,
    weight: d.weight ?? 1,
    tiers: d.tiers,
    info: {
      context: d.info?.context,
      argumentsFor: (d.info?.argumentsFor ?? []).map((x) => x.text),
      argumentsAgainst: (d.info?.argumentsAgainst ?? []).map((x) => x.text),
      sources: d.info?.sources ?? [],
    },
  }));

  mapped.sort((a, b) => {
    if (a.dimension !== b.dimension) {
      return a.dimension.localeCompare(b.dimension);
    }
    return a.id - b.id;
  });

  return interleaveByDimension(mapped);
}

function interleaveByDimension(questions: QuizQuestion[]): QuizQuestion[] {
  const groups = new Map<DimensionId, QuizQuestion[]>();
  for (const q of questions) {
    if (!groups.has(q.dimension)) groups.set(q.dimension, []);
    groups.get(q.dimension)!.push(q);
  }
  const order: DimensionId[] = [
    "economic",
    "social",
    "civil",
    "governance",
    "trust",
  ];
  const max = Math.max(...Array.from(groups.values()).map((g) => g.length));
  const out: QuizQuestion[] = [];
  for (let i = 0; i < max; i++) {
    for (const dim of order) {
      const g = groups.get(dim);
      if (g && g[i]) out.push(g[i]);
    }
  }
  return out;
}
