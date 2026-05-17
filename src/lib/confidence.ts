import {
  DIMENSION_IDS,
  type DimensionId,
} from "@/lib/dimensions";
import type {
  DimensionScores,
  QuestionScoringMeta,
  RawAnswer,
} from "@/lib/scoring";

export type DimensionConfidence = Record<DimensionId, number>;

export interface ConfidenceBreakdown {
  perDimension: DimensionConfidence;
  overall: number;
}

const MIN_ANSWERS_FOR_FULL_COUNT = 4;

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateConfidence(
  questions: ReadonlyArray<QuestionScoringMeta>,
  answers: ReadonlyArray<RawAnswer>,
  scores: DimensionScores,
): ConfidenceBreakdown {
  const byId = new Map<QuestionScoringMeta["id"], QuestionScoringMeta>();
  for (const q of questions) byId.set(q.id, q);

  const perDim: DimensionConfidence = {
    economic: 0,
    social: 0,
    civil: 0,
    governance: 0,
    trust: 0,
  };

  for (const dim of DIMENSION_IDS) {
    const values: number[] = [];
    for (const answer of answers) {
      const q = byId.get(answer.questionId);
      if (!q || q.dimension !== dim) continue;
      if (answer.value === null) continue;
      values.push(q.direction * answer.value);
    }

    if (values.length === 0) {
      perDim[dim] = 0;
      continue;
    }

    const coveragePart = clamp(
      (values.length / MIN_ANSWERS_FOR_FULL_COUNT) * 100,
      0,
      100,
    );
    const strengthPart = clamp(Math.abs(scores[dim]), 0, 100);

    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance =
      values.reduce((s, v) => s + (v - mean) * (v - mean), 0) / values.length;
    const variancePart = clamp(100 - (variance / 4) * 100, 0, 100);

    const blended =
      coveragePart * 0.35 + strengthPart * 0.4 + variancePart * 0.25;
    perDim[dim] = Math.round(clamp(blended));
  }

  const overall = Math.round(
    DIMENSION_IDS.reduce((s, dim) => s + perDim[dim], 0) / DIMENSION_IDS.length,
  );

  return { perDimension: perDim, overall };
}

export type ConfidenceBand = "laag" | "gemiddeld" | "hoog";

export function confidenceBand(score: number): ConfidenceBand {
  if (score >= 70) return "hoog";
  if (score >= 40) return "gemiddeld";
  return "laag";
}

export function confidenceBandLabel(band: ConfidenceBand): string {
  if (band === "hoog") return "Hoog vertrouwen";
  if (band === "gemiddeld") return "Gemiddeld vertrouwen";
  return "Laag vertrouwen";
}
