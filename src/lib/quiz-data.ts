import "server-only";

import { getStaticQuestions } from "@/lib/static-question-data";
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


export async function getQuestionPoolForTier(
  tier: Tier,
): Promise<QuizQuestion[]> {
  const staticQuestions = await getStaticQuestions();
  return staticQuestions.filter((question) => question.tiers.includes(tier)).map(
    (question) => ({
      id: question.id,
      statement: question.statement,
      dimension: question.dimension,
      direction: question.direction === "positive" ? 1 : -1,
      weight: question.weight ?? 1,
      tiers: question.tiers,
      depth: question.depth,
      discriminator: question.discriminator,
      themes: question.themes,
      info: question.info,
    }),
  );
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
