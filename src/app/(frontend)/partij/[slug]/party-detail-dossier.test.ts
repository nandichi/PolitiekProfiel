import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = path.join(process.cwd(), "src", "app", "(frontend)", "partij", "[slug]", "page.tsx");

describe("party detail dossier", () => {
  it("adds a plain-language reading guide to every party page", () => {
    const page = readFileSync(pagePath, "utf8");
    expect(page).toContain('import { PartyDossier }');
    expect(page).toContain("buildPartyDossier");
    expect(page).toContain("<PartyDossier dossier={partyDossier} />");
  });
});
