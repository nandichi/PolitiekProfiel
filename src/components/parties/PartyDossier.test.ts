import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PartyDossier } from "./PartyDossier";

describe("PartyDossier", () => {
  it("renders the party reading guide", () => {
    const html = renderToStaticMarkup(
      createElement(PartyDossier, {
        dossier: {
          roleLine: "Dit is een Nederlandse partij.",
          strongestSignals: [{ axis: "economic", label: "Economie", direction: "Actieve overheid", score: 54 }],
          methodLine: "De score is redactioneel.",
        },
      }),
    );

    expect(html).toContain("Zo lees je dit partijprofiel");
    expect(html).toContain("Economie");
    expect(html).toContain("De score is redactioneel.");
  });
});
