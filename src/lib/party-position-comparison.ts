import {
  normalizeStatement,
  type PartyPosition,
  type PartyPositionSet,
  type PartyStance,
} from "@/data/party-positions";

export type ComparisonAnswerValue = -2 | -1 | 0 | 1 | 2;

export interface ComparisonQuestion {
  id: number;
  statement: string;
}

export interface ComparisonAnswer {
  questionId: number;
  value: ComparisonAnswerValue | null;
}

export interface PartyComparisonCatalogItem {
  slug: string;
  name: string;
  abbreviation: string;
  region: string;
  regionType: string;
  country?: string;
  description?: string;
  founded?: string;
  leader?: string;
  websiteUrl?: string;
}

export interface PartyComparisonEvidence {
  statement: string;
  userAnswer: ComparisonAnswerValue;
  userAnswerLabel: string;
  partyStance: PartyStance;
  partyStanceLabel: string;
  sourceUrl: string;
  basis: PartyPosition["basis"];
  quote?: string;
  note?: string;
  agreement: boolean;
}

export interface PartyComparison {
  partySlug: string;
  party: PartyComparisonCatalogItem;
  matchPercentage: number | null;
  matchingAnswers: number;
  consideredAnswers: number;
  noPositionAnswers: number;
  skippedUnanswered: number;
  basisCounts: Record<PartyPosition["basis"], number>;
  agreements: PartyComparisonEvidence[];
  differences: PartyComparisonEvidence[];
}

const STANCE_LABELS: Record<PartyStance, string> = {
  eens: "eens",
  oneens: "oneens",
  neutraal: "neutraal",
  "geen-standpunt": "geen publiek standpunt",
};

export function answerValueLabel(value: ComparisonAnswerValue): string {
  switch (value) {
    case -2:
      return "sterk oneens";
    case -1:
      return "oneens";
    case 0:
      return "neutraal / twijfel";
    case 1:
      return "eens";
    case 2:
      return "sterk eens";
  }
}

function stanceForAnswer(value: ComparisonAnswerValue): Exclude<PartyStance, "geen-standpunt"> {
  if (value > 0) return "eens";
  if (value < 0) return "oneens";
  return "neutraal";
}

function evidenceFor(
  position: PartyPosition,
  answer: ComparisonAnswerValue,
  agreement: boolean,
): PartyComparisonEvidence {
  return {
    statement: position.statement,
    userAnswer: answer,
    userAnswerLabel: answerValueLabel(answer),
    partyStance: position.stance,
    partyStanceLabel: STANCE_LABELS[position.stance],
    sourceUrl: position.sourceUrl,
    basis: position.basis,
    quote: position.quote,
    note: position.note,
    agreement,
  };
}

function evidencePriority(item: PartyComparisonEvidence): number {
  return Math.abs(item.userAnswer) * 10 + (item.basis === "beide" ? 2 : 0);
}

/**
 * Vergelijkt letterlijk beantwoorde stellingen met gecodeerde partijposities.
 *
 * Dit is bewust geen stemadvies of ideologische afstandsmaat: alleen vragen die
 * de gebruiker werkelijk beantwoordde en waar de partij een publiek standpunt
 * heeft, tellen mee. `geen-standpunt` blijft dus buiten de noemer.
 */
export function buildPartyComparisons({
  answers,
  questions,
  positionSets,
  parties,
  limit = 8,
}: {
  answers: ComparisonAnswer[];
  questions: ComparisonQuestion[];
  positionSets: PartyPositionSet[];
  parties: PartyComparisonCatalogItem[];
  limit?: number;
}): PartyComparison[] {
  const statementByQuestionId = new Map(
    questions.map((question) => [question.id, normalizeStatement(question.statement)]),
  );
  const answerByStatement = new Map<string, ComparisonAnswerValue>();
  for (const answer of answers) {
    if (answer.value === null) continue;
    const statement = statementByQuestionId.get(answer.questionId);
    if (statement) answerByStatement.set(statement, answer.value);
  }

  const partyBySlug = new Map(parties.map((party) => [party.slug, party]));
  const comparisons: PartyComparison[] = [];

  for (const set of positionSets) {
    const party = partyBySlug.get(set.partySlug);
    if (!party) continue;

    const agreements: PartyComparisonEvidence[] = [];
    const differences: PartyComparisonEvidence[] = [];
    let matchingAnswers = 0;
    let consideredAnswers = 0;
    let noPositionAnswers = 0;
    let skippedUnanswered = 0;
    const basisCounts: Record<PartyPosition["basis"], number> = {
      programma: 0,
      stemgedrag: 0,
      beide: 0,
    };

    for (const position of set.positions) {
      const answer = answerByStatement.get(normalizeStatement(position.statement));
      if (answer === undefined) {
        skippedUnanswered += 1;
        continue;
      }
      if (position.stance === "geen-standpunt") {
        noPositionAnswers += 1;
        continue;
      }

      consideredAnswers += 1;
      basisCounts[position.basis] += 1;
      const agreement = stanceForAnswer(answer) === position.stance;
      if (agreement) matchingAnswers += 1;
      const evidence = evidenceFor(position, answer, agreement);
      (agreement ? agreements : differences).push(evidence);
    }

    agreements.sort((a, b) => evidencePriority(b) - evidencePriority(a));
    differences.sort((a, b) => evidencePriority(b) - evidencePriority(a));

    comparisons.push({
      partySlug: set.partySlug,
      party,
      matchPercentage:
        consideredAnswers > 0
          ? Math.round((matchingAnswers / consideredAnswers) * 100)
          : null,
      matchingAnswers,
      consideredAnswers,
      noPositionAnswers,
      skippedUnanswered,
      basisCounts,
      agreements: agreements.slice(0, 4),
      differences: differences.slice(0, 4),
    });
  }

  comparisons.sort((a, b) => {
    if (a.matchPercentage === null && b.matchPercentage !== null) return 1;
    if (a.matchPercentage !== null && b.matchPercentage === null) return -1;
    if (a.matchPercentage !== b.matchPercentage) {
      return (b.matchPercentage ?? -1) - (a.matchPercentage ?? -1);
    }
    if (a.consideredAnswers !== b.consideredAnswers) {
      return b.consideredAnswers - a.consideredAnswers;
    }
    return a.party.name.localeCompare(b.party.name, "nl");
  });

  return comparisons.slice(0, Math.max(0, limit));
}
