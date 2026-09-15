import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), "utf8");

const route = read("src", "app", "api", "results", "route.ts");
const store = read("src", "lib", "results-store.ts");
const page = read("src", "app", "(frontend)", "r", "[id]", "page.tsx");

/**
 * De dekking per thema werd wel berekend maar weggegooid, waardoor een thema
 * zonder vragen als een neutrale nul op de pagina stond. Deze test borgt dat de
 * dekking van de berekening via de opslag op de pagina komt.
 */
describe("themadekking door de hele keten", () => {
  it("schrijft de dekking weg bij het opslaan van een resultaat", () => {
    expect(route).toContain("themeCoverage: themeBreakdown.answeredPerTheme");
    expect(store).toContain("themeCoverage");
  });

  it("leest de dekking terug uit de opslag", () => {
    expect(store).toContain("data.themeCoverage");
  });

  it("geeft de dekking door aan de themabalken op de pagina", () => {
    expect(page).toContain("coverage={result.themeCoverage}");
  });
});
