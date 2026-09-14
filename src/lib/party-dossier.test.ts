import { describe, expect, it } from "vitest";
import { buildPartyDossier } from "./party-dossier";

describe("buildPartyDossier", () => {
  it("turns a party vector into plain-language context", () => {
    const dossier = buildPartyDossier({
      name: "Voorbeeldpartij",
      country: "Nederland",
      regionType: "national",
      lastReviewed: "2026-09-14",
      positionVector: { economic: 54, social: -12, civil: 9, governance: 39, trust: 2 },
    });

    expect(dossier.roleLine).toContain("Nederlandse partij");
    expect(dossier.strongestSignals.map((signal) => signal.axis)).toEqual(["economic", "governance"]);
    expect(dossier.methodLine).toContain("redactionele");
  });

  it("explains that a faction is not the whole party", () => {
    const dossier = buildPartyDossier({
      name: "Voorbeeldstroming",
      country: "Verenigde Staten",
      regionType: "faction",
      positionVector: { economic: 0, social: 0, civil: 0, governance: 0, trust: 0 },
    });

    expect(dossier.roleLine).toContain("stroming");
    expect(dossier.strongestSignals).toHaveLength(0);
  });

  it("uses a Dutch country adjective rather than a literal country name", () => {
    const dossier = buildPartyDossier({
      name: "Democratic Party",
      country: "Verenigde Staten",
      regionType: "national",
      positionVector: { economic: 1, social: 2, civil: 3, governance: 4, trust: 5 },
      lastReviewed: "2026-09-14",
    });

    expect(dossier.roleLine).toContain("Amerikaanse partij");
    expect(dossier.roleLine).not.toContain("Verenigde Statense");
  });
});
