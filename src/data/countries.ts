import type { DimensionScores } from "@/lib/scoring";
import type { SeedSource } from "./questions";

export interface SeedCountry {
  name: string;
  countryCode: string;
  description: string;
  positionVector: DimensionScores;
  sources: SeedSource[];
}

const vdem: SeedSource = {
  label: "V-Dem Institute – Liberal Democracy Index 2025",
  url: "https://v-dem.net/data/",
};
const heritage: SeedSource = {
  label: "Heritage Foundation – Index of Economic Freedom 2025",
  url: "https://www.heritage.org/index/",
};
const rsf: SeedSource = {
  label: "Reporters Without Borders – Press Freedom Index 2025",
  url: "https://rsf.org/en/index",
};
const eurobarometer: SeedSource = {
  label: "Eurobarometer Standard 102 (2024)",
  url: "https://europa.eu/eurobarometer/surveys/detail/3215",
};
const oecd: SeedSource = {
  label: "OECD – Trust in Government 2024",
  url: "https://www.oecd.org/governance/trust-in-government/",
};

const baseEU: SeedSource[] = [vdem, heritage, eurobarometer];

export const COUNTRIES: SeedCountry[] = [
  {
    name: "Nederland",
    countryCode: "NL",
    description:
      "Open economie met sterke verzorgingsstaat, hoge persvrijheid en hechte EU-positie. Sociaal-liberale midden, met groeiende rechts-conservatieve invloed.",
    positionVector: { economic: 30, social: 50, civil: 50, governance: 60, trust: 50 },
    sources: [...baseEU, rsf, oecd],
  },
  {
    name: "België",
    countryCode: "BE",
    description:
      "Federaal land met sterke regionale autonomie. Sociale markteconomie, brede sociale voorzieningen en pro-Europese koers.",
    positionVector: { economic: 50, social: 50, civil: 40, governance: 75, trust: 30 },
    sources: baseEU,
  },
  {
    name: "Duitsland",
    countryCode: "DE",
    description:
      "Sociale markteconomie, sterke instituties en kernpartner in de EU. Politieke koers schommelt rond centrum, met groei van populistische randen.",
    positionVector: { economic: 40, social: 40, civil: 40, governance: 70, trust: 50 },
    sources: [...baseEU, oecd],
  },
  {
    name: "Frankrijk",
    countryCode: "FR",
    description:
      "Sterke staat, brede publieke sector en uitgesproken centralistische politieke traditie. Pro-Europees op kernthema's; sterke sociale conflicten.",
    positionVector: { economic: 55, social: 30, civil: 20, governance: 65, trust: 20 },
    sources: baseEU,
  },
  {
    name: "Luxemburg",
    countryCode: "LU",
    description:
      "Klein, welvarend land met sterke financiële sector en zeer hoge mate van EU-integratie. Sociaal-progressief en bestuurlijk hoog vertrouwen.",
    positionVector: { economic: 35, social: 55, civil: 50, governance: 85, trust: 60 },
    sources: baseEU,
  },
  {
    name: "Italië",
    countryCode: "IT",
    description:
      "Lange democratische traditie met cyclische crises. Onder Meloni nationaal-conservatieve koers, met sterke regionale verschillen.",
    positionVector: { economic: 20, social: -10, civil: 10, governance: 25, trust: -10 },
    sources: baseEU,
  },
  {
    name: "Spanje",
    countryCode: "ES",
    description:
      "Decentraal koninkrijk met sterke regionale autonomie en sociaal-democratische regering. Pro-Europese koers, met polarisatie tussen blokken.",
    positionVector: { economic: 50, social: 55, civil: 30, governance: 60, trust: 20 },
    sources: baseEU,
  },
  {
    name: "Portugal",
    countryCode: "PT",
    description:
      "Sinds 1974 stabiele democratie met inhaalslag in welvaart. Sociaaldemocratische ondertoon, sterk pro-Europees, redelijk hoog institutioneel vertrouwen.",
    positionVector: { economic: 50, social: 50, civil: 40, governance: 60, trust: 30 },
    sources: baseEU,
  },
  {
    name: "Oostenrijk",
    countryCode: "AT",
    description:
      "Federale republiek met traditioneel hoge sociale cohesie. Politieke spanning tussen centrum-rechts en populistisch-rechts (FPÖ).",
    positionVector: { economic: 40, social: 10, civil: 20, governance: 50, trust: 40 },
    sources: baseEU,
  },
  {
    name: "Ierland",
    countryCode: "IE",
    description:
      "Sterk open economie, lage vennootschapsbelasting, snel maatschappelijk progressief (gelijke huwelijk 2015, abortus 2018).",
    positionVector: { economic: -20, social: 55, civil: 50, governance: 50, trust: 45 },
    sources: baseEU,
  },
  {
    name: "Griekenland",
    countryCode: "GR",
    description:
      "Sinds 2018 herstellend van eurocrisis. Sociale staat onder druk, sterke politieke polarisatie en wisselend institutioneel vertrouwen.",
    positionVector: { economic: 45, social: 0, civil: 20, governance: 30, trust: -10 },
    sources: baseEU,
  },
  {
    name: "Finland",
    countryCode: "FI",
    description:
      "Klein, technologisch sterk Noord-Europees land. Hoge welvaartsvoorzieningen, hoog vertrouwen in instituties en stevig EU-engagement.",
    positionVector: { economic: 50, social: 50, civil: 50, governance: 60, trust: 75 },
    sources: [...baseEU, oecd],
  },
  {
    name: "Zweden",
    countryCode: "SE",
    description:
      "Klassiek voorbeeld van sociaaldemocratische verzorgingsstaat met progressief cultureel klimaat. Recente verschuiving naar centrum-rechts coalities.",
    positionVector: { economic: 70, social: 70, civil: 50, governance: 50, trust: 70 },
    sources: [...baseEU, oecd],
  },
  {
    name: "Denemarken",
    countryCode: "DK",
    description:
      "Sterke verzorgingsstaat met flexibele arbeidsmarkt (flexicurity). Strengere migratielijn dan veel andere noordse landen; hoog vertrouwen.",
    positionVector: { economic: 60, social: 50, civil: 40, governance: 35, trust: 75 },
    sources: [...baseEU, oecd],
  },
  {
    name: "Polen",
    countryCode: "PL",
    description:
      "Sinds Tusk (2023) terugkeer naar centrum-Europese koers, na jaren van PiS-conservatisme. Sterke sociaal-culturele tegenstellingen.",
    positionVector: { economic: 20, social: -45, civil: -10, governance: -10, trust: -10 },
    sources: baseEU,
  },
  {
    name: "Tsjechië",
    countryCode: "CZ",
    description:
      "Liberale economie, kritisch tegenover EU-federalisme en migratie. Sterke industriële basis en gemengd vertrouwen in instituties.",
    positionVector: { economic: 10, social: -10, civil: 10, governance: 5, trust: 10 },
    sources: baseEU,
  },
  {
    name: "Slowakije",
    countryCode: "SK",
    description:
      "Politiek instabiel met opmars van Fico's populistisch-nationalistische koers. Wantrouwen jegens westerse media en EU-coördinatie groeit.",
    positionVector: { economic: 30, social: -30, civil: -10, governance: -25, trust: -20 },
    sources: baseEU,
  },
  {
    name: "Hongarije",
    countryCode: "HU",
    description:
      "Onder Orbán (Fidesz) sinds 2010 stevig nationaal-conservatieve koers. V-Dem rekent het land tot 'electorale autocratieën'.",
    positionVector: { economic: 30, social: -70, civil: -50, governance: -80, trust: -40 },
    sources: [vdem, rsf, heritage],
  },
  {
    name: "Roemenië",
    countryCode: "RO",
    description:
      "Jonge democratie met strijd tegen corruptie en sterke EU-oriëntatie. Hervormingen in justitie en bestuur lopen door.",
    positionVector: { economic: 20, social: -30, civil: 5, governance: 20, trust: -20 },
    sources: baseEU,
  },
  {
    name: "Bulgarije",
    countryCode: "BG",
    description:
      "Politiek versnipperd, kwetsbaar voor populisme. Lid van EU en NAVO, maar nog grote uitdagingen op rechtsstaat en vertrouwen.",
    positionVector: { economic: 25, social: -30, civil: 0, governance: 10, trust: -30 },
    sources: baseEU,
  },
  {
    name: "Slovenië",
    countryCode: "SI",
    description:
      "Welvarend deel van voormalig Joegoslavië, sterk geïntegreerd in EU. Sociaal-liberale traditie met wisselende coalities.",
    positionVector: { economic: 40, social: 30, civil: 30, governance: 40, trust: 20 },
    sources: baseEU,
  },
  {
    name: "Kroatië",
    countryCode: "HR",
    description:
      "Sinds 2023 lid van de eurozone en Schengen. Centrum-rechts dominant, met aandacht voor toerisme en cultureel erfgoed.",
    positionVector: { economic: 30, social: -10, civil: 10, governance: 25, trust: 5 },
    sources: baseEU,
  },
  {
    name: "Estland",
    countryCode: "EE",
    description:
      "Digitale voorhoede met liberale economie. Sterk pro-Atlantisch en pro-Europees, hoge bestuurskracht en transparantie.",
    positionVector: { economic: -30, social: 30, civil: 50, governance: 50, trust: 55 },
    sources: [...baseEU, oecd],
  },
  {
    name: "Letland",
    countryCode: "LV",
    description:
      "Open economie, sterk EU- en NAVO-georiënteerd. Politiek versnipperd, met aandacht voor veiligheid t.o.v. Rusland.",
    positionVector: { economic: -10, social: 5, civil: 30, governance: 30, trust: 20 },
    sources: baseEU,
  },
  {
    name: "Litouwen",
    countryCode: "LT",
    description:
      "Pragmatisch-Europees met sterke focus op verdediging en Atlantische samenwerking. Liberale economie en groeiende welvaart.",
    positionVector: { economic: 0, social: 5, civil: 30, governance: 30, trust: 25 },
    sources: baseEU,
  },
  {
    name: "Malta",
    countryCode: "MT",
    description:
      "Kleine eilandstaat met traditioneel rooms-katholieke wortels die snel moderniseert. Hoge mate van EU-betrokkenheid.",
    positionVector: { economic: 20, social: 30, civil: 20, governance: 50, trust: 30 },
    sources: baseEU,
  },
  {
    name: "Cyprus",
    countryCode: "CY",
    description:
      "Pragmatische coalities, gespleten politieke geschiedenis. EU-lid met financiële sector en focus op Middellandse Zee-veiligheid.",
    positionVector: { economic: 20, social: 0, civil: 20, governance: 30, trust: 10 },
    sources: baseEU,
  },
  {
    name: "Verenigde Staten",
    countryCode: "US",
    description:
      "Federale republiek met polarisatie tussen Democraten en Republikeinen. Sterke marktoriëntatie, hoge persvrijheid maar dalend institutioneel vertrouwen.",
    positionVector: { economic: -55, social: 0, civil: 25, governance: -45, trust: -10 },
    sources: [vdem, heritage, rsf, oecd],
  },
  {
    name: "Verenigd Koninkrijk",
    countryCode: "GB",
    description:
      "Sinds Brexit (2020) geheel buiten de EU. Onder Labour (2024) richting Europese herinrichting van betrekkingen. Sterke rechtsstaat-tradities.",
    positionVector: { economic: 20, social: 30, civil: 30, governance: -45, trust: 30 },
    sources: [vdem, heritage, rsf],
  },
  {
    name: "Canada",
    countryCode: "CA",
    description:
      "Federale parlementaire democratie met progressieve sociale agenda en open immigratiebeleid. Sterk multilateraal georiënteerd.",
    positionVector: { economic: 25, social: 60, civil: 50, governance: 50, trust: 55 },
    sources: [vdem, heritage, rsf, oecd],
  },
];
