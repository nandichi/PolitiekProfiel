import type { DimensionScores } from "@/lib/scoring";
import type { SeedSource } from "./questions";

export type PoliticianRoleKind =
  | "minister-president"
  | "vice-premier"
  | "minister"
  | "fractievoorzitter"
  | "kamerlid"
  | "partijleider"
  | "europarlementarier"
  | "president"
  | "premier"
  | "bondskanselier"
  | "senator"
  | "congreslid"
  | "voormalig";

export interface SeedPolitician {
  name: string;
  /** Functie-omschrijving zoals getoond aan gebruikers. */
  role: string;
  /** Gestructureerde rol voor filters en badges. */
  roleKind?: PoliticianRoleKind;
  country: string;
  party: string;
  /** Slug van `parties.ts` voor cross-linking (optioneel). */
  partySlug?: string;
  bio: string;
  positionVector: DimensionScores;
  isInternational: boolean;
  ideologySlugs: string[];
  sources: SeedSource[];
  /** Pakkende quotes voor `/turing-test` en politicus-pagina. */
  quotes?: { text: string; sourceLabel: string; sourceUrl?: string }[];
  /** Wanneer voor het laatst geverifieerd. */
  lastReviewed?: string;
}

const programmaNL: SeedSource = {
  label: "ProDemos – Verkiezingsprogramma's TK 2025",
  url: "https://prodemos.nl/verkiezingen/tweede-kamer/programmas/",
};
const stemwijzer: SeedSource = {
  label: "Kieskompas – Politieke kaart Nederland",
  url: "https://www.kieskompas.nl/",
};
const europeElects: SeedSource = {
  label: "Europe Elects – Party Positions Database",
  url: "https://europeelects.eu/",
};
const tkFracties: SeedSource = {
  label: "Tweede Kamer – Fracties en fractievoorzitters (13 september 2026)",
  url: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties",
};
const rijksoverheid: SeedSource = {
  label: "Rijksoverheid – Kabinet-Jetten (sinds 2026)",
  url: "https://www.rijksoverheid.nl/regering/over-de-regering/kabinetten-sinds-1945/kabinet-jetten",
};
const dnaSource: SeedSource = {
  label: "NRC – Groep Markuszower start nieuwe partij (20 april 2026)",
  url: "https://www.nrc.nl/nieuws/2026/04/20/groep-markuszower-start-nieuwe-partij-rita-verdonk-sluit-zich-aan-a4925990",
};

const internationalRoles: SeedSource = {
  label: "Officiële regerings- en parlementspagina's (13 september 2026)",
  url: "https://www.consilium.europa.eu/en/european-council/members/",
};
const ukGovernment: SeedSource = {
  label: "GOV.UK – Prime Minister",
  url: "https://www.gov.uk/government/ministers/prime-minister",
};
const usAdministration: SeedSource = {
  label: "The White House – The Administration",
  url: "https://www.whitehouse.gov/administration/",
};
const sandersSenate: SeedSource = {
  label: "Office of Senator Bernie Sanders",
  url: "https://sanders.senate.gov/",
};
const ocasioCortezHouse: SeedSource = {
  label: "U.S. House Clerk – Alexandria Ocasio-Cortez",
  url: "https://clerk.house.gov/Members/O000172",
};
const canadaGovernment: SeedSource = {
  label: "Prime Minister of Canada",
  url: "https://pm.gc.ca/en",
};
const frPresidency: SeedSource = {
  label: "Élysée – Emmanuel Macron",
  url: "https://www.elysee.fr/en/emmanuel-macron",
};

const REVIEW_DATE = "2026-09-13";

