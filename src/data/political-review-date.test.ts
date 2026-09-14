import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const politicalFiles = [
  "src/data/parties.ts",
  "src/data/politicians.ts",
  "src/app/(frontend)/partijen/page.tsx",
  "src/app/(frontend)/politici/page.tsx",
  "src/app/(frontend)/verkennen/page.tsx",
  "src/components/SiteHeader.tsx",
];

describe("political review date", () => {
  it("does not present the pre-audit 13 September review date as current", () => {
    const outdated = politicalFiles.filter((file) =>
      fs.readFileSync(path.join(process.cwd(), file), "utf8").includes("13 september 2026"),
    );
    expect(outdated).toEqual([]);
  });
});
