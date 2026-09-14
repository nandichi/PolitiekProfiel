import { describe, expect, it } from "vitest";
import { PARTIES } from "./parties";

describe("party knowledge centre roster", () => {
  it("makes the international first wave available to party pages", () => {
    expect(PARTIES).toHaveLength(45);
    expect(PARTIES.some((party) => party.slug === "us-democratic-party")).toBe(true);
    expect(PARTIES.some((party) => party.slug === "fr-rassemblement-national")).toBe(true);
  });
});
