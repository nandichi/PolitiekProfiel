import type { AnswerValue } from "@/lib/dimensions";

export interface SubmittedAnswer {
  questionId: number;
  value: AnswerValue | null;
}

export type SubmittedAnswerValidation =
  | { ok: true; answers: SubmittedAnswer[] }
  | { ok: false; reason: string };

const ANSWER_VALUES = new Set<AnswerValue>([-2, -1, 0, 1, 2]);

export function validateSubmittedAnswers(
  input: unknown,
  maximumCount: number,
): SubmittedAnswerValidation {
  if (!Array.isArray(input) || input.length === 0) {
    return { ok: false, reason: "Er zijn geen antwoorden ontvangen." };
  }

  if (input.length > maximumCount) {
    return {
      ok: false,
      reason: "Er zijn meer antwoorden ingestuurd dan deze quiz bevat.",
    };
  }

  const answers: SubmittedAnswer[] = [];
  const seenIds = new Set<number>();

  for (const item of input) {
    if (!item || typeof item !== "object") {
      return { ok: false, reason: "Een antwoord heeft geen geldig formaat." };
    }

    const { questionId, value } = item as Record<string, unknown>;
    if (!Number.isSafeInteger(questionId) || (questionId as number) <= 0) {
      return { ok: false, reason: "Een stelling heeft geen geldig nummer." };
    }

    if (seenIds.has(questionId as number)) {
      return {
        ok: false,
        reason: "Elke stelling mag maar één keer worden ingestuurd.",
      };
    }

    if (value !== null && !ANSWER_VALUES.has(value as AnswerValue)) {
      return {
        ok: false,
        reason: "Een antwoord heeft geen geldige schaalwaarde.",
      };
    }

    seenIds.add(questionId as number);
    answers.push({
      questionId: questionId as number,
      value: value as AnswerValue | null,
    });
  }

  return { ok: true, answers };
}
