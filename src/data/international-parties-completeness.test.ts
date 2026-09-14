import { describe, expect, it } from "vitest";
import { INTERNATIONAL_PARTIES } from "./international-parties";

/**
 * De buitenlandse partijpagina's tonen een meta-strip met Opgericht,
 * Partijleider en Fractievoorzitter. Stonden die velden leeg, dan verscheen
 * daar drie keer "Onbekend". Deze test borgt dat elk profiel de basisgegevens
 * heeft en dat elk weetje een echte bron-URL meedraagt.
 */
describe("internationale partijprofielen zijn compleet", () => {
  it("heeft voor elke partij een oprichtingsjaar en een partijleider", () => {
    const missing = INTERNATIONAL_PARTIES.filter(
      (party) => !party.founded || !party.leader,
    ).map((party) => party.slug);

    expect(missing).toEqual([]);
  });

  it("geeft elke partij minstens twee weetjes met een bron-URL", () => {
    const thin = INTERNATIONAL_PARTIES.filter(
      (party) => (party.facts?.length ?? 0) < 2,
    ).map((party) => party.slug);

    expect(thin).toEqual([]);
  });

  it("laat elk weetje naar een https-bron wijzen", () => {
    const bad: string[] = [];
    for (const party of INTERNATIONAL_PARTIES) {
      for (const fact of party.facts ?? []) {
        if (!fact.claim?.trim()) bad.push(`${party.slug}: lege claim`);
        if (!/^https:\/\//.test(fact.sourceUrl ?? "")) {
          bad.push(`${party.slug}: ongeldige bron ${fact.sourceUrl}`);
        }
      }
    }

    expect(bad).toEqual([]);
  });

  it("houdt de peildatum gelijk voor alle profielen", () => {
    const dates = new Set(INTERNATIONAL_PARTIES.map((party) => party.lastReviewed));

    expect(dates.size).toBe(1);
  });
});
