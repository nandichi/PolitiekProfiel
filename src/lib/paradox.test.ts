import { describe, expect, it } from "vitest";
import { detectParadoxes } from "./paradox";
import type { QuestionScoringMeta, RawAnswer } from "./scoring";

const questions: QuestionScoringMeta[] = [
  { id: 1, dimension: "economic", direction: 1, themes: ["economie"] },
  { id: 2, dimension: "economic", direction: 1, themes: ["economie"] },
  { id: 3, dimension: "economic", direction: -1, themes: ["economie"] },
  { id: 4, dimension: "civil", direction: 1 },
  { id: 5, dimension: "civil", direction: -1 },
  { id: 6, dimension: "social", direction: 1, themes: ["klimaat"] },
  { id: 7, dimension: "economic", direction: -1, themes: ["economie"] },
];

describe("detectParadoxes", () => {
  it("returns nothing if answers are consistent", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 2 },
      { questionId: 3, value: -2 },
    ];
    const result = detectParadoxes(questions, answers);
    expect(result.filter((p) => p.type === "economic-mismatch")).toHaveLength(0);
  });

  it("flags an economic mismatch when answers contradict", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: -2 },
      { questionId: 3, value: 2 },
      { questionId: 7, value: -2 },
    ];
    const result = detectParadoxes(questions, answers);
    expect(result.some((p) => p.type === "economic-mismatch")).toBe(true);
  });

  it("flags klimaat-economie tension when applicable", () => {
    const answers: RawAnswer[] = [
      { questionId: 6, value: 2 },
      { questionId: 1, value: -2 },
    ];
    const result = detectParadoxes(questions, answers);
    expect(result.some((p) => p.type === "klimaat-economie")).toBe(true);
  });

  it("returns empty when no answers are strong enough", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 1 },
      { questionId: 2, value: -1 },
      { questionId: 3, value: 1 },
    ];
    const result = detectParadoxes(questions, answers);
    expect(result.filter((p) => p.type === "economic-mismatch")).toHaveLength(0);
  });

  it("includes severity values between 1 and 100", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: -2 },
      { questionId: 3, value: 2 },
    ];
    const result = detectParadoxes(questions, answers);
    for (const p of result) {
      expect(p.severity).toBeGreaterThanOrEqual(1);
      expect(p.severity).toBeLessThanOrEqual(100);
    }
  });
});
