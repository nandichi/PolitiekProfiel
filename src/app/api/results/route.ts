import { NextResponse } from "next/server";
import { payload } from "@/lib/payload";
import { calculateScores, bestMatch, type QuestionScoringMeta } from "@/lib/scoring";
import { createResult } from "@/lib/results-store";
import type { AnswerValue, Tier } from "@/lib/dimensions";

interface Body {
  tier?: Tier;
  answers?: Array<{ questionId: number; value: AnswerValue | null }>;
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
    return NextResponse.json({ error: "Onbekende quizlengte." }, { status: 400 });
  }
  if (!Array.isArray(body.answers) || body.answers.length === 0) {
    return NextResponse.json(
      { error: "Geen antwoorden ontvangen." },
      { status: 400 },
    );
  }

  const ids = body.answers.map((a) => a.questionId).filter((n) => Number.isInteger(n));
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Geen geldige vraag-IDs ontvangen." },
      { status: 400 },
    );
  }

  const p = await payload();
  const [questionsRes, ideologiesRes] = await Promise.all([
    p.find({
      collection: "questions",
      where: { id: { in: ids } },
      limit: 200,
      depth: 0,
      pagination: false,
    }),
    p.find({ collection: "ideologies", limit: 100, depth: 0 }),
  ]);

  if (questionsRes.docs.length === 0 || ideologiesRes.docs.length === 0) {
    return NextResponse.json(
      { error: "Quiz of ideologieën niet gevonden." },
      { status: 500 },
    );
  }

  const scoringMeta: QuestionScoringMeta[] = (questionsRes.docs as unknown as Array<{
    id: number;
    dimension: QuestionScoringMeta["dimension"];
    direction: "positive" | "negative";
    weight?: number;
  }>).map((d) => ({
    id: d.id,
    dimension: d.dimension,
    direction: d.direction === "positive" ? 1 : -1,
    weight: d.weight ?? 1,
  }));

  const breakdown = calculateScores(scoringMeta, body.answers);

  if (breakdown.answeredCount < 5) {
    return NextResponse.json(
      { error: "Te weinig vragen beantwoord voor een betrouwbaar resultaat." },
      { status: 400 },
    );
  }

  const ideologies = (ideologiesRes.docs as unknown as Array<{
    slug: string;
    profileVector: ReturnType<typeof calculateScores>["scores"];
  }>).map((d) => ({
    slug: d.slug,
    vector: d.profileVector,
  }));

  const best = bestMatch(breakdown.scores, ideologies);
  if (!best) {
    return NextResponse.json(
      { error: "Geen passende ideologie kunnen bepalen." },
      { status: 500 },
    );
  }

  const stored = await createResult({
    tier: body.tier,
    ideologySlug: best.item.slug,
    dimensions: breakdown.scores,
    answeredCount: breakdown.answeredCount,
    skippedCount: breakdown.skippedCount,
    totalQuestions: questionsRes.docs.length,
  });

  return NextResponse.json({ id: stored.shareId });
}
