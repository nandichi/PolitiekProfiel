import { describe, expect, it } from "vitest";
import { derivePivotalAnswers } from "./result-pivotal-answers";

/**
 * Twee stellingen op dezelfde as, beide met richting +1 en gewicht 1.
 * `maxAbs` telt per beantwoorde stelling 2 x gewicht, dus 2 + 2 = 4.
 * Antwoorden 2 en 1 geven sums = 3, dus score round(3/4 x 100) = 75.
 * Draai je het eerste antwoord om naar -2, dan wordt sums = -1 en de score -25.
 */
const questions = [
  { id: 1, statement: "De overheid moet meer herverdelen.", dimension: "economic" as const, direction: 1 as const, weight: 1, theme: "economie" },
  { id: 2, statement: "De overheid moet de markt meer ruimte geven.", dimension: "economic" as const, direction: 1 as const, weight: 1, theme: "economie" },
];

const answers = [
  { questionId: 1, value: 2 as const },
  { questionId: 2, value: 1 as const },
];

const scores = { economic: 75, social: 0, civil: 0, governance: 0, trust: 0 };

describe("derivePivotalAnswers", () => {
  it("berekent wat er met de score gebeurt als een antwoord omdraait", () => {
    const items = derivePivotalAnswers({ questions, answers, scores, limit: 5 });
    const first = items.find((item) => item.questionId === 1);

    expect(first).toBeDefined();
    expect(first?.currentScore).toBe(75);
    expect(first?.flippedScore).toBe(-25);
    expect(first?.impact).toBe(100);
  });

  it("laat een antwoord zonder richting geen omkering opleveren", () => {
    const items = derivePivotalAnswers({
      questions,
      answers: [
        { questionId: 1, value: 0 },
        { questionId: 2, value: 1 },
      ],
      scores,
      limit: 5,
    });

    expect(items.map((item) => item.questionId)).not.toContain(1);
  });

  it("zet de grootste verschuiving bovenaan", () => {
    const items = derivePivotalAnswers({ questions, answers, scores, limit: 5 });

    expect(items[0].questionId).toBe(1);
    expect(items[0].impact).toBeGreaterThanOrEqual(items[1].impact);
  });

  it("respecteert de limiet en negeert onbekende vragen", () => {
    const items = derivePivotalAnswers({
      questions,
      answers: [...answers, { questionId: 999, value: 2 }],
      scores,
      limit: 1,
    });

    expect(items).toHaveLength(1);
  });
});
