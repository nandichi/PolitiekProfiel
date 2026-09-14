import { describe, expect, it } from "vitest";
import { buildResultMarkdown, type ExportInput } from "@/lib/result-export";

describe("buildResultMarkdown", () => {
  it("keeps a disagreement literal instead of exporting the agreement stance", () => {
    const markdown = buildResultMarkdown({
      result: {
        shareId: "test-result",
        tier: "quick",
        ideologySlug: "liberalisme",
        dimensions: {
          economic: 0,
          social: 0,
          civil: 0,
          governance: 0,
          trust: 0,
        },
        answeredCount: 5,
        skippedCount: 0,
        totalQuestions: 5,
        createdAt: "2026-09-14T12:00:00.000Z",
      },
      ideology: {
        name: "Testideologie",
        shortDescription: "Korte omschrijving.",
      },
      parties: [],
      politicians: [],
      stances: [
        {
          statement: "Nederland moet de uitstoot sneller terugdringen.",
          signedValue: -2,
          value: -2,
          derivedStance: "Nederland moet de uitstoot sneller terugdringen.",
          dimension: "economic",
        },
      ],
    } as unknown as ExportInput);

    expect(markdown).toContain("## Jouw uitgesproken antwoorden");
    expect(markdown).toContain("> Nederland moet de uitstoot sneller terugdringen.");
    expect(markdown).toContain("*Jouw antwoord: sterk oneens.*");
    expect(markdown).not.toContain("## Wat jij waarschijnlijk vindt");
  });
});
