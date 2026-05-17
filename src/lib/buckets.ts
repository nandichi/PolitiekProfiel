export type ScoreBucket =
  | "strong-negative"
  | "negative"
  | "neutral"
  | "positive"
  | "strong-positive";

export const SCORE_BUCKETS: ReadonlyArray<ScoreBucket> = [
  "strong-negative",
  "negative",
  "neutral",
  "positive",
  "strong-positive",
] as const;

export function scoreToBucket(score: number): ScoreBucket {
  if (score <= -60) return "strong-negative";
  if (score <= -20) return "negative";
  if (score < 20) return "neutral";
  if (score < 60) return "positive";
  return "strong-positive";
}

export function bucketLabel(bucket: ScoreBucket): string {
  switch (bucket) {
    case "strong-negative":
      return "Sterk negatief";
    case "negative":
      return "Negatief";
    case "neutral":
      return "Neutraal";
    case "positive":
      return "Positief";
    case "strong-positive":
      return "Sterk positief";
  }
}
