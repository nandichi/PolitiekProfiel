import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InternationalPartyIndex } from "./InternationalPartyIndex";

const vector = { economic: 55, social: 35, civil: 20, governance: 30, trust: 35 };

describe("InternationalPartyIndex", () => {
  it("groups readable party links by country", () => {
    const html = renderToStaticMarkup(
      createElement(InternationalPartyIndex, {
        countries: [
          {
            country: "Duitsland",
            code: "DE",
            note: "BONDSDAG 2025 · 1 PARTIJ",
            parties: [
              {
                name: "Sozialdemokratische Partei Deutschlands",
                slug: "de-spd",
                abbreviation: "SPD",
                description: "Sociaaldemocratische partij.",
                vector,
              },
            ],
          },
        ],
      }),
    );

    expect(html).toContain("Internationale partijen");
    expect(html).toContain("Duitsland");
    expect(html).toContain('href="/partij/de-spd"');
  });

  it("toont het land, de afkorting en de positie op de vijf assen", () => {
    const html = renderToStaticMarkup(
      createElement(InternationalPartyIndex, {
        countries: [
          {
            country: "Duitsland",
            code: "DE",
            note: "BONDSDAG 2025 · 1 PARTIJ",
            parties: [
              {
                name: "Sozialdemokratische Partei Deutschlands",
                slug: "de-spd",
                abbreviation: "SPD",
                description: "Sociaaldemocratische partij.",
                vector,
              },
            ],
          },
        ],
      }),
    );

    expect(html).toContain("DE");
    expect(html).toContain("SPD");
    // MiniVector rendert zijn marker voor de vijf-assenpositie.
    expect(html).toContain("bg-ink");
  });

  it("rendert niets zonder landen", () => {
    const html = renderToStaticMarkup(
      createElement(InternationalPartyIndex, { countries: [] }),
    );

    expect(html).toBe("");
  });
});
