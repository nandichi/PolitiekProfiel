import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(
  process.cwd(),
  "src",
  "app",
  "(frontend)",
  "r",
  "[id]",
  "page.tsx",
);

/**
 * De sectie "Wat als je hier anders had geantwoord?" is uniek voor deze site:
 * hij rekent de scoringsregel opnieuw door op één antwoord. Deze test borgt dat
 * de sectie op de pagina staat en in de inhoudsopgave terugkomt.
 */
describe("resultaatpagina met doorgerekende kantelpunten", () => {
  const source = readFileSync(pagePath, "utf8");

  it("importeert en rendert de sectie", () => {
    expect(source).toContain(
      'import { PivotalAnswers } from "@/components/result/PivotalAnswers"',
    );
    expect(source).toContain("derivePivotalAnswers(");
    expect(source).toContain("<PivotalAnswers items={pivotalAnswers} />");
  });

  it("neemt de sectie op in de inhoudsopgave", () => {
    expect(source).toContain('{ id: "kantelpunten"');
  });
});
