import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(
  process.cwd(),
  "src",
  "app",
  "(frontend)",
  "partij",
  "[slug]",
  "page.tsx",
);

describe("partijpagina toont feiten en geen 'Onbekend'", () => {
  const source = readFileSync(pagePath, "utf8");

  it("toont de weetjes met een klikbare bron per stuk", () => {
    expect(source).toContain("party.facts");
    expect(source).toContain("fact.sourceUrl");
  });

  it("verbergt meta-velden die geen waarde hebben in plaats van 'Onbekend'", () => {
    expect(source).not.toContain('?? "Onbekend"');
  });
});
