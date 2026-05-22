import type { DimensionScores } from "@/lib/scoring";
import type { SeedSource } from "./questions";

export type PartyRegion = "NL" | "EU" | "US";
export type PartyRegionType = "national" | "family" | "faction";
export type CoalitionStatus =
  | "governing"
  | "opposition"
  | "splinter"
  | "none";

export interface SeedParty {
  name: string;
  abbreviation: string;
  slug: string;
  region: PartyRegion;
  regionType: PartyRegionType;
  country?: string;
  description: string;
  positionVector: DimensionScores;
  ideologySlugs: string[];
  founded?: string;
  /** Politiek leider / partijvoorzitter (bv. lijsttrekker). */
  leader?: string;
  /** Fractievoorzitter in de Tweede Kamer (kan verschillen van `leader`). */
  factionLeader?: string;
  websiteUrl?: string;
  lastReviewed?: string;
  sources: SeedSource[];
  /** Aantal zetels na de Tweede Kamerverkiezingen van 29 oktober 2025
   *  (na eventuele afsplitsingen per mei 2026). */
  seatsTK2025?: number;
  /** Positie t.o.v. kabinet-Jetten (D66+VVD+CDA, beëdigd 23 feb 2026). */
  coalitionStatus?: CoalitionStatus;
  /** Wanneer doorgerekend door het CPB (Keuzes in Kaart 2025-2028). */
  cpbReviewed2025?: boolean;
}

const ches: SeedSource = {
  label: "Chapel Hill Expert Survey 2024",
  url: "https://www.chesdata.eu/ches-europe",
};
const kieskompas: SeedSource = {
  label: "Kieskompas – Politieke kaart Nederland",
  url: "https://www.kieskompas.nl/",
};
const manifesto: SeedSource = {
  label: "Manifesto Project Database",
  url: "https://manifesto-project.wzb.eu/",
};
const europeElects: SeedSource = {
  label: "Europe Elects – Party Positions Database",
  url: "https://europeelects.eu/",
};
const epRoster: SeedSource = {
  label: "Europees Parlement – Fracties",
  url: "https://www.europarl.europa.eu/about-parliament/en/organisation-and-rules/organisation/political-groups",
};
const pewUS: SeedSource = {
  label: "Pew Research – Political Typology",
  url: "https://www.pewresearch.org/politics/2021/11/09/beyond-red-vs-blue-the-political-typology-2/",
};

const REVIEW_DATE = "2026-05-17";
const cbsKiesraad: SeedSource = {
  label: "Kiesraad – Definitieve uitslag Tweede Kamerverkiezing 29 oktober 2025",
  url: "https://www.verkiezingsuitslagen.nl/verkiezingen/detail/TK20251029",
};
const tkFractievoorzitters: SeedSource = {
  label: "Tweede Kamer – Alle fractievoorzitters (mei 2026)",
  url: "https://www.tweedekamer.nl/kamerleden_en_commissies/alle_fractievoorzitters",
};
const cpb2025: SeedSource = {
  label: "CPB – Keuzes in Kaart 2025-2028",
  url: "https://www.cpb.nl/keuzes-in-kaart-2025-2028",
};

