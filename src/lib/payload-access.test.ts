import { describe, expect, it } from "vitest";
import { hasPayloadUser } from "@/lib/payload-access";

describe("hasPayloadUser", () => {
  it("rejects anonymous REST access", () => {
    expect(hasPayloadUser({ user: null })).toBe(false);
  });

  it("allows an authenticated Payload user", () => {
    expect(hasPayloadUser({ user: { id: "admin-1" } })).toBe(true);
  });
});
