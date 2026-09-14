import { describe, expect, it } from "vitest";
import {
  entitlementAttemptKey,
  isSubmissionId,
  nextReservedAttempt,
} from "@/lib/attempt-reservation";

describe("paid attempt reservations", () => {
  it("derives a non-reversible Firestore key without keeping the bearer token", () => {
    const token = "A".repeat(32);
    const key = entitlementAttemptKey(token);

    expect(key).toMatch(/^[a-f0-9]{64}$/);
    expect(key).not.toContain(token);
    expect(key).toBe(entitlementAttemptKey(token));
  });

  it("allows the second completion but atomically rejects a third", () => {
    expect(nextReservedAttempt(1, 2)).toEqual({ ok: true, count: 2 });
    expect(nextReservedAttempt(2, 2)).toEqual({ ok: false, count: 2 });
  });

  it("accepts only bounded opaque submission identifiers", () => {
    expect(isSubmissionId("72c7da0e-bb3d-411b-9e9f-1e62ec4c3477")).toBe(true);
    expect(isSubmissionId("too short")).toBe(false);
    expect(isSubmissionId("x".repeat(129))).toBe(false);
  });
});
