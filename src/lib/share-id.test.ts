import { describe, expect, it } from "vitest";
import { isShareId } from "@/lib/share-id";

describe("share capability validation", () => {
  it("accepts generated result capability identifiers", () => {
    expect(isShareId("Yf8oGX_1tZ-2")).toBe(true);
  });

  it.each(["", "short", "spaces are invalid", "../../unsafe", "x".repeat(33)])(
    "rejects malformed capability identifier %j",
    (value) => {
      expect(isShareId(value)).toBe(false);
    },
  );
});
