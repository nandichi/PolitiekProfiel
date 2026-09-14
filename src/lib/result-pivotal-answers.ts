import type { DimensionId } from "@/lib/dimensions";
import {
  scoreFromParts,
  scoreParts,
  type DimensionScores,
  type QuestionScoringMeta,
  type RawAnswer,
} from "@/lib/scoring";

/**
 * "Wat als je hier anders had geantwoord?"
 *
 * Deze sectie rekent met dezelfde scoringsregel als het rapport zelf door wat
 * er gebeurt als één antwoord precies omdraait. Omdat `scoreParts` de ruwe
 * teller en noemer per as bewaart, is dat exact te berekenen in plaats van
 * geschat. Alleen antwoorden met een richting kunnen verschuiven; een
 * middenantwoord levert dus geen omkering op en valt af.
 */

export interface PivotalQuestionMeta extends QuestionScoringMeta {
  statement: string;
  theme?: string;
}

export interface PivotalAnswer {
  questionId: number;
  statement: string;
  dimension: DimensionId;
  /** Het antwoord dat de persoon gaf, -2 t/m +2. */
  value: number;
  weight: number;
  direction: 1 | -1;
  theme?: string;
  /** De score op deze as zoals die in het rapport staat. */
  currentScore: number;
  /** De score op deze as als dit ene antwoord precies omgekeerd was. */
  flippedScore: number;
  /** Hoeveel scorepunten dat scheelt op deze as. */
  impact: number;
}

export function derivePivotalAnswers({
  questions,
  answers,
  scores,
  limit,
}: {
  questions: ReadonlyArray<PivotalQuestionMeta>;
  answers: ReadonlyArray<RawAnswer>;
  scores: DimensionScores;
  limit: number;
}): PivotalAnswer[] {
  if (limit <= 0) return [];

  const byId = new Map<PivotalQuestionMeta["id"], PivotalQuestionMeta>();
  for (const question of questions) byId.set(question.id, question);

  const parts = scoreParts(questions, answers);
  const items: PivotalAnswer[] = [];

  for (const answer of answers) {
    if (answer.value === null || answer.value === 0) continue;
    const question = byId.get(answer.questionId);
    if (!question) continue;

    const weight = question.weight ?? 1;
    const currentScore = scores[question.dimension];

    // Het antwoord omdraaien verandert alleen de teller van deze as: de noemer
    // (`maxAbs`) telt elke beantwoorde stelling toch al mee.
    const flippedSums: DimensionScores = { ...parts.sums };
    flippedSums[question.dimension] =
      parts.sums[question.dimension] -
      2 * question.direction * answer.value * weight;

    const flippedScore = scoreFromParts({
      ...parts,
      sums: flippedSums,
    })[question.dimension];

    const impact = Math.abs(currentScore - flippedScore);
    if (impact === 0) continue;

    items.push({
      questionId: Number(question.id),
      statement: question.statement,
      dimension: question.dimension,
      value: answer.value,
      weight,
      direction: question.direction,
      theme: question.theme,
      currentScore,
      flippedScore,
      impact,
    });
  }

  return items.sort((a, b) => b.impact - a.impact).slice(0, limit);
}
