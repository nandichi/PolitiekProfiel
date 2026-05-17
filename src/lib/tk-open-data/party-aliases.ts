/**
 * Mapping van TK Open Data fractie-afkortingen naar onze party-slugs.
 *
 * De TK kent partijen onder hun officiële afkorting, soms met variaties
 * (bv. "GL-PvdA" of "GroenLinks-PvdA"). Deze map houdt het simpel: afkorting
 * (uppercase) -> slug.
 */

export const TK_FRACTIE_TO_PARTY_SLUG: Record<string, string> = {
  D66: "d66",
  PVV: "pvv",
  VVD: "vvd",
  CDA: "cda",
  "GL-PVDA": "groenlinks-pvda",
  GROENLINKS_PVDA: "groenlinks-pvda",
  "GROENLINKS-PVDA": "groenlinks-pvda",
  GROENLINKS: "groenlinks-pvda", // historisch, vóór fusie
  PVDA: "groenlinks-pvda", // historisch, vóór fusie
  JA21: "ja21",
  FVD: "fvd",
  DNA: "dna",
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
