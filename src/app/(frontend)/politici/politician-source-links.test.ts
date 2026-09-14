import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("politician source transparency", () => {
  it("renders each politician source as a public outbound link", () => {
    const page = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/app/(frontend)/politici/[slug]/page.tsx",
      ),
      "utf8",
    );
    expect(page).toContain("politicus.sources.map");
    expect(page).toContain("href={source.url}");
  });
});
