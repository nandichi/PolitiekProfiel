import { describe, expect, it } from "vitest";
import { hasClearDimensionDirection } from "@/lib/result-presentation";

describe("hasClearDimensionDirection", () => {
  it("does not label a balanced score as either political pole", () => {
    expect(hasClearDimensionDirection(0)).toBe(false);
    expect(hasClearDimensionDirection(9)).toBe(false);
    expect(hasClearDimensionDirection(-9)).toBe(false);
  });

  it("labels a score outside the neutral range as directional", () => {
    expect(hasClearDimensionDirection(10)).toBe(true);
    expect(hasClearDimensionDirection(-10)).toBe(true);
  });
});
