import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Payload data minimisation", () => {
  it("does not register behavioural quiz tracking collections", () => {
    const config = fs.readFileSync(
      path.join(process.cwd(), "src", "payload.config.ts"),
      "utf8",
    );

    expect(config).not.toContain("QuizAttempts");
    expect(config).not.toContain("QuizEvents");
  });

  it("does not create an attempt-tracking record when a result is saved", () => {
    const resultsStore = fs.readFileSync(
      path.join(process.cwd(), "src", "lib", "results-store.ts"),
      "utf8",
    );

    expect(resultsStore).not.toContain("markAttemptSubmitted");
    expect(resultsStore).not.toContain("attemptId");
  });

  it("does not send a browser attempt identifier with quiz results", () => {
    const quizEngine = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "QuizEngine.tsx"),
      "utf8",
    );

    expect(quizEngine).not.toContain("attemptId");
    expect(quizEngine).not.toContain("useTracking");
  });

  it("makes party-position sources directly clickable", () => {
    const partyPage = fs.readFileSync(
      path.join(process.cwd(), "src", "app", "(frontend)", "partij", "[slug]", "page.tsx"),
      "utf8",
    );

    expect(partyPage).toContain("href={s.url}");
  });

  it("makes country-position sources directly clickable", () => {
    const countryPage = fs.readFileSync(
      path.join(process.cwd(), "src", "app", "(frontend)", "land", "[iso2]", "page.tsx"),
      "utf8",
    );

    expect(countryPage).toContain("href={s.url}");
  });
});
