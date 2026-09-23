import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HomepageFiveLineInstrument } from "@/components/brand/HomepageFiveLineInstrument";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Container } from "@/components/Container";
import { DIMENSIONS, TIER_QUESTION_COUNT, type Tier } from "@/lib/dimensions";

export const metadata: Metadata = {
  title: {
    absolute: "PolitiekProfiel: een onafhankelijk politiek kompas",
  },
  description:
    "Politiek is meer dan links of rechts. Een rustig, doordacht profiel op vijf onafhankelijke dimensies. Gratis indicatie, betaalde verdieping, geen advertentietracking.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "PolitiekProfiel: een onafhankelijk politiek kompas",
    description:
      "Politiek is meer dan links of rechts. Een rustig, doordacht profiel op vijf onafhankelijke dimensies.",
    url: "/",
    type: "website",
  },
};

const MEASUREMENT_STEPS = [
  {
    label: "Vraagstelling",
    title: "Concreet genoeg om echt te kiezen.",
    body: "De redactie stelt concrete, actuele stellingen op. Voor en tegen krijgen evenveel ruimte. Bij iedere vraag kun je eerst de context en bronnen bekijken.",
    className: "lg:col-span-9",
  },
  {
    label: "Methodiek",
    title: "Vijf metingen blijven zelfstandig.",
    body: "Economisch, sociaal-cultureel, burgerrechten, bestuur en systeemvertrouwen leveren vijf afzonderlijke scores op. We persen ze niet samen tot één links-rechtslabel.",
    className: "lg:col-span-7 lg:col-start-9",
  },
  {
    label: "Privacy",
    title: "Je antwoorden zijn geen advertentieprofiel.",
    body: "Je hebt geen account nodig. Resultaten worden anoniem opgeslagen voor een korte deellink. Stripe verwerkt betalingen apart van je politieke uitslag.",
    className: "lg:col-span-11 lg:col-start-3",
  },
] as const;

