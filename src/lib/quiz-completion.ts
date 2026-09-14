export const MINIMUM_RESULT_ANSWERS = 5;

export function canCreateResult(nonSkippedAnswerCount: number): boolean {
  return nonSkippedAnswerCount >= MINIMUM_RESULT_ANSWERS;
}
