import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (file: string) =>
  fs.readFileSync(path.join(process.cwd(), file), "utf8");

describe("plain-language result presentation", () => {
  it("keeps EU integration distinct from local decentralisation", () => {
    const dimensions = read("src/lib/dimensions.ts");
    expect(dimensions).toContain("Europees/internationaal samenwerken");
    expect(dimensions).not.toContain("of juist meer macht naar regio's, gemeentes en burgers");
  });

  it("describes result evidence as pattern clarity, not as trust", () => {
    const indicator = read("src/components/result/ConfidenceIndicator.tsx");
    const confidence = read("src/lib/confidence.ts");
    expect(indicator).toContain("Duidelijkheid van dit patroon");
    expect(indicator).not.toContain('label = "Vertrouwen"');
    expect(confidence).toContain("Duidelijk patroon");
    expect(confidence).not.toContain("Hoog vertrouwen");
  });

  it("does not imply an economic link in a migration-only mismatch", () => {
    const paradox = read("src/lib/paradox.ts");
    expect(paradox).toContain('"migratie-mismatch"');
    expect(paradox).not.toContain('"migratie-economie"');
  });
});