export const PARTIES: SeedParty[] = [
  // ============== NEDERLAND (16) ==============
  // Stand: 17 mei 2026. Zetels = uitslag Tweede Kamerverkiezingen 29 oktober 2025
  // (Kiesraad 7 november 2025), gecorrigeerd voor de afsplitsing van 7 PVV-Kamerleden
  // onder leiding van Gidi Markuszower op 20 januari 2026 (eerst als Groep Markuszower;
  // partij De Nederlandse Alliantie (DNA) officieel opgericht op 17 april 2026).
  // Coalitie = kabinet-Jetten (D66 + VVD + CDA), beëdigd 23 februari 2026.
  {
    name: "Democraten 66",
    abbreviation: "D66",
    slug: "d66",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Sociaal-liberale partij die de TK-verkiezingen van 29 oktober 2025 won (26 zetels, 1.790.634 stemmen). Levert sinds 23 februari 2026 minister-president Rob Jetten aan het minderheidskabinet met VVD en CDA. Sterk pro-EU, focus op onderwijs, klimaat en bestuurlijke vernieuwing.",
    positionVector: { economic: 10, social: 70, civil: 55, governance: 80, trust: 60 },
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    founded: "1966",
    leader: "Rob Jetten",
    factionLeader: "Jan Paternotte",
    websiteUrl: "https://www.d66.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 26,
    coalitionStatus: "governing",
    cpbReviewed2025: true,
    sources: [ches, kieskompas, manifesto, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "Partij voor de Vrijheid",
    abbreviation: "PVV",
    slug: "pvv",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Nationaal-populistische partij, geleid door Geert Wilders. Behaalde 29 oktober 2025 26 zetels, maar zag op 20 januari 2026 zeven Kamerleden onder leiding van Gidi Markuszower vertrekken naar Groep Markuszower, die op 17 april 2026 de partij De Nederlandse Alliantie (DNA) oprichtte. Combineert harde lijn op migratie en EU met sociale uitgaven voor de eigen kiezers en sterk wantrouwen jegens gevestigde instituties.",
    positionVector: { economic: 0, social: -90, civil: -40, governance: -85, trust: -75 },
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    founded: "2006",
    leader: "Geert Wilders",
    factionLeader: "Geert Wilders",
    websiteUrl: "https://www.pvv.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 19,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [ches, kieskompas, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "Volkspartij voor Vrijheid en Democratie",
    abbreviation: "VVD",
    slug: "vvd",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Liberaal-conservatieve volkspartij, coalitiepartner in kabinet-Jetten met 22 zetels (29 okt 2025). Voormalig leider Dilan Yeşilgöz-Zegerius is minister van Defensie en vicepremier; Ruben Brekelmans leidt sindsdien de Tweede Kamerfractie. Voorstander van vrije markt, lage belastingen, stevig veiligheidsbeleid en pragmatisch EU-engagement.",
    positionVector: { economic: -55, social: -10, civil: -10, governance: 20, trust: 35 },
    ideologySlugs: ["conservatief-liberaal", "klassiek-liberaal"],
    founded: "1948",
    leader: "Dilan Yesilgöz-Zegerius",
    factionLeader: "Ruben Brekelmans",
    websiteUrl: "https://www.vvd.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 22,
    coalitionStatus: "governing",
    cpbReviewed2025: true,
    sources: [ches, kieskompas, manifesto, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "GroenLinks-PvdA",
    abbreviation: "GL-PvdA",
    slug: "groenlinks-pvda",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Fusiepartij van GroenLinks en PvdA (sinds 2023). Behaalde 20 zetels in 2025 en zit sindsdien in de oppositie tegen kabinet-Jetten. Frans Timmermans trad terug als lijsttrekker; Jesse Klaver is sindsdien fractievoorzitter. Verbindt sociaal-democratisch herverdelingsbeleid met ambitieus klimaatbeleid en sterke pro-Europese koers.",
    positionVector: { economic: 65, social: 70, civil: 30, governance: 75, trust: 55 },
    ideologySlugs: ["sociaal-democraat", "groen-progressief"],
    founded: "2023",
    leader: "Jesse Klaver",
    factionLeader: "Jesse Klaver",
    websiteUrl: "https://www.groenlinkspvda.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 20,
    coalitionStatus: "opposition",
    cpbReviewed2025: true,
    sources: [ches, kieskompas, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "Christen-Democratisch Appèl",
    abbreviation: "CDA",
    slug: "cda",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Klassieke christen-democratische partij, derde coalitiepartij in kabinet-Jetten met 18 zetels. Henri Bontenbal leidt de fractie; Bart van den Brink (CDA) is vicepremier en bewindspersoon voor Asiel en Migratie binnen Justitie en Veiligheid. Pleit voor gespreide verantwoordelijkheid, brede welvaart en gematigd cultureel-conservatief beleid.",
    positionVector: { economic: 20, social: -25, civil: -10, governance: 10, trust: 30 },
    ideologySlugs: ["christen-democraat", "conservatief-liberaal"],
    founded: "1980",
    leader: "Henri Bontenbal",
    factionLeader: "Henri Bontenbal",
    websiteUrl: "https://www.cda.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 18,
    coalitionStatus: "governing",
    cpbReviewed2025: true,
    sources: [ches, kieskompas, manifesto, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "Juiste Antwoord 21",
    abbreviation: "JA21",
    slug: "ja21",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Centrum-rechtse, conservatief-liberale partij. Maakte 29 oktober 2025 een sprong naar 9 zetels en zit in de oppositie. Strenger op migratie en veiligheid dan VVD, maar pragmatisch op EU en bestuur.",
    positionVector: { economic: -45, social: -55, civil: -15, governance: -35, trust: 0 },
    ideologySlugs: ["conservatief-liberaal", "nationaal-conservatief"],
    founded: "2020",
    leader: "Joost Eerdmans",
    factionLeader: "Joost Eerdmans",
    websiteUrl: "https://www.ja21.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 9,
    coalitionStatus: "opposition",
    cpbReviewed2025: true,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "Forum voor Democratie",
    abbreviation: "FvD",
    slug: "fvd",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Rechts-conservatief en sterk EU-kritisch (7 zetels in 2025). Lidewij de Vos volgde Thierry Baudet op als politiek leider en lijsttrekker (4 september 2025) en is sindsdien ook fractievoorzitter; Baudet blijft oprichter van de partij. Combineert libertaire economische ideeën met cultureel-conservatieve agenda en wantrouwen jegens mainstream wetenschap en media.",
    positionVector: { economic: -55, social: -70, civil: 25, governance: -85, trust: -90 },
    ideologySlugs: ["libertarier", "populistisch-rechts"],
    founded: "2016",
    leader: "Lidewij de Vos",
    factionLeader: "Lidewij de Vos",
    websiteUrl: "https://www.fvd.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 7,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "De Nederlandse Alliantie",
    abbreviation: "DNA",
    slug: "dna",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Nieuwe rechts-conservatieve partij, opgericht 17 april 2026 na de afsplitsing van zeven PVV-Kamerleden onder leiding van Gidi Markuszower op 20 januari 2026 (eerst als Groep Markuszower). Pleit voor strenge grenscontrole, soevereiniteit, joods-christelijke waarden en wil, anders dan de PVV, een open ledenpartij zijn. Voormalig VVD-minister Rita Verdonk treedt op als politieke coach.",
    positionVector: { economic: -10, social: -80, civil: -30, governance: -75, trust: -55 },
    ideologySlugs: ["nationaal-conservatief", "populistisch-rechts"],
    founded: "2026",
    leader: "Gidi Markuszower",
    factionLeader: "Gidi Markuszower",
    websiteUrl: "https://www.denederlandsevrijheidsalliantie.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 7,
    coalitionStatus: "splinter",
    cpbReviewed2025: false,
    sources: [cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "BoerBurgerBeweging",
    abbreviation: "BBB",
    slug: "bbb",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Politieke beweging voor boeren, plattelandsbewoners en regionale belangen. Verloor zwaar in 2025 (4 zetels). Mede-oprichter Henk Vermeer volgde Caroline van der Plas op als partijleider én fractievoorzitter op 20 februari 2026; Van der Plas blijft Tweede Kamerlid en richt zich op landbouw- en visserijdossiers. Scepsis tegenover stikstofbeleid en EU-regelgeving op landbouwgebied.",
    positionVector: { economic: -10, social: -50, civil: -20, governance: -50, trust: -30 },
    ideologySlugs: ["klassiek-conservatief", "communitarist"],
    founded: "2019",
    leader: "Henk Vermeer",
    factionLeader: "Henk Vermeer",
    websiteUrl: "https://www.boerburgerbeweging.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 4,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "DENK",
    abbreviation: "DENK",
    slug: "denk",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Multiculturele partij die voortkomt uit oppositie tegen 'mainstream'-debat over migratie. Behoudt 3 zetels in 2025. Progressief sociaal-cultureel, links-economisch, kritisch op gevestigde instituties.",
    positionVector: { economic: 55, social: 65, civil: 15, governance: 25, trust: -45 },
    ideologySlugs: ["populistisch-links", "groen-progressief"],
    founded: "2015",
    leader: "Stephan van Baarle",
    factionLeader: "Stephan van Baarle",
    websiteUrl: "https://www.bewegingdenk.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 3,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "ChristenUnie",
    abbreviation: "CU",
    slug: "christenunie",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Sociaal-christelijke partij (3 zetels in 2025) met aandacht voor bestaanszekerheid, gezinsbeleid en gerechtigheid voor kwetsbaren. Conservatief op ethische onderwerpen.",
    positionVector: { economic: 25, social: -45, civil: -10, governance: 20, trust: 35 },
    ideologySlugs: ["christen-democraat", "klassiek-conservatief"],
    founded: "2000",
    leader: "Mirjam Bikker",
    factionLeader: "Mirjam Bikker",
    websiteUrl: "https://www.christenunie.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 3,
    coalitionStatus: "opposition",
    cpbReviewed2025: true,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "Socialistische Partij",
    abbreviation: "SP",
    slug: "sp",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Klassiek-links profiel (3 zetels in 2025) met focus op nationalisering, hoge belasting op vermogen, behoud van sociale voorzieningen en kritische houding tegenover de EU.",
    positionVector: { economic: 85, social: 30, civil: 25, governance: -20, trust: -25 },
    ideologySlugs: ["populistisch-links", "marxist"],
    founded: "1972",
    leader: "Jimmy Dijk",
    factionLeader: "Jimmy Dijk",
    websiteUrl: "https://www.sp.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 3,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [ches, kieskompas, manifesto, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "Staatkundig Gereformeerde Partij",
    abbreviation: "SGP",
    slug: "sgp",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Bevindelijk-reformatorische partij (3 zetels in 2025). Theocratisch geïnspireerd, sterk conservatief op ethische onderwerpen en huiselijk-traditioneel op cultuur.",
    positionVector: { economic: -15, social: -80, civil: -30, governance: -5, trust: 25 },
    ideologySlugs: ["klassiek-conservatief", "christen-democraat"],
    founded: "1918",
    leader: "Chris Stoffer",
    factionLeader: "Chris Stoffer",
    websiteUrl: "https://www.sgp.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 3,
    coalitionStatus: "opposition",
    cpbReviewed2025: true,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },
  {
    name: "Partij voor de Dieren",
    abbreviation: "PvdD",
    slug: "pvdd",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Eco-progressieve partij die dierenwelzijn en ecologie als hoofdrichtsnoeren neemt (3 zetels in 2025). Combineert sterk klimaatbeleid met progressieve sociale agenda.",
    positionVector: { economic: 60, social: 80, civil: 50, governance: 50, trust: 20 },
    ideologySlugs: ["eco-socialist", "groen-progressief"],
    founded: "2002",
    leader: "Esther Ouwehand",
    factionLeader: "Esther Ouwehand",
    websiteUrl: "https://www.partijvoordedieren.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 3,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "50PLUS",
    abbreviation: "50PLUS",
    slug: "50plus",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Belangenpartij voor ouderen en gepensioneerden (2 zetels in 2025). Pleit voor behoud van AOW-leeftijd, indexatie van pensioenen en zorg voor ouderen. Pragmatisch midden op andere thema's.",
    positionVector: { economic: 35, social: -10, civil: 5, governance: 0, trust: 0 },
    ideologySlugs: ["sociaal-democraat", "communitarist"],
    founded: "2009",
    leader: "Jan Struijs",
    factionLeader: "Jan Struijs",
    websiteUrl: "https://www.50pluspartij.nl",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 2,
    coalitionStatus: "opposition",
    cpbReviewed2025: false,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters],
  },
  {
    name: "Volt Nederland",
    abbreviation: "Volt",
    slug: "volt",
    region: "NL",
    regionType: "national",
    country: "Nederland",
    description:
      "Pan-Europese progressieve beweging (1 zetel in 2025). Sterk pro-EU, gematigd-progressief op cultuur en klimaat, technocratisch op bestuur.",
    positionVector: { economic: 20, social: 65, civil: 40, governance: 90, trust: 70 },
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    founded: "2018",
    leader: "Laurens Dassen",
    factionLeader: "Laurens Dassen",
    websiteUrl: "https://www.voltnederland.org",
    lastReviewed: REVIEW_DATE,
    seatsTK2025: 1,
    coalitionStatus: "opposition",
    cpbReviewed2025: true,
    sources: [kieskompas, cbsKiesraad, tkFractievoorzitters, cpb2025],
  },

  // ============== EUROPESE PARTIJ-FAMILIES (7) ==============
  {
    name: "European People's Party",
    abbreviation: "EPP",
    slug: "epp",
    region: "EU",
    regionType: "family",
    description:
      "Grootste partij-familie in het Europees Parlement. Christen-democratisch en centrum-rechts: pro-EU, marktgericht, gematigd cultureel-conservatief. Bevat CDA, CDU, Forza Italia, PP, Fidesz (geschorst sinds 2021).",
    positionVector: { economic: -25, social: -25, civil: -10, governance: 50, trust: 40 },
    ideologySlugs: ["christen-democraat", "conservatief-liberaal"],
    founded: "1976",
    websiteUrl: "https://www.epp.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },
  {
    name: "Progressive Alliance of Socialists and Democrats",
    abbreviation: "S&D",
    slug: "sd",
    region: "EU",
    regionType: "family",
    description:
      "Sociaal-democratische fractie. Pro-EU, sterk op sociale rechten, herverdeling en publieke voorzieningen. Bevat o.a. PvdA, SPD, Partido Socialista, Partito Democratico.",
    positionVector: { economic: 55, social: 50, civil: 30, governance: 75, trust: 45 },
    ideologySlugs: ["sociaal-democraat", "sociaal-liberaal"],
    founded: "1953",
    websiteUrl: "https://www.socialistsanddemocrats.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },
  {
    name: "Renew Europe",
    abbreviation: "Renew",
    slug: "renew",
    region: "EU",
    regionType: "family",
    description:
      "Liberale, sterk pro-Europese fractie. Verbindt economisch liberalisme met progressieve sociale opvattingen. Bevat D66, Renaissance (Macron), FDP.",
    positionVector: { economic: 0, social: 50, civil: 45, governance: 85, trust: 60 },
    ideologySlugs: ["sociaal-liberaal", "klassiek-liberaal"],
    founded: "2019",
    websiteUrl: "https://www.reneweuropegroup.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },
  {
    name: "Greens/European Free Alliance",
    abbreviation: "Greens/EFA",
    slug: "greens-efa",
    region: "EU",
    regionType: "family",
    description:
      "Groene en regionalistische fractie. Ambitieus klimaatbeleid, progressief op cultuur, sterk pro-EU. Bevat GroenLinks, Die Grünen, Europe Écologie.",
    positionVector: { economic: 50, social: 75, civil: 50, governance: 70, trust: 40 },
    ideologySlugs: ["groen-progressief", "eco-socialist"],
    founded: "1999",
    websiteUrl: "https://www.greens-efa.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },
  {
    name: "European Conservatives and Reformists",
    abbreviation: "ECR",
    slug: "ecr",
    region: "EU",
    regionType: "family",
    description:
      "Conservatieve en eurosceptische fractie. Kritisch op EU-integratie, conservatief op cultuur, pragmatisch op economie. Bevat Fratelli d’Italia, PiS, Vox.",
    positionVector: { economic: -25, social: -65, civil: -25, governance: -45, trust: -15 },
    ideologySlugs: ["nationaal-conservatief", "klassiek-conservatief"],
    founded: "2009",
    websiteUrl: "https://ecrgroup.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },
  {
    name: "Patriots for Europe",
    abbreviation: "PfE",
    slug: "pfe",
    region: "EU",
    regionType: "family",
    description:
      "Rechts-nationalistische fractie, opgericht in 2024. Sterk EU-kritisch, restrictief op migratie, populistisch register. Bevat Fidesz, RN, FPÖ.",
    positionVector: { economic: 0, social: -80, civil: -35, governance: -85, trust: -65 },
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    founded: "2024",
    websiteUrl: "https://patriots.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },
  {
    name: "The Left in the European Parliament",
    abbreviation: "GUE/NGL",
    slug: "the-left",
    region: "EU",
    regionType: "family",
    description:
      "Radicaal-linkse fractie. Klassiek socialistisch tot eco-socialistisch profiel; kritisch op neoliberaal EU-beleid maar veelal pro-EU als project. Bevat SP, Die Linke, Podemos.",
    positionVector: { economic: 80, social: 55, civil: 30, governance: 20, trust: -35 },
    ideologySlugs: ["marxist", "eco-socialist", "populistisch-links"],
    founded: "1995",
    websiteUrl: "https://left.eu",
    lastReviewed: REVIEW_DATE,
    sources: [ches, epRoster, europeElects],
  },

  // ============== AMERIKAANSE FACTIES (4) ==============
  {
    name: "Progressive Democrats",
    abbreviation: "Progressive Dems",
    slug: "progressive-democrats",
    region: "US",
    regionType: "faction",
    country: "Verenigde Staten",
    description:
      "Linker vleugel van de Democratische Partij. Boegbeelden Sanders, Ocasio-Cortez, Warren. Pleit voor Medicare for All, Green New Deal en sterke vermogensbelastingen.",
    positionVector: { economic: 80, social: 80, civil: 40, governance: 25, trust: 0 },
    ideologySlugs: ["sociaal-democraat", "eco-socialist"],
    founded: "2018",
    websiteUrl: "https://progressives.house.gov",
    lastReviewed: REVIEW_DATE,
    sources: [pewUS, europeElects],
  },
  {
    name: "Establishment Democrats",
    abbreviation: "Establishment Dems",
    slug: "establishment-democrats",
    region: "US",
    regionType: "faction",
    country: "Verenigde Staten",
    description:
      "Centrum-linkse hoofdstroom van de Democraten. Sociaal-liberaal en pro-multilateralisme; pragmatisch op economie, voorzichtig op systeemverandering. Boegbeelden Biden, Harris, Buttigieg.",
    positionVector: { economic: 30, social: 55, civil: 30, governance: 45, trust: 50 },
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    founded: "Eind 20e eeuw als duidelijke stroming",
    websiteUrl: "https://democrats.org",
    lastReviewed: REVIEW_DATE,
    sources: [pewUS, europeElects],
  },
  {
    name: "Traditional Republicans",
    abbreviation: "Traditional GOP",
    slug: "traditional-republicans",
    region: "US",
    regionType: "faction",
    country: "Verenigde Staten",
    description:
      "Klassieke conservatief-liberale Republikeinen. Pleiten voor lage belastingen, vrije markt, sterke defensie en traditionele waarden. Boegbeelden Romney, McConnell, Haley.",
    positionVector: { economic: -65, social: -40, civil: -15, governance: 20, trust: 25 },
    ideologySlugs: ["conservatief-liberaal", "klassiek-conservatief"],
    founded: "Halverwege 20e eeuw als stroming",
    websiteUrl: "https://www.gop.com",
    lastReviewed: REVIEW_DATE,
    sources: [pewUS, europeElects],
  },
  {
    name: "MAGA Republicans",
    abbreviation: "MAGA",
    slug: "maga-republicans",
    region: "US",
    regionType: "faction",
    country: "Verenigde Staten",
    description:
      "Nationaal-populistische beweging binnen de Republikeinse Partij rond Donald Trump. Restrictief op migratie en handel, sterk wantrouwen jegens federale instituties en media.",
    positionVector: { economic: -25, social: -85, civil: -50, governance: -85, trust: -85 },
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    founded: "2015",
    websiteUrl: "https://www.donaldjtrump.com",
    lastReviewed: REVIEW_DATE,
    sources: [pewUS, europeElects],
  },
];
