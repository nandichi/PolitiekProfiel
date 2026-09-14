import { describe, expect, it } from "vitest";
import { pickNextBatch, type AdaptiveQuestion } from "@/lib/adaptive";

const dimensions = ["economic", "social", "civil", "governance", "trust"] as const;

function question(id: number): AdaptiveQuestion {
  return {
    id,
    dimension: dimensions[(id - 1) % dimensions.length],
    direction: id % 2 === 0 ? 1 : -1,
    weight: 1,
    depth: "broad",
    discriminator: 1,
    themes: ["economie"],
  };
}

describe("pickNextBatch", () => {
  it("does not treat skipped statements as completed answers", () => {
    const skipped = Array.from({ length: 15 }, (_, index) => ({
      questionId: index + 1,
      value: null,
    }));

    const next = pickNextBatch({
      tier: "quick",
      seenIds: skipped.map((answer) => answer.questionId),
      answers: skipped,
      pool: Array.from({ length: 25 }, (_, index) => question(index + 1)),
    });

    expect(next).not.toHaveLength(0);
    expect(next.every((item) => !skipped.some((answer) => answer.questionId === item.id))).toBe(true);
  });
});
