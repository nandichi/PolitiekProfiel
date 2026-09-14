import { NextResponse } from "next/server";
import { payload } from "@/lib/payload";
import { calculateScores, bestMatch, type QuestionScoringMeta } from "@/lib/scoring";
import { calculateThemeScores } from "@/lib/themes";
import { calculateConfidence } from "@/lib/confidence";
import { detectParadoxes } from "@/lib/paradox";
import { createResult, getResult } from "@/lib/results-store";
import { TIER_QUESTION_COUNT, type AnswerValue, type Tier } from "@/lib/dimensions";
import {
  normalizeEntitlementToken,
  registerPaidAttempt,
  validateEntitlementForTier,
} from "@/lib/entitlements";
import { isPaidTier } from "@/lib/stripe";
import { validateSubmittedAnswers } from "@/lib/result-answer-validation";
import { MINIMUM_RESULT_ANSWERS } from "@/lib/quiz-completion";
import { getAllIdeologiesSeed } from "@/lib/seed-readers";
import { getStaticQuestionById, isStaticQuestionId } from "@/lib/static-question-data";
import { isSubmissionId } from "@/lib/attempt-reservation";
import type { ThemeId } from "@/lib/themes";

interface Body {
  tier?: Tier;
  answers?: Array<{ questionId: number; value: AnswerValue | null }>;
  entitlementToken?: string;
  submissionId?: string;
}

