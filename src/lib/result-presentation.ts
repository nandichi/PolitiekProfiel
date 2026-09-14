export const NEUTRAL_DIMENSION_THRESHOLD = 10;

export function hasClearDimensionDirection(score: number): boolean {
  return Math.abs(score) >= NEUTRAL_DIMENSION_THRESHOLD;
}
