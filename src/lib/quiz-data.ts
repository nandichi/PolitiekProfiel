import "server-only";

import { payload } from "@/lib/payload";
import { TIER_QUESTION_COUNT, type DimensionId, type Tier } from "@/lib/dimensions";
import type { ThemeId } from "@/lib/themes";
import {
  pickInitialBatch,
  type AdaptiveQuestion,
  type QuestionDepth,
} from "@/lib/adaptive";

export interface QuizQuestion {
  id: number;
  statement: string;
  dimension: DimensionId;
  direction: 1 | -1;
  weight: number;
  tiers: Tier[];
  depth: QuestionDepth;
  discriminator: number;
  themes: ThemeId[];
  info: {
    context?: string;
    argumentsFor: string[];
    argumentsAgainst: string[];
    sources: { label: string; url: string }[];
  };
}

interface QuestionDoc {
  id: number;
  statement: string;
  dimension: DimensionId;
  direction: "positive" | "negative";
  weight?: number;
  tiers: Tier[];
  depth?: QuestionDepth;
  discriminator?: number;
  themes?: ThemeId[];
  info?: {
    context?: string;
    argumentsFor?: { text: string }[];
    argumentsAgainst?: { text: string }[];
    sources?: { label: string; url: string }[];
  };
}

function docToQuestion(d: QuestionDoc): QuizQuestion {
  return {
    id: d.id,
    statement: d.statement,
    dimension: d.dimension,
    direction: d.direction === "positive" ? 1 : -1,
    weight: d.weight ?? 1,
    tiers: d.tiers,
    depth: d.depth ?? "broad",
    discriminator: d.discriminator ?? 50,
    themes: Array.isArray(d.themes) ? d.themes : [],
    info: {
      context: d.info?.context,
      argumentsFor: (d.info?.argumentsFor ?? []).map((x) => x.text),
      argumentsAgainst: (d.info?.argumentsAgainst ?? []).map((x) => x.text),
      sources: d.info?.sources ?? [],
    },
  };
}

export async function getQuestionPoolForTier(
  tier: Tier,
): Promise<QuizQuestion[]> {
  const p = await payload();
  const res = await p.find({
    collection: "questions",
    where: { tiers: { contains: tier } },
    limit: 300,
    depth: 0,
    pagination: false,
  });
  const docs = res.docs as unknown as QuestionDoc[];
  return docs.map(docToQuestion);
}

export async function getInitialAdaptiveQuestions(
  tier: Tier,
): Promise<QuizQuestion[]> {
  const pool = await getQuestionPoolForTier(tier);
  const adaptivePool: AdaptiveQuestion[] = pool.map((q) => ({
    id: q.id,
    dimension: q.dimension,
    direction: q.direction,
    weight: q.weight,
    depth: q.depth,
    discriminator: q.discriminator,
    themes: q.themes,
  }));
  const initial = pickInitialBatch({
    tier,
    seenIds: [],
    answers: [],
    pool: adaptivePool,
  });
  const lookup = new Map(pool.map((q) => [q.id, q]));
  return initial
    .map((q) => lookup.get(q.id))
    .filter((q): q is QuizQuestion => q !== undefined);
}

export async function getQuestionsForTier(tier: Tier): Promise<QuizQuestion[]> {
  const pool = await getQuestionPoolForTier(tier);
  pool.sort((a, b) => {
    if (a.dimension !== b.dimension) {
      return a.dimension.localeCompare(b.dimension);
    }
    return a.id - b.id;
  });
  return interleaveByDimension(pool).slice(0, TIER_QUESTION_COUNT[tier]);
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
  const max = Math.max(0, ...Array.from(groups.values()).map((g) => g.length));
  const out: QuizQuestion[] = [];
  for (let i = 0; i < max; i++) {
    for (const dim of order) {
      const g = groups.get(dim);
      if (g && g[i]) out.push(g[i]);
    }
  }
  return out;
}
