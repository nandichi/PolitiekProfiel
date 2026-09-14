import { describe, expect, it } from "vitest";
import { isBehaviouralTrackingEnabled } from "@/lib/privacy-policy";

describe("quiz privacy policy", () => {
  it("does not permit persistent behavioural quiz tracking", () => {
    expect(isBehaviouralTrackingEnabled()).toBe(false);
  });
});
