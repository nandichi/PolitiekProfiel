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
});
