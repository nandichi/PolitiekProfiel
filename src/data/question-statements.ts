import { QUESTIONS } from "./questions";
import { THEMED_QUESTIONS } from "./questions-themes";

/**
 * Alle stellingen uit de vragenbank, als platte lijst.
 *
 * Wordt gebruikt om te controleren of elke gecodeerde partijstandpunt-codering
 * echt aan een bestaande stelling hangt. Zo kan er geen codering in de dataset
 * sluipen die nergens bij hoort.
 */
export const ALL_QUESTION_STATEMENTS: string[] = [
  ...QUESTIONS.map((question) => question.statement),
  ...THEMED_QUESTIONS.map((question) => question.statement),
];
