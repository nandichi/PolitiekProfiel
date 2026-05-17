import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getActiveDutchParties } from "@/lib/seed-readers";
import {
  findCoalitions,
  presetCoalitions,
  type CoalitionInput,
} from "@/lib/coalition";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import { CoalitionResultExplorer } from "@/components/coalition/CoalitionResultExplorer";
import { getResult } from "@/lib/results-store";
import { DIMENSIONS } from "@/lib/dimensions";

interface PageProps {
  searchParams: Promise<{ r?: string }>;
}

const PAGE_PATH = "/coalitie";
const PAGE_TITLE = "Coalitie-simulator";
const PAGE_DESCRIPTION =
  "Welke coalities zijn rekenkundig mogelijk in de huidige Tweede Kamer, en welke ligt het dichtst bij jouw eigen positie?";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: `${PAGE_TITLE} · PolitiekProfiel`,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "website",
  },
};

export default async function CoalitiePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const result = sp.r ? await getResult(sp.r) : null;

  const partiesSeed = getActiveDutchParties();
  const pool: CoalitionInput[] = partiesSeed.map((p) => ({
    slug: p.slug,
    name: p.name,
    abbreviation: p.abbreviation,
    seats: p.seatsTK2025 ?? 0,
    vector: p.positionVector,
    coalitionStatus: p.coalitionStatus,
  }));

  // Default (non-personalised): tel naar laagste partijenaantal voor majority.
  const defaultCoalitions = findCoalitions({
    parties: pool,
    majority: 76,
    maxSize: 5,
    limit: 20,
  });

  // Personalised: gebruik user-vector als die bekend is via ?r=
  const personalised = result
    ? findCoalitions({
        parties: pool,
        userVector: result.dimensions,
        majority: 76,
        maxSize: 6,
        limit: 12,
      })
    : null;

  const presets = presetCoalitions(pool);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Coalitie-simulator", item: PAGE_PATH },
  ]);

  return (
    <Container width="bleed" className="pt-12 md:pt-20 pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <ScrollReveal variant="stagger" immediate>
        <ScrollRevealItem>
          <Kicker number="B5">Coalitie-simulator</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Welke coalitie{" "}
            <em className="display-italic font-light text-navy">
              past het beste
            </em>{" "}
            bij jou?
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Met de huidige zetelverdeling (TK 2025) zoeken we combinaties van
            partijen die samen minimaal 76 zetels halen. Doe de quiz om de
            beste match te zien op basis van jouw vector op de vijf dimensies.
            Geen stemadvies — een gedachte-experiment.
          </p>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quiz/standard" className="btn btn-primary">
              Doe de quiz
            </Link>
            <Link href="/vergelijk" className="btn btn-ghost">
              Heb je al een resultaat?
            </Link>
          </div>
        </ScrollRevealItem>
      </ScrollReveal>

      {/* Personalised explorer */}
      <section className="mt-16 md:mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>Personaliseer op basis van jouw profiel</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 max-w-2xl text-sm text-ink-muted">
              Plak je share-link of share-ID (te vinden onderaan jouw
              resultaatpagina). We rekenen lokaal — geen tracking, geen opslag.
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-8">
              <CoalitionResultExplorer pool={pool} />
            </div>
          </ScrollRevealItem>

          {personalised && personalised.length > 0 && (
            <ScrollRevealItem>
              <div className="mt-12">
                <p className="kicker mb-4">
                  Top 12 op basis van jouw vector ({result?.shareId})
                </p>
                <ul className="border-t border-rule">
                  {personalised.map((c, i) => (
                    <li key={i} className="border-b border-rule py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_120px_140px_140px] gap-3 lg:gap-6 items-center">
                        <p className="index-num text-xs">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {c.parties.map((p) => (
                            <li key={p.slug}>
                              <Link
                                href={`/partij/${p.slug}`}
                                className="inline-flex items-baseline gap-2 border border-rule px-2.5 py-1 text-xs text-ink-2 no-underline hover:text-navy"
                              >
                                <span>{p.abbreviation}</span>
                                <span className="mono tabular-nums text-[0.6rem] text-ink-subtle">
                                  {p.seats}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <p className="mono tabular-nums text-sm text-ink">
                          {c.totalSeats}{" "}
                          <span className="text-ink-muted text-xs">zetels</span>
                        </p>
                        <div>
                          <p className="mono text-[0.6rem] tracking-wider text-ink-subtle">
                            AFSTAND
                          </p>
                          <p className="mono tabular-nums text-sm text-ink">
                            {Math.round(c.weightedDistance)}
                          </p>
                        </div>
                        <div>
                          <p className="mono text-[0.6rem] tracking-wider text-ink-subtle">
                            SPREAD
                          </p>
                          <p className="mono tabular-nums text-sm text-ink">
                            {Math.round(c.spread)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-xs text-ink-muted max-w-2xl">
                  Afstand = gewogen euclidische afstand van jouw vector tot het
                  zetel-gewogen zwaartepunt van de coalitie. Spread = grootste
                  onderlinge afstand binnen de coalitie. Lager is in beide
                  gevallen &lsquo;dichterbij&rsquo;.
                </p>

                <details className="mt-6 max-w-2xl">
                  <summary className="cursor-pointer text-sm text-ink-2 hover:text-navy">
                    Hoe vergelijken deze coalities zich met jouw vector?
                  </summary>
                  <div className="mt-4 border border-rule p-4">
                    {result && (
                      <div>
                        <p className="kicker mb-2">Jouw vector</p>
                        <ul className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                          {DIMENSIONS.map((d) => (
                            <li key={d.id} className="text-xs">
                              <p className="text-ink-muted">{d.shortLabel}</p>
                              <p className="mono tabular-nums text-ink">
                                {result.dimensions[d.id] > 0 ? "+" : ""}
                                {Math.round(result.dimensions[d.id])}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </ScrollRevealItem>
          )}
        </ScrollReveal>
      </section>

      {/* Presets */}
      <section className="mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={2}>Bekende scenario&rsquo;s</Kicker>
            <h2 className="display mt-5 max-w-3xl">
              Vijf coalities zoals die nu in het debat circuleren.
            </h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <ul className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
              {presets.map((preset) => {
                const totalSeats = preset.parties.reduce(
                  (s, p) => s + p.seats,
                  0,
                );
                return (
                  <li key={preset.name} className="border border-rule bg-paper p-6">
                    <div className="flex items-baseline justify-between">
                      <p className="display text-lg text-ink">{preset.name}</p>
                      <p className="mono tabular-nums text-sm text-ink">
                        {totalSeats}{" "}
                        <span className="text-ink-muted text-xs">zetels</span>
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-ink-2 leading-relaxed">
                      {preset.description}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {preset.parties.map((p) => (
                        <li key={p.slug}>
                          <Link
                            href={`/partij/${p.slug}`}
                            className="inline-flex items-baseline gap-2 border border-rule px-2.5 py-1 text-xs text-ink-2 no-underline hover:text-navy"
                          >
                            <span>{p.abbreviation}</span>
                            <span className="mono tabular-nums text-[0.6rem] text-ink-subtle">
                              {p.seats}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Rekenkundige top */}
      <section className="mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={3}>Rekenkundig kleinste meerderheden</Kicker>
            <h2 className="display mt-5 max-w-3xl">
              Twintig coalities (≤ 5 partijen) die samen 76+ zetels halen.
            </h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 max-w-2xl text-sm text-ink-muted">
              Zonder personalisatie sorteren we op &quot;spread&quot;: hoe ver
              de partijen op de vijf assen uit elkaar liggen. Een kleine
              spread voorspelt makkelijker akkoord. Geen rekening gehouden met
              uitsluitingen of politieke voorkeuren — puur arithmetisch.
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <ul className="mt-8 border-t border-rule">
              {defaultCoalitions
                .slice()
                .sort((a, b) => a.spread - b.spread)
                .slice(0, 12)
                .map((c, i) => (
                  <li key={i} className="border-b border-rule py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_140px_120px] gap-3 lg:gap-6 items-center">
                      <p className="index-num text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {c.parties.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/partij/${p.slug}`}
                              className="inline-flex items-baseline gap-2 border border-rule px-2.5 py-1 text-xs text-ink-2 no-underline hover:text-navy"
                            >
                              <span>{p.abbreviation}</span>
                              <span className="mono tabular-nums text-[0.6rem] text-ink-subtle">
                                {p.seats}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mono tabular-nums text-sm text-ink">
                        {c.totalSeats}{" "}
                        <span className="text-ink-muted text-xs">zetels</span>
                      </p>
                      <div>
                        <p className="mono text-[0.6rem] tracking-wider text-ink-subtle">
                          SPREAD
                        </p>
                        <p className="mono tabular-nums text-sm text-ink">
                          {Math.round(c.spread)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Disclaimer */}
      <section className="mt-20 border-t border-ink pt-10 max-w-3xl">
        <p className="kicker mb-3">Geen stemadvies</p>
        <p className="text-sm text-ink-2 leading-relaxed">
          Deze simulator rekent op afstanden tussen partijposities op vijf
          dimensies. Een lage afstand zegt niets over haalbaarheid in de
          praktijk: politiek wordt mede bepaald door uitsluitingen, persoonlijke
          verhoudingen en thema-prioriteiten. Voor de echte formatie zie de
          publicaties van de informateur en parlement.com.
        </p>
        <div className="mt-6">
          <MiniVector
            vector={{ economic: 0, social: 0, civil: 0, governance: 0, trust: 0 }}
            showLabels
            size="sm"
          />
        </div>
      </section>
    </Container>
  );
}
