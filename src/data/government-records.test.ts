import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GOVERNMENT_RECORDS, getGovernmentRecord } from "./government-records";
import { PARTIES } from "./parties";

const page = readFileSync(
  path.join(process.cwd(), "src", "app", "(frontend)", "partij", "[slug]", "page.tsx"),
  "utf8",
);

describe("regeringsrecord per partij", () => {
  it("wijst alleen naar bestaande partijpagina's", () => {
    const slugs = new Set(PARTIES.map((party) => party.slug));
    const fout = GOVERNMENT_RECORDS.filter(
      (record) => !slugs.has(record.partySlug),
    ).map((record) => record.partySlug);

    expect(fout).toEqual([]);
  });

  it("geeft elke partij resultaten met een verantwoordelijke bewindspersoon en bron", () => {
    const fout: string[] = [];
    for (const record of GOVERNMENT_RECORDS) {
      if (record.results.length < 2) fout.push(`${record.partySlug}: te weinig resultaten`);
      if (record.notDelivered.length < 1) fout.push(`${record.partySlug}: niets over niet-gehaald`);
      if (!record.keyMinisters.trim()) fout.push(`${record.partySlug}: geen bewindslieden`);
      for (const result of record.results) {
        if (!result.responsibleMinister.trim()) {
          fout.push(`${record.partySlug}: resultaat zonder bewindspersoon`);
        }
        if (!result.year.trim()) fout.push(`${record.partySlug}: resultaat zonder jaar`);
        if (!/^https:\/\//.test(result.sourceUrl)) {
          fout.push(`${record.partySlug}: ongeldige bron`);
        }
      }
      for (const item of record.notDelivered) {
        if (!/^https:\/\//.test(item.sourceUrl)) {
          fout.push(`${record.partySlug}: ongeldige bron bij niet-gehaald punt`);
        }
      }
    }

    expect(fout).toEqual([]);
  });

  it("vindt een record op partijslug", () => {
    expect(getGovernmentRecord("vvd")?.cabinets.length).toBeGreaterThan(5);
    expect(getGovernmentRecord("bestaat-niet")).toBeUndefined();
  });

  it("toont het regeringsrecord op de partijpagina", () => {
    expect(page).toContain("getGovernmentRecord");
    expect(page).toContain("governmentRecord");
  });
});
