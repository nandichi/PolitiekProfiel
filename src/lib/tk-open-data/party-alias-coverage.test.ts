import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PARTIES } from "@/data/parties";
import {
  TK_FRACTIE_TO_PARTY_SLUG,
  partySlugLookupKeys,
  tkFractieToSlug,
} from "./party-aliases";

/**
 * De wekelijkse TK-refresh schrijft stemgedrag weg onder de slug die uit deze
 * map komt. De partijpagina leest vervolgens met `party.slug`. Zolang beide
 * kanten niet exact dezelfde slug gebruiken, verdwijnt het stemgedrag stil:
 * geen foutmelding, alleen een leeg blok op de pagina.
 */
describe("TK fractie-alias naar partijpagina", () => {
  const pageSlugs = new Set(PARTIES.map((party) => party.slug));

  it("laat elke OData-alias naar een bestaande partijpagina wijzen", () => {
    const orphans = Object.entries(TK_FRACTIE_TO_PARTY_SLUG)
      .filter(([, slug]) => !pageSlugs.has(slug))
      .map(([fractie, slug]) => `${fractie} -> ${slug}`);

    expect(orphans).toEqual([]);
  });

  it("koppelt GL-PvdA aan de pagina van Progressief Nederland", () => {
    expect(tkFractieToSlug("GL-PvdA")).toBe("progressief-nederland");
  });

  it("koppelt DNA aan de pagina van Groep Markuszower", () => {
    expect(tkFractieToSlug("DNA")).toBe("groep-markuszower");
  });

  it("koppelt de eenpersoonsfractie van Keijzer aan haar eigen pagina", () => {
    expect(tkFractieToSlug("Lid Keijzer")).toBe("lid-keijzer");
  });

  it("haalt bij het lezen ook rijen onder een oude partijnaam op", () => {
    expect(partySlugLookupKeys("progressief-nederland")).toEqual([
      "progressief-nederland",
      "groenlinks-pvda",
    ]);
    expect(partySlugLookupKeys("groep-markuszower")).toEqual([
      "groep-markuszower",
      "dna",
    ]);
  });

  it("gebruikt voor een onveranderde partij alleen de eigen slug", () => {
    expect(partySlugLookupKeys("d66")).toEqual(["d66"]);
  });

  it("laat de lezer alle opgegeven slugs ophalen en samenvoegen", () => {
    const store = readFileSync(
      path.join(process.cwd(), "src", "lib", "tk-open-data", "voting-store.ts"),
      "utf8",
    );

    expect(store).toContain("partySlugLookupKeys");
    expect(store).toContain("mergePartyVotingRows");
  });
});
