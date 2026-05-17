import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { LiveAxes } from "@/components/LiveAxes";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { DIMENSIONS, TIER_QUESTION_COUNT } from "@/lib/dimensions";
import { cx } from "@/lib/cx";

export const metadata: Metadata = {
  title: {
    absolute: "PolitiekProfiel: een onafhankelijk politiek kompas",
  },
  description:
    "Politiek is meer dan links of rechts. Een rustig, doordacht profiel op vijf onafhankelijke dimensies. Geen scorelijst voor partijen, geen tracking, anonieme deelbare resultaten.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PolitiekProfiel: een onafhankelijk politiek kompas",
    description:
      "Politiek is meer dan links of rechts. Een rustig, doordacht profiel op vijf onafhankelijke dimensies.",
    url: "/",
    type: "website",
  },
};

const FEATURES: Array<{
  kicker: string;
  title: string;
  body: string;
}> = [
  {
    kicker: "Vraagstelling",
    title: "Concreet, actueel, gebalanceerd",
    body: "Stellingen die de redactie zorgvuldig opstelt. Voor en tegen krijgen evenveel ruimte; informeer jezelf vóór je antwoordt.",
  },
  {
    kicker: "Methodiek",
    title: "Vijf dimensies, geen karikatuur",
    body: "Economisch, sociaal-cultureel, burgerrechten, bestuur en systeemvertrouwen. Vijf onafhankelijke scores, geen één-as label.",
  },
  {
    kicker: "Privacy",
    title: "Geen account, geen tracking",
    body: "Resultaten worden anoniem opgeslagen voor een korte deellink. Geen IP-adres, geen analytics, geen marketing-cookies.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="relative overflow-hidden">
        <Container width="bleed" className="pt-12 md:pt-20 pb-16 md:pb-24">
          <ScrollReveal variant="stagger" immediate>
            <ScrollRevealItem>
              <Kicker number={"NL · 2026"}>Een onafhankelijk kompas</Kicker>
            </ScrollRevealItem>

            <div className="mt-8 md:mt-12 grid grid-cols-1 gap-12 lg:gap-20 lg:grid-cols-12 items-start">
              {/* Manifesto headline */}
              <ScrollRevealItem className="lg:col-span-7">
                <h1
                  className="display font-medium text-ink"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  <span className="block">Politiek is meer</span>
                  <span className="block">
                    dan <em className="display-italic font-light text-navy">links</em>
                    {" "}of{" "}
                    <em className="display-italic font-light text-navy">
                      rechts
                    </em>
                    .
                  </span>
                  <span className="block text-ink-2 mt-3 md:mt-5">
                    Zie waar je écht staat.
                  </span>
                </h1>

                <p className="mt-8 md:mt-10 max-w-xl text-lg text-ink-2 leading-relaxed">
                  Een rustig, doordacht profiel op{" "}
                  <strong className="text-ink">
                    vijf onafhankelijke dimensies
                  </strong>
                  . Geen scorelijst voor partijen. Geen reclame. Wel heldere
                  uitleg, ruimte voor twijfel, en herkenbare vergelijking met
                  politici en landen.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/quiz/standard" className="btn btn-primary">
                    Start de standaard quiz
                    <ArrowRight size={16} strokeWidth={1.8} />
                  </Link>
                  <Link href="/methodiek" className="btn btn-secondary">
                    Lees eerst de methodiek
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 bg-success rounded-full" />
                    <span className="mono tracking-wider">GEEN TRACKING</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 bg-success rounded-full" />
                    <span className="mono tracking-wider">ANONIEM</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="block w-1.5 h-1.5 bg-success rounded-full" />
                    <span className="mono tracking-wider">5–20 MIN</span>
                  </span>
                </div>
              </ScrollRevealItem>

              {/* Live axes */}
              <ScrollRevealItem className="lg:col-span-5 lg:pl-6 lg:border-l lg:border-rule">
                <div className="relative bg-paper-50 border border-rule p-6 md:p-8 lg:bg-transparent lg:border-0 lg:p-0">
                  <LiveAxes />
                </div>
              </ScrollRevealItem>
            </div>
          </ScrollReveal>
        </Container>

        {/* Decorative thin baseline rule */}
        <div className="border-t border-rule-strong" />
      </section>

      {/* ─────────────────────── PRINCIPES (3 KOL) ─────────────────────── */}
      <section className="bg-paper-50/40 border-b border-rule">
        <Container width="bleed" className="py-20 md:py-28">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Het instrument</Kicker>
              <h2 className="display max-w-3xl mt-5">
                Drie principes die het verschil maken.
              </h2>
            </ScrollRevealItem>

            <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-x-12">
              {FEATURES.map((f, i) => (
                <ScrollRevealItem key={i}>
                  <article className="relative pl-8 border-l border-rule">
                    <span className="absolute -left-px top-0 h-10 w-px bg-ink" />
                    <p className="index-num text-xs mb-3">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="kicker mb-3">{f.kicker}</p>
                    <h3 className="display text-2xl leading-tight mb-3">
                      {f.title}
                    </h3>
                    <p className="text-sm text-ink-2 leading-relaxed">
                      {f.body}
                    </p>
                  </article>
                </ScrollRevealItem>
              ))}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─────────────────────── TIER-KEUZE (MONUMENTAAL) ─────────────────────── */}
      <section className="border-b border-rule">
        <Container width="bleed" className="py-20 md:py-28">
          <ScrollReveal variant="stagger">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:items-end mb-12">
              <ScrollRevealItem>
                <Kicker number={2}>Kies een lengte</Kicker>
                <h2 className="display max-w-2xl mt-5">
                  Een snelle indicatie of een grondig portret.{" "}
                  <span className="display-italic font-light text-ink-muted">
                    Jij bepaalt.
                  </span>
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="text-sm text-ink-muted max-w-xs">
                  Voortgang wordt lokaal in je browser bewaard.
                  <br />
                  Geen account, geen e-mail.
                </p>
              </ScrollRevealItem>
            </div>

            <div className="grid grid-cols-1 gap-px bg-rule border border-rule md:grid-cols-3">
              <TierCard
                tier="quick"
                title="Quick"
                minutes="5 min"
                tagline="Korte indicatie van waar je staat."
                description="Genoeg om een ruwe positie te zien op de vijf assen, ideaal als snelle introductie."
              />
              <TierCard
                tier="standard"
                title="Standaard"
                minutes="10 min"
                tagline="Onze aanbevolen lengte voor een degelijk profiel."
                description="Een evenwichtige steekproef per dimensie, met genoeg nuance voor een serieus portret."
                recommended
              />
              <TierCard
                tier="extended"
                title="Uitgebreid"
                minutes="20 min"
                tagline="Diepgaande analyse met de meeste nuances."
                description="Alle stellingen, voor wie tijd wil nemen en zeker wil zijn van het resultaat."
              />
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* ─────────────────────── DE VIJF DIMENSIES (INDEX) ─────────────────────── */}
      <section>
        <Container width="bleed" className="py-20 md:py-28">
          <ScrollReveal variant="stagger">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20 mb-14">
              <ScrollRevealItem>
                <Kicker number={3}>De vijf assen</Kicker>
                <h2 className="display mt-5">
                  Politiek laat zich niet samenpersen tot één lijn.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="text-lg text-ink-2 leading-relaxed max-w-2xl">
                  Iedere dimensie meet een onafhankelijke houding. Een
                  conservatief op cultuur kan economisch links zijn. Een
                  libertair kan EU-gezind zijn. De vijf scores samen tonen wat
                  een enkele links–rechts schaal niet kan.
                </p>
              </ScrollRevealItem>
            </div>

            <ol className="border-t border-ink">
              {DIMENSIONS.map((d, i) => (
                <ScrollRevealItem
                  key={d.id}
                  as="li"
                  className="border-b border-rule"
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[80px_1fr_2fr_auto] lg:gap-8 py-7 md:py-9 items-baseline group">
                    <p className="index-num text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="display text-2xl md:text-3xl leading-tight text-ink">
                      {d.poleNegative.label}
                      <span className="text-ink-subtle font-light mx-2">/</span>
                      {d.polePositive.label}
                    </h3>
                    <p className="text-sm md:text-base text-ink-2 leading-relaxed lg:max-w-xl">
                      {d.description}
                    </p>
                    <p className="kicker text-right">{d.shortLabel}</p>
                  </div>
                </ScrollRevealItem>
              ))}
            </ol>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}

