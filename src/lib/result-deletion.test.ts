import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("self-service result deletion", () => {
  it("accepts only a valid share capability and deletes through the server store", () => {
    const route = fs.readFileSync(
      path.join(root, "src", "app", "api", "r", "[id]", "route.ts"),
      "utf8",
    );

    expect(route).toContain("isShareId(id)");
    expect(route).toContain("deleteResult(id)");
    expect(route).toContain("status: 204");
    expect(route).toContain("no-store");
  });

  it("deletes from whichever result store is active", () => {
    const store = fs.readFileSync(
      path.join(root, "src", "lib", "results-store.ts"),
      "utf8",
    );

    expect(store).toContain("export async function deleteResult");
    expect(store).toContain(".doc(shareId).delete()");
    expect(store).toContain("collection: \"results\"");
  });
});
