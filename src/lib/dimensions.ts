export type DimensionId =
  | "economic"
  | "social"
  | "civil"
  | "governance"
  | "trust";

export type Tier = "quick" | "standard" | "extended";

export type AnswerValue = -2 | -1 | 0 | 1 | 2;

export interface DimensionMeta {
  id: DimensionId;
  label: string;
  shortLabel: string;
  description: string;
  poleNegative: { label: string; description: string };
  polePositive: { label: string; description: string };
}

export const DIMENSIONS: ReadonlyArray<DimensionMeta> = [
  {
    id: "economic",
    label: "Economisch",
    shortLabel: "Economie",
    description:
      "Hoe sterk moet de overheid ingrijpen in de economie via belasting, regulering en sociale zekerheid?",
    poleNegative: {
      label: "Vrije markt",
      description:
        "Lage belastingen, weinig regulering, terughoudende overheid, eigen verantwoordelijkheid.",
    },
    polePositive: {
      label: "Sterke staat",
      description:
        "Herverdeling, publieke voorzieningen, regulering van markten, sociale zekerheid.",
    },
  },
  {
    id: "social",
    label: "Sociaal-cultureel",
    shortLabel: "Cultureel",
    description:
      "Hoe verhouden traditie, identiteit en gelijkheid zich tot openheid, diversiteit en culturele verandering?",
    poleNegative: {
      label: "Conservatief",
      description:
        "Behoud van tradities, nationale identiteit, terughoudendheid t.o.v. snelle culturele verandering.",
    },
    polePositive: {
      label: "Progressief",
      description:
        "Gelijke rechten, openheid voor diversiteit, ruimte voor culturele en maatschappelijke vernieuwing.",
    },
  },
  {
    id: "civil",
    label: "Burgerrechten",
    shortLabel: "Vrijheid",
    description:
      "Hoeveel ruimte krijgt het individu tegenover de behoefte aan veiligheid en orde?",
    poleNegative: {
      label: "Autoritair",
      description:
        "Sterke overheidsbevoegdheden voor veiligheid, surveillance en ordehandhaving.",
    },
    polePositive: {
      label: "Libertair",
      description:
        "Maximale individuele vrijheid, privacy en bescherming tegen overheidsingrijpen.",
    },
  },
  {
    id: "governance",
    label: "Bestuur",
    shortLabel: "Bestuur",
    description:
      "Waar moet macht liggen: bij de natiestaat, bij Europa, of juist bij gemeentes en burgers?",
    poleNegative: {
      label: "Nationaal-soeverein",
      description:
        "Macht bij de natiestaat, terughoudend t.o.v. supranationale instituties zoals de EU.",
    },
    polePositive: {
      label: "Multilevel/EU",
      description:
        "Sterkere Europese samenwerking, of juist meer macht naar regio's, gemeentes en burgers.",
    },
  },
  {
    id: "trust",
    label: "Systeemvertrouwen",
    shortLabel: "Vertrouwen",
    description:
      "In hoeverre vertrouw je publieke instituties zoals media, rechtspraak, wetenschap en overheid?",
    poleNegative: {
      label: "Wantrouwen",
      description:
        "Kritisch tot wantrouwend tegenover gevestigde instituties; vraagt fundamentele hervorming.",
    },
    polePositive: {
      label: "Vertrouwen",
      description:
        "Vertrouwen in instituties als media, rechtspraak, wetenschap en democratie.",
    },
  },
];

export const DIMENSION_IDS = DIMENSIONS.map((d) => d.id) as DimensionId[];

export function dimensionMeta(id: DimensionId): DimensionMeta {
  const meta = DIMENSIONS.find((d) => d.id === id);
  if (!meta) {
    throw new Error(`Unknown dimension id: ${id}`);
  }
  return meta;
}

export const TIER_QUESTION_COUNT: Record<Tier, number> = {
  quick: 15,
  standard: 50,
  extended: 80,
};

export const TIER_PER_DIMENSION: Record<Tier, number> = {
  quick: 3,
  standard: 10,
  extended: 16,
};
