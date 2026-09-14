import { describe, expect, it } from "vitest";
import { TURING_QUOTES } from "@/data/turing-quotes";
import { GLOSSARY } from "@/data/woordenboek";

function quote(id: string) {
  const item = TURING_QUOTES.find((candidate) => candidate.id === id);
  expect(item, `Missing ${id}`).toBeDefined();
  return item!;
}

function term(name: string) {
  const item = GLOSSARY.find((candidate) => candidate.term === name);
  expect(item, `Missing ${name}`).toBeDefined();
  return item!;
}

describe("public content regressions", () => {
  it("labels programme paraphrases with their current official titles", () => {
    expect(quote("q-001").source.label).toContain("Een sterker Nederland");
    expect(quote("q-004").source.label).toContain("Een nieuwe start voor Nederland");
    expect(quote("q-006").source.label).toContain("Bouwen op vertrouwen");
    expect(quote("q-013").source.label).toContain("BBB Levert!");
  });

  it("uses specific programme sources instead of retired party pages", () => {
    expect(quote("q-005").source.url).toBe("https://cdn.sp.nl/2025/09/SP-verkiezingsprogramma-TK2025.pdf");
    expect(quote("q-008").source.url).toBe("https://ja21.nl/fileadmin/user_upload/Verkiezingsprogramma_JA21_TK25_DEF.pdf");
    expect(quote("q-009").source.url).toBe("https://voltnederland.org/storage/doc/volt_verkiezingsprogramma_2025.pdf");
  });

  it("does not present unsourced redactional text as a politician's quotation", () => {
    expect(quote("q-002").paraphrased).toBe(true);
    expect(quote("q-011").source.label).toBe("Redactionele parafrase, geen politiek citaat");
  });

  it("keeps glossary definitions current and plain", () => {
    expect(term("Subsidiariteit").short).toContain("alleen als dat beter werkt");
    expect(term("Voorkeurstem").short).toContain("ongeacht de plek op de lijst");
    expect(term("Europese Unie").short).toContain("21 landen gebruiken de euro");
    expect(term("Europese Unie").short).not.toContain("gepoolde soevereiniteit");
    expect(term("Waterschap").long).toContain("natuur en landbouw geborgde zetels");
  });
});
