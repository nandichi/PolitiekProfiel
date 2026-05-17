/**
 * Heuristische mapping van TK-zaaktekst naar onze 7 beleidsthema's.
 *
 * Doel: een snelle 0/1-classificatie op basis van keywords in titel +
 * onderwerp. Niet bedoeld als wetenschappelijke classificatie, maar om
 * stemgedrag per thema agregeren op de partijpagina (B2) en politicipagina
 * (C5).
 *
 * Volgorde van checks is van smal naar breed. Eerste hit wint.
 */
import type { ThemeId } from "@/lib/themes";

const PATTERNS: Array<{ theme: ThemeId; regex: RegExp }> = [
  // Klimaat & milieu
  {
    theme: "klimaat",
    regex:
      /\b(klimaat|stikstof|natuur(herstel)?|biodiversi|CO2|broeikas|wind(molens|park)|zonnepark|kernenergie|fossiele?\s*(brandstof|subsidie)|emissie|warmtepomp|isolatie|verduurzam|milieu|natura\s*2000|landbouw\s*(transitie|hervorming))\b/i,
  },
  // Migratie & integratie
  {
    theme: "migratie",
    regex:
      /\b(asiel|migratie|immigratie|vluchtelingen|inburgering|spreidingswet|tweestatusstelsel|nareis|vreemdelingen|grenscontrole|terugkeer|opvang(crisis)?|statushouder|integratie)\b/i,
  },
  // Wonen & ruimte
  {
    theme: "wonen",
    regex:
      /\b(woning(crisis|bouw|markt)?|huur(prijzen|markt|verlaging)?|hypotheek|sociale\s*huur|corporaties?|nieuwbouw|verhuurderheffing|starters?(woning|lening)|huisvesting|wonen)\b/i,
  },
  // EU & internationaal
  {
    theme: "eu",
    regex:
      /\b(europees(e|)? unie|EU(-|\s)|brussel(s)?|Europese\s+Commissie|europarlement|euro(pees)?\s*(parlement|leger|begroting)|verdrag\s+van\s+lissabon|brexit|nexit|navo|defensie\s*samenwerking|sanctie(s)?|oekra(ï|i)ne)\b/i,
  },
  // Zorg & welzijn
  {
    theme: "zorg",
    regex:
      /\b(zorg(stelsel|verzekeraar|kosten|premie|personeel|kantoor)?|verpleging|verzorgingstehuis|huisarts|ziekenhuis|ggz|jeugdzorg|wmo|wlz|zvw|farmac|euthanasie|geneesmiddel|abortus|preventie|wijkverpleging|eigen\s+risico)\b/i,
  },
  // Economie & belastingen
  {
    theme: "economie",
    regex:
      /\b(belasting|btw|inkomstenbelasting|vennootschap|box\s*3|fiscale|begroting|miljoenennota|voorjaarsnota|aow|pensioen|minimumloon|werkloosheid|uitkering|toeslag(en)?|cpb|conjunctuur|inflatie|loonstijging|cao|economie|brede\s*welvaart)\b/i,
  },
  // Democratie & instituties
  {
    theme: "democratie",
    regex:
      /\b(democratie|kiesstelsel|referendum|grondwet|grondrechten|rechtsstaat|trias|kiesraad|verkiezingsuitslag|burger(beraad|forum)|persvrijheid|publieke\s*omroep|toezicht(houder)?|integriteit|fraude|ondermijning|machtenscheiding|EHRM|VN-verdrag)\b/i,
  },
];

export function inferThemeFromText(input: {
  titel?: string | null;
  onderwerp?: string | null;
}): ThemeId | null {
  const haystack = `${input.titel ?? ""} ${input.onderwerp ?? ""}`.trim();
  if (!haystack) return null;
  for (const { theme, regex } of PATTERNS) {
    if (regex.test(haystack)) return theme;
  }
  return null;
}
