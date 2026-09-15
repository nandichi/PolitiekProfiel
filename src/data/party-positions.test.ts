import { describe, expect, it } from "vitest";
import { PARTY_POSITIONS, normalizeStatement } from "./party-positions";
import { ALL_QUESTION_STATEMENTS } from "./question-statements";

const STANCES = ["eens", "oneens", "neutraal", "geen-standpunt"];
const BASES = ["programma", "stemgedrag", "beide"];

describe("standpunten per partij per stelling", () => {
  const bank = new Set(ALL_QUESTION_STATEMENTS.map(normalizeStatement));

  it("heeft de vragenbank volledig ingelezen", () => {
    expect(ALL_QUESTION_STATEMENTS.length).toBeGreaterThan(150);
    expect(bank.size).toBe(ALL_QUESTION_STATEMENTS.length);
  });

  it("koppelt elke codering aan een echte stelling uit de vragenbank", () => {
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      for (const position of set.positions) {
        if (!bank.has(normalizeStatement(position.statement))) {
          fout.push(`${set.partySlug}: onbekende stelling "${position.statement.slice(0, 50)}"`);
        }
      }
    }

    expect(fout).toEqual([]);
  });

  it("gebruikt alleen toegestane coderingen en basiswaarden", () => {
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      for (const position of set.positions) {
        if (!STANCES.includes(position.stance)) {
          fout.push(`${set.partySlug}: onbekende codering ${position.stance}`);
        }
        if (!BASES.includes(position.basis)) {
          fout.push(`${set.partySlug}: onbekende basis ${position.basis}`);
        }
      }
    }

    expect(fout).toEqual([]);
  });

  it("geeft elk echt standpunt een bron", () => {
    // Een codering als eens, oneens of neutraal zonder bron is niet te
    // controleren en mag de site niet op. Bij "geen standpunt" is een bron
    // optioneel: de een laat hem leeg, de ander verwijst naar het programma
    // waarin hij tevergeefs is gezocht.
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      for (const position of set.positions) {
        if (position.stance === "geen-standpunt") continue;
        if (!/^https:\/\//.test(position.sourceUrl)) {
          fout.push(
            `${set.partySlug}: "${position.statement.slice(0, 40)}" heeft codering ${position.stance} zonder bron`,
          );
        }
      }
    }

    expect(fout).toEqual([]);
  });

  it("citeert alleen bij een echt standpunt", () => {
    // Bij "geen standpunt" mag de bron wel staan (dat is het programma waarin
    // we het tevergeefs zochten), maar er hoort geen citaat te zijn: er is
    // niets om te citeren.
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      for (const position of set.positions) {
        if (position.stance === "geen-standpunt" && position.quote) {
          fout.push(
            `${set.partySlug}: geen standpunt met een citaat bij "${position.statement.slice(0, 40)}"`,
          );
        }
      }
    }

    expect(fout).toEqual([]);
  });

  it("heeft voor elke gekoppelde partij exact één codering per stelling", () => {
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      if (set.positions.length !== ALL_QUESTION_STATEMENTS.length) {
        fout.push(`${set.partySlug}: ${set.positions.length} in plaats van ${ALL_QUESTION_STATEMENTS.length}`);
      }
      const statements = set.positions.map((position) => normalizeStatement(position.statement));
      if (new Set(statements).size !== statements.length) {
        fout.push(`${set.partySlug}: dubbele stelling`);
      }
    }

    expect(fout).toEqual([]);
  });

  it("heeft een bron en controledatum per partijset", () => {
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      if (!/^https:\/\//.test(set.programmeUrl)) {
        fout.push(`${set.partySlug}: ongeldige programmalink`);
      }
      if (!set.reviewed.trim()) {
        fout.push(`${set.partySlug}: ontbrekende controledatum`);
      }
    }

    expect(fout).toEqual([]);
  });

  it("houdt citaten kort en laat geen standpunt zonder citaat staan", () => {
    const fout: string[] = [];
    for (const set of PARTY_POSITIONS) {
      for (const position of set.positions) {
        if (position.stance === "geen-standpunt" && position.quote) {
          fout.push(`${set.partySlug}: citaat bij geen-standpunt`);
        }
        if (position.quote && position.quote.trim().split(/\s+/).length > 20) {
          fout.push(`${set.partySlug}: te lang citaat bij "${position.statement.slice(0, 40)}"`);
        }
      }
    }

    expect(fout).toEqual([]);
  });

  it("heeft alle Nederlandse partijen uit de vragenbank gekoppeld", () => {
    expect(new Set(PARTY_POSITIONS.map((set) => set.partySlug))).toEqual(
      new Set([
        "d66",
        "christenunie",
        "pvv",
        "cda",
        "vvd",
        "progressief-nederland",
        "sp",
        "pvdd",
        "bbb",
        "ja21",
        "fvd",
        "denk",
        "sgp",
        "volt",
        "50plus",
        "groep-markuszower",
        "lid-keijzer",
      ]),
    );
  });

  it("laat een partij niet dubbel voorkomen", () => {
    const slugs = PARTY_POSITIONS.map((set) => set.partySlug);

    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
