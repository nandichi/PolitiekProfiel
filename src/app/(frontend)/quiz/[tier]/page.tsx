import { notFound } from "next/navigation";
import { getQuestionsForTier } from "@/lib/quiz-data";
import { QuizEngine } from "@/components/QuizEngine";
import type { Tier } from "@/lib/dimensions";

const VALID_TIERS: Tier[] = ["quick", "standard", "extended"];

type Args = { params: Promise<{ tier: string }> };

export default async function QuizPage({ params }: Args) {
  const { tier } = await params;
  if (!VALID_TIERS.includes(tier as Tier)) {
    notFound();
  }
  const questions = await getQuestionsForTier(tier as Tier);
  if (questions.length === 0) {
    notFound();
  }
  return <QuizEngine tier={tier as Tier} questions={questions} />;
}

export const dynamic = "force-dynamic";
