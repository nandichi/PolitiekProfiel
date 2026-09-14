import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AnswerAtlas } from "./AnswerAtlas";

describe("AnswerAtlas", () => {
  it("shows a reader how their own answers shaped the result", () => {
    const html = renderToStaticMarkup(
      createElement(AnswerAtlas, {
        sections: [
          {
            theme: "klimaat",
            entries: [
              {
                questionId: 1,
                question: "Nederland moet sneller verduurzamen.",
                explanation: "De vraag ging over klimaatbeleid.",
                theme: "klimaat",
                dimension: "economic",
                value: 2,
                answerLabel: "Helemaal eens",
                sourceUrl: "https://example.com/source",
              },
            ],
          },
        ],
      }),
    );

    expect(html).toContain("Je antwoordkaart");
    expect(html).toContain("Klimaat &amp; milieu");
    expect(html).toContain("Helemaal eens");
    expect(html).toContain("Waarom deze vraag meetelt");
    expect(html).toContain("<details open");
    expect(html).toContain("Bron bij deze vraag");
  });

  it("laat zien op welke as de stelling meewoog en hoe stellig het antwoord was", () => {
    const html = renderToStaticMarkup(
      createElement(AnswerAtlas, {
        sections: [
          {
            theme: "klimaat",
            entries: [
              {
                questionId: 1,
                question: "Nederland moet sneller verduurzamen.",
                explanation: "De vraag ging over klimaatbeleid.",
                theme: "klimaat",
                dimension: "economic",
                value: 2,
                answerLabel: "Helemaal eens",
              },
              {
                questionId: 2,
                question: "De overheid moet minder regelen.",
                explanation: "De vraag ging over marktwerking.",
                theme: "economie",
                dimension: "economic",
                value: -1,
                answerLabel: "Oneens",
              },
            ],
          },
        ],
      }),
    );

    // De as waarop de stelling meewoog staat er nu bij.
    expect(html).toContain("Economie");
    // En hoe stellig het antwoord was.
    expect(html).toContain("sterk eens");
    expect(html).toContain("matig oneens");
  });
});
