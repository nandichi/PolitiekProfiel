import { describe, expect, it } from "vitest";
import { calculateConfidence, confidenceBand } from "./confidence";
import { emptyScores, type QuestionScoringMeta, type RawAnswer } from "./scoring";

const questions: QuestionScoringMeta[] = [
  { id: 1, dimension: "economic", direction: 1 },
  { id: 2, dimension: "economic", direction: 1 },
  { id: 3, dimension: "economic", direction: -1 },
  { id: 4, dimension: "economic", direction: -1 },
  { id: 5, dimension: "social", direction: 1 },
  { id: 6, dimension: "civil", direction: 1 },
];

describe("calculateConfidence", () => {
  it("returns zero confidence for any dimension without answers", () => {
    const scores = emptyScores();
    const result = calculateConfidence(questions, [], scores);
    expect(result.perDimension.economic).toBe(0);
    expect(result.overall).toBe(0);
  });

  it("gives high confidence for consistent strong answers", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 2 },
      { questionId: 3, value: -2 },
      { questionId: 4, value: -2 },
    ];
    const scores = { ...emptyScores(), economic: 100 };
    const result = calculateConfidence(questions, answers, scores);
    expect(result.perDimension.economic).toBeGreaterThanOrEqual(75);
  });

  it("gives lower confidence for contradictory answers", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: -2 },
      { questionId: 3, value: 2 },
      { questionId: 4, value: -2 },
    ];
    const scores = { ...emptyScores(), economic: 0 };
    const result = calculateConfidence(questions, answers, scores);
    expect(result.perDimension.economic).toBeLessThan(50);
  });

  it("rewards more coverage", () => {
    const fewer: RawAnswer[] = [{ questionId: 1, value: 2 }];
    const more: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 2 },
      { questionId: 3, value: -2 },
      { questionId: 4, value: -2 },
    ];
    const scores = { ...emptyScores(), economic: 100 };
    const a = calculateConfidence(questions, fewer, scores);
    const b = calculateConfidence(questions, more, scores);
    expect(b.perDimension.economic).toBeGreaterThan(a.perDimension.economic);
  });

  it("confidenceBand maps scores to bands", () => {
    expect(confidenceBand(80)).toBe("hoog");
    expect(confidenceBand(50)).toBe("gemiddeld");
    expect(confidenceBand(20)).toBe("laag");
  });
});
