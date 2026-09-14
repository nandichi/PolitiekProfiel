import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PivotalAnswers } from "./PivotalAnswers";

const items = [
  {
    questionId: 1,
    statement: "De overheid moet meer herverdelen.",
    dimension: "economic" as const,
    value: 2,
    weight: 1,
    direction: 1 as const,
    theme: "economie",
    currentScore: 75,
    flippedScore: -25,
    impact: 100,
  },
];

describe("PivotalAnswers", () => {
  it("laat zien wat één omgedraaid antwoord met de score doet", () => {
    const html = renderToStaticMarkup(createElement(PivotalAnswers, { items }));

    expect(html).toContain("Wat als je hier anders had geantwoord");
    expect(html).toContain("De overheid moet meer herverdelen.");
    expect(html).toContain("75");
    expect(html).toContain("-25");
    expect(html).toContain("100");
  });

  it("zegt eerlijk dat dit één antwoord in isolatie is", () => {
    const html = renderToStaticMarkup(createElement(PivotalAnswers, { items }));

    expect(html).toMatch(/één antwoord|een enkel antwoord/i);
    expect(html).toMatch(/geen voorspelling|niet hoeft te betekenen/i);
  });

  it("rendert niets zonder omkeerbare antwoorden", () => {
    const html = renderToStaticMarkup(createElement(PivotalAnswers, { items: [] }));

    expect(html).toBe("");
  });
});
