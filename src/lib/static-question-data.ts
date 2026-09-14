import { getAllSeedQuestions } from "@/data/questions";
import { tagQuestion } from "@/data/question-tagger";

/**
 * Current seed questions get a deterministic ID derived from their statement,
 * so reordering the source array cannot silently remap a stored answer.
 */
export const STATIC_QUESTION_ID_BASE = 1_000_000_000;
const STATIC_QUESTION_ID_MAX = STATIC_QUESTION_ID_BASE + 0x1_0000_0000;

/** Positional IDs remain resolvable for reports created before 14 Sep 2026. */
export const LEGACY_STATIC_QUESTION_ID_BASE = 900_000;
const LEGACY_STATIC_QUESTION_ID_LIMIT = 901_000;

function normalizedStatement(statement: string): string {
  return statement
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function stableQuestionId(statement: string): number {
  const input = normalizedStatement(statement);
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return STATIC_QUESTION_ID_BASE + (hash >>> 0) + 1;
}

export async function getStaticQuestions() {
  const questions = await getAllSeedQuestions();
  const tagged = questions.map((question) => {
    const tags = tagQuestion(question);
    return {
      ...question,
      id: stableQuestionId(question.statement),
      depth: tags.depth,
      discriminator: tags.discriminator,
      themes: tags.themes,
    };
  });

  if (new Set(tagged.map((question) => question.id)).size !== tagged.length) {
    throw new Error("Collision in deterministic static question IDs.");
  }
  return tagged;
}

export function isStaticQuestionId(id: number): boolean {
  return (
    (id >= LEGACY_STATIC_QUESTION_ID_BASE && id < LEGACY_STATIC_QUESTION_ID_LIMIT) ||
    (id > STATIC_QUESTION_ID_BASE && id <= STATIC_QUESTION_ID_MAX)
  );
}

export async function getStaticQuestionById(id: number) {
  const questions = await getStaticQuestions();
  if (id >= LEGACY_STATIC_QUESTION_ID_BASE && id < LEGACY_STATIC_QUESTION_ID_LIMIT) {
    return questions[id - LEGACY_STATIC_QUESTION_ID_BASE];
  }
  return questions.find((question) => question.id === id);
}
