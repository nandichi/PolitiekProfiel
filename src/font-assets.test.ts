import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();
const FONT_FILES = [
  "public/fonts/CabinetGrotesk-Variable.woff2",
  "public/fonts/Switzer-Variable.woff2",
] as const;

describe("self-hosted redesign fonts", () => {
  it.each(FONT_FILES)("ships a real WOFF2 asset at %s", (relativePath) => {
    const absolutePath = path.join(ROOT, relativePath);
    const font = readFileSync(absolutePath);

    expect(font.subarray(0, 4).toString("ascii")).toBe("wOF2");
    expect(statSync(absolutePath).size).toBeGreaterThan(30_000);
  });

  it("wires both variable fonts through next/font/local", () => {
    const layout = readFileSync(
      path.join(ROOT, "src/app/(frontend)/layout.tsx"),
      "utf8",
    );

    expect(layout).toContain('from "next/font/local"');
    expect(layout).toContain("CabinetGrotesk-Variable.woff2");
    expect(layout).toContain("Switzer-Variable.woff2");
    expect(layout).toContain('variable: "--font-cabinet"');
    expect(layout).toContain('variable: "--font-switzer"');
  });

  it("records the official family and license sources", () => {
    const notice = readFileSync(
      path.join(ROOT, "public/fonts/README.md"),
      "utf8",
    );

    expect(notice).toContain("Cabinet Grotesk");
    expect(notice).toContain("Switzer");
    expect(notice).toContain("ITF Free Font License");
    expect(notice).toContain("https://www.fontshare.com/licenses/itf-ffl");
  });
});
