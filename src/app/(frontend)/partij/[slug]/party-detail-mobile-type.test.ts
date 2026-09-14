import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(process.cwd(), "src", "app", "(frontend)", "partij", "[slug]", "page.tsx");
const cssPath = path.join(process.cwd(), "src", "app", "(frontend)", "globals.css");

describe("party detail mobile type", () => {
  it("keeps long international party names and metadata inside a 320px layout", () => {
    const page = readFileSync(pagePath, "utf8");
    const css = readFileSync(cssPath, "utf8");

    expect(page).toContain("party-title");
    expect(page).toContain("party-meta-term");
    expect(css).toContain(".party-title");
    expect(css).toContain(".party-meta-term");
  });
});
