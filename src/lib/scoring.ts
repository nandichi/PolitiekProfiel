import {
  DIMENSION_IDS,
  type AnswerValue,
  type DimensionId,
} from "@/lib/dimensions";

export interface QuestionScoringMeta {
  id: string | number;
  dimension: DimensionId;
  direction: 1 | -1;
  weight?: number;
}

export interface RawAnswer {
  questionId: QuestionScoringMeta["id"];
  value: AnswerValue | null;
}

export type DimensionScores = Record<DimensionId, number>;

export interface ScoreBreakdown {
  scores: DimensionScores;
  answeredCount: number;
  skippedCount: number;
  totalQuestions: number;
}

export interface VectorTarget {
  vector: DimensionScores;
}

const ZERO: DimensionScores = {
  economic: 0,
  social: 0,
  civil: 0,
  governance: 0,
  trust: 0,
};

export function emptyScores(): DimensionScores {
  return { ...ZERO };
}

export function calculateScores(
  questions: ReadonlyArray<QuestionScoringMeta>,
  answers: ReadonlyArray<RawAnswer>,
): ScoreBreakdown {
  const byId = new Map<QuestionScoringMeta["id"], QuestionScoringMeta>();
  for (const q of questions) {
    byId.set(q.id, q);
  }

  const sums: DimensionScores = emptyScores();
  const maxAbs: DimensionScores = emptyScores();

  let answered = 0;
  let skipped = 0;

  for (const answer of answers) {
    const q = byId.get(answer.questionId);
    if (!q) continue;
    const weight = q.weight ?? 1;
    if (answer.value === null) {
      skipped += 1;
      continue;
    }
    if (answer.value === 0) {
      answered += 1;
      maxAbs[q.dimension] += 2 * weight;
      continue;
    }
    answered += 1;
    sums[q.dimension] += q.direction * answer.value * weight;
    maxAbs[q.dimension] += 2 * weight;
  }

  const scores = emptyScores();
  for (const dim of DIMENSION_IDS) {
    if (maxAbs[dim] === 0) {
      scores[dim] = 0;
    } else {
      const normalized = (sums[dim] / maxAbs[dim]) * 100;
      scores[dim] = Math.max(-100, Math.min(100, Math.round(normalized)));
    }
  }

  return {
    scores,
    answeredCount: answered,
    skippedCount: skipped,
    totalQuestions: questions.length,
  };
}

export function distance(a: DimensionScores, b: DimensionScores): number {
  let total = 0;
  for (const dim of DIMENSION_IDS) {
    const diff = a[dim] - b[dim];
    total += diff * diff;
  }
  return Math.sqrt(total);
}

export const MAX_DISTANCE = Math.sqrt(DIMENSION_IDS.length * 200 * 200);

export function similarityPercent(a: DimensionScores, b: DimensionScores): number {
  const d = distance(a, b);
  return Math.round(Math.max(0, Math.min(100, (1 - d / MAX_DISTANCE) * 100)));
}

export interface RankedMatch<T> {
  item: T;
  distance: number;
  similarity: number;
}

export function rankByDistance<T extends VectorTarget>(
  user: DimensionScores,
  items: ReadonlyArray<T>,
): RankedMatch<T>[] {
  return items
    .map<RankedMatch<T>>((item) => {
      const d = distance(user, item.vector);
      return {
        item,
        distance: d,
        similarity: Math.round(
          Math.max(0, Math.min(100, (1 - d / MAX_DISTANCE) * 100)),
        ),
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

export function bestMatch<T extends VectorTarget>(
  user: DimensionScores,
  items: ReadonlyArray<T>,
): RankedMatch<T> | null {
  if (items.length === 0) return null;
  const ranked = rankByDistance(user, items);
  return ranked[0];
}
