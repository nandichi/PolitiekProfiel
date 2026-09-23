import { describe, expect, it } from "vitest";
import {
  PUBLIC_MOTION_BLOCKER_SELECTOR,
  getPublicMotionPolicy,
} from "./public-motion-policy";

describe("public motion route policy", () => {
  it("enables Lenis only on explicit marketing and content routes", () => {
    expect(getPublicMotionPolicy("/", "")).toEqual({
      lenis: true,
      gsap: true,
    });
    expect(getPublicMotionPolicy("/privacy", "")).toEqual({
      lenis: true,
      gsap: false,
    });
    expect(getPublicMotionPolicy("/woordenboek/tweede-kamer", "")).toEqual({
      lenis: true,
      gsap: false,
    });
  });

  it("limits GSAP to the homepage and method story", () => {
    expect(getPublicMotionPolicy("/methodiek", "")).toEqual({
      lenis: true,
      gsap: true,
    });
    expect(getPublicMotionPolicy("/verkennen", "").gsap).toBe(false);
  });

  it.each([
    "/quiz/quick",
    "/r/example",
    "/embed/example",
    "/contact",
    "/coalitie",
    "/turing-test",
    "/vergelijk",
    "/evolutie",
  ])("keeps interactive route %s on native scroll", (pathname) => {
    expect(getPublicMotionPolicy(pathname, "")).toEqual({
      lenis: false,
      gsap: false,
    });
  });

  it("blocks smooth scrolling whenever a form or dialog is present", () => {
    expect(PUBLIC_MOTION_BLOCKER_SELECTOR).toContain("form");
    expect(PUBLIC_MOTION_BLOCKER_SELECTOR).toContain("dialog[open]");
    expect(PUBLIC_MOTION_BLOCKER_SELECTOR).toContain('[role="dialog"]');
  });

  it("disables public motion for checkout state", () => {
    expect(getPublicMotionPolicy("/", "checkout=cancelled&tier=standard")).toEqual({
      lenis: false,
      gsap: false,
    });
  });
});
