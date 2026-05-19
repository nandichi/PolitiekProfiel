import { NextResponse } from "next/server";
import { getQuestionPoolForTier, type QuizQuestion } from "@/lib/quiz-data";
import {
  pickNextBatch,
  tierIsComplete,
  type AdaptiveQuestion,
} from "@/lib/adaptive";
import type { AnswerValue, Tier } from "@/lib/dimensions";
import { validateEntitlementForTier } from "@/lib/entitlements";

interface Body {
  tier?: Tier;
  seenIds?: number[];
  answers?: Array<{ questionId: number; value: AnswerValue | null }>;
  entitlementToken?: string;
}

const VALID_TIERS: Tier[] = ["quick", "standard", "extended"];

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Ongeldige JSON." }, { status: 400 });
  }

  if (!body.tier || !VALID_TIERS.includes(body.tier)) {
    return NextResponse.json(
      { error: "Onbekende quizlengte." },
      { status: 400 },
    );
  }

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

  const seenIds = Array.isArray(body.seenIds)
    ? body.seenIds.filter((n) => Number.isInteger(n))
    : [];
  const answers = Array.isArray(body.answers)
    ? body.answers
        .filter(
          (a) =>
            typeof a.questionId === "number" &&
            (a.value === null || [-2, -1, 0, 1, 2].includes(a.value as number)),
        )
        .map((a) => ({ questionId: a.questionId, value: a.value }))
    : [];

  const pool: QuizQuestion[] = await getQuestionPoolForTier(body.tier);
  const adaptivePool: AdaptiveQuestion[] = pool.map((q) => ({
    id: q.id,
    dimension: q.dimension,
    direction: q.direction,
    weight: q.weight,
    depth: q.depth,
    discriminator: q.discriminator,
    themes: q.themes,
  }));

  const answeredCount = answers.filter((a) => a.value !== null).length;
  const done = tierIsComplete(body.tier, answeredCount);

  if (done) {
    return NextResponse.json({ done: true, questions: [] });
  }

  const next = pickNextBatch({
    tier: body.tier,
    seenIds,
    answers,
    pool: adaptivePool,
  });

  const lookup = new Map(pool.map((q) => [q.id, q]));
  const fullQuestions = next
    .map((q) => lookup.get(q.id))
    .filter((q): q is QuizQuestion => q !== undefined);

  return NextResponse.json({
    done: fullQuestions.length === 0,
    questions: fullQuestions,
  });
}
