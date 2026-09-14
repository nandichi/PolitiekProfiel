import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PersonalProfile } from "./PersonalProfile";

const profile = {
  lead: "Deze uitkomst ligt het dichtst bij sociaal-liberaal. Het is geen stemadvies.",
  strongestAxes: [
    {
      id: "economic" as const,
      label: "Economisch",
      score: 58,
      direction: "Sterke staat",
      explanation: "Je antwoorden wijzen hier duidelijk deze kant op.",
      confidence: 82,
    },
  ],
  openAxes: [
    {
      id: "civil" as const,
      label: "Burgerrechten",
      score: 4,
      direction: "Open midden",
      explanation: "Je antwoorden blijven hier dicht bij het midden.",
      confidence: 51,
    },
  ],
  contextualAxes: [],
  themeSignals: [
    {
      id: "klimaat" as const,
      label: "Klimaat & milieu",
      score: 64,
      direction: "Ambitieus",
      explanation: "Sterk klimaatbeleid staat voorop.",
    },
  ],
  coverage: {
    label: "50 van 50 stellingen beantwoord",
    message: "Er ligt voldoende antwoordmateriaal onder dit profiel.",
    percentage: 100,
  },
};

describe("PersonalProfile", () => {
  it("vat het profiel samen in gewone taal", () => {
    const html = renderToStaticMarkup(createElement(PersonalProfile, { profile }));

    expect(html).toContain("Je politieke kern in woorden");
    expect(html).toContain("Deze uitkomst ligt het dichtst bij sociaal-liberaal");
    expect(html).toContain("50 van 50 stellingen beantwoord");
    expect(html).toContain("Sterke staat");
    expect(html).toContain("Open midden");
  });

  it("herhaalt de assen en thema's niet die al een eigen sectie hebben", () => {
    const html = renderToStaticMarkup(createElement(PersonalProfile, { profile }));

    // De uitleg per pool staat in de sectie "Vijf dimensies".
    expect(html).not.toContain("Je antwoorden wijzen hier duidelijk deze kant op.");
    // De themabeschrijvingen staan in de sectie "Zeven thema's".
    expect(html).not.toContain("Klimaat &amp; milieu");
    expect(html).not.toContain("Sterk klimaatbeleid staat voorop.");
  });
});
