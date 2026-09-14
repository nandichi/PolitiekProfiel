import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PoliticianProfileLens } from "./PoliticianProfileLens";

describe("PoliticianProfileLens", () => {
  it("turns a compact political vector into a readable portrait", () => {
    const html = renderToStaticMarkup(
      createElement(PoliticianProfileLens, {
        lens: {
          roleTitle: "Wat doet een fractievoorzitter?",
          roleExplanation: "Leidt de Kamerfractie.",
          strongestSignals: [
            {
              axis: "civil",
              label: "Burgerrechten",
              direction: "Ruime individuele vrijheden",
              explanation: "Een duidelijke richting.",
            },
          ],
          profileNote: "Een redactionele kaart, geen stemadvies.",
        },
      }),
    );

    expect(html).toContain("Portret in context");
    expect(html).toContain("Wat doet een fractievoorzitter?");
    expect(html).toContain("Opvallend in deze kaart");
    expect(html).toContain("Ruime individuele vrijheden");
    expect(html).toContain("geen stemadvies");
  });
});
