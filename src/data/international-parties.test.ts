import { describe, expect, it } from "vitest";
import { INTERNATIONAL_PARTIES } from "./international-parties";

describe("international party seed", () => {
  it("contains a source-backed first wave", () => {
    expect(INTERNATIONAL_PARTIES).toHaveLength(17);
    expect(INTERNATIONAL_PARTIES.map((party) => party.region)).toEqual([
      "US", "US", "DE", "DE", "DE", "DE", "DE",
      "GB", "GB", "GB", "GB", "GB", "FR", "FR", "FR", "FR", "FR",
    ]);
    expect(INTERNATIONAL_PARTIES.every((party) => party.sources.length >= 2)).toBe(true);
    expect(INTERNATIONAL_PARTIES.every((party) => party.lastReviewed === "2026-09-14")).toBe(true);
  });
});
