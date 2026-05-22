import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { DimensionBar } from "@/components/DimensionBar";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { DIMENSIONS } from "@/lib/dimensions";
import { THEMES } from "@/lib/themes";
import {
  getAllPartiesSeed,
  getPartyBySlugSeed,
  getAllPoliticiansSeed,
  getAllIdeologiesSeed,
} from "@/lib/seed-readers";
import { distance } from "@/lib/scoring";
import {
  PARTY_PROGRAMMES,
  PROGRAMME_SOURCES,
} from "@/data/party-programmes";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import { loadPartyVotingByTheme } from "@/lib/tk-open-data/voting-store";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPartiesSeed().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPartyBySlugSeed(slug);
  if (!p) return {};
  const path = `/partij/${slug}`;
  return {
    title: `${p.name} (${p.abbreviation})`,
    description: p.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${p.name} · PolitiekProfiel`,
      description: p.description,
      url: path,
      type: "article",
    },
  };
}

const COALITION_LABEL = {
  governing: "Coalitiepartij in kabinet-Jetten",
  opposition: "Oppositie",
  splinter: "Afgesplitst van moederpartij",
  none: "Geen Kamerzetels",
} as const;

export default async function PartijDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const party = getPartyBySlugSeed(slug);
  if (!party) notFound();

  const programme = PARTY_PROGRAMMES[slug];
  const programmeSource = PROGRAMME_SOURCES[slug];

  const allParties = getAllPartiesSeed();
  const closeParties = allParties
    .filter((p) => p.slug !== slug && p.region === party.region)
    .map((p) => ({ ...p, d: distance(party.positionVector, p.positionVector) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 4);

  const politicians = getAllPoliticiansSeed().filter(
    (p) =>
      p.partySlug === slug ||
      p.party.toLowerCase() === party.name.toLowerCase() ||
      p.party.toLowerCase() === party.abbreviation.toLowerCase(),
  );

  const ideologies = getAllIdeologiesSeed().filter((i) =>
    party.ideologySlugs.includes(i.slug),
  );

  // TK stemgedrag (B2): kan leeg zijn als cron nog niet heeft gedraaid of
  // partij geen Kamerzetels heeft.
  const votingRecords = party.region === "NL"
    ? await loadPartyVotingByTheme(party.slug).catch(() => [])
    : [];
  const votingByTheme = new Map<string, (typeof votingRecords)[number]>();
  for (const v of votingRecords) {
    if (v.theme !== "overig") votingByTheme.set(v.theme, v);
  }
  const totalMotions = votingRecords.reduce((s, v) => s + v.totaal, 0);

  const path = `/partij/${slug}`;
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Partijen", item: "/partijen" },
    { name: party.name, item: path },
  ]);

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    name: party.name,
    alternateName: party.abbreviation,
    description: party.description,
    url: party.websiteUrl,
    foundingDate: party.founded,
    leader: party.leader,
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(orgLd) }}
      />

      <Container width="bleed" className="pt-10 md:pt-16">
        <Link
          href="/partijen"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink no-underline mb-6"
        >
          <ArrowLeft size={14} strokeWidth={1.8} />
          Alle partijen
        </Link>

        <ScrollReveal variant="stagger" immediate>
          <ScrollRevealItem>
            <Kicker>{party.abbreviation}</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <h1
              className="display mt-6 max-w-4xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              {party.name}
            </h1>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-8 max-w-3xl text-base md:text-lg text-ink-2 leading-relaxed">
              {party.description}
            </p>
          </ScrollRevealItem>

          {/* Meta-strip */}
          <ScrollRevealItem>
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border border-rule max-w-4xl">
              <Meta term="Opgericht" value={party.founded ?? "Onbekend"} />
              <Meta term="Partijleider" value={party.leader ?? "Onbekend"} />
              <Meta
                term="Fractievoorzitter"
                value={party.factionLeader ?? party.leader ?? "Onbekend"}
              />
              <Meta
                term="Zetels TK 2025"
                value={String(party.seatsTK2025 ?? 0)}
              />
            </dl>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              {party.coalitionStatus && (
                <span className="inline-flex items-baseline gap-2 border border-rule px-3 py-1.5">
                  <span className="mono text-[0.62rem] tracking-wider text-ink-muted">
                    STATUS
                  </span>
                  <span className="text-ink-2">
                    {COALITION_LABEL[party.coalitionStatus]}
                  </span>
                </span>
              )}
              {party.cpbReviewed2025 && (
                <span className="inline-flex items-baseline gap-2 border border-rule px-3 py-1.5">
                  <span className="mono text-[0.62rem] tracking-wider text-ink-muted">
                    CPB 2025
                  </span>
                  <span className="text-ink-2">Doorgerekend</span>
                </span>
              )}
              {party.websiteUrl && (
                <a
                  href={party.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-rule px-3 py-1.5 text-ink-2 no-underline hover:text-navy"
                >
                  Partijwebsite
                  <ExternalLink size={11} strokeWidth={1.8} />
                </a>
              )}
            </div>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Dimensies */}
      <section className="mt-16 md:mt-20 border-t border-ink">
        <Container width="bleed" className="py-12 md:py-16">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Positie op de vijf dimensies</Kicker>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="mt-8 max-w-3xl">
                {DIMENSIONS.map((d, i) => (
                  <DimensionBar
                    key={d.id}
                    dimension={d.id}
                    value={party.positionVector[d.id]}
                    index={i}
                  />
                ))}
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-6 mono text-[0.62rem] tracking-wider text-ink-subtle max-w-3xl">
                BRONNEN: {party.sources.map((s) => s.label).join(" · ").toUpperCase()}
              </p>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Programma per thema */}
      {programme && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>Programma per thema</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  Wat zegt {party.abbreviation} over de zeven thema's?
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                  Redactionele samenvatting per thema, op basis van het
                  verkiezingsprogramma 2025 en het kabinetsbeleid (mei 2026).
                  Geen rangschikking, geen stemadvies.
                </p>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-10 max-w-5xl">
                  {THEMES.map((t) => {
                    const block = programme[t.id];
                    if (!block) return null;
                    return (
                      <div
                        key={t.id}
                        className="border-t border-rule pt-6"
                      >
                        <p className="kicker mb-2">{t.label}</p>
                        <p className="text-base text-ink leading-relaxed">
                          {block.summary}
                        </p>
                        <ul className="mt-4 space-y-2">
                          {block.bullets.map((b, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm text-ink-2 leading-relaxed"
                            >
                              <span className="mono text-[0.6rem] tracking-wider text-ink-subtle shrink-0 mt-1">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span>{b.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </ScrollRevealItem>
              {programmeSource && (
                <ScrollRevealItem>
                  <p className="mt-10 mono text-[0.62rem] tracking-wider text-ink-subtle">
                    BRON:{" "}
                    <a
                      href={programmeSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-2 hover:text-navy no-underline"
                    >
                      {programmeSource.label.toUpperCase()}
                      <ExternalLink
                        size={10}
                        strokeWidth={1.8}
                        className="inline-block ml-1 mb-0.5"
                      />
                    </a>
                  </p>
                </ScrollRevealItem>
              )}
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Stemgedrag per thema (B2) */}
      {totalMotions > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={3}>Stemgedrag per thema</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  Wat stemt {party.abbreviation} in de praktijk?
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                  Aggregaat van moties en wetsvoorstellen die in de Tweede
                  Kamer ter stemming kwamen. Thema-classificatie via
                  keyword-mapping. Gewogen percentage 'voor' van het totaal
                  uitgebrachte stemmen.
                </p>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 max-w-4xl">
                  {THEMES.map((t) => {
                    const v = votingByTheme.get(t.id);
                    return (
                      <li key={t.id} className="border-t border-rule pt-4">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="display text-base text-ink">
                            {t.label}
                          </p>
                          <p className="mono tabular-nums text-sm text-ink">
                            {v ? `${v.voorPct}%` : "n.v.t."}
                          </p>
                        </div>
                        <VotingBar v={v} />
                        <p className="mt-1.5 text-[0.7rem] text-ink-muted">
                          {v
                            ? `${v.voor} voor · ${v.tegen} tegen · ${v.onthouding} onth. · n=${v.totaal}`
                            : "Nog geen data deze refresh-cyclus."}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-6 mono text-[0.6rem] tracking-wider text-ink-subtle">
                  BRON: TWEEDE KAMER OPEN DATA (OData v4) · WEKELIJKSE REFRESH
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Ideologieën */}
      {ideologies.length > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={4}>Aansluitende ideologieën</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  {ideologies.map((i) => (
                    <li key={i.slug} className="border border-rule bg-paper p-5">
                      <Link
                        href={`/ideologie/${i.slug}`}
                        className="block no-underline group"
                      >
                        <p className="display text-lg text-ink group-hover:text-navy transition-colors">
                          {i.name}
                        </p>
                        {i.shortDescription && (
                          <p className="mt-2 text-sm text-ink-2 leading-snug">
                            {i.shortDescription}
                          </p>
                        )}
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-2 group-hover:text-navy">
                          Verken ideologie
                          <ArrowRight size={12} strokeWidth={1.8} />
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Politici van deze partij */}
      {politicians.length > 0 && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={5}>
                  Politici van {party.abbreviation}
                </Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
                  {politicians.map((pol) => (
                    <li
                      key={pol.slug}
                      className="border border-rule bg-paper p-5"
                    >
                      <Link
                        href={`/politici/${pol.slug}`}
                        className="block no-underline group"
                      >
                        <p className="display text-base text-ink group-hover:text-navy transition-colors">
                          {pol.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">
                          {pol.role}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Dichtbij gelegen partijen */}
      {closeParties.length > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={6}>Dichtbij op de vijf assen</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  Vier partijen die {party.abbreviation} het meest benaderen.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
                  {closeParties.map((p) => (
                    <li key={p.slug} className="border border-rule bg-paper p-5">
                      <Link
                        href={`/partij/${p.slug}`}
                        className="block no-underline group"
                      >
                        <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                          {p.abbreviation.toUpperCase()}
                        </p>
                        <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                          {p.name}
                        </p>
                        <p className="mt-3 mono text-[0.65rem] tracking-wider text-ink-subtle">
                          AFSTAND {Math.round(p.d)}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-2 group-hover:text-navy">
                          Bekijk
                          <ArrowRight size={12} strokeWidth={1.8} />
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}
    </>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div className="bg-paper p-4">
      <dt className="kicker mb-1">{term}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}

function VotingBar({
  v,
}: {
  v?: { voorPct: number; tegen: number; voor: number; totaal: number; onthouding: number };
}) {
  if (!v || v.totaal === 0) {
    return (
      <div
        className="mt-2 h-1.5 bg-rule"
        aria-hidden
      />
    );
  }
  const voor = (v.voor / v.totaal) * 100;
  const tegen = (v.tegen / v.totaal) * 100;
  return (
    <div className="mt-2 h-1.5 bg-rule overflow-hidden flex" aria-hidden>
      <span style={{ width: `${voor}%` }} className="bg-navy" />
      <span style={{ width: `${tegen}%` }} className="bg-terra" />
    </div>
  );
}
