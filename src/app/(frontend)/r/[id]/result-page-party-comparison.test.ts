import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "src", "app", "(frontend)", "r", "[id]", "page.tsx");
const componentPath = path.join(root, "src", "components", "result", "PartyStatementCompare.tsx");

describe("paid result-page party comparison", () => {
  it("derives comparisons from stored answers and renders the evidence section", () => {
    const page = readFileSync(pagePath, "utf8");
    const component = readFileSync(componentPath, "utf8");

    expect(page).toContain('import { PARTY_POSITIONS } from "@/data/party-positions";');
    expect(page).toContain("buildPartyComparisons");
    expect(page).toContain('id="partijstandpunten"');
    expect(page).toContain("<PartyStatementCompare");
    expect(component).toContain("Eerst antwoorden, dan vergelijken");
    expect(component).toContain("geen stemadvies");
    expect(component).toContain("Bron openen");
  });
});
