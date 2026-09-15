import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), "utf8");

const component = read(
  "src",
  "components",
  "parties",
  "InternationalPartyIndex.tsx",
);
const page = read("src", "app", "(frontend)", "partijen", "page.tsx");

/**
 * De buitenlandse partijen stonden in een eigen component zonder
 * vijf-assenweergave en zonder sectienummer, terwijl de Nederlandse, EU- en
 * Amerikaanse partijen dat wel hebben. Deze test borgt dat alle partijen
 * dezelfde presentatie krijgen.
 */
describe("internationale partijen in dezelfde presentatie", () => {
  it("toont de positie op de vijf assen, net als de andere secties", () => {
    expect(component).toContain("MiniVector");
    expect(component).toContain("vector");
  });

  it("gebruikt hetzelfde sectienummer als de andere secties", () => {
    expect(component).toContain("Kicker");
  });

  it("toont een mono-label met land en afkorting per partij", () => {
    expect(component).toContain("abbreviation");
  });

  it("noemt de buitenlandse reeks in de metadata", () => {
    const description = page.match(/PAGE_DESCRIPTION =\s*"([^"]+)"/)?.[1] ?? "";

    // Zowel het land als de bijvoeglijke vorm is goede copy; de eis is dat de
    // reeks genoemd wordt.
    const landen: Array<[string, string[]]> = [
      ["Duitsland", ["Duitsland", "Duitse"]],
      ["Verenigd Koninkrijk", ["Verenigd Koninkrijk", "Britse"]],
      ["Frankrijk", ["Frankrijk", "Franse"]],
    ];

    for (const [naam, vormen] of landen) {
      expect(
        vormen.some((vorm) => description.includes(vorm)),
        `${naam} ontbreekt in de omschrijving`,
      ).toBe(true);
    }
  });
});
