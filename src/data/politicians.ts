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
  label: "Tweede Kamer – Alle fractievoorzitters (mei 2026)",
  url: "https://www.tweedekamer.nl/kamerleden_en_commissies/alle_fractievoorzitters",
};
const rijksoverheid: SeedSource = {
  label: "Rijksoverheid – Kabinet-Jetten beëdigd (23 februari 2026)",
  url: "https://www.rijksoverheid.nl/actueel/nieuws/2026/02/23/kabinet-jetten-beedigd",
};
const dnaSource: SeedSource = {
  label: "NRC – Groep Markuszower start nieuwe partij (20 april 2026)",
  url: "https://www.nrc.nl/nieuws/2026/04/20/groep-markuszower-start-nieuwe-partij-rita-verdonk-sluit-zich-aan-a4925990",
};

const REVIEW_DATE = "2026-05-17";

export const POLITICIANS: SeedPolitician[] = [
  // ============== NEDERLAND (16) ==============
  // Stand 17 mei 2026 — na kabinet-Jetten (beëdigd 23 februari 2026) en
  // afsplitsing van Groep Markuszower uit de PVV (20 januari 2026,
  // partij DNA opgericht 17 april 2026).
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
    role: "Fractievoorzitter GroenLinks-PvdA",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "GroenLinks-PvdA",
    partySlug: "groenlinks-pvda",
    bio: "Leidt de fractie van GroenLinks-PvdA sinds Frans Timmermans terugtrad na de verkiezingen van 29 oktober 2025. Sociaal-democratische koers met sterk klimaatprofiel en pleidooi voor publieke voorzieningen.",
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
    bio: "Oprichter en leider van de PVV sinds 2006. PVV werd in 2025 tweede partij (26 zetels), maar verloor op 20 januari 2026 zeven Kamerleden aan Groep Markuszower (later DNA), waardoor de fractie kromp tot 19. Combineert harde lijn op migratie en EU met sociale uitgaven voor de eigen kiezers en sterk wantrouwen jegens gevestigde instituties.",
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
    name: "Lidewij de Vos",
    role: "Fractievoorzitter Forum voor Democratie",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "FvD",
    partySlug: "fvd",
    bio: "Leidt de FvD-fractie in de Tweede Kamer sinds de verkiezingen van 2025. Oprichter Thierry Baudet blijft partijleider buiten het parlement. Rechts-conservatieve, EU-kritische koers met libertaire economische trekken.",
    positionVector: { economic: -55, social: -70, civil: 25, governance: -85, trust: -90 },
    isInternational: false,
    ideologySlugs: ["libertarier", "populistisch-rechts"],
    sources: [tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Gidi Markuszower",
    role: "Partijleider De Nederlandse Alliantie (DNA)",
    roleKind: "partijleider",
    country: "Nederland",
    party: "DNA",
    partySlug: "dna",
    bio: "Voormalig PVV-Kamerlid en woordvoerder Justitie/Migratie. Leidde op 20 januari 2026 een afsplitsing van zeven PVV-Kamerleden (eerst als Groep Markuszower) en richtte op 17 april 2026 De Nederlandse Alliantie op — een open ledenpartij met focus op grenscontrole, soevereiniteit en joods-christelijke waarden.",
    positionVector: { economic: -10, social: -80, civil: -30, governance: -75, trust: -55 },
    isInternational: false,
    ideologySlugs: ["nationaal-conservatief", "populistisch-rechts"],
    sources: [dnaSource, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Henk Vermeer",
    role: "Fractievoorzitter BBB",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "BBB",
    partySlug: "bbb",
    bio: "Fractievoorzitter van BBB in de Tweede Kamer sinds de electorale terugval in 2025 (4 zetels). Voormalig wethouder en regionaal bestuurder; vertegenwoordigt plattelandsbelangen, kritisch op stikstofbeleid en EU-regelgeving op landbouwgebied.",
    positionVector: { economic: -10, social: -50, civil: -20, governance: -50, trust: -30 },
    isInternational: false,
    ideologySlugs: ["klassiek-conservatief", "communitarist"],
    sources: [tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Esther Ouwehand",
    role: "Fractievoorzitter PvdD",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "PvdD",
    partySlug: "pvdd",
    bio: "Leider van de Partij voor de Dieren. Combineert ecologisch radicalisme met progressieve sociale agenda en stevige kritiek op marktwerking in landbouw en zorg. PvdD behield 3 zetels in 2025.",
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
    bio: "Sinds januari 2025 opnieuw president van de Verenigde Staten. Combineert nationaal-protectionisme, hardere migratielijn en wantrouwen jegens instituties. Lage approval (38% per voorjaar 2026), onder druk door impopulair tarievenbeleid.",
    positionVector: { economic: -35, social: -85, civil: -50, governance: -85, trust: -85 },
    isInternational: true,
    ideologySlugs: ["populistisch-rechts", "nationaal-conservatief"],
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Bernie Sanders",
    role: "U.S. Senator (Vermont)",
    roleKind: "senator",
    country: "Verenigde Staten",
    party: "Independent / Democratic",
    bio: "Democratisch-socialistische senator, bekend van campagnes voor Medicare for All, hoger minimumloon en stevige belasting op vermogen. Trekt in 2025-2026 'Fighting Oligarchy'-rallies tegen Trumps tweede ambtstermijn.",
    positionVector: { economic: 85, social: 60, civil: 40, governance: 25, trust: 0 },
    isInternational: true,
    ideologySlugs: ["sociaal-democraat", "eco-socialist"],
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Alexandria Ocasio-Cortez",
    role: "U.S. Congresswoman (New York)",
    roleKind: "congreslid",
    country: "Verenigde Staten",
    party: "Democratic",
    bio: "Progressief Congreslid uit New York en boegbeeld van de linkervleugel binnen de Democraten. Pleit voor Green New Deal en uitbreiding sociale voorzieningen. Steeds vaker genoemd als kandidaat voor de progressieve presidentslijn in 2028.",
    positionVector: { economic: 80, social: 85, civil: 45, governance: 25, trust: 5 },
    isInternational: true,
    ideologySlugs: ["eco-socialist", "groen-progressief"],
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Emmanuel Macron",
    role: "President Frankrijk",
    roleKind: "president",
    country: "Frankrijk",
    party: "Renaissance",
    bio: "President van Frankrijk sinds 2017; niet meer herkiesbaar in 2027. Pro-Europese centristische koers; combineert markthervormingen met sterke pleidooien voor Europese soevereiniteit.",
    positionVector: { economic: -10, social: 30, civil: 10, governance: 85, trust: 55 },
    isInternational: true,
    ideologySlugs: ["technocratisch-centrist", "sociaal-liberaal"],
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Marine Le Pen",
    role: "Fractievoorzitter Rassemblement National",
    roleKind: "fractievoorzitter",
    country: "Frankrijk",
    party: "Rassemblement National",
    bio: "Leider van het Franse Rassemblement National in de Assemblée. In maart 2025 veroordeeld tot vier jaar celstraf en een vijfjarig verkiezingsverbod wegens fraude met EU-gelden; hoger beroep loopt. Adjunct Jordan Bardella wordt vooralsnog beoogd kandidaat voor de presidentsverkiezingen van 2027.",
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
    sources: [europeElects],
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
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Keir Starmer",
    role: "Premier Verenigd Koninkrijk",
    roleKind: "premier",
    country: "Verenigd Koninkrijk",
    party: "Labour",
    bio: "Premier van het VK sinds 2024. Centrum-links profiel: pragmatische sociale agenda, herstel van banden met Europa en focus op publieke voorzieningen.",
    positionVector: { economic: 35, social: 40, civil: 20, governance: 25, trust: 50 },
    isInternational: true,
    ideologySlugs: ["sociaal-democraat", "sociaal-liberaal"],
    sources: [europeElects],
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
    sources: [europeElects],
    lastReviewed: REVIEW_DATE,
  },
];
