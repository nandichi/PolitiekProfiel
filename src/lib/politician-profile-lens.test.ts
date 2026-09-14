import { describe, expect, it } from "vitest";
import { buildPoliticianProfileLens } from "./politician-profile-lens";

describe("buildPoliticianProfileLens", () => {
  it("explains a parliamentary leader's profile in plain language", () => {
    const lens = buildPoliticianProfileLens({
      name: "Voorbeeld Persoon",
      role: "Fractievoorzitter Voorbeeldpartij",
      party: "Voorbeeldpartij",
      country: "Nederland",
      dimensions: {
        economic: 34,
        social: -12,
        civil: 56,
        governance: 8,
        trust: -42,
      },
    });

    expect(lens.roleTitle).toBe("Wat doet een fractievoorzitter?");
    expect(lens.roleExplanation).toContain("Kamerfractie");
    expect(lens.strongestSignals.map((signal) => signal.axis)).toEqual(["civil", "trust"]);
    expect(lens.profileNote).toContain("geen stemadvies");
  });

  it("does not pretend a near-centre score is a firm conviction", () => {
    const lens = buildPoliticianProfileLens({
      name: "Voorbeeld Persoon",
      role: "Kamerlid",
      party: "Voorbeeldpartij",
      country: "Nederland",
      dimensions: {
        economic: 4,
        social: -8,
        civil: 11,
        governance: 0,
        trust: -6,
      },
    });

    expect(lens.strongestSignals).toHaveLength(0);
    expect(lens.profileNote).toContain("geen scherpe richting");
  });
});
