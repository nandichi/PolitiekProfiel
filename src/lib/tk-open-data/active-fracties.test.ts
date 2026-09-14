import { describe, expect, it } from "vitest";
import { PARTIES } from "@/data/parties";
import { tkFractieToSlug } from "./party-aliases";

/**
 * Deze afkortingen komen uit de echte TK Open Data `Fractie`-set, gefilterd op
 * `Verwijderd eq false` en `AantalZetels > 0`. Ze zijn één op één overgenomen
 * zoals de API ze teruggeeft, inclusief spaties en hoofdletters, want juist die
 * vorm bepaalt of de wekelijkse stemmingrefresh een partij terugvindt.
 *
 * `Nieuw Sociaal Contract` staat er bewust niet bij: die fractie is sinds
 * 11 november 2025 inactief en heeft geen pagina op de site.
 */
const ACTIEVE_TK_AFKORTINGEN = [
  "D66",
  "VVD",
  "PRO",
  "GroenLinks-PvdA",
  "PVV",
  "CDA",
  "JA21",
  "Groep Markuszower",
  "FVD",
  "ChristenUnie",
  "SP",
  "PvdD",
  "SGP",
  "BBB",
  "DENK",
  "50PLUS",
  "Lid Keijzer",
  "Volt",
] as const;

describe("elke actieve TK-fractie vindt een partijpagina", () => {
  const pageSlugs = new Set(PARTIES.map((party) => party.slug));

  it.each(ACTIEVE_TK_AFKORTINGEN)("herkent %s", (afkorting) => {
    const slug = tkFractieToSlug(afkorting);

    expect(slug, `geen slug voor ${afkorting}`).not.toBeNull();
    expect(pageSlugs.has(slug as string), `${slug} is geen bestaande pagina`).toBe(true);
  });

  it("laat spaties en streepjes geen verschil maken", () => {
    expect(tkFractieToSlug("Groep Markuszower")).toBe(
      tkFractieToSlug("Groep-Markuszower"),
    );
    expect(tkFractieToSlug("GL-PvdA")).toBe(tkFractieToSlug("GLPvdA"));
  });
});
