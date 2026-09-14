import { describe, expect, it } from "vitest";
import { CABINETS, CABINET_REVIEWED, getCabinetBySlug } from "./cabinets";

describe("kabinettendata", () => {
  it("dekt de periode vanaf 1994 tot het zittende kabinet", () => {
    expect(CABINETS.length).toBeGreaterThanOrEqual(10);
    expect(CABINETS.some((cabinet) => cabinet.sitting)).toBe(true);
  });

  it("geeft elk kabinet bereikte maatregelen en niet-gehaalde doelen", () => {
    const thin = CABINETS.filter(
      (cabinet) =>
        cabinet.achievements.length < 2 ||
        cabinet.unfulfilled.length < 1 ||
        !cabinet.interestingFact,
    ).map((cabinet) => cabinet.slug);

    expect(thin).toEqual([]);
  });

  it("laat elke bewering naar een echte https-bron wijzen", () => {
    const bad: string[] = [];
    for (const cabinet of CABINETS) {
      const claims = [
        ...cabinet.achievements,
        ...cabinet.unfulfilled,
      ];
      for (const claim of claims) {
        if (!claim.claim.trim()) bad.push(`${cabinet.slug}: lege claim`);
        if (!/^https:\/\//.test(claim.sourceUrl)) {
          bad.push(`${cabinet.slug}: bron ${claim.sourceUrl}`);
        }
      }
      if (!/^https:\/\//.test(cabinet.interestingFactSource)) {
        bad.push(`${cabinet.slug}: feitbron ${cabinet.interestingFactSource}`);
      }
    }

    expect(bad).toEqual([]);
  });

  it("vertelt nergens dat een belofte is gehaald zonder bron", () => {
    // De claims mogen geen ingebakken controledatum meer bevatten; die staat
    // apart op de pagina.
    const withStamp = CABINETS.filter((cabinet) =>
      [...cabinet.achievements, ...cabinet.unfulfilled].some((claim) =>
        /gecontroleerd/i.test(claim.claim),
      ),
    ).map((cabinet) => cabinet.slug);

    expect(withStamp).toEqual([]);
  });

  it("vindt een kabinet op zijn slug", () => {
    expect(getCabinetBySlug("rutte-ii")?.name).toContain("Rutte II");
    expect(getCabinetBySlug("bestaat-niet")).toBeUndefined();
  });

  it("houdt de peildatum gelijk voor alle kabinetten", () => {
    const dates = new Set(CABINETS.map((cabinet) => cabinet.reviewed));

    expect(dates.size).toBe(1);
    expect([...dates][0]).toBe(CABINET_REVIEWED);
  });
});
