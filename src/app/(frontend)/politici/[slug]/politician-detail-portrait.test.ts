import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(process.cwd(), "src", "app", "(frontend)", "politici", "[slug]", "page.tsx");

describe("politician detail portrait", () => {
  it("includes a plain-language contextual portrait", () => {
    const source = readFileSync(pagePath, "utf8");

    expect(source).toContain('import { PoliticianProfileLens } from "@/components/politicians/PoliticianProfileLens"');
    expect(source).toContain('import { buildPoliticianProfileLens } from "@/lib/politician-profile-lens"');
    expect(source).toContain("const politicianLens = buildPoliticianProfileLens(");
    expect(source).toContain("<PoliticianProfileLens lens={politicianLens} />");
  });
});
