import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InternationalPartyIndex } from "./InternationalPartyIndex";

describe("InternationalPartyIndex", () => {
  it("groups readable party links by country", () => {
    const html = renderToStaticMarkup(
      createElement(InternationalPartyIndex, {
        countries: [
          {
            country: "Duitsland",
            note: "Vijf brongebonden profielen.",
            parties: [{ name: "SPD", slug: "de-spd", description: "Sociaaldemocratische partij." }],
          },
        ],
      }),
    );

    expect(html).toContain("Internationale kaart");
    expect(html).toContain("Duitsland");
    expect(html).toContain('href="/partij/de-spd"');
  });
});
