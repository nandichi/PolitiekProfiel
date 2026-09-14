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
 * De resultaatpagina had twee secties die dezelfde eigen antwoorden toonden:
 * "Je antwoordkaart" (met uitleg en bron) en "Je uitgesproken antwoorden".
 * Dat is nu één sectie, zodat de lezer zijn stelling niet twee keer tegenkomt.
 */
describe("resultaatpagina toont eigen antwoorden in één sectie", () => {
  const source = readFileSync(pagePath, "utf8");

  it("gebruikt de antwoordkaart als enige antwoordensectie", () => {
    expect(source).toContain("AnswerAtlas");
    expect(source).not.toContain("StanceExtract");
    expect(source).not.toContain('id="standpunten"');
  });

  it("houdt de sectie niet in de inhoudsopgave", () => {
    expect(source).not.toContain('{ id: "standpunten"');
  });
});
