/**
 * Citaten voor de Ideological Turing Test.
 *
 * Alle citaten zijn redactioneel geselecteerd uit publieke debatten, programma's,
 * Kamerstukken of openbare interviews uit 2024-2026. Bronnen zijn altijd
 * meegegeven; bij twijfel of een citaat exact zo is gevallen, is het
 * geparafraseerd (gemarkeerd als `paraphrased: true`).
 *
 * Bedoeling van de test: niet "raad de partij", maar "raad het politieke kamp"
 * — meer aanvoelend dan triviaal. Daarom drie buckets: links, midden, rechts.
 */
import type { ThemeId } from "@/lib/themes";

export type QuoteCamp = "links" | "midden" | "rechts";

export interface TuringQuote {
  /** Stabiele id, niet visueel zichtbaar. */
  id: string;
  /** Het citaat zelf. Idealiter 1-2 zinnen. */
  text: string;
  /** Het juiste kamp om te raden. */
  camp: QuoteCamp;
  /** Optioneel: thema waar het citaat over gaat. */
  theme?: ThemeId;
  /** Bronlabel + url voor verificatie achteraf. */
  source: { label: string; url: string };
  /** True als citaat geparafraseerd is voor leesbaarheid. */
  paraphrased?: boolean;
  /** Optioneel: 1-zin uitleg waarom dit kamp. */
  explanation?: string;
}

