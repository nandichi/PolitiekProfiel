import { describe, expect, it } from "vitest";
import { stableQuestionId } from "./static-question-data";
import {
  buildAnswerAtlas,
  deriveAnswerAtlas,
  type AnswerAtlasInput,
} from "./result-answer-atlas";

const answers: AnswerAtlasInput[] = [
  { questionId: 1, question: "Energie", explanation: "Een vraag over energie.", theme: "klimaat", dimension: "economic", value: 2 },
  { questionId: 2, question: "CO2", explanation: "Een vraag over klimaatbeleid.", theme: "klimaat", dimension: "economic", value: 1 },
  { questionId: 3, question: "Belasting", explanation: "Een vraag over belasting.", theme: "economie", dimension: "economic", value: -2 },
  { questionId: 4, question: "Zorg", explanation: "Een vraag over zorg.", theme: "zorg", dimension: "social", value: 0 },
];

describe("buildAnswerAtlas", () => {
  it("groups explicit answers by theme in the given profile order", () => {
    const atlas = buildAnswerAtlas(answers, ["klimaat", "economie", "zorg"], 1);

    expect(atlas.map((section) => section.theme)).toEqual(["klimaat", "economie", "zorg"]);
    expect(atlas[0].entries).toHaveLength(1);
    expect(atlas[0].entries[0]).toMatchObject({ questionId: 1, answerLabel: "Helemaal eens" });
    expect(atlas[1].entries[0]).toMatchObject({ questionId: 3, answerLabel: "Helemaal oneens" });
    expect(atlas[2].entries[0]).toMatchObject({ questionId: 4, answerLabel: "Geen duidelijke richting" });
  });

  it("does not invent a theme that has no answered question", () => {
    const atlas = buildAnswerAtlas(answers, ["veiligheid", "klimaat"], 2);

    expect(atlas.map((section) => section.theme)).toEqual(["klimaat"]);
    expect(atlas[0].entries.map((entry) => entry.questionId)).toEqual([1, 2]);
  });

  it("turns stored answers into explanation-ready quiz evidence", async () => {
    const questionId = stableQuestionId(
      "De overheid moet de hoogste inkomens (boven €150.000 per jaar) zwaarder belasten dan nu.",
    );
    const atlas = await deriveAnswerAtlas(
      [{ questionId, value: 2 }],
      ["economie"],
      1,
    );

    expect(atlas).toHaveLength(1);
    expect(atlas[0]).toMatchObject({ theme: "economie" });
    expect(atlas[0].entries[0]).toMatchObject({
      questionId,
      answerLabel: "Helemaal eens",
      question: expect.stringContaining("hoogste inkomens"),
    });
    expect(atlas[0].entries[0].explanation).toContain("Nederland");
  });
});
