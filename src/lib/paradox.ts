import type { DimensionId } from "@/lib/dimensions";
import type { ThemeId } from "@/lib/themes";
import type { QuestionScoringMeta, RawAnswer } from "@/lib/scoring";

export type ParadoxType =
  | "economic-mismatch"
  | "civil-mismatch"
  | "social-mismatch"
  | "governance-mismatch"
  | "trust-mismatch"
  | "klimaat-economie"
  | "migratie-economie"
  | "democratie-trust";

export interface ParadoxSignal {
  type: ParadoxType;
  dimension?: DimensionId;
  theme?: ThemeId;
  severity: number;
  exampleQuestionIds: Array<QuestionScoringMeta["id"]>;
  description: string;
}

interface AnsweredQ {
  q: QuestionScoringMeta;
  signedValue: number;
  rawValue: number;
}

function gatherAnswered(
  questions: ReadonlyArray<QuestionScoringMeta>,
  answers: ReadonlyArray<RawAnswer>,
): AnsweredQ[] {
  const byId = new Map<QuestionScoringMeta["id"], QuestionScoringMeta>();
  for (const q of questions) byId.set(q.id, q);
  const out: AnsweredQ[] = [];
  for (const a of answers) {
    const q = byId.get(a.questionId);
    if (!q) continue;
    if (a.value === null) continue;
    out.push({
      q,
      signedValue: q.direction * a.value,
      rawValue: a.value,
    });
  }
  return out;
}

function detectDimensionMismatch(
  answered: AnsweredQ[],
  dimension: DimensionId,
): ParadoxSignal | null {
  const inDim = answered.filter((a) => a.q.dimension === dimension);
  if (inDim.length < 3) return null;

  const positives = inDim.filter((a) => a.signedValue >= 1);
  const negatives = inDim.filter((a) => a.signedValue <= -1);
  if (positives.length === 0 || negatives.length === 0) return null;

  const strongPositive = positives
    .filter((a) => Math.abs(a.signedValue) >= 2)
    .sort((a, b) => Math.abs(b.signedValue) - Math.abs(a.signedValue));
  const strongNegative = negatives
    .filter((a) => Math.abs(a.signedValue) >= 2)
    .sort((a, b) => Math.abs(b.signedValue) - Math.abs(a.signedValue));

  if (strongPositive.length === 0 || strongNegative.length === 0) return null;

  const severity = Math.round(
    Math.min(
      100,
      (Math.min(strongPositive.length, strongNegative.length) /
        Math.max(1, inDim.length)) *
        100 +
        20,
    ),
  );

  const type = `${dimension}-mismatch` as ParadoxType;

  return {
    type,
    dimension,
    severity,
    exampleQuestionIds: [
      strongPositive[0].q.id,
      strongNegative[0].q.id,
    ],
    description: paradoxDescription(type),
  };
}

function detectCrossThemeMismatch(
  answered: AnsweredQ[],
): ParadoxSignal[] {
  const out: ParadoxSignal[] = [];

  const klimaatStrong = answered
    .filter((a) => a.q.themes?.includes("klimaat") && Math.abs(a.signedValue) >= 2)
    .sort((a, b) => Math.abs(b.signedValue) - Math.abs(a.signedValue));
  const economieStrong = answered
    .filter(
      (a) => a.q.themes?.includes("economie") && Math.abs(a.signedValue) >= 2,
    )
    .sort((a, b) => Math.abs(b.signedValue) - Math.abs(a.signedValue));

  if (klimaatStrong.length > 0 && economieStrong.length > 0) {
    const klimaatPositive = klimaatStrong.find((a) => a.signedValue >= 2);
    const economieNegative = economieStrong.find((a) => a.signedValue <= -2);
    if (klimaatPositive && economieNegative) {
      out.push({
        type: "klimaat-economie",
        theme: "klimaat",
        severity: 60,
        exampleQuestionIds: [klimaatPositive.q.id, economieNegative.q.id],
        description: paradoxDescription("klimaat-economie"),
      });
    }
  }

  const migratiePos = answered.find(
    (a) =>
      a.q.themes?.includes("migratie") &&
      a.signedValue >= 2 &&
      a.q.dimension === "social",
  );
  const migratieNeg = answered.find(
    (a) =>
      a.q.themes?.includes("migratie") &&
      a.signedValue <= -2 &&
      a.q.dimension === "social",
  );
  if (migratiePos && migratieNeg) {
    out.push({
      type: "migratie-economie",
      theme: "migratie",
      severity: 55,
      exampleQuestionIds: [migratiePos.q.id, migratieNeg.q.id],
      description: paradoxDescription("migratie-economie"),
    });
  }

  const trustNeg = answered.find(
    (a) => a.q.dimension === "trust" && a.signedValue <= -2,
  );
  const democratiePos = answered.find(
    (a) =>
      a.q.themes?.includes("democratie") &&
      a.signedValue >= 2 &&
      a.q.dimension !== "trust",
  );
  if (trustNeg && democratiePos) {
    out.push({
      type: "democratie-trust",
      theme: "democratie",
      severity: 50,
      exampleQuestionIds: [trustNeg.q.id, democratiePos.q.id],
      description: paradoxDescription("democratie-trust"),
    });
  }

  return out;
}

