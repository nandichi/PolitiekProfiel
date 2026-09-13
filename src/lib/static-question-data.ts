import { getAllSeedQuestions } from "@/data/questions";
import { tagQuestion } from "@/data/question-tagger";

/**
 * New quiz attempts use versioned source questions, not an editable CMS copy.
 * Keep their identifiers in a separate range so older reports can still load
 * the Payload question IDs stored with their original answers.
 */
export const STATIC_QUESTION_ID_BASE = 900_000;
const STATIC_QUESTION_ID_LIMIT = 901_000;

export async function getStaticQuestions() {
  const questions = await getAllSeedQuestions();
  return questions.map((question, index) => {
    const tags = tagQuestion(question);
    return {
      ...question,
      id: STATIC_QUESTION_ID_BASE + index,
      depth: tags.depth,
      discriminator: tags.discriminator,
      themes: tags.themes,
    };
  });
}

export function isStaticQuestionId(id: number): boolean {
  return id >= STATIC_QUESTION_ID_BASE && id < STATIC_QUESTION_ID_LIMIT;
}

export async function getStaticQuestionById(id: number) {
  if (!isStaticQuestionId(id)) return undefined;
  const questions = await getStaticQuestions();
  return questions[id - STATIC_QUESTION_ID_BASE];
}
