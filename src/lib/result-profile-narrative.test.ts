import { describe, expect, it } from "vitest";
import { createPersonalProfile } from "./result-profile-narrative";

describe("createPersonalProfile", () => {
  const dimensions = {
    economic: 58,
    social: -44,
    civil: 4,
    governance: 36,
    trust: -3,
  } as const;

  it("turns a multi-axis result into a cautious, plain-language personal synthesis", () => {
    const profile = createPersonalProfile({
      ideologyName: "Sociaal-liberaal",
      dimensions,
      themeScores: {
        klimaat: 64,
        zorg: 22,
        migratie: -46,
        economie: 52,
        eu: 48,
        democratie: 8,
        wonen: 39,
      },
      confidence: {
        economic: 82,
        social: 76,
        civil: 51,
        governance: 71,
        trust: 49,
      },
      answeredCount: 50,
      totalQuestions: 50,
    });

    expect(profile.lead).toContain("Sociaal-liberaal");
    expect(profile.lead).toContain("geen stemadvies");
    expect(profile.strongestAxes.map((axis) => axis.id)).toEqual([
      "economic",
      "social",
      "governance",
    ]);
    expect(profile.openAxes.map((axis) => axis.id)).toEqual(["civil", "trust"]);
    expect(profile.themeSignals.map((theme) => theme.id)).toEqual([
      "klimaat",
      "economie",
      "eu",
    ]);
    expect(profile.coverage.label).toBe("50 van 50 stellingen beantwoord");
  });

  it("does not invent a clear direction from scores near the middle", () => {
    const profile = createPersonalProfile({
      ideologyName: "Gemengd profiel",
      dimensions: {
        economic: 6,
        social: -8,
        civil: 3,
        governance: 9,
        trust: -4,
      },
      themeScores: undefined,
      confidence: undefined,
      answeredCount: 19,
      totalQuestions: 50,
    });

    expect(profile.strongestAxes).toHaveLength(0);
    expect(profile.openAxes).toHaveLength(5);
    expect(profile.themeSignals).toHaveLength(0);
    expect(profile.coverage.message).toContain("voorzichtig");
  });
});
