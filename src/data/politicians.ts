import type { DimensionScores } from "@/lib/scoring";
import type { SeedSource } from "./questions";
import type { SeedFact } from "./parties";

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
  /**
   * Opvallende, verifieerbare feiten over deze politica of politicus.
   * Alleen feiten met een bron-URL; geen roddels of privéleven.
   */
  facts?: SeedFact[];
  /** Pakkende quotes voor `/turing-test` en politicus-pagina. */
  quotes?: { text: string; sourceLabel: string; sourceUrl?: string }[];
  /** Wanneer voor het laatst geverifieerd. */
  lastReviewed?: string;
}

const programmaNL: SeedSource = {
  label: "ProDemos – Tweede Kamerverkiezing",
  url: "https://verkiezingen.prodemos.nl/verkiezingsinformatie/tweede-kamer/",
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
  label: "Tweede Kamer – Fracties en fractievoorzitters (14 september 2026)",
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
  label: "Officiële regerings- en parlementspagina's (14 september 2026)",
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

const REVIEW_DATE = "2026-09-14";

export const POLITICIANS: SeedPolitician[] = [
  // ============== NEDERLAND (17) ==============
  // Stand: 14 september 2026. Rollen en fractienamen zijn gecontroleerd
  // tegen de Tweede Kamer en Rijksoverheid.
  {
    name: "Rob Jetten",
    role: "Minister-president (D66)",
    roleKind: "minister-president",
    country: "Nederland",
    party: "D66",
    partySlug: "d66",
    bio: "Minister-president van Nederland sinds 23 februari 2026. Won de TK-verkiezingen van 29 oktober 2025 met D66 (26 zetels, grootste partij). Leidt een minderheidskabinet van D66, VVD en CDA. Voormalig minister voor Klimaat en Energie; sociaal-liberale koers met sterke pro-EU houding.",
facts: [
      { claim: "Is met 38 jaar de jongste minister-president die Nederland ooit heeft gehad.", sourceUrl: "https://nos.nl/artikel/2603527-jetten-na-bliksemcarriere-jongste-premier-ooit" },
      { claim: "Is de eerste minister-president van D66-huize en de eerste openlijk homoseksuele premier van Nederland.", sourceUrl: "https://nos.nl/artikel/2603527-jetten-na-bliksemcarriere-jongste-premier-ooit" },
    ],
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
facts: [
      { claim: "Werd in 2010 uitgeroepen tot beste raadslid van Nederland op het Festival van de Lokale Democratie.", sourceUrl: "https://www.parlement.com/biografie/jm-jan-paternotte" },
      { claim: "Leidde D66 in 2014 naar de winst bij de Amsterdamse gemeenteraadsverkiezingen; de PvdA was daar sinds 1948 niet meer onttroond.", sourceUrl: "https://www.parlement.com/biografie/jm-jan-paternotte" },
      { claim: "Is voorzitter van de commissie voor de Inlichtingen- en Veiligheidsdiensten en van de vaste commissie voor Defensie.", sourceUrl: "https://www.parlement.com/biografie/jm-jan-paternotte" },
    ],
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
facts: [
      { claim: "Was een van de acht Kamerleden die het initiatiefwetsvoorstel-Klimaatwet verdedigden (34.534).", sourceUrl: "https://www.parlement.com/biografie/d-dilan-yesilgoz-zegerius" },
      { claim: "Bracht in 2019 met Gert-Jan Segers een initiatiefnota uit over een effectievere aanpak van antisemitisme, met een Nationaal Coördinator als voorstel (35.164).", sourceUrl: "https://www.parlement.com/biografie/d-dilan-yesilgoz-zegerius" },
    ],
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
facts: [
      { claim: "Kreeg bij de verkiezingen van 29 oktober 2025 als nummer 3 op de VVD-lijst 166.730 voorkeurstemmen.", sourceUrl: "https://www.parlement.com/biografie/rp-ruben-brekelmans" },
      { claim: "Was minister van Defensie in kabinet-Schoof en werd daarna fractievoorzitter van de VVD.", sourceUrl: "https://www.parlement.com/biografie/rp-ruben-brekelmans" },
    ],
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
facts: [
      { claim: "Diende in 2016 met Diederik Samsom het initiatiefwetsvoorstel-Klimaatwet in, dat wettelijke klimaatdoelen vastlegde (34.534).", sourceUrl: "https://parlement.com/biografie/jf-jesse-klaver" },
      { claim: "Diende in 2020 met Esther Ouwehand het initiatiefwetsvoorstel voor een vuurwerkverbod in, dat in 2025 werd aangenomen (35.386).", sourceUrl: "https://parlement.com/biografie/jf-jesse-klaver" },
    ],
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
facts: [
      { claim: "Werd in december 2024 door kiezers in een onderzoek van Ipsos I&O samen met Geert Wilders uitgeroepen tot beste politicus van het jaar.", sourceUrl: "https://www.ipsos-publiek.nl/actueel/geert-wilders-en-henri-bontenbal-beste-politici-van-2024" },
      { claim: "Was in oktober 2025 volgens het EenVandaag Opiniepanel de door kiezers meest geschikt geachte minister-president: 43 procent tegen 25 procent voor Rob Jetten.", sourceUrl: "https://eenvandaag.avrotros.nl/opiniepanel/uitslagen/cda-lang-niet-grootste-in-zetelpeiling-maar-henri-bontenbal-volgens-kiezers-veruit-meest-geschikt-als-premier-161703" },
    ],
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
facts: [
      { claim: "Is sinds 25 augustus 1998 Tweede Kamerlid en daarmee het langstzittende lid van de Kamer.", sourceUrl: "https://www.parlement.com/biografie/g-geert-wilders" },
      { claim: "Liet in augustus 2015 het Kamerreces onderbreken om een motie van wantrouwen in te dienen tegen het kabinet, na de Nederlandse instemming met een derde steunpakket voor Griekenland.", sourceUrl: "https://www.parlement.com/biografie/g-geert-wilders" },
    ],
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
facts: [
      { claim: "Richtte op 9 december 2020 samen met Annabel Nanninga JA21 op, nadat beiden op 26 november 2020 uit Forum voor Democratie stapten.", sourceUrl: "https://rug.nl/research/dnpp/politieke-partijen/ja21/geschiedenis" },
      { claim: "Was in 2022 het enige JA21-Kamerlid dat vóór het initiatiefwetsvoorstel over de afschaffing van de vijf dagen bedenktijd bij zwangerschapsafbreking stemde.", sourceUrl: "https://parlement.com/biografie/drs-bj-joost-eerdmans" },
    ],
        positionVector: { economic: -45, social: -55, civil: -15, governance: -35, trust: 0 },
    isInternational: false,
    ideologySlugs: ["conservatief-liberaal", "nationaal-conservatief"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },
  {
    name: "Ralf Dekker",
    role: "Waarnemend fractievoorzitter Forum voor Democratie",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "FvD",
    partySlug: "fvd",
    bio: "Neemt sinds 6 augustus 2026 het fractievoorzitterschap van FVD waar, omdat fractievoorzitter Lidewij de Vos met zwangerschaps- en bevallingsverlof is. De partij heeft 7 zetels en voert een rechts-conservatieve, EU-kritische koers met libertaire economische trekken.",
facts: [
      { claim: "Neemt sinds 6 augustus 2026 het fractievoorzitterschap van FVD waar, omdat fractievoorzitter Lidewij de Vos met zwangerschaps- en bevallingsverlof is.", sourceUrl: "https://www.parlement.com/biografie/rj-ralf-dekker" },
      { claim: "Was al twee keer eerder tijdelijk Kamerlid als vervanger, voordat hij op 12 november 2025 vast Kamerlid werd.", sourceUrl: "https://www.parlement.com/biografie/rj-ralf-dekker" },
      { claim: "Is voorzitter van het Renaissance Instituut, het wetenschappelijk bureau van FVD, en werkte eerder ruim dertig jaar bij de Rabobank.", sourceUrl: "https://www.parlement.com/biografie/rj-ralf-dekker" },
    ],
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
facts: [
      { claim: "Was in juni 2024 voorzien als minister van Asiel en Migratie in het beoogde kabinet-Schoof; zijn kandidatuur werd ingetrokken na de AIVD-naslag.", sourceUrl: "https://parlement.com/biografie/g-gidi-markuszower" },
      { claim: "Zeven PVV-Kamerleden splitsten zich op 20 januari 2026 onder zijn leiding af als Groep-Markuszower, waardoor de PVV van 26 naar 19 zetels ging.", sourceUrl: "https://parlement.com/partij/pvv-partij-voor-de-vrijheid" },
    ],
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
facts: [
      { claim: "Is medeoprichter van BBB en was ambtelijk secretaris van de eenpersoonsfractie van Caroline van der Plas voordat hij zelf Kamerlid werd.", sourceUrl: "https://www.parlement.com/biografie/h-henk-vermeer" },
      { claim: "Werd op 20 februari 2026 politiek leider en fractievoorzitter van BBB nadat Caroline van der Plas zich terugtrok; zij bleef Kamerlid.", sourceUrl: "https://nltimes.nl/2026/02/20/caroline-van-der-plas-steps-bbb-leader-henk-vermeer-takes" },
    ],
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
facts: [
      { claim: "Was in kabinet-Schoof vicepremier en minister van Volkshuisvesting en Ruimtelijke Ordening, en vanaf juni 2025 ook belast met de opvang en huisvesting van asielzoekers.", sourceUrl: "https://www.parlement.com/biografie/mcg-mona-keijzer" },
      { claim: "Kreeg bij de verkiezingen van 2025 als nummer 2 op de BBB-lijst 111.839 voorkeurstemmen.", sourceUrl: "https://www.parlement.com/biografie/mcg-mona-keijzer" },
    ],
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
facts: [
      { claim: "Was Eerste Kamerlid en is sinds 31 maart 2021 Tweede Kamerlid; daarmee is zij een van de weinige politici die beide Kamers vertegenwoordigde.", sourceUrl: "https://www.parlement.com/biografie/ch-christine-teunissen" },
      { claim: "Is sinds juni 2026 partijleider en fractievoorzitter van de Partij voor de Dieren, nadat Esther Ouwehand beide rollen overdroeg.", sourceUrl: "https://www.partijvoordedieren.nl/persbericht-christine-teunissen-nieuwe-fractievoorzitter" },
    ],
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
facts: [
      { claim: "Was fabrieksarbeider en zat van 2010 tot 2023 in de gemeenteraad van Groningen, vanaf 2013 als fractievoorzitter, voordat hij Kamerlid en partijleider van de SP werd.", sourceUrl: "https://www.parlement.com/biografie/jp-jimmy-dijk" },
      { claim: "Nam in 2023 de verdediging over van het initiatiefwetsvoorstel over grondwettelijke vastlegging van het correctief referendum.", sourceUrl: "https://www.parlement.com/biografie/jp-jimmy-dijk" },
    ],
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
facts: [
      { claim: "Leidde eerst de ChristenUnie-fractie in de Eerste Kamer en sinds januari 2023 die in de Tweede Kamer: een van de weinige politici die beide fracties voorzaten.", sourceUrl: "https://www.parlement.com/biografie/mh-mirjam-bikker" },
      { claim: "Is de eerste vrouw die de ChristenUnie als partijleider aanvoert.", sourceUrl: "https://cne.news/article/2407-the-new-dutch-christianunion-leader-is-a-pilgrim-on-the-plush" },
    ],
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
facts: [
      { claim: "Was in maart 2021 het eerste Volt-Kamerlid; Volt is een pan-Europese beweging die in meer dan dertig landen met hetzelfde beginselprogramma actief is.", sourceUrl: "https://parlement.com/partij/volt-nederland" },
      { claim: "Is rapporteur Europese Veiligheidsarchitectuur en was in 2024 rapporteur Europese Defensie Industrie Strategie.", sourceUrl: "https://www.parlement.com/biografie/lajm-laurens-dassen" },
    ],
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
facts: [
      { claim: "Diende in 2026 met Doğukan Ergin een initiatiefwetsvoorstel in over toezicht op gelijke kansen bij werving en selectie, tegen discriminatie bij sollicitaties (36.908).", sourceUrl: "https://www.parlement.com/biografie/srt-stephan-van-baarle" },
      { claim: "Was fractievoorzitter van DENK in de Rotterdamse gemeenteraad voordat hij in 2021 Kamerlid werd en in 2023 de landelijke fractie ging leiden.", sourceUrl: "https://www.parlement.com/biografie/srt-stephan-van-baarle" },
    ],
        positionVector: { economic: 55, social: 65, civil: 15, governance: 25, trust: -45 },
    isInternational: false,
    ideologySlugs: ["populistisch-links", "groen-progressief"],
    sources: [programmaNL, tkFracties],
    lastReviewed: REVIEW_DATE,
  },

  {
    name: "Thom van Campen",
    role: "Voorzitter van de Tweede Kamer",
    roleKind: "kamerlid",
    country: "Nederland",
    party: "VVD",
    partySlug: "vvd",
    bio: "Voorzitter van de Tweede Kamer sinds 18 november 2025. Hij werd in de derde stemronde gekozen met 79 van de 148 stemmen en is de jongste Kamervoorzitter die Nederland heeft gehad. Als voorzitter hoort hij boven de partijen te staan en onthoudt hij zich van een eigen oordeel over voorstellen.",
    positionVector: { economic: -50, social: -10, civil: -5, governance: 20, trust: 40 },
    isInternational: false,
    ideologySlugs: ["conservatief-liberaal"],
    sources: [tkFracties],
    facts: [
      { claim: "Werd op 18 november 2025 in drie stemrondes verkozen tot Voorzitter van de Tweede Kamer, met 79 van de 148 geldige stemmen.", sourceUrl: "https://www.tweedekamer.nl/nieuws/kamernieuws/thom-van-campen-verkozen-tot-voorzitter" },

      { claim: "Is de jongste Kamervoorzitter ooit; hij was 35 bij zijn aantreden.", sourceUrl: "https://nrc.nl/nieuws/2025/11/18/thom-van-campen-vvd-verkozen-tot-nieuwe-voorzitter-tweede-kamer-a4912988" },

      { claim: "Zit sinds 31 maart 2021 in de Tweede Kamer en was daarvoor tien jaar gemeenteraadslid in Zwolle.", sourceUrl: "https://www.parlement.com/biografie/aah-thom-van-campen" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Lidewij de Vos",
    role: "Fractievoorzitter Forum voor Democratie",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "FvD",
    partySlug: "fvd",
    bio: "Politiek leider en fractievoorzitter van Forum voor Democratie. Tijdens haar zwangerschaps- en bevallingsverlof neemt Ralf Dekker het fractievoorzitterschap waar. De partij heeft 7 zetels en voert een rechts-conservatieve, EU-kritische koers.",
    positionVector: { economic: -50, social: -75, civil: 10, governance: -85, trust: -85 },
    isInternational: false,
    ideologySlugs: ["nationaal-conservatief", "populistisch-rechts"],
    sources: [tkFracties],
    facts: [
      { claim: "Is politiek leider en fractievoorzitter van FVD; Ralf Dekker neemt het fractievoorzitterschap waar tijdens haar zwangerschaps- en bevallingsverlof.", sourceUrl: "https://www.parlement.com/biografie/rj-ralf-dekker" },

      { claim: "Werd bij de verkiezingen van 29 oktober 2025 in de Tweede Kamer gekozen en is sinds 4 september 2025 Kamerlid.", sourceUrl: "https://www.parlement.com/tweede-kamerfractie-fvd" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Chris Stoffer",
    role: "Politiek leider en fractievoorzitter SGP",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "SGP",
    partySlug: "sgp",
    bio: "Politiek leider en fractievoorzitter van de Staatkundig Gereformeerde Partij, die 3 zetels heeft. De SGP is de oudste nog bestaande politieke partij van Nederland en neemt deel aan de Kamer sinds 1922.",
    positionVector: { economic: -20, social: -85, civil: -45, governance: -40, trust: 35 },
    isInternational: false,
    ideologySlugs: ["klassiek-conservatief", "christen-democraat"],
    sources: [tkFracties],
    facts: [
      { claim: "Is sinds 2023 fractievoorzitter van de SGP en zit sinds 2018 in de Tweede Kamer.", sourceUrl: "https://www.tweedekamer.nl/kamerleden_en_commissies/alle_kamerleden/stoffer-c-sgp" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Jan Struijs",
    role: "Politiek leider en fractievoorzitter 50PLUS",
    roleKind: "fractievoorzitter",
    country: "Nederland",
    party: "50PLUS",
    partySlug: "50plus",
    bio: "Politiek leider en fractievoorzitter van 50PLUS sinds 12 november 2025. Hij is oud-voorzitter van de politievakbond ACP en oud-politiechef van Rotterdam. De partij heeft 2 zetels en richt zich vooral op ouderen en pensioenen.",
    positionVector: { economic: 35, social: -20, civil: -5, governance: -20, trust: -10 },
    isInternational: false,
    ideologySlugs: ["sociaal-democraat"],
    sources: [tkFracties],
    facts: [
      { claim: "Werd op 12 november 2025 Kamerlid en is sindsdien fractievoorzitter en politiek leider van 50PLUS.", sourceUrl: "https://www.tweedekamer.nl/kamerleden_en_commissies/alle_kamerleden/struijs-ja-50plus" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Caroline van der Plas",
    role: "Tweede Kamerlid en medeoprichter BBB",
    roleKind: "kamerlid",
    country: "Nederland",
    party: "BBB",
    partySlug: "bbb",
    bio: "Medeoprichter van BoerBurgerBeweging en vijf jaar lang het gezicht van de partij. Zij was politiek leider en fractievoorzitter tot 20 februari 2026 en bleef daarna Kamerlid. BBB won bij de verkiezingen van 2023 verrassend 7 zetels.",
    positionVector: { economic: -10, social: -50, civil: -20, governance: -50, trust: -25 },
    isInternational: false,
    ideologySlugs: ["klassiek-conservatief", "communitarist"],
    sources: [tkFracties],
    facts: [
      { claim: "Zit sinds 31 maart 2021 in de Tweede Kamer en was tot 20 februari 2026 politiek leider en fractievoorzitter van BBB.", sourceUrl: "https://www.tweedekamer.nl/kamerleden_en_commissies/fracties/bbb" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Esther Ouwehand",
    role: "Tweede Kamerlid Partij voor de Dieren",
    roleKind: "kamerlid",
    country: "Nederland",
    party: "PvdD",
    partySlug: "pvdd",
    bio: "Zit sinds 30 november 2006 in de Tweede Kamer en was van 2019 tot juni 2026 partijleider en fractievoorzitter van de Partij voor de Dieren. Zij droeg die rollen over aan Christine Teunissen en richt zich nu op het landbouwdossier en haar eigen wetsvoorstellen.",
    positionVector: { economic: 70, social: 55, civil: 45, governance: 30, trust: -15 },
    isInternational: false,
    ideologySlugs: ["groen-progressief"],
    sources: [tkFracties],
    facts: [
      { claim: "Is sinds 30 november 2006 Tweede Kamerlid en was van 2019 tot juni 2026 partijleider van de Partij voor de Dieren.", sourceUrl: "https://tweedekamer.nl/kamerleden_en_commissies/alle_kamerleden/ouwehand-e-pvdd/biografie" },

      { claim: "Blijft na haar terugtreden Kamerlid en verdedigt daar haar eigen wetsvoorstellen over de bio-industrie en het beperken van dierenleed bij de slacht.", sourceUrl: "https://www.partijvoordedieren.nl/persbericht-christine-teunissen-nieuwe-fractievoorzitter" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Bart van den Brink",
    role: "Viceminister-president en minister van Asiel en Migratie",
    roleKind: "vice-premier",
    country: "Nederland",
    party: "CDA",
    partySlug: "cda",
    bio: "Viceminister-president en minister van Asiel en Migratie in kabinet-Jetten, beëdigd op 23 februari 2026. Hij is een van de twee viceminister-presidenten naast premier Rob Jetten.",
    positionVector: { economic: 20, social: -30, civil: -15, governance: 10, trust: 30 },
    isInternational: false,
    ideologySlugs: ["christen-democraat"],
    sources: [tkFracties],
    facts: [
      { claim: "Is sinds 23 februari 2026 viceminister-president en minister van Asiel en Migratie in kabinet-Jetten.", sourceUrl: "https://www.rijksoverheid.nl/regering/over-de-regering/kabinetten-sinds-1945/kabinet-jetten" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Femke Wiersma",
    role: "Tweede Kamerlid BBB",
    roleKind: "kamerlid",
    country: "Nederland",
    party: "BBB",
    partySlug: "bbb",
    bio: "Was minister van Landbouw, Visserij, Voedselzekerheid en Natuur in kabinet-Schoof van 2 juli 2024 tot 23 februari 2026 en is sinds 12 november 2025 weer Tweede Kamerlid voor BBB.",
    positionVector: { economic: -5, social: -55, civil: -20, governance: -45, trust: -20 },
    isInternational: false,
    ideologySlugs: ["klassiek-conservatief", "communitarist"],
    sources: [tkFracties],
    facts: [
      { claim: "Was minister van Landbouw, Visserij, Voedselzekerheid en Natuur in kabinet-Schoof en is sinds 12 november 2025 weer Kamerlid.", sourceUrl: "https://www.parlement.com/biografie/fm-femke-wiersma" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Frans Timmermans",
    role: "Voormalig politiek leider GroenLinks-PvdA",
    roleKind: "voormalig",
    country: "Nederland",
    party: "GroenLinks-PvdA",
    partySlug: "progressief-nederland",
    bio: "Was van november 2023 tot oktober 2025 politiek leider en fractievoorzitter van GroenLinks-PvdA. Daarvoor was hij Eurocommissaris en minister van Buitenlandse Zaken. Hij nam zijn Kamerzetel na de verkiezingen van 2025 niet in.",
    positionVector: { economic: 60, social: 65, civil: 35, governance: 80, trust: 50 },
    isInternational: false,
    ideologySlugs: ["sociaal-democraat", "groen-progressief"],
    sources: [tkFracties],
    facts: [
      { claim: "Was fractievoorzitter van GroenLinks-PvdA van 23 november 2023 tot 29 oktober 2025 en nam daarna zijn Kamerzetel niet in.", sourceUrl: "https://parlement.com/biografie/dr-fcgm-frans-timmermans" },

    ],
    lastReviewed: "2026-09-15",
  },

  {
    name: "Annabel Nanninga",
    role: "Tweede Kamerlid JA21",
    roleKind: "kamerlid",
    country: "Nederland",
    party: "JA21",
    partySlug: "ja21",
    bio: "Medeoprichter van JA21 en sinds 2025 Tweede Kamerlid. Zij leidde de JA21-fractie in de Eerste Kamer van 2020 tot 2025 en zat daarvoor in de gemeenteraad van Amsterdam.",
    positionVector: { economic: -45, social: -60, civil: -20, governance: -35, trust: -15 },
    isInternational: false,
    ideologySlugs: ["conservatief-liberaal", "nationaal-conservatief"],
    sources: [tkFracties],
    facts: [
      { claim: "Richtte op 9 december 2020 samen met Joost Eerdmans JA21 op, na hun vertrek uit Forum voor Democratie.", sourceUrl: "https://www.parlement.com/biografie/annabel-nanninga" },

      { claim: "Leidde de JA21-fractie in de Eerste Kamer van 2020 tot 2025 en is sinds 2025 Tweede Kamerlid.", sourceUrl: "https://www.parlement.com/biografie/annabel-nanninga" },

    ],
    lastReviewed: "2026-09-15",
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
