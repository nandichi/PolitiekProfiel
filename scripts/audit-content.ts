import { getAllSeedQuestions } from "../src/data/questions";
import { PARTIES } from "../src/data/parties";
import { POLITICIANS } from "../src/data/politicians";
import { COUNTRIES } from "../src/data/countries";
import { IDEOLOGIES } from "../src/data/ideologies";
import { GLOSSARY } from "../src/data/woordenboek";
import { TURING_QUOTES } from "../src/data/turing-quotes";
import type { Tier } from "../src/lib/dimensions";

const TIERS: Tier[] = ["quick", "standard", "extended"];

type DatedQuestion = {
  id: number;
  statement: string;
  dates: string[];
  context: string;
};

async function main() {
  const questions = await getAllSeedQuestions();
  const dated: DatedQuestion[] = questions.flatMap((question, index) => {
    const dates = [
      ...question.statement.matchAll(/\b(?:19|20)\d{2}\b/g),
      ...question.info.context.matchAll(/\b(?:19|20)\d{2}\b/g),
    ].map((match) => match[0]);

    return dates.length
      ? [{ id: index + 1, statement: question.statement, dates, context: question.info.context }]
      : [];
  });

  const dimensions = [...new Set(questions.map((question) => question.dimension))];
  const duplicateStatements = [...new Set(
    questions
      .map((question) => question.statement)
      .filter((statement, index, all) => all.indexOf(statement) !== index),
  )];

  const report = {
    generatedAt: new Date().toISOString(),
    totals: {
      questions: questions.length,
      parties: PARTIES.length,
      politicians: POLITICIANS.length,
      countries: COUNTRIES.length,
      ideologies: IDEOLOGIES.length,
      glossary: GLOSSARY.length,
      turingQuotes: TURING_QUOTES.length,
    },
    questions: {
      noSources: questions.filter((question) => question.info.sources.length === 0).map((question) => question.statement),
      noArguments: questions
        .filter((question) => question.info.argumentsFor.length === 0 || question.info.argumentsAgainst.length === 0)
        .map((question) => question.statement),
      noDerivedStance: questions.filter((question) => !question.derivedStance).map((question) => question.statement),
      tierCounts: Object.fromEntries(TIERS.map((tier) => [tier, questions.filter((question) => question.tiers.includes(tier)).length])),
      dimensionDirectionCounts: Object.fromEntries(
        dimensions.map((dimension) => [
          dimension,
          Object.fromEntries(
            ["positive", "negative"].map((direction) => [
              direction,
              questions.filter((question) => question.dimension === dimension && question.direction === direction).length,
            ]),
          ),
        ]),
      ),
      duplicateStatements,
      dated,
    },
    sources: [...new Set(questions.flatMap((question) => question.info.sources.map((source) => source.url)))].sort(),
  };

  console.log(JSON.stringify(report, null, 2));
}

void main();
