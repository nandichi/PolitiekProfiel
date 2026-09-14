import { getStaticQuestions } from "@/lib/static-question-data";

export interface AnswerAtlasInput {
  questionId: number;
  question: string;
  explanation: string;
  theme: string;
  value: -2 | -1 | 0 | 1 | 2;
  sourceUrl?: string;
}

export interface AnswerAtlasEntry extends AnswerAtlasInput {
  answerLabel: string;
}

export interface AnswerAtlasSection {
  theme: string;
  entries: AnswerAtlasEntry[];
}

const ANSWER_LABELS: Record<AnswerAtlasInput["value"], string> = {
  "-2": "Helemaal oneens",
  "-1": "Oneens",
  "0": "Geen duidelijke richting",
  "1": "Eens",
  "2": "Helemaal eens",
};

export function buildAnswerAtlas(
  answers: AnswerAtlasInput[],
  themeOrder: string[],
  entriesPerTheme: number,
): AnswerAtlasSection[] {
  const grouped = new Map<string, AnswerAtlasInput[]>();

  for (const answer of answers) {
    const current = grouped.get(answer.theme) ?? [];
    current.push(answer);
    grouped.set(answer.theme, current);
  }

  return themeOrder.flatMap((theme) => {
    const entries = grouped.get(theme);
    if (!entries?.length) return [];

    const selected = [...entries]
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value) || a.questionId - b.questionId)
      .slice(0, entriesPerTheme)
      .map((entry) => ({
        ...entry,
        answerLabel: ANSWER_LABELS[entry.value],
      }));

    return [{ theme, entries: selected }];
  });
}

export interface StoredQuizAnswer {
  questionId: number;
  value: number | null;
}

function isAnswerValue(value: number | null): value is AnswerAtlasInput["value"] {
  return value === -2 || value === -1 || value === 0 || value === 1 || value === 2;
}

export async function deriveAnswerAtlas(
  answers: StoredQuizAnswer[],
  themeOrder: string[],
  entriesPerTheme: number,
): Promise<AnswerAtlasSection[]> {
  const questions = await getStaticQuestions();
  const byId = new Map(questions.map((question) => [question.id, question]));
  const themeSet = new Set(themeOrder);

  const evidence = answers.flatMap((answer): AnswerAtlasInput[] => {
    if (!isAnswerValue(answer.value)) return [];
    const question = byId.get(answer.questionId);
    if (!question) return [];

    const theme = question.themes.find((candidate) => themeSet.has(candidate));
    if (!theme) return [];

    return [{
      questionId: question.id,
      question: question.statement,
      explanation: question.info.context,
      theme,
      value: answer.value,
      sourceUrl: question.info.sources[0]?.url,
    }];
  });

  return buildAnswerAtlas(evidence, themeOrder, entriesPerTheme);
}
