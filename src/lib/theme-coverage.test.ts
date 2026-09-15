import { describe, expect, it } from "vitest";
import { themeCoverageLabel, themeCoverageState } from "./theme-coverage";

/**
 * Een thema waarover in de quiz niets is gevraagd, mag geen score tonen die er
 * als "neutraal" uitziet. Dekking bepaalt wat we mogen beweren.
 */
describe("themadekking", () => {
  it("geeft geen oordeel als de dekking onbekend is", () => {
    expect(themeCoverageState(undefined)).toBeNull();
    expect(themeCoverageLabel(undefined)).toBeNull();
  });

  it("herkent een thema zonder vragen", () => {
    expect(themeCoverageState(0)).toBe("geen");
    expect(themeCoverageLabel(0)).toContain("Geen vragen");
  });

  it("noemt een of twee vragen een voorzichtige indicatie", () => {
    expect(themeCoverageState(1)).toBe("voorzichtig");
    expect(themeCoverageState(2)).toBe("voorzichtig");
    expect(themeCoverageLabel(1)).toContain("Voorzichtige indicatie");
    expect(themeCoverageLabel(1)).toContain("1 vraag");
    expect(themeCoverageLabel(2)).toContain("2 vragen");
  });

  it("noemt drie of meer vragen voldoende dekking", () => {
    expect(themeCoverageState(3)).toBe("voldoende");
    expect(themeCoverageState(9)).toBe("voldoende");
    expect(themeCoverageLabel(5)).toContain("5 vragen");
  });
});
