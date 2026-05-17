import type { ThemeId } from "@/lib/themes";
import type { Tier } from "@/lib/dimensions";
import type { QuestionDepth, SeedQuestion } from "./questions";

interface ThemeRule {
  theme: ThemeId;
  patterns: RegExp[];
}

const THEME_RULES: ReadonlyArray<ThemeRule> = [
  {
    theme: "klimaat",
    patterns: [
      /klimaat/i,
      /stikstof/i,
      /milieu/i,
      /natuur/i,
      /co2|broeikas|energietransitie/i,
      /duurzaam/i,
      /landbouw/i,
      /vleesconsumptie|vlees/i,
    ],
  },
  {
    theme: "zorg",
    patterns: [
      /zorg(\b|verzeker|premie|stelsel|verleen|kosten)/i,
      /gezondheid/i,
      /eigen risico/i,
      /\bggz\b/i,
      /jeugdzorg/i,
      /ouderenzorg/i,
      /pati[eë]nt/i,
    ],
  },
  {
    theme: "migratie",
    patterns: [
      /asiel/i,
      /migrat/i,
      /vluchteling/i,
      /integrat/i,
      /\bind\b/i,
      /naturalisat/i,
      /immigrat/i,
      /grenzen.*controleren/i,
    ],
  },
  {
    theme: "economie",
    patterns: [
      /belasting/i,
      /inkomen|inkomens/i,
      /vermogen/i,
      /minimumloon|loon(\b|en)/i,
      /uitkering/i,
      /\bwinst/i,
      /vlaktaks/i,
      /economie|economisch/i,
      /werkgever|werknemer|werk(\b|gelegenheid)/i,
      /ontslag/i,
      /basisinkomen/i,
      /pensioen/i,
    ],
  },
  {
    theme: "eu",
    patterns: [
      /\bEU\b/,
      /europees|europa/i,
      /brussel/i,
      /supranationaal/i,
      /eurocommissar/i,
      /europese unie/i,
      /\bnavo\b|\bnato\b/i,
      /handelsverdrag/i,
    ],
  },
  {
    theme: "democratie",
    patterns: [
      /referendum/i,
      /grondwet/i,
      /rechtsstaat/i,
      /verkiezing/i,
      /kies(s|recht|stelsel)/i,
      /democrat/i,
      /tweede kamer|eerste kamer|parlement/i,
      /constitutionele toetsing/i,
      /minister-?president|kabinet/i,
      /(media|pers).*vrij/i,
      /wetenschap.*onafhankel/i,
      /rechter|rechtspraak/i,
    ],
  },
  {
    theme: "wonen",
    patterns: [
      /woning(\b|markt|nood|bouw)/i,
      /sociale huur/i,
      /\bhuur(\b|markt|prijs|der|woning|huizen)/i,
      /huizenmarkt|huizen/i,
      /verhuur/i,
      /starters?(woning|leen)/i,
      /hypotheek/i,
      /box 3/i,
      /\bwoz\b/i,
    ],
  },
];

export function deriveThemes(question: SeedQuestion): ThemeId[] {
  const haystack = [
    question.statement,
    question.info.context,
    ...question.info.argumentsFor,
    ...question.info.argumentsAgainst,
  ]
    .filter(Boolean)
    .join(" ");
  const matches = new Set<ThemeId>();
  for (const rule of THEME_RULES) {
    if (rule.patterns.some((p) => p.test(haystack))) {
      matches.add(rule.theme);
    }
  }
  return Array.from(matches);
}

export function deriveDepth(tiers: Tier[]): QuestionDepth {
  if (tiers.includes("quick")) return "broad";
  if (tiers.length === 1 && tiers[0] === "extended") return "deep";
  if (tiers.includes("standard") && !tiers.includes("quick")) return "deep";
  return "broad";
}

export function deriveDiscriminator(tiers: Tier[], weight: number): number {
  let base: number;
  if (tiers.includes("quick")) base = 75;
  else if (tiers.includes("standard")) base = 55;
  else base = 40;
  const weightAdjust = Math.round((weight - 1) * 10);
  return Math.max(10, Math.min(100, base + weightAdjust));
}

export function tagQuestion(
  question: SeedQuestion,
): {
  themes: ThemeId[];
  depth: QuestionDepth;
  discriminator: number;
} {
  return {
    themes: question.themes ?? deriveThemes(question),
    depth: question.depth ?? deriveDepth(question.tiers),
    discriminator:
      question.discriminator ??
      deriveDiscriminator(question.tiers, question.weight ?? 1),
  };
}