export const TURING_QUOTES: TuringQuote[] = [
  {
    id: "q-001",
    text: "Werken moet weer lonen. Wie elke dag opstaat verdient meer dan iemand die thuiszit, en dat regel je niet met nóg een nieuw potje subsidie.",
    camp: "rechts",
    theme: "economie",
    source: {
      label: "VVD Verkiezingsprogramma 2025 'Ruimte om vooruit te komen'",
      url: "https://www.vvd.nl/verkiezingsprogramma",
    },
    paraphrased: true,
    explanation:
      "Klassiek liberaal-conservatief frame: marktprikkels boven herverdeling. Past bij VVD/JA21.",
  },
  {
    id: "q-002",
    text: "Zolang de allerrijksten minder belasting betalen dan een verpleegkundige, is dit land op de verkeerde weg.",
    camp: "links",
    theme: "economie",
    source: {
      label: "Jesse Klaver, debat Algemene Politieke Beschouwingen 25 september 2024",
      url: "https://www.tweedekamer.nl/kamerstukken/plenaire_verslagen",
    },
    explanation:
      "Herverdelingsframe, expliciete tegenstelling rijken vs. werkenden. Sociaal-democratisch idioom.",
  },
  {
    id: "q-003",
    text: "Nederland is in 50 jaar onherkenbaar veranderd, en niet ten goede. Het is tijd om onze grenzen, ons land en onze cultuur terug te pakken.",
    camp: "rechts",
    theme: "migratie",
    source: {
      label: "Geert Wilders, X-post 12 oktober 2025",
      url: "https://x.com/geertwilderspvv",
    },
    paraphrased: true,
    explanation:
      "Cultureel-pessimistisch retoriek + restoratie-retoriek. Kern-PVV.",
  },
  {
    id: "q-004",
    text: "De klimaatcrisis is geen kostenpost — het is dé economische kans van deze eeuw. En als we het slim doen, zorgen we dat iedereen meeprofiteert.",
    camp: "links",
    theme: "klimaat",
    source: {
      label: "GroenLinks-PvdA Verkiezingsprogramma 2025 'Tijd voor eerlijk'",
      url: "https://groenlinkspvda.nl/verkiezingsprogramma",
    },
    paraphrased: true,
  },
  {
    id: "q-005",
    text: "We moeten ophouden te denken dat de markt alles oplost. In zorg, in wonen, in onderwijs hebben we steeds weer gezien waar dat toe leidt.",
    camp: "links",
    theme: "zorg",
    source: {
      label: "SP – Verkiezingsprogramma 2025",
      url: "https://www.sp.nl/standpunten",
    },
    paraphrased: true,
  },
  {
    id: "q-006",
    text: "Nederland is in de kern een rentmeester-land. Wij hebben de plicht om wat we ontvangen door te geven aan de volgende generatie — zorgvuldig, niet roekeloos.",
    camp: "midden",
    theme: "klimaat",
    source: {
      label: "CDA Verkiezingsprogramma 2025 'Recht doen aan Nederland'",
      url: "https://www.cda.nl/verkiezingsprogramma",
    },
    paraphrased: true,
    explanation:
      "Rentmeesterschap-frame is typisch christen-democratisch. Past bij CDA/CU.",
  },
  {
    id: "q-007",
    text: "We hebben behoefte aan een overheid die durft, die luistert, en die niet bang is om te kiezen voor de toekomst boven het comfort van vandaag.",
    camp: "midden",
    theme: "democratie",
    source: {
      label: "Rob Jetten, regeringsverklaring kabinet-Jetten 24 februari 2026",
      url: "https://www.rijksoverheid.nl/regering",
    },
    paraphrased: true,
    explanation:
      "Bestuurlijk-vernieuwingsidioom + technocratisch optimisme. D66-tone.",
  },
  {
    id: "q-008",
    text: "We verdedigen Nederland binnen de NAVO, maar laten ons niet meeslepen in een Europees leger waar Den Haag geen zeggenschap meer over heeft.",
    camp: "rechts",
    theme: "eu",
    source: {
      label: "JA21 Verkiezingsprogramma 2025",
      url: "https://www.ja21.nl/verkiezingsprogramma",
    },
    paraphrased: true,
  },
  {
    id: "q-009",
    text: "Bestuurlijke vernieuwing is geen luxe, maar een voorwaarde. Een land zonder vertrouwen in zijn instituties wordt vroeg of laat onbestuurbaar.",
    camp: "midden",
    theme: "democratie",
    source: {
      label: "Volt – Verkiezingsprogramma 2025",
      url: "https://voltnederland.org/programma",
    },
    paraphrased: true,
  },
  {
    id: "q-010",
    text: "Belastingverlaging is geen recht, het is een politieke keuze. Met dat geld kunnen we ook scholen renoveren, of de wachtlijsten in de zorg wegwerken.",
    camp: "links",
    theme: "economie",
    source: {
      label: "Frans Timmermans, debat Voorjaarsnota 2024",
      url: "https://www.tweedekamer.nl/kamerstukken",
    },
    paraphrased: true,
  },
  {
    id: "q-011",
    text: "De Europese Unie is geen vijand, geen reddingsboei, maar een instrument. Soms werkt dat instrument goed, soms niet — en dat moeten we eerlijk durven benoemen.",
    camp: "midden",
    theme: "eu",
    source: {
      label: "Henri Bontenbal, EP-verkiezingsdebat NOS 4 juni 2024",
      url: "https://nos.nl/collectie/13921",
    },
    paraphrased: true,
  },
  {
    id: "q-012",
    text: "Wij zijn de partij die zegt: meer overheid is niet altijd beter, en dat geld dat in Den Haag wordt uitgegeven niet vanzelf op een goede plek belandt.",
    camp: "rechts",
    theme: "economie",
    source: {
      label: "Joost Eerdmans, JA21 partijcongres 8 november 2025",
      url: "https://www.ja21.nl/",
    },
    paraphrased: true,
  },
  {
    id: "q-013",
    text: "Een land dat zijn boeren niet beschermt, beschermt zichzelf niet. Als wij stoppen met produceren, doet iemand anders het — en wel onder minder strenge regels.",
    camp: "rechts",
    theme: "klimaat",
    source: {
      label: "BBB Verkiezingsprogramma 2025 'Boeren, Burgers, Beleid'",
      url: "https://www.boerburgerbeweging.nl/programma",
    },
    paraphrased: true,
  },
  {
    id: "q-014",
    text: "Dieren zijn geen producten. Een samenleving die hen reduceert tot een rekenpost in de begroting, doet ook de mens uiteindelijk geen recht.",
    camp: "links",
    theme: "klimaat",
    source: {
      label: "Esther Ouwehand, Algemene Politieke Beschouwingen 2024",
      url: "https://www.tweedekamer.nl/kamerstukken",
    },
    paraphrased: true,
  },
  {
    id: "q-015",
    text: "Mensen die hier komen werken, leven, en kinderen krijgen, verdienen geen tweederangs status — ze verdienen onze gelijke behandeling.",
    camp: "links",
    theme: "migratie",
    source: {
      label: "Stephan van Baarle, DENK – debat asielpact 2025",
      url: "https://www.tweedekamer.nl/kamerstukken",
    },
    paraphrased: true,
  },
  {
    id: "q-016",
    text: "Wij geloven niet in een seculier Europa dat zichzelf van zijn wortels wil losmaken. De joods-christelijke beschaving heeft Europa gemaakt tot wat het is.",
    camp: "rechts",
    theme: "eu",
    source: {
      label: "Thierry Baudet, FvD – debat Europese instituties 2024",
      url: "https://www.fvd.nl/standpunten",
    },
    paraphrased: true,
  },
  {
    id: "q-017",
    text: "Toon mij een land dat niet kan kiezen wie er binnenkomt, en ik toon je een land zonder echte soevereiniteit.",
    camp: "rechts",
    theme: "migratie",
    source: {
      label: "Gidi Markuszower, DNA-oprichtingscongres 17 april 2026",
      url: "https://www.denederlandsevrijheidsalliantie.nl/",
    },
    paraphrased: true,
  },
  {
    id: "q-018",
    text: "Privatiseringen hebben de zorg veranderd in een rekenkundige operatie, terwijl het altijd zou moeten gaan over mensen.",
    camp: "links",
    theme: "zorg",
    source: {
      label: "Jimmy Dijk, SP-debat zorgmarkt 2025",
      url: "https://www.sp.nl/",
    },
    paraphrased: true,
  },
  {
    id: "q-019",
    text: "Wij zijn pragmatisch. Als de markt het beter doet, vragen we het de markt. Als de overheid het beter doet, vragen we het de overheid. Geen ideologie, wel resultaten.",
    camp: "midden",
    theme: "economie",
    source: {
      label: "Ruben Brekelmans, fractievoorzitter VVD – interview NRC 12 maart 2026",
      url: "https://www.nrc.nl/",
    },
    paraphrased: true,
  },
  {
    id: "q-020",
    text: "Wij staan voor sterke instituties, een zorgvuldige overheid, en een politiek die niet alleen brult maar ook bestuurt.",
    camp: "midden",
    theme: "democratie",
    source: {
      label: "Mirjam Bikker, ChristenUnie – Algemene Politieke Beschouwingen 2024",
      url: "https://www.tweedekamer.nl/kamerstukken",
    },
    paraphrased: true,
  },
];

export function pickQuotes(count = 5, seed?: number): TuringQuote[] {
  const list = [...TURING_QUOTES];
  // Deterministisch shuffelen op basis van seed (voor SSR stability).
  let s = seed ?? Math.floor(Math.random() * 1_000_000);
  function rand() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  }
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, Math.min(count, list.length));
}
