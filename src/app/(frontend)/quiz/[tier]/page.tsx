import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getInitialAdaptiveQuestions,
  getQuestionsForTier,
} from "@/lib/quiz-data";
import { QuizEngine } from "@/components/QuizEngine";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import type { Tier } from "@/lib/dimensions";
import { TIER_QUESTION_COUNT } from "@/lib/dimensions";
import {
  normalizeEntitlementToken,
  validateEntitlementForTier,
} from "@/lib/entitlements";
import { isPaidTier, type PaidTier } from "@/lib/stripe";
import {
  buildBreadcrumbList,
  buildQuizSchema,
  jsonLdString,
} from "@/lib/structured-data";

const VALID_TIERS: Tier[] = ["quick", "standard", "extended"];

const TIER_LABELS: Record<
  Tier,
  {
    title: string;
    minutes: string;
    tagline: string;
    /** ISO 8601 duration. */
    duration: string;
  }
> = {
  quick: {
    title: "Quick quiz",
    minutes: "3 minuten",
    tagline: "Gratis indicatie van waar je staat op de vijf dimensies.",
    duration: "PT3M",
  },
  standard: {
    title: "Standaard quiz",
    minutes: "10 minuten",
    tagline: "Betaalde quiz voor een volledig politiek profiel.",
    duration: "PT10M",
  },
  extended: {
    title: "Uitgebreide quiz",
    minutes: "20 minuten",
    tagline: "Betaalde quiz met de meeste nuance en extra verdieping.",
    duration: "PT20M",
  },
};

type Args = { params: Promise<{ tier: string }> };
type PageArgs = Args & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

const ADAPTIVE_ENABLED = process.env.NEXT_PUBLIC_ADAPTIVE_QUIZ !== "false";

export default async function QuizPage({ params, searchParams }: PageArgs) {
  const { tier } = await params;
  if (!VALID_TIERS.includes(tier as Tier)) {
    notFound();
  }
  const tierKey = tier as Tier;
  const search = await searchParams;
  const entitlementToken = normalizeEntitlementToken(
    Array.isArray(search.entitlement)
      ? search.entitlement[0]
      : search.entitlement,
  );

  if (isPaidTier(tierKey)) {
    const access = await validateEntitlementForTier({
      tier: tierKey,
      token: entitlementToken,
    });
    if (!access.ok) {
      return (
        <PaidQuizGate
          tier={tierKey}
          entitlementToken={entitlementToken ?? undefined}
          checkoutStatus={
            Array.isArray(search.checkout) ? search.checkout[0] : search.checkout
          }
          entitlementStatus={access.status}
        />
      );
    }
  }

  const questions = ADAPTIVE_ENABLED
    ? await getInitialAdaptiveQuestions(tierKey)
    : await getQuestionsForTier(tierKey);
  if (questions.length === 0) {
    notFound();
  }
  const meta = TIER_LABELS[tierKey];
  const count = TIER_QUESTION_COUNT[tierKey];
  const path = `/quiz/${tierKey}`;
  const quizLd = buildQuizSchema({
    path,
    name: `PolitiekProfiel: ${meta.title}`,
    description: `${meta.tagline} ${count} stellingen, ongeveer ${meta.minutes}.`,
    numberOfQuestions: count,
    timeRequired: meta.duration,
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: meta.title, item: path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdString([quizLd, breadcrumbLd]),
        }}
      />
      <QuizEngine
        tier={tierKey}
        questions={questions}
        adaptive={ADAPTIVE_ENABLED}
        entitlementToken={entitlementToken ?? undefined}
      />
    </>
  );
}

export const dynamic = "force-dynamic";

function PaidQuizGate({
  tier,
  entitlementToken,
  checkoutStatus,
  entitlementStatus,
}: {
  tier: PaidTier;
  entitlementToken?: string;
  checkoutStatus?: string;
  entitlementStatus: string;
}) {
  const title =
    tier === "standard" ? "Standaard quiz" : "Uitgebreide quiz";
  const price = tier === "standard" ? "5 euro" : "10 euro";
  const count = TIER_QUESTION_COUNT[tier];
  const processing =
    checkoutStatus === "success" &&
    (entitlementStatus === "pending" || entitlementStatus === "missing");

  return (
    <Container width="narrow" className="py-20 md:py-28">
      <Kicker>{processing ? "Betaling verwerken" : "Betaalde quiz"}</Kicker>
      <h1 className="display mt-5 mb-5">{title}</h1>
      <p className="text-ink-2 leading-relaxed mb-8 max-w-xl">
        {processing
          ? "Stripe heeft je teruggestuurd. De webhook verwerkt je betaling nog. Ververs deze pagina over een paar seconden."
          : `${title} bevat ${count} stellingen en kost ${price}. Na betaling kun je zonder account verder naar de quiz.`}
      </p>
      <div className="flex flex-wrap gap-3">
        {processing ? (
          <Link
            href={`/quiz/${tier}${entitlementToken ? `?entitlement=${entitlementToken}&checkout=success` : ""}`}
            className="btn btn-secondary"
          >
            Opnieuw controleren
            <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
        ) : (
          <CheckoutButton tier={tier}>
            Koop voor {price}
            <ArrowRight size={16} strokeWidth={1.8} />
          </CheckoutButton>
        )}
        <Link href="/quiz/quick" className="btn-ghost">
          Start gratis met 15 vragen
        </Link>
      </div>
    </Container>
  );
}
