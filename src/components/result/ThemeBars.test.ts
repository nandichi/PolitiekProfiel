import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ThemeBars } from "./ThemeBars";

const scores = {
  klimaat: 0,
  zorg: 0,
  migratie: 0,
  economie: 0,
  eu: 0,
  democratie: 0,
  wonen: 0,
};

describe("ThemeBars", () => {
  it("toont geen score voor thema's waarover niets is gevraagd", () => {
    const html = renderToStaticMarkup(
      createElement(ThemeBars, { scores, coverage: { klimaat: 0, zorg: 0 } }),
    );

    const meldingen = html.match(/Geen vragen over dit thema/g) ?? [];
    expect(meldingen).toHaveLength(2);
  });

  it("blijft de score tonen als de dekking onbekend is", () => {
    const html = renderToStaticMarkup(
      createElement(ThemeBars, { scores, coverage: { klimaat: 0 } }),
    );

    // Zes thema's hebben geen dekkinginformatie en houden dus hun gewone rij.
    expect(html.match(/Geen vragen over dit thema/g) ?? []).toHaveLength(1);
    expect(html).toContain("Klimaat &amp; milieu");
    expect(html).toContain("Wonen &amp; ruimte");
  });
});
