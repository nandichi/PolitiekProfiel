import { describe, expect, it } from "vitest";
import {
  bestMatch,
  calculateScores,
  distance,
  emptyScores,
  rankByDistance,
  similarityPercent,
  type QuestionScoringMeta,
  type RawAnswer,
} from "./scoring";

const baseQuestions: QuestionScoringMeta[] = [
  { id: 1, dimension: "economic", direction: 1 },
  { id: 2, dimension: "economic", direction: -1 },
  { id: 3, dimension: "social", direction: 1 },
  { id: 4, dimension: "civil", direction: -1 },
  { id: 5, dimension: "governance", direction: 1 },
  { id: 6, dimension: "trust", direction: 1 },
];

describe("calculateScores", () => {
  it("returns all zeros when no answers given", () => {
    const result = calculateScores(baseQuestions, []);
    expect(result.scores).toEqual(emptyScores());
    expect(result.answeredCount).toBe(0);
    expect(result.skippedCount).toBe(0);
  });

  it("treats null answers as skipped, not as zero", () => {
    const answers: RawAnswer[] = baseQuestions.map((q) => ({
      questionId: q.id,
      value: null,
    }));
    const result = calculateScores(baseQuestions, answers);
    expect(result.answeredCount).toBe(0);
    expect(result.skippedCount).toBe(6);
    expect(result.scores.economic).toBe(0);
  });

  it("treats neutral as a counted answer with no shift", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 0 },
      { questionId: 2, value: 0 },
    ];
    const result = calculateScores(baseQuestions, answers);
    expect(result.answeredCount).toBe(2);
    expect(result.skippedCount).toBe(0);
    expect(result.scores.economic).toBe(0);
  });

  it("flips sign correctly via direction", () => {
    const result = calculateScores(baseQuestions, [
      { questionId: 1, value: 2 },
      { questionId: 2, value: -2 },
    ]);
    expect(result.scores.economic).toBe(100);
  });

  it("normalizes between -100 and +100", () => {
    const result = calculateScores(baseQuestions, [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 2 },
    ]);
    expect(result.scores.economic).toBeGreaterThanOrEqual(-100);
    expect(result.scores.economic).toBeLessThanOrEqual(100);
    expect(result.scores.economic).toBe(0);
  });

  it("respects per-question weight", () => {
    const weighted: QuestionScoringMeta[] = [
      { id: 10, dimension: "trust", direction: 1, weight: 3 },
      { id: 11, dimension: "trust", direction: 1, weight: 1 },
    ];
    const result = calculateScores(weighted, [
      { questionId: 10, value: 2 },
      { questionId: 11, value: -2 },
    ]);
    expect(result.scores.trust).toBe(50);
  });

  it("ignores answers for unknown question ids", () => {
    const result = calculateScores(baseQuestions, [
      { questionId: 999, value: 2 },
    ]);
    expect(result.answeredCount).toBe(0);
  });
});

describe("distance", () => {
  it("is zero for identical vectors", () => {
    const v = { ...emptyScores(), economic: 50 };
    expect(distance(v, v)).toBe(0);
  });

  it("is symmetric", () => {
    const a = { ...emptyScores(), economic: 50, social: 30 };
    const b = { ...emptyScores(), economic: -10, civil: 20 };
    expect(distance(a, b)).toBeCloseTo(distance(b, a));
  });

  it("returns max distance between extreme opposite vectors", () => {
    const a = { economic: 100, social: 100, civil: 100, governance: 100, trust: 100 };
    const b = { economic: -100, social: -100, civil: -100, governance: -100, trust: -100 };
    expect(similarityPercent(a, b)).toBe(0);
    expect(similarityPercent(a, a)).toBe(100);
  });
});

describe("rankByDistance", () => {
  it("returns items sorted by distance ascending", () => {
    const user = { ...emptyScores(), economic: 50 };
    const items = [
      { name: "ver", vector: { ...emptyScores(), economic: -50 } },
      { name: "dichtbij", vector: { ...emptyScores(), economic: 60 } },
      { name: "midden", vector: { ...emptyScores(), economic: 0 } },
    ];
    const ranked = rankByDistance(user, items);
    expect(ranked[0].item.name).toBe("dichtbij");
    expect(ranked[1].item.name).toBe("midden");
    expect(ranked[2].item.name).toBe("ver");
  });

  it("similarity is 100 for identical vectors", () => {
    const user = { ...emptyScores(), economic: 50, social: 20 };
    const items = [{ vector: { ...emptyScores(), economic: 50, social: 20 } }];
    const ranked = rankByDistance(user, items);
    expect(ranked[0].similarity).toBe(100);
  });

  it("bestMatch returns the closest item", () => {
    const user = { ...emptyScores(), trust: 80 };
    const items = [
      { name: "a", vector: { ...emptyScores(), trust: 30 } },
      { name: "b", vector: { ...emptyScores(), trust: 75 } },
    ];
    const best = bestMatch(user, items);
    expect(best?.item.name).toBe("b");
  });

  it("bestMatch returns null on empty list", () => {
    const user = emptyScores();
    expect(bestMatch(user, [])).toBeNull();
  });
});
