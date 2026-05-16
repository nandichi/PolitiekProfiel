import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getQuestionsForTier } from "@/lib/quiz-data";
import { QuizEngine } from "@/components/QuizEngine";
import type { Tier } from "@/lib/dimensions";
import { TIER_QUESTION_COUNT } from "@/lib/dimensions";

const VALID_TIERS: Tier[] = ["quick", "standard", "extended"];

const TIER_LABELS: Record<Tier, { title: string; minutes: string; tagline: string }> = {
  quick: {
    title: "Quick quiz",
    minutes: "5 minuten",
    tagline: "Korte indicatie van waar je staat op de vijf dimensies.",
  },
  standard: {
    title: "Standaard quiz",
    minutes: "10 minuten",
    tagline: "Aanbevolen lengte voor een degelijk politiek profiel.",
  },
  extended: {
    title: "Uitgebreide quiz",
    minutes: "20 minuten",
    tagline: "Diepgaande analyse met de meeste nuances.",
  },
};

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { tier } = await params;
  if (!VALID_TIERS.includes(tier as Tier)) {
    return { title: "Quiz" };
  }
  const meta = TIER_LABELS[tier as Tier];
  const count = TIER_QUESTION_COUNT[tier as Tier];
  const description = `${meta.tagline} ${count} stellingen, ongeveer ${meta.minutes}. Geen account, voortgang lokaal in je browser.`;
  return {
    title: meta.title,
    description,
    alternates: { canonical: `/quiz/${tier}` },
    openGraph: {
      title: `${meta.title} · PolitiekProfiel`,
      description,
      url: `/quiz/${tier}`,
      type: "website",
    },
  };
}

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
