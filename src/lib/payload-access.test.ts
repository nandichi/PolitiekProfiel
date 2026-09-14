import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { hasPayloadAdmin } from "@/lib/payload-access";

describe("hasPayloadAdmin", () => {
  it("rejects anonymous REST access", () => {
    expect(hasPayloadAdmin({ user: null })).toBe(false);
  });

  it("rejects an editor from reading sensitive results", () => {
    expect(hasPayloadAdmin({ user: { id: "editor-1", role: "editor" } })).toBe(false);
  });

  it("allows an administrator and preserves the legacy administrator migration path", () => {
    expect(hasPayloadAdmin({ user: { id: "admin-1", role: "admin" } })).toBe(true);
    expect(hasPayloadAdmin({ user: { id: "legacy-admin" } })).toBe(true);
  });

  it("does not let a new editor self-promote through the CMS user collection", () => {
    const users = fs.readFileSync(
      path.join(process.cwd(), "src", "collections", "Users.ts"),
      "utf8",
    );

    expect(users).toContain('name: "role"');
    expect(users).toContain('defaultValue: "editor"');
    expect(users).toContain("hasPayloadAdmin");
  });
});