export function paradoxDescription(type: ParadoxType): string {
  switch (type) {
    case "economic-mismatch":
      return "Op economisch beleid combineer je een sterke voorkeur voor publieke uitgaven of bescherming met een even sterke voorkeur voor marktwerking en lagere lasten.";
    case "civil-mismatch":
      return "Op burgerrechten wil je zowel maximale individuele vrijheid als sterke ordehandhaving of veiligheidsmaatregelen.";
    case "social-mismatch":
      return "Op cultureel-sociaal vlak combineer je sterke openheid op het ene punt met sterke behoudendheid op het andere.";
    case "governance-mismatch":
      return "Op bestuur wil je tegelijk macht naar Europa/onafhankelijk én scherp behoud van nationale soevereiniteit.";
    case "trust-mismatch":
      return "Je laat zowel sterk vertrouwen als sterk wantrouwen in instituties zien, afhankelijk van wélke instelling het betreft.";
    case "klimaat-economie":
      return "Je hecht aan ambitieus klimaatbeleid, maar wil tegelijk lasten of regelgeving voor de economie zoveel mogelijk beperken.";
    case "migratie-economie":
      return "Je houding op migratie wijst in twee verschillende richtingen: open op het ene aspect, restrictief op het andere.";
    case "democratie-trust":
      return "Je wilt sterke democratische instituties, maar wantrouwt het huidige bestel tegelijk diep.";
  }
}

export function paradoxTitle(type: ParadoxType): string {
  switch (type) {
    case "economic-mismatch":
      return "Spanning binnen je economische opvattingen";
    case "civil-mismatch":
      return "Spanning tussen vrijheid en veiligheid";
    case "social-mismatch":
      return "Spanning in je sociaal-culturele opvattingen";
    case "governance-mismatch":
      return "Spanning tussen Europa en Nederland";
    case "trust-mismatch":
      return "Selectief vertrouwen in instituties";
    case "klimaat-economie":
      return "Klimaat ambitieus, lasten laag";
    case "migratie-economie":
      return "Migratie in twee richtingen";
    case "democratie-trust":
      return "Sterke democratie, diep wantrouwen";
  }
}

export function detectParadoxes(
  questions: ReadonlyArray<QuestionScoringMeta>,
  answers: ReadonlyArray<RawAnswer>,
): ParadoxSignal[] {
  const answered = gatherAnswered(questions, answers);
  const dims: DimensionId[] = [
    "economic",
    "social",
    "civil",
    "governance",
    "trust",
  ];
  const out: ParadoxSignal[] = [];
  for (const dim of dims) {
    const signal = detectDimensionMismatch(answered, dim);
    if (signal) out.push(signal);
  }
  out.push(...detectCrossThemeMismatch(answered));
  out.sort((a, b) => b.severity - a.severity);
  return out;
}

export const ALL_PARADOX_TYPES: ParadoxType[] = [
  "economic-mismatch",
  "social-mismatch",
  "civil-mismatch",
  "governance-mismatch",
  "trust-mismatch",
  "klimaat-economie",
  "migratie-economie",
  "democratie-trust",
];
