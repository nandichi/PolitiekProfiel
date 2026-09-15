import { describe, expect, it } from "vitest";
import { buildPartyComparisons } from "./party-position-comparison";
import type { PartyPositionSet } from "@/data/party-positions";

const party = {
  slug: "demo",
  name: "Demo Partij",
  abbreviation: "DP",
  region: "NL",
  regionType: "national",
};

const set: PartyPositionSet = {
  partySlug: "demo",
  programmeTitle: "Demo",
  programmeUrl: "https://example.com/programme",
  reviewed: "2026-09-15",
  positions: [
    {
      statement: "Belastingstelling",
      stance: "eens",
      basis: "programma",
      sourceUrl: "https://example.com/programme",
      quote: "Wij zijn het eens.",
    },
    {
      statement: "Zorgstelling",
      stance: "oneens",
      basis: "beide",
      sourceUrl: "https://example.com/vote",
      quote: "Wij zijn het oneens.",
    },
    {
      statement: "Onbekende stelling",
      stance: "geen-standpunt",
      basis: "programma",
      sourceUrl: "https://example.com/programme",
    },
  ],
};

describe("buildPartyComparisons", () => {
  it("compares only answered positions and excludes no-position from the denominator", () => {
    const result = buildPartyComparisons({
      answers: [
        { questionId: 1, value: 2 },
        { questionId: 2, value: -1 },
        { questionId: 3, value: 1 },
      ],
      questions: [
        { id: 1, statement: "Belastingstelling" },
        { id: 2, statement: "Zorgstelling" },
        { id: 3, statement: "Onbekende stelling" },
      ],
      positionSets: [set],
      parties: [party],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      matchingAnswers: 2,
      consideredAnswers: 2,
      noPositionAnswers: 1,
      skippedUnanswered: 0,
      matchPercentage: 100,
    });
    expect(result[0].agreements).toHaveLength(2);
    expect(result[0].differences).toHaveLength(0);
  });

  it("does not manufacture a match when a question was not answered", () => {
    const result = buildPartyComparisons({
      answers: [{ questionId: 1, value: null }],
      questions: [{ id: 1, statement: "Belastingstelling" }],
      positionSets: [set],
      parties: [party],
    });

    expect(result[0]).toMatchObject({
      matchPercentage: null,
      matchingAnswers: 0,
      consideredAnswers: 0,
      skippedUnanswered: 3,
    });
  });
});
