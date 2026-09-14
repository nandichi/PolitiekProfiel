import { describe, expect, it } from "vitest";
import {
  mergePartyVotingRows,
  type PartyThemeVotingRow,
} from "./party-voting-merge";

const row = (
  partySlug: string,
  theme: string,
  voor: number,
  tegen: number,
  onthouding: number,
  updatedAt = "2026-09-01T00:00:00.000Z",
): PartyThemeVotingRow => {
  const totaal = voor + tegen + onthouding;
  return {
    partySlug,
    theme,
    voor,
    tegen,
    onthouding,
    totaal,
    voorPct: totaal > 0 ? Math.round((voor / totaal) * 100) : 0,
    updatedAt,
  };
};

describe("mergePartyVotingRows", () => {
  it("telt rijen onder een oude en een nieuwe partijslug samen", () => {
    const merged = mergePartyVotingRows("progressief-nederland", [
      row("groenlinks-pvda", "klimaat", 6, 2, 0),
      row("progressief-nederland", "klimaat", 3, 1, 1),
    ]);

    expect(merged).toHaveLength(1);
    expect(merged[0].voor).toBe(9);
    expect(merged[0].tegen).toBe(3);
    expect(merged[0].onthouding).toBe(1);
    expect(merged[0].totaal).toBe(13);
    expect(merged[0].voorPct).toBe(69);
  });

  it("houdt verschillende thema's apart", () => {
    const merged = mergePartyVotingRows("progressief-nederland", [
      row("groenlinks-pvda", "klimaat", 6, 2, 0),
      row("progressief-nederland", "wonen", 1, 1, 0),
    ]);

    expect(merged.map((r) => r.theme).sort()).toEqual(["klimaat", "wonen"]);
  });

  it("levert de canonieke slug en de nieuwste datum op", () => {
    const merged = mergePartyVotingRows("progressief-nederland", [
      row("groenlinks-pvda", "klimaat", 6, 2, 0, "2026-02-01T00:00:00.000Z"),
      row("progressief-nederland", "klimaat", 1, 0, 0, "2026-09-10T00:00:00.000Z"),
    ]);

    expect(merged[0].partySlug).toBe("progressief-nederland");
    expect(merged[0].updatedAt).toBe("2026-09-10T00:00:00.000Z");
  });

  it("laat een enkele rij ongewijzigd doorwerken", () => {
    const merged = mergePartyVotingRows("d66", [row("d66", "zorg", 4, 0, 0)]);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({ partySlug: "d66", voor: 4, totaal: 4, voorPct: 100 });
  });
});
