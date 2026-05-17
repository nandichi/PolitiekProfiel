import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { DimensionBar } from "@/components/DimensionBar";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { DIMENSIONS } from "@/lib/dimensions";
import {
  getAllPoliticiansSeed,
  getPoliticianBySlugSeed,
  getPartyBySlugSeed,
  getAllIdeologiesSeed,
} from "@/lib/seed-readers";
import { bestMatch, distance } from "@/lib/scoring";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import { loadPartyVotingByTheme } from "@/lib/tk-open-data/voting-store";
import { projectVotingToDimensions } from "@/lib/voting-projection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllPoliticiansSeed().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPoliticianBySlugSeed(slug);
  if (!p) return {};
  const title = `${p.name} — ${p.role}`;
  const path = `/politici/${slug}`;
  return {
    title,
    description: p.bio,
    alternates: { canonical: path },
    openGraph: {
      title: `${p.name} · PolitiekProfiel`,
      description: p.bio,
      url: path,
      type: "profile",
    },
  };
}

export default async function PoliticusDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const politicus = getPoliticianBySlugSeed(slug);
  if (!politicus) notFound();

  const ideologies = getAllIdeologiesSeed().map((i) => ({
    ...i,
    vector: i.profileVector,
  }));
  const closest = bestMatch(politicus.positionVector, ideologies);

  // Politici uit dezelfde partij of land
  const sameParty = getAllPoliticiansSeed()
    .filter((p) => p.slug !== slug && p.partySlug === politicus.partySlug)
    .slice(0, 4);

  // Vergelijkbare politici op vector-afstand
  const sortedByDistance = getAllPoliticiansSeed()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      ...p,
      d: distance(politicus.positionVector, p.positionVector),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);

  const party = politicus.partySlug
    ? getPartyBySlugSeed(politicus.partySlug)
    : null;

  // C5: stemgedrag-projectie via partij (alleen voor NL-politici met partij).
  const votingProjection =
    party && politicus.country === "Nederland"
      ? await projectVotingToDimensions(
          await loadPartyVotingByTheme(party.slug).catch(() => []),
        ).catch(() => null)
      : null;

  const path = `/politici/${slug}`;
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Politici", item: "/politici" },
    { name: politicus.name, item: path },
  ]);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: politicus.name,
    jobTitle: politicus.role,
    nationality: { "@type": "Country", name: politicus.country },
    description: politicus.bio,
    affiliation: party
      ? {
          "@type": "PoliticalParty",
          name: party.name,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdString([breadcrumbLd, personLd]),
        }}
      />

      <Container width="bleed" className="pt-10 md:pt-16">
        <Link
          href="/politici"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink no-underline mb-6"
        >
          <ArrowLeft size={14} strokeWidth={1.8} />
          Alle politici
        </Link>

        <ScrollReveal variant="stagger" immediate>
          <ScrollRevealItem>
            <Kicker>
              {politicus.country.toUpperCase()} · {politicus.party.toUpperCase()}
            </Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <h1
              className="display mt-6 max-w-4xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              {politicus.name}
            </h1>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-3 text-ink-muted">{politicus.role}</p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-8 max-w-2xl text-base md:text-lg text-ink-2 leading-relaxed">
              {politicus.bio}
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Vector */}
      <section className="mt-16 md:mt-20 border-t border-ink">
        <Container width="bleed" className="py-12 md:py-16">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Positie op de vijf dimensies</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                Een rustig portret in cijfers.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="mt-10 max-w-3xl">
                {DIMENSIONS.map((d, i) => (
                  <DimensionBar
                    key={d.id}
                    dimension={d.id}
                    value={politicus.positionVector[d.id]}
                    index={i}
                  />
                ))}
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-6 mono text-[0.65rem] tracking-wider text-ink-subtle max-w-3xl">
                POSITIES ZIJN SCHATTINGEN OP BASIS VAN PUBLIEKE STANDPUNTEN
                {politicus.lastReviewed
                  ? ` · LAATST GEVERIFIEERD ${politicus.lastReviewed.toUpperCase()}`
                  : ""}
              </p>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Stemgedrag-projectie (C5) */}
      {votingProjection && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number="1b">
                  Afgeleid uit het stemgedrag van de partij
                </Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  Wat zegt het werkelijke parlementaire stemgedrag?
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-4 max-w-2xl text-sm text-ink-2 leading-relaxed">
                  Onderstaande positie is geen schatting van standpunten, maar
                  een projectie van werkelijk stemgedrag van{" "}
                  {party?.abbreviation ?? politicus.party} in de Tweede Kamer
                  ({votingProjection.totalMotions.toLocaleString("nl-NL")} moties
                  meegenomen, {Math.round(votingProjection.coverage * 100)}%
                  themadekking). Individuele afwijkingen zijn niet meegenomen.
                </p>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-2 max-w-5xl">
                  <div>
                    <p className="kicker mb-3">Verklaarde positie</p>
                    {DIMENSIONS.map((d, i) => (
                      <DimensionBar
                        key={d.id}
                        dimension={d.id}
                        value={politicus.positionVector[d.id]}
                        index={i}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="kicker mb-3">Stemgedrag-projectie</p>
                    {DIMENSIONS.map((d, i) => (
                      <DimensionBar
                        key={d.id}
                        dimension={d.id}
                        value={votingProjection.vector[d.id]}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-6 mono text-[0.65rem] tracking-wider text-ink-subtle max-w-3xl">
                  PROJECTIE VIA THEMA→DIMENSIE-MATRIX OP BASIS VAN DE
                  STELLINGEN-DATABASE. RUWE BENADERING — DIRECTIONALITY PER MOTIE
                  IS NIET MEEGENOMEN.
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Dichtstbijzijnde ideologie */}
      {closest && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>Dichtstbijzijnde ideologie</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end max-w-4xl">
                  <div>
                    <h2 className="display text-3xl md:text-4xl text-ink">
                      {closest.item.name}
                    </h2>
                    <p className="mt-3 text-ink-2 leading-relaxed">
                      {closest.item.shortDescription}
                    </p>
                    <Link
                      href={`/ideologie/${closest.item.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-navy no-underline"
                    >
                      Lees ideologie-deepdive
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className="kicker mb-1">Overeenkomst</p>
                    <span className="display tabular-nums text-5xl md:text-6xl text-ink leading-none">
                      {closest.similarity}
                      <span className="text-2xl text-ink-muted">%</span>
                    </span>
                  </div>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Partij-context */}
      {party && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={3}>Partij-context</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  Waar {party.abbreviation} voor staat.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 max-w-5xl">
                  <div>
                    <p className="text-ink-2 leading-relaxed">
                      {party.description}
                    </p>
                    <Link
                      href={`/partij/${party.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-navy no-underline"
                    >
                      Partij-deepdive
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </Link>
                  </div>
                  <dl className="border-l border-rule pl-6 space-y-4 text-sm">
                    {party.seatsTK2025 !== undefined && (
                      <div>
                        <dt className="kicker mb-1">Zetels TK 2025</dt>
                        <dd className="display tabular-nums text-3xl text-ink leading-none">
                          {party.seatsTK2025}
                        </dd>
                      </div>
                    )}
                    {party.coalitionStatus && (
                      <div>
                        <dt className="kicker mb-1">Coalitiestatus</dt>
                        <dd className="mono text-[0.75rem] tracking-wider text-ink">
                          {party.coalitionStatus.toUpperCase()}
                        </dd>
                      </div>
                    )}
                    {party.factionLeader && (
                      <div>
                        <dt className="kicker mb-1">Fractievoorzitter</dt>
                        <dd className="text-ink">{party.factionLeader}</dd>
                      </div>
                    )}
                    {party.websiteUrl && (
                      <div>
                        <dt className="kicker mb-1">Website</dt>
                        <dd>
                          <a
                            href={party.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ink underline underline-offset-2 hover:text-navy break-all"
                          >
                            {party.websiteUrl.replace(/^https?:\/\//, "")}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Andere politici uit dezelfde partij */}
      {sameParty.length > 0 && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={4}>Uit dezelfde partij</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
                  {sameParty.map((p) => (
                    <li key={p.slug} className="border border-rule bg-paper p-4">
                      <Link
                        href={`/politici/${p.slug}`}
                        className="block no-underline group"
                      >
                        <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                          {p.country.toUpperCase()}
                        </p>
                        <p className="display mt-1 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                          {p.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">{p.role}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Dichtbij op de vijf assen */}
      <section className="border-t border-rule">
        <Container width="bleed" className="py-14 md:py-20">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={5}>Op de vijf assen dichtbij</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                Politiek dichtstbijzijnd, niet per definitie ideologisch verwant.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
                {sortedByDistance.map((p) => (
                  <li key={p.slug} className="border border-rule bg-paper p-5">
                    <Link
                      href={`/politici/${p.slug}`}
                      className="block no-underline group"
                    >
                      <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                        {p.party.toUpperCase()} · {p.country.toUpperCase()}
                      </p>
                      <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                        {p.name}
                      </p>
                      <p className="mt-1 text-xs text-ink-muted">{p.role}</p>
                      <p className="mt-3 mono text-[0.65rem] tracking-wider text-ink-subtle">
                        AFSTAND {Math.round(p.d)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
