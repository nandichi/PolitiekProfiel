import { describe, expect, it } from "vitest";
import {
  STATIC_QUESTION_ID_BASE,
  isStaticQuestionId,
  stableQuestionId,
} from "@/lib/static-question-data";

describe("static question identifiers", () => {
  it("keeps a question ID stable when source-array order changes", () => {
    const first = stableQuestionId("Nederland moet investeren in openbaar vervoer.");
    const second = stableQuestionId("Nederland moet investeren in openbaar vervoer.");

    expect(first).toBe(second);
    expect(first).toBeGreaterThan(STATIC_QUESTION_ID_BASE);
    expect(isStaticQuestionId(first)).toBe(true);
  });

  it("still recognizes the legacy positional ID range for existing reports", () => {
    expect(isStaticQuestionId(900_000)).toBe(true);
    expect(isStaticQuestionId(900_162)).toBe(true);
  });
});
