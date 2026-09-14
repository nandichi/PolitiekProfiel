import { describe, expect, it } from "vitest";
import {
  MINIMUM_RESULT_ANSWERS,
  canCreateResult,
} from "@/lib/quiz-completion";

describe("canCreateResult", () => {
  it("requires five non-skipped answers before a profile can be created", () => {
    expect(MINIMUM_RESULT_ANSWERS).toBe(5);
    expect(canCreateResult(4)).toBe(false);
    expect(canCreateResult(5)).toBe(true);
  });
});
