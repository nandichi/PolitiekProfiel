import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { FiveAxisMark } from "@/components/brand/FiveAxisMark";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { Section } from "@/components/Section";
import { StickyIndex } from "@/components/StickyIndex";
import { MeasureRule } from "@/components/system/MeasureRule";
import { RuledRow } from "@/components/system/RuledRow";

describe("redesign system primitives", () => {
  it("renders the five-part measurement rule", () => {
    const html = renderToStaticMarkup(createElement(MeasureRule));

    expect(html.match(/data-measure-segment=/g)).toHaveLength(5);
    expect(html).toContain('aria-hidden="true"');
  });

  it("renders a composable ruled row with annotation", () => {
    const html = renderToStaticMarkup(
      createElement(RuledRow, { annotation: "03" }, "Inhoud"),
    );

    expect(html).toContain("03");
    expect(html).toContain("Inhoud");
  });

  it("marks the shared layout primitives as one system", () => {
    const container = renderToStaticMarkup(
      createElement(Container, { as: "article" }, "Dossier"),
    );
    const kicker = renderToStaticMarkup(
      createElement(Kicker, { number: 2 }, "Methode"),
    );
    const section = renderToStaticMarkup(
      createElement(Section, { id: "methode" }, "Inhoud"),
    );
    const index = renderToStaticMarkup(
      createElement(StickyIndex, {
        items: [{ id: "methode", label: "Methode" }],
      }),
    );

    expect(container).toContain('data-system="container"');
    expect(container).toContain("<article");
    expect(kicker).toContain('data-system="kicker"');
    expect(section).toContain('data-system="section"');
    expect(index).toContain('data-system="sticky-index"');
  });

  it("renders the wordmark and five independent brand axes", () => {
    const wordmark = renderToStaticMarkup(createElement(BrandWordmark));
    const axes = renderToStaticMarkup(
      createElement(FiveAxisMark, { title: "Vijf meetassen" }),
    );

    expect(wordmark).toContain("PolitiekProfiel");
    expect(axes.match(/data-axis=/g)).toHaveLength(5);
    expect(axes).toContain("Vijf meetassen");
  });
});
