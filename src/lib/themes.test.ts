import { describe, expect, it } from "vitest";
import {
  calculateThemeScores,
  emptyThemeScores,
} from "./themes";
import type { QuestionScoringMeta, RawAnswer } from "./scoring";

const baseQuestions: QuestionScoringMeta[] = [
  {
    id: 1,
    dimension: "economic",
    direction: 1,
    themes: ["economie", "wonen"],
  },
  {
    id: 2,
    dimension: "economic",
    direction: -1,
    themes: ["economie"],
  },
  {
    id: 3,
    dimension: "social",
    direction: 1,
    themes: ["klimaat"],
  },
  {
    id: 4,
    dimension: "social",
    direction: 1,
  },
];

describe("calculateThemeScores", () => {
  it("returns zero theme scores for empty answers", () => {
    const result = calculateThemeScores(baseQuestions, []);
    expect(result.scores).toEqual(emptyThemeScores());
  });

  it("ignores questions without themes", () => {
    const answers: RawAnswer[] = [{ questionId: 4, value: 2 }];
    const result = calculateThemeScores(baseQuestions, answers);
    expect(result.scores).toEqual(emptyThemeScores());
  });

  it("aggregates answers per theme respecting direction", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: -2 },
    ];
    const result = calculateThemeScores(baseQuestions, answers);
    expect(result.scores.economie).toBe(100);
    expect(result.scores.wonen).toBe(100);
    expect(result.answeredPerTheme.economie).toBe(2);
    expect(result.answeredPerTheme.wonen).toBe(1);
  });

  it("counts neutral answers in maxAbs but not in sum", () => {
    const answers: RawAnswer[] = [
      { questionId: 1, value: 2 },
      { questionId: 2, value: 0 },
    ];
    const result = calculateThemeScores(baseQuestions, answers);
    expect(result.scores.economie).toBe(50);
  });

  it("uses a theme-specific direction when a question spans two constructs", () => {
    const questions: QuestionScoringMeta[] = [
      {
        id: 9,
        dimension: "civil",
        direction: -1,
        themes: ["klimaat"],
        themeDirections: { klimaat: 1 },
      },
    ];
    const result = calculateThemeScores(questions, [{ questionId: 9, value: 2 }]);
    expect(result.scores.klimaat).toBe(100);
  });

  it("handles a single themed question correctly", () => {
    const answers: RawAnswer[] = [{ questionId: 3, value: -2 }];
    const result = calculateThemeScores(baseQuestions, answers);
    expect(result.scores.klimaat).toBe(-100);
  });
});
