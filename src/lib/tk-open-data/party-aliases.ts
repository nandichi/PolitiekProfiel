/**
 * Mapping van TK Open Data fractie-afkortingen naar onze party-slugs.
 *
 * De TK kent partijen onder hun officiële afkorting, soms met variaties
 * (bv. "GL-PvdA" of "GroenLinks-PvdA"). Deze map houdt het simpel: afkorting
 * (uppercase, zonder spaties) -> slug.
 *
 * BELANGRIJK: het doel van elke regel moet een bestaande partijpagina-slug
 * uit `PARTIES` zijn. De refresh schrijft stemgedrag weg onder deze slug en de
 * partijpagina leest met `party.slug`; wijkt dat af, dan verdwijnt het
 * stemgedrag stil van de pagina. `party-alias-coverage.test.ts` bewaakt dit.
 */

export const TK_FRACTIE_TO_PARTY_SLUG: Record<string, string> = {
  D66: "d66",
  PVV: "pvv",
  VVD: "vvd",
  CDA: "cda",
  "GL-PVDA": "progressief-nederland",
  GROENLINKS_PVDA: "progressief-nederland",
  "GROENLINKS-PVDA": "progressief-nederland",
  GROENLINKS: "progressief-nederland", // historisch, vóór fusie
  PVDA: "progressief-nederland", // historisch, vóór fusie
  "PROGRESSIEF-NEDERLAND": "progressief-nederland",
  PRO: "progressief-nederland",
  JA21: "ja21",
  FVD: "fvd",
  DNA: "groep-markuszower",
  "GROEP-MARKUSZOWER": "groep-markuszower",
  GM: "groep-markuszower",
  "LIDKEIJZER": "lid-keijzer",
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
  const key = afkorting.toUpperCase().replace(/\s+/g, "");
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
