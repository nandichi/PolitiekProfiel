export type ThemeId =
  | "klimaat"
  | "zorg"
  | "migratie"
  | "economie"
  | "eu"
  | "democratie"
  | "wonen";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  shortLabel: string;
  description: string;
  poleNegative: { label: string; description: string };
  polePositive: { label: string; description: string };
}

export const THEMES: ReadonlyArray<ThemeMeta> = [
  {
    id: "klimaat",
    label: "Klimaat & milieu",
    shortLabel: "Klimaat",
    description:
      "Hoe ver moet beleid gaan om klimaatverandering tegen te gaan en natuur te beschermen?",
    poleNegative: {
      label: "Behoudend",
      description:
        "Voorzichtig met ingrijpende klimaatmaatregelen; economische lasten en haalbaarheid wegen zwaar.",
    },
    polePositive: {
      label: "Ambitieus",
      description:
        "Sterk klimaatbeleid, vergroening en bescherming van natuur staan voorop, ook als dat pijn doet.",
    },
  },
  {
    id: "zorg",
    label: "Zorg & welzijn",
    shortLabel: "Zorg",
    description:
      "Hoeveel publieke verantwoordelijkheid hoort er bij gezondheidszorg en sociale voorzieningen?",
    poleNegative: {
      label: "Markt & eigen kracht",
      description:
        "Meer ruimte voor marktwerking, keuzevrijheid en eigen verantwoordelijkheid in de zorg.",
    },
    polePositive: {
      label: "Publieke zorg",
      description:
        "Zorg en welzijn als publieke verantwoordelijkheid, met sterke collectieve voorzieningen.",
    },
  },
  {
    id: "migratie",
    label: "Migratie & integratie",
    shortLabel: "Migratie",
    description:
      "Welke houding past bij migratie, asielbeleid en de inrichting van een diverse samenleving?",
    poleNegative: {
      label: "Restrictief",
      description:
        "Strenger asielbeleid, beperking van migratie en nadruk op aanpassing.",
    },
    polePositive: {
      label: "Open",
      description:
        "Ruimer toelatingsbeleid, internationale solidariteit en ruimte voor culturele diversiteit.",
    },
  },
  {
    id: "economie",
    label: "Economie & belastingen",
    shortLabel: "Economie",
    description:
      "Hoe zit het met belastingdruk, herverdeling en de rol van overheid en markt in de economie?",
    poleNegative: {
      label: "Lasten omlaag",
      description:
        "Lagere belastingen, minder regulering, ruimte voor ondernemers en de markt.",
    },
    polePositive: {
      label: "Herverdelen",
      description:
        "Sterkere herverdeling, hogere belastingen voor vermogenden en publieke investeringen.",
    },
  },
  {
    id: "eu",
    label: "EU & internationaal",
    shortLabel: "EU",
    description:
      "Hoe moet Nederland zich verhouden tot de Europese Unie en internationale samenwerking?",
    poleNegative: {
      label: "Soeverein",
      description:
        "Nationale soevereiniteit voorop, terughoudend met overdracht van bevoegdheden.",
    },
    polePositive: {
      label: "Geïntegreerd",
      description:
        "Sterkere EU-samenwerking en internationale verbondenheid, ook in beleid.",
    },
  },
  {
    id: "democratie",
    label: "Democratie & instituties",
    shortLabel: "Democratie",
    description:
      "Hoeveel vertrouwen verdient het huidige bestel, en hoe ver moet democratische vernieuwing gaan?",
    poleNegative: {
      label: "Vernieuwen",
      description:
        "Het bestel heeft fundamentele verandering nodig; directere zeggenschap, kritiek op gevestigde instituties.",
    },
    polePositive: {
      label: "Versterken",
      description:
        "Vertrouwen in rechtsstaat en instituties, voorzichtig met grote ingrepen in het bestel.",
    },
  },
  {
    id: "wonen",
    label: "Wonen & ruimte",
    shortLabel: "Wonen",
    description:
      "Hoe pakken we de woningnood aan, en wie krijgt voorrang op de Nederlandse woningmarkt?",
    poleNegative: {
      label: "Markt & bouwen",
      description:
        "Vooral via de markt en versnelde nieuwbouw oplossen; ruimte voor ontwikkelaars en eigenaren.",
    },
    polePositive: {
      label: "Publiek sturen",
      description:
        "Sterkere overheidssturing: publieke bouw, huurregulering en bescherming van starters en huurders.",
    },
  },
] as const;

export const THEME_IDS = THEMES.map((t) => t.id) as ThemeId[];

export function themeMeta(id: ThemeId): ThemeMeta {
  const meta = THEMES.find((t) => t.id === id);
  if (!meta) {
    throw new Error(`Unknown theme id: ${id}`);
  }
  return meta;
}

export type ThemeScores = Record<ThemeId, number>;

export function emptyThemeScores(): ThemeScores {
  return {
    klimaat: 0,
    zorg: 0,
    migratie: 0,
    economie: 0,
    eu: 0,
    democratie: 0,
    wonen: 0,
  };
}

import type { QuestionScoringMeta, RawAnswer } from "@/lib/scoring";

export interface ThemeBreakdown {
  scores: ThemeScores;
  answeredPerTheme: Record<ThemeId, number>;
}

export function calculateThemeScores(
  questions: ReadonlyArray<QuestionScoringMeta>,
  answers: ReadonlyArray<RawAnswer>,
): ThemeBreakdown {
  const byId = new Map<QuestionScoringMeta["id"], QuestionScoringMeta>();
  for (const q of questions) {
    byId.set(q.id, q);
  }

  const sums = emptyThemeScores();
  const maxAbs = emptyThemeScores();
  const counts: Record<ThemeId, number> = emptyThemeScores();

  for (const answer of answers) {
    const q = byId.get(answer.questionId);
    if (!q || !q.themes || q.themes.length === 0) continue;
    if (answer.value === null) continue;
    const weight = q.weight ?? 1;
    for (const theme of q.themes) {
      maxAbs[theme] += 2 * weight;
      if (answer.value !== 0) {
        sums[theme] += q.direction * answer.value * weight;
      }
      counts[theme] += 1;
    }
  }

  const scores = emptyThemeScores();
  for (const theme of THEME_IDS) {
    if (maxAbs[theme] === 0) {
      scores[theme] = 0;
    } else {
      const normalized = (sums[theme] / maxAbs[theme]) * 100;
      scores[theme] = Math.max(-100, Math.min(100, Math.round(normalized)));
    }
  }

  return { scores, answeredPerTheme: counts };
}