const VALID_TIERS: Tier[] = ["quick", "standard", "extended"];
const MAXIMUM_SUBMITTED_STATEMENTS = 300;

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON." }, { status: 400 });
  }

  if (!body.tier || !VALID_TIERS.includes(body.tier)) {
    return NextResponse.json({ error: "Onbekende quizlengte." }, { status: 400 });
  }
  const parsedAnswers = validateSubmittedAnswers(
    body.answers,
    MAXIMUM_SUBMITTED_STATEMENTS,
  );
  if (!parsedAnswers.ok) {
    return NextResponse.json({ error: parsedAnswers.reason }, { status: 400 });
  }
  const answers = parsedAnswers.answers;

  const entitlement = await validateEntitlementForTier({
    tier: body.tier,
    token: body.entitlementToken,
  });
  if (!entitlement.ok) {
    return NextResponse.json(
      { error: "Voor deze quiz is een geldige betaling nodig." },
      { status: 402 },
    );
  }

  const ids = answers.map((a) => a.questionId);
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Geen geldige vraag-IDs ontvangen." },
      { status: 400 },
    );
  }

  const staticQuestions = await Promise.all(
    ids.filter(isStaticQuestionId).map((id) => getStaticQuestionById(id)),
  );
  const legacyIds = ids.filter((id) => !isStaticQuestionId(id));
  const p = legacyIds.length > 0 ? await payload() : null;
  const legacyDocs = p
    ? await p.find({
        collection: "questions",
        where: { id: { in: legacyIds } },
        limit: 300,
        depth: 0,
        pagination: false,
      })
    : { docs: [] };

  const staticById = new Map(
    staticQuestions.filter((q): q is NonNullable<typeof q> => Boolean(q)).map((q) => [q.id, q]),
  );
  const legacyById = new Map(
    (legacyDocs.docs as unknown as Array<{
      id: number;
      dimension: QuestionScoringMeta["dimension"];
      direction: "positive" | "negative";
      weight?: number;
      themes?: ThemeId[];
      tiers?: Tier[];
    }>).map((q) => [q.id, q]),
  );

  const scoringMeta: QuestionScoringMeta[] = ids.flatMap((id) => {
    const staticQuestion = staticById.get(id);
    if (staticQuestion) {
      return [{
        id,
        dimension: staticQuestion.dimension,
        direction: staticQuestion.direction === "positive" ? 1 : -1,
        weight: staticQuestion.weight ?? 1,
        themes: staticQuestion.themes ?? [],
        themeDirections: staticQuestion.themeDirections
          ? Object.fromEntries(
              Object.entries(staticQuestion.themeDirections).map(([theme, direction]) => [
                theme,
                direction === "positive" ? 1 : -1,
              ]),
            )
          : undefined,
      }];
    }
    const legacyQuestion = legacyById.get(id);
    if (!legacyQuestion) return [];
    return [{
      id,
      dimension: legacyQuestion.dimension,
      direction: legacyQuestion.direction === "positive" ? 1 : -1,
      weight: legacyQuestion.weight ?? 1,
      themes: legacyQuestion.themes ?? [],
    }];
  });

  if (scoringMeta.length !== answers.length) {
    return NextResponse.json(
      { error: "Een of meer quizvragen zijn niet gevonden." },
      { status: 400 },
    );
  }

  const containsQuestionOutsideTier = ids.some((id) => {
    const staticQuestion = staticById.get(id);
    if (staticQuestion) return !staticQuestion.tiers.includes(body.tier!);
    const legacyQuestion = legacyById.get(id);
    return Boolean(
      legacyQuestion?.tiers && !legacyQuestion.tiers.includes(body.tier!),
    );
  });
  if (containsQuestionOutsideTier) {
    return NextResponse.json(
      { error: "Een of meer vragen horen niet bij deze quizlengte." },
      { status: 400 },
    );
  }

  const breakdown = calculateScores(scoringMeta, answers);

  if (breakdown.answeredCount > TIER_QUESTION_COUNT[body.tier]) {
    return NextResponse.json(
      { error: "Er zijn meer beantwoorde stellingen ingestuurd dan deze quiz bevat." },
      { status: 400 },
    );
  }

  if (breakdown.answeredCount < MINIMUM_RESULT_ANSWERS) {
    return NextResponse.json(
      { error: "Te weinig vragen beantwoord voor een betrouwbaar resultaat." },
      { status: 400 },
    );
  }

  const themeBreakdown = calculateThemeScores(scoringMeta, answers);
  const confidence = calculateConfidence(
    scoringMeta,
    answers,
    breakdown.scores,
  );
  const paradoxes = detectParadoxes(scoringMeta, answers);

  const ideologies = (await getAllIdeologiesSeed()).map((ideology) => ({
    slug: ideology.slug,
    vector: ideology.profileVector,
  }));

  const best = bestMatch(breakdown.scores, ideologies);
  if (!best) {
    return NextResponse.json(
      { error: "Geen passende ideologie kunnen bepalen." },
      { status: 500 },
    );
  }

  let reservedShareId: string | undefined;
  if (isPaidTier(body.tier)) {
    const token = normalizeEntitlementToken(body.entitlementToken);
    if (!token || !isSubmissionId(body.submissionId)) {
      return NextResponse.json(
        { error: "Ongeldige afrondingscode." },
        { status: 400 },
      );
    }

    const registration = await registerPaidAttempt(token, body.submissionId);
    if (!registration.ok) {
      return NextResponse.json(
        {
          error:
            registration.reason === "exhausted"
              ? "Je hebt beide quizpogingen al gebruikt."
              : "De poging kon niet veilig worden geregistreerd. Probeer het later opnieuw.",
        },
        { status: registration.reason === "exhausted" ? 429 : 503 },
      );
    }

    reservedShareId = registration.shareId;
    if (registration.alreadyReserved) {
      const existing = await getResult(registration.shareId);
      if (existing) return NextResponse.json({ id: existing.shareId });
    }
  }

  const storedAnswers = answers.map((answer) => ({
    questionId: answer.questionId,
    value: answer.value,
  }));

  const stored = await createResult({
    shareId: reservedShareId,
    tier: body.tier,
    ideologySlug: best.item.slug,
    dimensions: breakdown.scores,
    themeScores: themeBreakdown.scores,
    confidence: confidence.perDimension,
    paradoxes: paradoxes.map((p) => ({
      dimension: p.dimension,
      theme: p.theme,
      type: p.type,
      severity: p.severity,
      description: p.description,
      exampleQuestionIds: (p.exampleQuestionIds ?? []).filter(
        (x): x is number => typeof x === "number",
      ),
    })),
    answers: storedAnswers,
    answeredCount: breakdown.answeredCount,
    skippedCount: breakdown.skippedCount,
    totalQuestions: TIER_QUESTION_COUNT[body.tier],
  });

  return NextResponse.json({ id: stored.shareId });
}
