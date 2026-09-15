import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// Direct uit het databestand: `seed-readers` importeert `server-only` en
// laadt daardoor niet in een testomgeving.
import { POLITICIANS } from "./politicians";

const page = readFileSync(
  path.join(
    process.cwd(),
    "src",
    "app",
    "(frontend)",
    "politici",
    "[slug]",
    "page.tsx",
  ),
  "utf8",
);

describe("politicusprofielen", () => {
  const all = POLITICIANS;
  const dutch = all.filter((p) => !p.isInternational);

  it("bevat de ontbrekende Kamerleden en fractievoorzitters", () => {
    const namen = new Set(dutch.map((p) => p.name));
    for (const naam of [
      "Thom van Campen",
      "Lidewij de Vos",
      "Chris Stoffer",
      "Jan Struijs",
      "Caroline van der Plas",
      "Esther Ouwehand",
      "Bart van den Brink",
      "Femke Wiersma",
      "Frans Timmermans",
      "Annabel Nanninga",
    ]) {
      expect(namen.has(naam), `${naam} ontbreekt`).toBe(true);
    }
  });

  it("noemt Ralf Dekker niet langer de fractievoorzitter van FVD", () => {
    const dekker = dutch.find((p) => p.name === "Ralf Dekker");

    expect(dekker?.role).toContain("Waarnemend");
    expect(dekker?.bio).toContain("Lidewij de Vos");
  });

  it("geeft elke Nederlandse politicus minstens één feit met https-bron", () => {
    const bad: string[] = [];
    for (const politicus of dutch) {
      if (!politicus.facts?.length) {
        bad.push(`${politicus.name}: geen feiten`);
        continue;
      }
      for (const fact of politicus.facts) {
        if (!fact.claim.trim()) bad.push(`${politicus.name}: lege claim`);
        if (!/^https:\/\//.test(fact.sourceUrl)) {
          bad.push(`${politicus.name}: bron ${fact.sourceUrl}`);
        }
      }
    }

    expect(bad).toEqual([]);
  });

  it("toont de feiten op de detailpagina met een bron per stuk", () => {
    expect(page).toContain("politicus.facts");
    expect(page).toContain("fact.sourceUrl");
  });
});
