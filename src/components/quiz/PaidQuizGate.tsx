import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Container } from "@/components/Container";
import { TIER_QUESTION_COUNT } from "@/lib/dimensions";
import type { PaidTier } from "@/lib/stripe";

const TIER_DETAILS: Record<
  PaidTier,
  {
    title: string;
    price: string;
    vat: string;
    minutes: string;
    benefits: string[];
  }
> = {
  standard: {
    title: "Standaard quiz",
    price: "€ 5",
    vat: "inclusief € 0,87 btw",
    minutes: "10 minuten",
    benefits: [
      "Een volledig profiel op vijf onafhankelijke dimensies",
      "Uitleg per dimensie en verdieping per politiek thema",
      "Een anonieme, deelbare link naar je resultaat",
    ],
  },
  extended: {
    title: "Uitgebreide quiz",
    price: "€ 10",
    vat: "inclusief € 1,74 btw",
    minutes: "20 minuten",
    benefits: [
      "Het meest genuanceerde profiel op vijf onafhankelijke dimensies",
      "Uitgebreide uitleg en verdieping per politiek thema",
      "Een anonieme, deelbare link naar je resultaat",
    ],
  },
};

export function PaidQuizGate({
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
  const details = TIER_DETAILS[tier];
  const count = TIER_QUESTION_COUNT[tier];
  const processing =
    checkoutStatus === "success" &&
    (entitlementStatus === "pending" || entitlementStatus === "missing");
  const consumed = entitlementStatus === "consumed";

  return (
    <Container width="wide" className="py-12 sm:py-16 lg:py-24">
      <section
        aria-labelledby="paid-quiz-title"
        className="grid border-y border-rule-strong lg:grid-cols-[minmax(0,6fr)_minmax(21rem,7fr)]"
      >
        <header className="border-b border-rule-strong px-0 py-8 sm:py-12 lg:border-b-0 lg:border-r lg:px-8 lg:py-14 xl:px-12">
          <p className="mono text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
            {processing
              ? "Betaling verwerken"
              : consumed
                ? "Quiz al afgerond"
                : "Eenmalige aankoop"}
          </p>
          <h1
            id="paid-quiz-title"
            className="mt-5 max-w-xl text-[clamp(2.5rem,6vw,5.75rem)] font-black leading-[0.9] tracking-[-0.055em] text-ink"
          >
            {details.title}
          </h1>
          <p className="mt-7 max-w-[58ch] text-base leading-relaxed text-text-muted sm:text-lg">
            {processing
              ? "Stripe heeft je teruggestuurd. We controleren je betaling en openen de quiz zodra die is bevestigd."
              : consumed
                ? "Dit toegangstoken is al twee keer gebruikt. Je resultaat staat op de deelbare link die je na de quiz kreeg."
                : "Meet je politieke profiel met meer vragen, meer nuance en uitleg bij de uitkomst."}
          </p>

          <dl className="mt-10 grid grid-cols-3 border-t border-rule">
            <div className="min-w-0 border-r border-rule py-4 pr-3">
              <dt className="mono text-[0.65rem] uppercase tracking-wider text-text-muted">
                Prijs
              </dt>
              <dd className="mt-2 text-lg font-bold text-ink">{details.price}</dd>
              <dd className="mt-1 text-xs leading-snug text-text-muted">{details.vat}</dd>
            </div>
            <div className="min-w-0 border-r border-rule px-3 py-4">
              <dt className="mono text-[0.65rem] uppercase tracking-wider text-text-muted">
                Tijd
              </dt>
              <dd className="mt-2 text-sm font-bold leading-tight text-ink sm:text-base">
                {details.minutes}
              </dd>
            </div>
            <div className="min-w-0 py-4 pl-3">
              <dt className="mono text-[0.65rem] uppercase tracking-wider text-text-muted">
                Omvang
              </dt>
              <dd className="mt-2 text-sm font-bold leading-tight text-ink sm:text-base">
                {count} stellingen
              </dd>
            </div>
          </dl>
        </header>

        <div className="bg-canvas-raised px-0 py-8 sm:py-12 lg:px-8 lg:py-14 xl:px-12">
          <h2 className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Je ontvangt
          </h2>
          <ul className="mt-6 border-t border-rule">
            {details.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex gap-3 border-b border-rule py-4 text-sm font-medium leading-relaxed text-ink sm:text-base"
              >
                <Check
                  aria-hidden
                  className="mt-0.5 shrink-0 text-signal"
                  size={18}
                  strokeWidth={2}
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 grid grid-cols-2 border-y border-rule text-sm">
            <p className="border-r border-rule py-3 pr-3 font-semibold text-ink">
              Geen abonnement
            </p>
            <p className="py-3 pl-3 font-semibold text-ink">Geen account</p>
          </div>

          <div className="mt-7 border-l-2 border-signal pl-4">
            <p className="text-sm font-semibold leading-relaxed text-ink">
              Na betaling stuurt Stripe je terug naar deze pagina.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              De quiz opent automatisch zodra de betaling is bevestigd. Dat duurt meestal
              maar enkele seconden. Je kunt de quiz daarna maximaal twee keer afronden.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {processing ? (
              <Link
                href={`/quiz/${tier}${entitlementToken ? `?entitlement=${entitlementToken}&checkout=success` : ""}`}
                className="btn btn-secondary min-h-11 w-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 sm:w-auto"
              >
                Opnieuw controleren
                <ArrowRight aria-hidden size={16} strokeWidth={1.8} />
              </Link>
            ) : consumed ? (
              <Link
                href="/contact"
                className="btn btn-secondary min-h-11 w-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 sm:w-auto"
              >
                Resultaat kwijt? Stuur een bericht
              </Link>
            ) : (
              <CheckoutButton
                tier={tier}
                className="btn btn-primary min-h-11 w-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 sm:w-auto"
              >
                Koop voor {details.price}
                <ArrowRight aria-hidden size={16} strokeWidth={1.8} />
              </CheckoutButton>
            )}
            <Link
              href="/quiz/quick"
              className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-ink underline decoration-rule-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
            >
              Start gratis met 15 vragen
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
}
