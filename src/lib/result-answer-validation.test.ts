import { describe, expect, it } from "vitest";
import { validateSubmittedAnswers } from "@/lib/result-answer-validation";

describe("validateSubmittedAnswers", () => {
  it("rejects a repeated question ID instead of counting it twice", () => {
    const result = validateSubmittedAnswers(
      [
        { questionId: 101, value: 2 },
        { questionId: 101, value: 2 },
      ],
      15,
    );

    expect(result).toEqual({
      ok: false,
      reason: "Elke stelling mag maar één keer worden ingestuurd.",
    });
  });

  it("rejects values outside the five supported answer positions", () => {
    const result = validateSubmittedAnswers([{ questionId: 101, value: 99 }], 15);

    expect(result).toEqual({
      ok: false,
      reason: "Een antwoord heeft geen geldige schaalwaarde.",
    });
  });

  it("preserves explicit skips without treating them as an answer", () => {
    const result = validateSubmittedAnswers(
      [
        { questionId: 101, value: null },
        { questionId: 102, value: -1 },
      ],
      15,
    );

    expect(result).toEqual({
      ok: true,
      answers: [
        { questionId: 101, value: null },
        { questionId: 102, value: -1 },
      ],
    });
  });
});
