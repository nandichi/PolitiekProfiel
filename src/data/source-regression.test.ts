import { describe, expect, it } from "vitest";
import { getAllSeedQuestions } from "@/data/questions";
import { TURING_QUOTES } from "@/data/turing-quotes";

const RETIRED_URLS = new Set([
  "https://nvir.nl/",
  "https://www.ja21.nl/verkiezingsprogramma",
  "https://voltnederland.org/programma",
]);

describe("corrected public source destinations", () => {
  it("does not reintroduce retired audit destinations", async () => {
    const questionUrls = (await getAllSeedQuestions()).flatMap((question) =>
      question.info?.sources?.map((source) => source.url) ?? [],
    );
    const urls = [...questionUrls, ...TURING_QUOTES.map((quote) => quote.source.url)];
    expect(urls.filter((url) => RETIRED_URLS.has(url))).toEqual([]);
  });
});