interface TierCardProps {
  tier: "quick" | "standard" | "extended";
  title: string;
  minutes: string;
  tagline: string;
  description: string;
  recommended?: boolean;
}

function TierCard({
  tier,
  title,
  minutes,
  tagline,
  description,
  recommended = false,
}: TierCardProps) {
  const count = TIER_QUESTION_COUNT[tier];
  return (
    <Link
      href={`/quiz/${tier}`}
      className={cx(
        "group relative block p-8 md:p-10 transition-colors duration-200 no-underline",
        recommended
          ? "bg-ink text-paper hover:bg-navy"
          : "bg-paper hover:bg-paper-50",
      )}
    >
      {recommended && (
        <span
          className={cx(
            "absolute top-6 right-6 mono text-[0.62rem] tracking-widest border px-2 py-1",
            "bg-paper text-ink border-paper",
          )}
        >
          AANBEVOLEN
        </span>
      )}

      <p
        className={cx(
          "mono text-[0.7rem] tracking-widest mb-6",
          recommended ? "text-paper/70" : "text-ink-muted",
        )}
      >
        {String((["quick", "standard", "extended"] as const).indexOf(tier) + 1).padStart(
          2,
          "0",
        )}{" "}
        / TIER
      </p>

      <h3
        className={cx(
          "display text-3xl md:text-4xl mb-1.5",
          recommended ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h3>
      <p
        className={cx(
          "text-sm mb-8",
          recommended ? "text-paper/75" : "text-ink-muted",
        )}
      >
        {tagline}
      </p>

      <div
        className={cx(
          "border-t pt-6 mb-8",
          recommended ? "border-paper/25" : "border-rule",
        )}
      >
        <div className="flex items-baseline justify-between mb-3">
          <span
            className={cx(
              "display tabular-nums text-6xl md:text-7xl leading-none",
              recommended ? "text-paper" : "text-ink",
            )}
          >
            {count}
          </span>
          <span
            className={cx(
              "kicker",
              recommended ? "text-paper/70" : "text-ink-muted",
            )}
          >
            Stellingen
          </span>
        </div>
        <p
          className={cx(
            "mono text-[0.7rem] tracking-widest inline-flex items-center gap-1.5",
            recommended ? "text-paper/70" : "text-ink-muted",
          )}
        >
          <Clock3 size={12} strokeWidth={1.8} />
          {minutes.toUpperCase()}
        </p>
      </div>

      <p
        className={cx(
          "text-sm leading-relaxed mb-8 min-h-[3.5em]",
          recommended ? "text-paper/80" : "text-ink-2",
        )}
      >
        {description}
      </p>

      <span
        className={cx(
          "inline-flex items-center gap-2 text-sm font-medium transition-transform group-hover:translate-x-0.5",
          recommended ? "text-paper" : "text-ink",
        )}
      >
        Begin
        <ArrowRight size={16} strokeWidth={1.8} />
      </span>
    </Link>
  );
}
