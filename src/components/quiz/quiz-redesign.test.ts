import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PaidQuizGate } from "./PaidQuizGate";
import { QuizProgress } from "./QuizProgress";
import { QuizSegmentBar } from "./QuizSegmentBar";

describe("quiz answer choices", () => {
  it("renders five fully labelled 44px answer targets with visible keyboard focus", () => {
    const html = renderToStaticMarkup(
      createElement(QuizSegmentBar, {
        selected: undefined,
        onChange: () => undefined,
      }),
    );

    for (const label of [
      "Helemaal oneens",
      "Oneens",
      "Neutraal",
      "Eens",
      "Helemaal eens",
    ]) {
      expect(html).toContain(label);
    }

    const choices = html.match(/<button\b[^>]*role="radio"[^>]*>/g) ?? [];
    expect(choices).toHaveLength(5);
    for (const choice of choices) {
      expect(choice).toContain("min-h-11");
      expect(choice).toContain("focus-visible:");
    }
  });
});

describe("quiz progress", () => {
  it("shows one primary bar and the plain Vraag N van M label", () => {
    const html = renderToStaticMarkup(
      createElement(QuizProgress, { current: 7, total: 50 }),
    );

    expect(html).toContain("Vraag 7 van 50");
    expect(html.match(/role="progressbar"/g) ?? []).toHaveLength(1);
    expect(html).toContain('aria-valuenow="7"');
    expect(html).toContain('aria-valuemax="50"');
    expect(html).not.toMatch(/Economie|Cultureel|Vrijheid|Bestuur|Vertrouwen/);
  });
});

describe("active quiz shell", () => {
  it("keeps the behavior contracts while using the three-rail quiz layout", () => {
    const engine = readFileSync(
      path.join(process.cwd(), "src", "components", "QuizEngine.tsx"),
      "utf8",
    );

    for (const contract of [
      "politiekprofiel-quiz-${tier}",
      'fetch("/api/quiz/next"',
      'fetch("/api/results"',
      "setTimeout(",
      "reduce ? 0 : 220",
    ]) {
      expect(engine).toContain(contract);
    }

    expect(engine).toContain("data-active-quiz");
    expect(engine).toContain("Hulp en privacy");
    expect(engine).toContain("lg:grid-cols-");
    expect(engine).toContain("<QuizProgress");
    expect(engine).not.toContain("QuizProgressDots");
    expect(engine).not.toContain("json.error");
    expect(engine).not.toContain("status ${res.status}");
    expect(engine).toContain("Je profiel kon niet worden aangemaakt. Probeer het opnieuw.");
  });
});

describe("quiz information drawer", () => {
  it("uses direct reduced-motion states and 44px focused controls", () => {
    const drawer = readFileSync(
      path.join(
        process.cwd(),
        "src",
        "components",
        "quiz",
        "InfoDrawer.tsx",
      ),
      "utf8",
    );

    expect(drawer).toContain("useReducedMotion");
    expect(drawer).toMatch(/(?:min-h-11|h-11)/);
    expect(drawer).toContain("focus-visible:");
    expect(drawer).not.toContain("display-italic");
  });
});

describe("paid quiz gate", () => {
  it("states the complete Standard purchase contract before checkout", () => {
    const html = renderToStaticMarkup(
      createElement(PaidQuizGate, {
        tier: "standard",
        entitlementStatus: "missing",
      }),
    );

    for (const copy of [
      "€ 5",
      "10 minuten",
      "50 stellingen",
      "Je ontvangt",
      "vijf onafhankelijke dimensies",
      "Geen abonnement",
      "Geen account",
      "Na betaling stuurt Stripe je terug naar deze pagina",
    ]) {
      expect(html).toContain(copy);
    }
    expect(html).not.toMatch(/[—–]/);
  });

  it("is the gate used by the paid quiz route", () => {
    const route = readFileSync(
      path.join(
        process.cwd(),
        "src",
        "app",
        "(frontend)",
        "quiz",
        "[tier]",
        "page.tsx",
      ),
      "utf8",
    );

    expect(route).toContain('@/components/quiz/PaidQuizGate');
    expect(route).not.toContain("function PaidQuizGate(");
  });
});