const TIER_ROWS: ReadonlyArray<{
  tier: Tier;
  name: string;
  price: string;
  time: string;
  result: string;
  suitable: string;
  summary: string;
  recommended?: boolean;
}> = [
  {
    tier: "quick",
    name: "Quick",
    price: "Gratis",
    time: "3 min",
    result: "Profielnaam en vijf assen",
    suitable: "Een eerste, bruikbare indicatie",
    summary:
      "Een korte proefuitslag die laat zien hoe de vijf onafhankelijke metingen samen een profiel vormen.",
  },
  {
    tier: "standard",
    name: "Standaard",
    price: "€ 5 incl. btw",
    time: "10 min",
    result: "Volledig rapport met thema's en duiding",
    suitable: "Een degelijk profiel met context",
    summary:
      "Het volledige rapport met standpunten, paradoxen, vergelijkingen en leesverdieping.",
    recommended: true,
  },
  {
    tier: "extended",
    name: "Uitgebreid",
    price: "€ 10 incl. btw",
    time: "20 min",
    result: "Meest uitgebreide rapport en vergelijking",
    suitable: "De meeste nuance en scherpte",
    summary:
      "De langste quiz met extra standpunten, ruimere vergelijkingen en de meeste meetzekerheid.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="w-full overflow-hidden bg-ink text-canvas">
        <Container width="bleed" className="py-14 sm:py-18 lg:py-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6 lg:gap-y-0">
            <div className="lg:col-span-8">
              <p data-home-intro className="mono text-[0.68rem] uppercase tracking-[0.18em] text-focus">
                Onafhankelijk politiek meetinstrument
              </p>
              <h1 data-home-intro className="mt-7 max-w-[8.6ch] text-[clamp(3.5rem,7.2vw,8.25rem)] font-black leading-[0.86] tracking-[-0.055em] !text-canvas">
                Politiek past niet op één lijn.
              </h1>
              <p data-home-intro className="mt-8 max-w-[62ch] text-base leading-relaxed text-canvas/78 sm:text-lg lg:mt-10 lg:text-xl">
                Ontdek je politieke profiel op vijf onafhankelijke dimensies.
                Geen partijadvies, geen account en geen advertentietracking. Wel
                een heldere uitslag met ruimte voor nuance, twijfel en context.
              </p>
              <div data-home-intro className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <Link
                  href="/quiz/quick"
                  className="inline-flex min-h-12 items-center gap-3 bg-signal px-5 py-3 text-sm font-bold text-canvas no-underline transition-colors hover:bg-signal-pressed hover:text-canvas"
                >
                  Doe de Quick · gratis
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2} />
                </Link>
                <Link
                  href="#versies"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-canvas underline decoration-canvas/45 underline-offset-8 hover:text-focus hover:decoration-focus"
                >
                  Bekijk de drie versies
                  <ArrowDown aria-hidden="true" size={15} strokeWidth={2} />
                </Link>
              </div>
              <ul className="mt-12 grid max-w-2xl grid-cols-1 border-y border-canvas/25 text-sm text-canvas/65 sm:grid-cols-3">
                <li className="border-b border-canvas/25 py-3 sm:border-b-0 sm:border-r sm:pr-4">
                  <span className="mono text-[0.64rem] uppercase tracking-[0.12em]">01</span>
                  <span className="ml-3">Vijf dimensies</span>
                </li>
                <li className="border-b border-canvas/25 py-3 sm:border-b-0 sm:border-r sm:px-4">
                  <span className="mono text-[0.64rem] uppercase tracking-[0.12em]">02</span>
                  <span className="ml-3">Geen stemadvies</span>
                </li>
                <li className="py-3 sm:pl-4">
                  <span className="mono text-[0.64rem] uppercase tracking-[0.12em]">03</span>
                  <span className="ml-3">Anoniem te doen</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-6 lg:col-start-10 lg:self-end">
              <HomepageFiveLineInstrument />
            </div>
          </div>
        </Container>
      </section>

      <section
        id="versies"
        aria-labelledby="versions-title"
        className="scroll-mt-24 border-b border-rule bg-canvas"
      >
        <Container width="bleed" className="py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6">
            <div className="lg:col-span-6">
              <p className="mono text-[0.68rem] uppercase tracking-[0.17em] text-text-muted">
                Drie versies, één meetmodel
              </p>
              <h2 id="versions-title" className="mt-4 max-w-xl text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Kies hoeveel detail je wilt zien.
              </h2>
            </div>
            <p className="max-w-[62ch] text-base leading-relaxed text-text-muted lg:col-span-6 lg:col-start-9 lg:self-end lg:text-lg">
              Quick geeft gratis een bruikbare eerste indicatie. Standaard en
              Uitgebreid voegen meer vragen en het volledige rapport toe. De
              prijs verandert alleen met de diepgang.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-16 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6">
            <ReportPreview />

            <div className="lg:col-span-9 lg:col-start-7">
              <div className="border-t border-ink">
                {TIER_ROWS.map((row) => (
                  <TierChoiceRow key={row.tier} {...row} />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 border-b border-rule py-5 text-xs leading-relaxed text-text-muted sm:grid-cols-2">
                <p>Standaard en Uitgebreid zijn eenmalige bedragen inclusief btw.</p>
                <p className="sm:text-right">Geen abonnement. Geen account. Geen automatische verlenging.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="sequence-title" className="border-b border-rule bg-canvas-raised">
        <Container width="bleed" className="py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6">
            <div className="lg:col-span-5">
              <p className="mono text-[0.68rem] uppercase tracking-[0.17em] text-text-muted">
                Van stelling naar profiel
              </p>
              <h2 id="sequence-title" className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
                Een meetreeks die uitlegbaar blijft.
              </h2>
            </div>
            <p className="max-w-[62ch] text-base leading-relaxed text-text-muted lg:col-span-7 lg:col-start-9 lg:self-end lg:text-lg">
              Je krijgt geen verborgen optelsom en geen partijwinnaar. Iedere stap
              blijft zichtbaar: wat we vragen, hoe we meten en wat we niet met je
              antwoorden doen.
            </p>
          </div>

          <ol className="mt-14 grid grid-cols-1 gap-y-0 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6">
            {MEASUREMENT_STEPS.map((step, index) => (
              <li key={step.label} className={step.className}>
                <article className="grid grid-cols-[3.25rem_1fr] border-t border-ink py-7 sm:grid-cols-[5rem_1fr] sm:py-9">
                  <span className="mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="mono text-[0.66rem] uppercase tracking-[0.15em] text-text-muted">
                      {step.label}
                    </p>
                    <h3 className="mt-3 max-w-[24ch] text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-text-muted">
                      {step.body}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="axes-title" className="border-b border-rule bg-canvas">
        <Container width="bleed" className="py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6">
            <div className="lg:col-span-6">
              <p className="mono text-[0.68rem] uppercase tracking-[0.17em] text-text-muted">
                De vijf assen
              </p>
              <h2 id="axes-title" className="mt-4 max-w-2xl text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                Vijf vragen die niet hetzelfde meten.
              </h2>
            </div>
            <p className="max-w-[62ch] text-base leading-relaxed text-text-muted lg:col-span-6 lg:col-start-9 lg:self-end lg:text-lg">
              Een cultureel conservatieve houding zegt nog niets over economie of
              burgerrechten. Daarom krijgt iedere dimensie een eigen lijn, eigen
              polen en een afzonderlijke score.
            </p>
          </div>

          <ol className="mt-12 border-t border-ink lg:mt-16">
            {DIMENSIONS.map((dimension, index) => (
              <li key={dimension.id} className="border-b border-rule">
                <article className="grid grid-cols-[2.75rem_1fr] gap-x-4 py-7 sm:grid-cols-[4rem_1fr] lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6 lg:py-8">
                  <div className="pt-1 lg:col-span-1">
                    <AxisMarker index={index} />
                  </div>
                  <div className="lg:col-span-4">
                    <p className="mono text-[0.64rem] uppercase tracking-[0.14em] text-text-muted">
                      As {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
                      {dimension.label}
                    </h3>
                  </div>
                  <div className="col-start-2 mt-5 lg:col-span-5 lg:col-start-auto lg:mt-0">
                    <div className="relative h-px bg-rule-strong">
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <AxisMarker index={index} small />
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm font-semibold">
                      <span>{dimension.poleNegative.label}</span>
                      <span className="text-right">{dimension.polePositive.label}</span>
                    </div>
                  </div>
                  <p className="col-start-2 mt-5 max-w-[58ch] text-sm leading-relaxed text-text-muted lg:col-span-5 lg:col-start-auto lg:mt-0 lg:text-base">
                    {dimension.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="trust-title" className="bg-ink text-canvas">
        <Container width="bleed" className="py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[repeat(15,minmax(0,1fr))] lg:gap-x-6">
            <div className="lg:col-span-5">
              <p className="mono text-[0.68rem] uppercase tracking-[0.17em] text-focus">
                Controleerbaar vertrouwen
              </p>
              <h2 id="trust-title" className="mt-4 max-w-lg text-4xl font-extrabold tracking-[-0.04em] !text-canvas sm:text-5xl">
                Lees hoe de meting tot stand komt.
              </h2>
            </div>

            <div className="lg:col-span-9 lg:col-start-7">
              <div className="grid grid-cols-1 border-t border-canvas/35 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr]">
                <TrustItem
                  label="Methodiek"
                  title="Vijf scores, geen verborgen totaalcijfer"
                  body="De dimensies lopen elk van -100 tot +100. We documenteren vraagselectie, scoring, onzekerheid en de beperkingen van het model."
                  href="/methodiek"
                  linkLabel="Lees de methodiek"
                  className="sm:border-r sm:border-canvas/25"
                />
                <TrustItem
                  label="Bronbeleid"
                  title="Context naast iedere politieke claim"
                  body="Stellingen en dossiers steunen op publiek toegankelijke bronnen. We tonen argumenten voor en tegen en vermelden de herkomst waar mogelijk."
                  href="/disclaimer#bronnen"
                  linkLabel="Lees het bronbeleid"
                />
                <TrustItem
                  label="Privacy"
                  title="Je uitslag blijft los van je betaling"
                  body="Geen advertentietracking en geen verplicht account. Stripe verwerkt de betaling; PolitiekProfiel koppelt betaalgegevens niet aan je politieke uitslag."
                  href="/privacy"
                  linkLabel="Lees de privacyverklaring"
                  className="sm:col-span-2 sm:border-r-0 lg:pr-[14%]"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ReportPreview() {
  const positions = [32, 61, 45, 70, 54];

  return (
    <aside className="lg:col-span-5" aria-label="Statische voorbeeldweergave van een rapport">
      <div className="border border-ink bg-canvas-raised">
        <div className="flex items-start justify-between gap-5 border-b border-ink p-5 sm:p-6">
          <div>
            <p className="mono text-[0.64rem] uppercase tracking-[0.15em] text-text-muted">
              Voorbeeldrapport
            </p>
            <p className="mt-3 text-2xl font-extrabold leading-tight text-ink">Je politieke profiel</p>
          </div>
          <span className="mono border border-rule-strong px-2 py-1 text-[0.6rem] uppercase tracking-[0.12em] text-text-muted">
            5 assen
          </span>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-text-muted">
            Iedere as wordt apart getoond. Een rapport legt daarna uit waar je
            antwoorden duidelijk zijn en waar meer nuance nodig is.
          </p>
          <div className="mt-7 space-y-6">
            {DIMENSIONS.map((dimension, index) => (
              <div key={dimension.id}>
                <div className="flex items-center justify-between gap-4">
                  <span className="mono text-[0.62rem] uppercase tracking-[0.1em] text-text-muted">
                    {dimension.shortLabel}
                  </span>
                  <span className="text-xs text-text-muted">afzonderlijke score</span>
                </div>
                <div className="relative mt-2 h-px bg-rule-strong">
                  <span
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas-raised"
                    style={{ left: positions[index] + "%" }}
                  >
                    <AxisMarker index={index} small />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 border-t border-rule pt-4 text-xs leading-relaxed text-text-muted">
            Indicatieve voorbeeldweergave. Dit is geen echte uitslag.
          </p>
        </div>
      </div>
    </aside>
  );
}

function TierChoiceRow({
  tier,
  name,
  price,
  time,
  result,
  suitable,
  summary,
  recommended = false,
}: (typeof TIER_ROWS)[number]) {
  const isPaid = tier !== "quick";

  return (
    <article className="relative border-b border-rule py-7 sm:py-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(8rem,0.8fr)_minmax(0,2fr)_auto] xl:items-start xl:gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{name}</h3>
            {recommended && (
              <span className="mono border border-signal px-2 py-1 text-[0.58rem] uppercase tracking-[0.12em] text-signal">
                Aanbevolen
              </span>
            )}
          </div>
          <p className="mt-2 text-sm font-semibold text-ink">{price}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-muted xl:hidden">{summary}</p>
        </div>

        <div>
          <p className="hidden max-w-[58ch] text-sm leading-relaxed text-text-muted xl:block">{summary}</p>
          <dl className="mt-1 grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4 xl:mt-6">
            <TierFact label="Tijd" value={time} />
            <TierFact label="Stellingen" value={String(TIER_QUESTION_COUNT[tier])} />
            <TierFact label="Resultaat" value={result} />
            <TierFact label="Geschikt voor" value={suitable} />
          </dl>
        </div>

        <div className="xl:flex xl:min-w-40 xl:justify-end">
          {isPaid ? (
            <CheckoutButton
              tier={tier as "standard" | "extended"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-ink bg-ink px-4 py-3 text-sm font-bold text-canvas transition-colors hover:border-signal hover:bg-signal sm:w-auto"
            >
              Kies {name}
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
            </CheckoutButton>
          ) : (
            <Link
              href="/quiz/quick"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-signal px-4 py-3 text-sm font-bold text-canvas no-underline transition-colors hover:bg-signal-pressed hover:text-canvas sm:w-auto"
            >
              Doe de Quick
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

function TierFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-rule pl-3">
      <dt className="mono text-[0.58rem] uppercase tracking-[0.11em] text-text-muted">{label}</dt>
      <dd className="mt-1.5 text-xs font-semibold leading-snug text-ink sm:text-sm">{value}</dd>
    </div>
  );
}

function TrustItem({
  label,
  title,
  body,
  href,
  linkLabel,
  className = "",
}: {
  label: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  className?: string;
}) {
  return (
    <article className={"border-b border-canvas/25 py-7 sm:p-7 " + className}>
      <p className="mono text-[0.64rem] uppercase tracking-[0.15em] text-focus">{label}</p>
      <h3 className="mt-4 max-w-[28ch] text-2xl font-bold tracking-[-0.025em] !text-canvas">{title}</h3>
      <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-canvas/68">{body}</p>
      <Link
        href={href}
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-canvas underline decoration-canvas/40 underline-offset-8 hover:text-focus hover:decoration-focus"
      >
        {linkLabel}
        <ArrowRight aria-hidden="true" size={15} strokeWidth={2} />
      </Link>
    </article>
  );
}

function AxisMarker({ index, small = false }: { index: number; small?: boolean }) {
  const size = small ? "size-3" : "size-4";

  if (index === 0) {
    return <span aria-hidden="true" className={"block border-2 border-signal bg-canvas " + size} />;
  }
  if (index === 1) {
    return <span aria-hidden="true" className={"block rounded-full border-2 border-signal bg-canvas " + size} />;
  }
  if (index === 2) {
    return <span aria-hidden="true" className={"block rotate-45 border-2 border-signal bg-canvas " + size} />;
  }
  if (index === 3) {
    return (
      <span aria-hidden="true" className={"relative block " + size}>
        <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-signal" />
        <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-signal" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={"block border-2 border-signal bg-canvas " + size}
      style={{ clipPath: "polygon(50% 0, 100% 28%, 82% 100%, 18% 100%, 0 28%)" }}
    />
  );
}
