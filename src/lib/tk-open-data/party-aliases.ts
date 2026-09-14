/**
 * Mapping van TK Open Data fractie-afkortingen naar onze party-slugs.
 *
 * De TK kent partijen onder hun officiële afkorting, soms met variaties
 * (bv. "GL-PvdA", "GroenLinks-PvdA" of "Groep Markuszower"). De API levert die
 * namen met spaties, streepjes en underscore door elkaar. Door bij het opzoeken
 * alles behalve letters en cijfers weg te halen, hoeven we die varianten niet
 * apart te onderhouden. De sleutels hieronder staan daarom in die
 * genormaliseerde vorm: alleen A-Z en 0-9.
 *
 * BELANGRIJK: het doel van elke regel moet een bestaande partijpagina-slug uit
 * `PARTIES` zijn. De refresh schrijft stemgedrag weg onder deze slug en de
 * partijpagina leest met `party.slug`; wijkt dat af, dan verdwijnt het
 * stemgedrag stil van de pagina. `party-alias-coverage.test.ts` en
 * `active-fracties.test.ts` bewaken dit tegen de echte API-namen.
 */

export const TK_FRACTIE_TO_PARTY_SLUG: Record<string, string> = {
  D66: "d66",
  PVV: "pvv",
  VVD: "vvd",
  CDA: "cda",

  // Progressief Nederland. De fractie heette GroenLinks-PvdA tot 10 juni 2026
  // en heet in de API daarna "PRO".
  GLPVDA: "progressief-nederland",
  GROENLINKSPVDA: "progressief-nederland",
  GROENLINKS: "progressief-nederland", // historisch, vóór fusie
  PVDA: "progressief-nederland", // historisch, vóór fusie
  PROGRESSIEFNEDERLAND: "progressief-nederland",
  PRO: "progressief-nederland",

  JA21: "ja21",
  FVD: "fvd",

  // Groep Markuszower, sinds 20 januari 2026 afgesplitst van de PVV.
  DNA: "groep-markuszower",
  GROEPMARKUSZOWER: "groep-markuszower",
  GM: "groep-markuszower",

  // Eenpersoonsfractie van Mona Keijzer, sinds 24 februari 2026.
  LIDKEIJZER: "lid-keijzer",
  KEIJZER: "lid-keijzer",

  BBB: "bbb",
  DENK: "denk",
  CU: "christenunie",
  CHRISTENUNIE: "christenunie",
  SP: "sp",
  SGP: "sgp",
  PVDD: "pvdd",
  "50PLUS": "50plus",
  VOLT: "volt",
};

export function tkFractieToSlug(afkorting: string): string | null {
  const key = afkorting.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return TK_FRACTIE_TO_PARTY_SLUG[key] ?? null;
}

/**
 * Partijen die eerder onder een andere slug in `tk_voting_party` zijn
 * weggeschreven. Rijen uit die periode staan er nog; zonder deze lijst zou het
 * opgebouwde stemgedrag na een slugwijziging stil van de pagina verdwijnen.
 */
const LEGACY_SLUGS_BY_PARTY: Record<string, string[]> = {
  "progressief-nederland": ["groenlinks-pvda"],
  "groep-markuszower": ["dna"],
};

/** Canonieke slug eerst, daarna eventuele oude namen uit de database. */
export function partySlugLookupKeys(slug: string): string[] {
  return [slug, ...(LEGACY_SLUGS_BY_PARTY[slug] ?? [])];
}
