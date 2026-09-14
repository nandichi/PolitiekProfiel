import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), "utf8");

const overview = read("src", "app", "(frontend)", "kabinetten", "page.tsx");
const detail = read(
  "src",
  "app",
  "(frontend)",
  "kabinetten",
  "[slug]",
  "page.tsx",
);

describe("kabinettenpagina's", () => {
  it("toont op de overzichtspagina alle kabinetten met een link", () => {
    expect(overview).toContain("CABINETS");
    expect(overview).toContain("/kabinetten/${cabinet.slug}");
  });

  it("toont op de detailpagina wat bereikt is en wat niet, met bron", () => {
    expect(detail).toContain("cabinet.achievements.map");
    expect(detail).toContain("cabinet.unfulfilled.map");
    expect(detail).toContain("claim.sourceUrl");
  });

  it("toont ook het opvallende feit met bron", () => {
    expect(detail).toContain("cabinet.interestingFact");
    expect(detail).toContain("cabinet.interestingFactSource");
  });

  it("geeft niet-bestaande kabinetten een 404", () => {
    expect(detail).toContain("notFound()");
    expect(detail).toContain("generateStaticParams");
  });
});