export const POLITICIANS: SeedPolitician[] = [
  // ============== NEDERLAND (17) ==============
  // Stand: 13 september 2026. Rollen en fractienamen zijn gecontroleerd
  // tegen de Tweede Kamer en Rijksoverheid.
  {
    name: "Rob Jetten",
    role: "Minister-president (D66)",
    roleKind: "minister-president",
    country: "Nederland",
    party: "D66",
    partySlug: "d66",
    bio: "Minister-president van Nederland sinds 23 februari 2026. Won de TK-verkiezingen van 29 oktober 2025 met D66 (26 zetels, grootste partij). Leidt een minderheidskabinet van D66, VVD en CDA. Voormalig minister voor Klimaat en Energie; sociaal-liberale koers met sterke pro-EU houding.",
    positionVector: { economic: 10, social: 70, civil: 55, governance: 80, trust: 60 },
    isInternational: false,
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    sources: [programmaNL, stemwijzer, rijksoverheid],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Jan Paternotte",
    role: "Fractievoorzitter D66",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "D66",
    partySlug: "d66",
    bio: "Leidt de D66-fractie in de Tweede Kamer sinds Rob Jetten minister-president werd in februari 2026. Voormalig fractievoorzitter buitenland; sociaal-liberale koers met aandacht voor klimaat, rechtsstaat en EU.",
    positionVector: { economic: 5, social: 65, civil: 50, governance: 85, trust: 60 },
    isInternational: false,
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Dilan Yesilgöz-Zegerius",
    role: "Minister van Defensie en vicepremier (VVD)",
    roleKind: "vice-premier",
    country: "Nederland",
    party: "VVD",
    partySlug: "vvd",
    bio: "Vicepremier en minister van Defensie in kabinet-Jetten sinds februari 2026. Voormalig fractievoorzitter en lijsttrekker van de VVD; liberaal-conservatieve koers met sterke nadruk op veiligheid en marktwerking.",
    positionVector: { economic: -55, social: -10, civil: -10, governance: 20, trust: 35 },
    isInternational: false,
    ideologySlugs: ["conservatief-liberaal", "klassiek-liberaal"],
    sources: [programmaNL, stemwijzer, rijksoverheid],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Ruben Brekelmans",
    role: "Fractievoorzitter VVD",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "VVD",
    partySlug: "vvd",
    bio: "Leidt de VVD-fractie in de Tweede Kamer sinds Dilan Yesilgöz toetrad tot kabinet-Jetten. Voormalig buitenland- en defensiewoordvoerder; liberaal-conservatieve koers met sterke focus op veiligheid en NAVO.",
    positionVector: { economic: -50, social: -15, civil: -15, governance: 15, trust: 30 },
    isInternational: false,
    ideologySlugs: ["conservatief-liberaal", "klassiek-liberaal"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Jesse Klaver",
    role: "Fractievoorzitter Progressief Nederland (PRO)",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "Progressief Nederland",
    partySlug: "progressief-nederland",
    bio: "Leidt de PRO-fractie in de Tweede Kamer. De partij combineert een sociaal-democratische koers met een sterk klimaatprofiel en pleidooien voor publieke voorzieningen.",
    positionVector: { economic: 60, social: 70, civil: 35, governance: 75, trust: 55 },
    isInternational: false,
    ideologySlugs: ["sociaal-democraat", "groen-progressief"],
    sources: [programmaNL, stemwijzer, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Henri Bontenbal",
    role: "Fractievoorzitter CDA",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "CDA",
    partySlug: "cda",
    bio: "Lijsttrekker en fractievoorzitter van het CDA sinds 2023. Het CDA is sinds februari 2026 coalitiepartner in kabinet-Jetten. Christen-democratische koers met aandacht voor brede welvaart, klimaat en gespreide verantwoordelijkheid.",
    positionVector: { economic: 20, social: -25, civil: -10, governance: 10, trust: 30 },
    isInternational: false,
    ideologySlugs: ["christen-democraat", "conservatief-liberaal"],
    sources: [programmaNL, stemwijzer, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Geert Wilders",
    role: "Fractievoorzitter PVV",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "PVV",
    partySlug: "pvv",
    bio: "Oprichter en leider van de PVV sinds 2006. De fractie telt 19 zetels. Wilders combineert een harde lijn op migratie en de EU met sociale uitgaven voor zijn kiezers en scherp wantrouwen jegens gevestigde instituties.",
    positionVector: { economic: 0, social: -90, civil: -40, governance: -85, trust: -75 },
    isInternational: false,
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    sources: [programmaNL, stemwijzer, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Joost Eerdmans",
    role: "Fractievoorzitter JA21",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "JA21",
    partySlug: "ja21",
    bio: "Medeoprichter en lijsttrekker van JA21. Maakte in 2025 een sprong naar 9 zetels. Centrum-rechtse, conservatief-liberale koers, strenger op migratie en veiligheid dan VVD, maar pragmatisch op EU en bestuur.",
    positionVector: { economic: -45, social: -55, civil: -15, governance: -35, trust: 0 },
    isInternational: false,
    ideologySlugs: ["conservatief-liberaal", "nationaal-conservatief"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Ralf Dekker",
    role: "Fractievoorzitter Forum voor Democratie",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "FvD",
    partySlug: "fvd",
    bio: "Fractievoorzitter van FVD. De partij heeft 7 zetels en voert een rechts-conservatieve, EU-kritische koers met libertaire economische trekken.",
    positionVector: { economic: -55, social: -70, civil: 25, governance: -85, trust: -90 },
    isInternational: false,
    ideologySlugs: ["libertarier", "populistisch-rechts"],
    sources: [tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Gidi Markuszower",
    role: "Fractievoorzitter Groep Markuszower (DNA)",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "Groep Markuszower (DNA)",
    partySlug: "groep-markuszower",
    bio: "Leidt de 7-koppige Groep Markuszower in de Tweede Kamer. De fractie ontstond na een breuk met de PVV in januari 2026; de bredere partijvorming eromheen wordt als DNA aangeduid.",
    positionVector: { economic: -10, social: -80, civil: -30, governance: -75, trust: -55 },
    isInternational: false,
    ideologySlugs: ["nationaal-conservatief", "populistisch-rechts"],
    sources: [dnaSource, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Henk Vermeer",
    role: "Partijleider en fractievoorzitter BBB",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "BBB",
    partySlug: "bbb",
    bio: "Medeoprichter van BBB en partijleider. Henk Vermeer leidt een fractie van 3 zetels en vertegenwoordigt vooral plattelandsbelangen; BBB is kritisch op stikstofbeleid en EU-regelgeving voor de landbouw.",
    positionVector: { economic: -10, social: -50, civil: -20, governance: -50, trust: -30 },
    isInternational: false,
    ideologySlugs: ["klassiek-conservatief", "communitarist"],
    sources: [tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Mona Keijzer",
    role: "Fractievoorzitter Lid Keijzer",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "Lid Keijzer",
    partySlug: "lid-keijzer",
    bio: "Fractievoorzitter van de eenpersoonsfractie Lid Keijzer in de Tweede Kamer.",
    positionVector: { economic: -10, social: -50, civil: -20, governance: -50, trust: -30 },
    isInternational: false,
    ideologySlugs: ["klassiek-conservatief", "communitarist"],
    sources: [tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Christine Teunissen",
    role: "Fractievoorzitter PvdD",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "PvdD",
    partySlug: "pvdd",
    bio: "Fractievoorzitter van de Partij voor de Dieren. De partij combineert dierenwelzijn en ecologie met een progressieve sociale agenda en kritiek op marktwerking in landbouw en zorg.",
    positionVector: { economic: 60, social: 80, civil: 50, governance: 50, trust: 20 },
    isInternational: false,
    ideologySlugs: ["eco-socialist", "groen-progressief"],
    sources: [programmaNL, stemwijzer, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Jimmy Dijk",
    role: "Fractievoorzitter SP",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "SP",
    partySlug: "sp",
    bio: "Sinds 2023 fractievoorzitter van de SP (3 zetels in 2025). Klassiek links profiel: hoge belasting op vermogen, behoud sociale voorzieningen, kritisch op EU.",
    positionVector: { economic: 85, social: 30, civil: 25, governance: -20, trust: -25 },
    isInternational: false,
    ideologySlugs: ["populistisch-links", "marxist"],
    sources: [programmaNL, stemwijzer, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Mirjam Bikker",
    role: "Fractievoorzitter ChristenUnie",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "CU",
    partySlug: "christenunie",
    bio: "Leidt de ChristenUnie sinds 2023 (3 zetels in 2025). Sociaal-christelijk profiel: bestaanszekerheid, gezinsbeleid en aandacht voor schepping en gerechtigheid.",
    positionVector: { economic: 25, social: -45, civil: -10, governance: 20, trust: 35 },
    isInternational: false,
    ideologySlugs: ["christen-democraat", "klassiek-conservatief"],
    sources: [programmaNL, stemwijzer, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Laurens Dassen",
    role: "Fractievoorzitter Volt",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "Volt",
    partySlug: "volt",
    bio: "Leider van Volt Nederland (1 zetel in 2025). Pan-Europese progressieve beweging met focus op klimaat, democratie en transnationale samenwerking.",
    positionVector: { economic: 20, social: 65, civil: 40, governance: 90, trust: 70 },
    isInternational: false,
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Stephan van Baarle",
    role: "Fractievoorzitter DENK",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "DENK",
    partySlug: "denk",
    bio: "Leider van DENK in de Tweede Kamer (3 zetels in 2025). Multicultureel-progressief profiel, links-economisch, kritisch op gevestigde instituties.",
    positionVector: { economic: 55, social: 65, civil: 15, governance: 25, trust: -45 },
    isInternational: false,
    ideologySlugs: ["populistisch-links", "groen-progressief"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },

  // ============== INTERNATIONAAL (10) ==============
  {
    name: "Donald Trump",
    role: "President Verenigde Staten",
    roleKind: "president",
    country: "Verenigde Staten",
    party: "Republican",
    bio: "Sinds januari 2025 opnieuw president van de Verenigde Staten. Combineert nationaal-protectionisme, een harde migratielijn en scherpe kritiek op gevestigde instituties.",
    positionVector: { economic: -35, social: -85, civil: -50, governance: -85, trust: -85 },
    isInternational: true,
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    sources: [europeElects, usAdministration],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Bernie Sanders",
    role: "U.S. Senator (Vermont)",
    roleKind: "senator",
    country: "Verenigde Staten",
    party: "Independent / Democratic",
    bio: "Onafhankelijke senator uit Vermont, bekend van campagnes voor Medicare for All, een hoger minimumloon en een zwaardere belasting op vermogen.",
    positionVector: { economic: 85, social: 60, civil: 40, governance: 25, trust: 0 },
    isInternational: true,
    ideologySlugs: ["sociaal-democraat", "eco-socialist"],
    sources: [europeElects, sandersSenate],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Alexandria Ocasio-Cortez",
    role: "U.S. Congresswoman (New York)",
    roleKind: "congreslid",
    country: "Verenigde Staten",
    party: "Democratic",
    bio: "Progressief Congreslid uit New York en een gezicht van de linkervleugel van de Democratische Partij. Pleit voor de Green New Deal en uitbreiding van sociale voorzieningen.",
    positionVector: { economic: 80, social: 85, civil: 45, governance: 25, trust: 5 },
    isInternational: true,
    ideologySlugs: ["eco-socialist", "groen-progressief"],
    sources: [europeElects, ocasioCortezHouse],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Emmanuel Macron",
    role: "President Frankrijk",
    roleKind: "president",
    country: "Frankrijk",
    party: "Renaissance",
    bio: "President van Frankrijk sinds 2017 en in 2022 herkozen. Hij kan zich volgens de huidige grondwettelijke termijnlimiet niet opnieuw kandidaat stellen in 2027. Zijn koers is pro-Europees en centristisch, met markthervormingen en nadruk op Europese soevereiniteit.",
    positionVector: { economic: -10, social: 30, civil: 10, governance: 85, trust: 55 },
    isInternational: true,
    ideologySlugs: ["technocratisch-centrist", "sociaal-liberaal"],
    sources: [europeElects, frPresidency],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Marine Le Pen",
    role: "Fractievoorzitter Rassemblement National",
    roleKind: "fractievoorzitter",
    country: "Frankrijk",
    party: "Rassemblement National",
    bio: "Afgevaardigde voor Rassemblement National in de Franse Assemblée. Haar politieke profiel is nationalistisch en eurosceptisch, met een restrictieve migratiekoers.",
    positionVector: { economic: 15, social: -85, civil: -40, governance: -90, trust: -75 },
    isInternational: true,
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Friedrich Merz",
    role: "Bondskanselier Duitsland",
    roleKind: "bondskanselier",
    country: "Duitsland",
    party: "CDU",
    bio: "Christen-democratisch bondskanselier sinds mei 2025. Behoudender koers op migratie en harde aanpak van staatsschuld, terwijl Europa centraal blijft.",
    positionVector: { economic: -45, social: -30, civil: -10, governance: 35, trust: 30 },
    isInternational: true,
    ideologySlugs: ["conservatief-liberaal", "christen-democraat"],
    sources: [europeElects, internationalRoles],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Olaf Scholz",
    role: "Voormalig bondskanselier Duitsland (SPD)",
    roleKind: "voormalig",
    country: "Duitsland",
    party: "SPD",
    bio: "Sociaaldemocratisch bondskanselier (2021–2025). Behoedzame buitenlandse koers, sterk sociaal beleid en pro-Europese houding. Vervangen door Friedrich Merz na de Bondsdagverkiezingen van 2025.",
    positionVector: { economic: 50, social: 50, civil: 30, governance: 75, trust: 50 },
    isInternational: true,
    ideologySlugs: ["sociaal-democraat"],
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Giorgia Meloni",
    role: "Premier Italië",
    roleKind: "premier",
    country: "Italië",
    party: "Fratelli d'Italia",
    bio: "Premier sinds oktober 2022. Nationaal-conservatieve koers; harde lijn op migratie maar pragmatisch op EU-niveau.",
    positionVector: { economic: -10, social: -75, civil: -30, governance: -45, trust: -20 },
    isInternational: true,
    ideologySlugs: ["nationaal-conservatief", "klassiek-conservatief"],
    sources: [europeElects, internationalRoles],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Andy Burnham",
    role: "Premier Verenigd Koninkrijk",
    roleKind: "premier",
    country: "Verenigd Koninkrijk",
    party: "Labour",
    bio: "Premier van het Verenigd Koninkrijk sinds 20 juli 2026 en leider van de Labour Party. Zijn politieke profiel is centrum-links, met aandacht voor publieke diensten, sociale zorg en decentralisatie.",
    positionVector: { economic: 35, social: 40, civil: 20, governance: 25, trust: 50 },
    isInternational: true,
    ideologySlugs: ["sociaal-democraat", "sociaal-liberaal"],
    sources: [europeElects, ukGovernment],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Mark Carney",
    role: "Premier Canada",
    roleKind: "premier",
    country: "Canada",
    party: "Liberal Party",
    bio: "Voormalig centrale bankier; premier van Canada sinds maart 2025. Pragmatisch-liberaal profiel met focus op klimaat, economie en Atlantische samenwerking.",
    positionVector: { economic: 25, social: 60, civil: 45, governance: 55, trust: 65 },
    isInternational: true,
    ideologySlugs: ["sociaal-liberaal", "technocratisch-centrist"],
    sources: [europeElects, canadaGovernment],
    lastReviewed: REVIEW_DATE,
  },
];
