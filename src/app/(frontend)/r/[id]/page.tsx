import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Repeat, BookOpen } from "lucide-react";
import { Container } from "@/components/Container";
import { DimensionBar } from "@/components/DimensionBar";
import { ScatterPlot } from "@/components/ScatterPlot";
import { RankedList } from "@/components/RankedList";
import { LexicalRenderer } from "@/components/LexicalRenderer";
import { ShareBlock } from "@/components/ShareBlock";
import { StickyIndex } from "@/components/StickyIndex";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getResult } from "@/lib/results-store";
import {
  getAllCountries,
  getAllPoliticians,
  getIdeologyBySlug,
} from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";
import { rankByDistance } from "@/lib/scoring";

type Args = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) {
    return {
      title: "Resultaat niet gevonden",
      robots: { index: false, follow: false },
    };
  }
  const ideo = await getIdeologyBySlug(result.ideologySlug);
  const name = ideo?.name ?? "Politiek profiel";
  return {
    title: `${name}`,
    description: ideo?.shortDescription ?? "Bekijk dit politieke profiel.",
    // Persoonlijke resultaten zijn deelbaar maar mogen niet in zoekindexen
    // verschijnen: privacy-belofte (anoniem) + vermijdt doorway-page risico
    // (zelfde structuur per ideologie). follow=true zodat link equity naar
    // /methodiek, /quiz/* en /vergelijk wel doorvloeit.
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: true,
        noimageindex: true,
      },
    },
    // Canonical naar de vergelijk-pagina met share-ID prefilled, omdat deze
    // pagina geen unieke "indexable" content is maar een deelbare view op
    // een record. /vergelijk is de bredere functionaliteit.
    alternates: { canonical: `/vergelijk?a=${result.shareId}` },
    openGraph: {
      title: `${name} · PolitiekProfiel`,
      description: ideo?.shortDescription ?? "Bekijk dit politieke profiel.",
      url: `/r/${id}`,
      type: "profile",
      images: [
        {
          url: `/api/og/${id}`,
          width: 1200,
          height: 630,
          alt: `Politiek profiel: ${name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} · PolitiekProfiel`,
      description: ideo?.shortDescription ?? "Bekijk dit politieke profiel.",
      images: [`/api/og/${id}`],
    },
  };
}

const INDEX_ITEMS = [
  { id: "profiel", label: "Profiel" },
  { id: "dimensies", label: "Dimensies" },
  { id: "politici", label: "Politici" },
  { id: "landen", label: "Landen" },
  { id: "delen", label: "Delen" },
];

export default async function ResultPage({ params }: Args) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const [ideo, politicians, countries] = await Promise.all([
    getIdeologyBySlug(result.ideologySlug),
    getAllPoliticians(),
    getAllCountries(),
  ]);
  if (!ideo) notFound();

  const rankedPoliticians = rankByDistance(
    result.dimensions,
    politicians.map((p) => ({
      id: String(p.id),
      primary: p.name,
      secondary: `${p.party} · ${p.country}`,
      vector: p.positionVector,
    }))
  );
  const rankedCountries = rankByDistance(
    result.dimensions,
    countries.map((c) => ({
      id: String(c.id),
      primary: c.name,
      secondary: c.description,
      vector: c.positionVector,
    }))
  );

  return (
    <div>
      <Container width="bleed" className="pt-10 md:pt-16">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-[220px_1fr]">
          {/* ─── Sticky Index ─── */}
          <StickyIndex items={INDEX_ITEMS} topOffset={96} />

          {/* ─── Main column ─── */}
          <div className="min-w-0">
            {/* PROFIEL */}
            <section id="profiel" className="scroll-mt-32">
              <ScrollReveal variant="stagger" immediate>
                <ScrollRevealItem>
                  <Kicker number={1}>Jouw politieke profiel</Kicker>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <h1
                    className="display mt-6 text-ink leading-[0.95]"
                    style={{
                      fontSize: "clamp(2.6rem, 7vw, 6rem)",
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {ideo.name}
                    <span className="text-terra">.</span>
                  </h1>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-8 max-w-2xl text-lg md:text-xl text-ink-2 leading-relaxed">
                    {ideo.shortDescription}
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-8 flex flex-wrap gap-2">
                    <MetaPill label="Tier" value={tierLabel(result.tier)} />
                    <MetaPill
                      label="Beantwoord"
                      value={`${result.answeredCount}/${result.totalQuestions}`}
                    />
                    {result.skippedCount > 0 && (
                      <MetaPill
                        label="Overgeslagen"
                        value={String(result.skippedCount)}
                      />
                    )}
                    <MetaPill
                      label="Spectrum"
                      value={ideo.spectrumPosition.replace("-", " ")}
                      capitalize
                    />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* Pull quote intro */}
            <section className="mt-20 md:mt-28 max-w-3xl">
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker>Wat houdt dit profiel in?</Kicker>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-5 editorial-prose">
                    <LexicalRenderer value={ideo.description} />
                  </div>
                </ScrollRevealItem>
                {ideo.examplePeople?.length ? (
                  <ScrollRevealItem>
                    <div className="mt-10 border-t border-rule pt-6">
                      <p className="kicker mb-4">Bekende voorbeelden</p>
                      <ul className="flex flex-wrap gap-2 text-sm">
                        {ideo.examplePeople.map((ex, i) => (
                          <li
                            key={i}
                            className="border border-rule px-3 py-1 text-ink-2"
                          >
                            {ex.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollRevealItem>
                ) : null}
              </ScrollReveal>
            </section>

            {/* DIMENSIES */}
            <section
              id="dimensies"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end mb-8">
                  <ScrollRevealItem>
                    <Kicker number={2}>Je scores op vijf assen</Kicker>
                    <h2 className="display mt-5">Waar je staat, in cijfers.</h2>
                  </ScrollRevealItem>
                  <ScrollRevealItem>
                    <p className="text-sm text-ink-muted max-w-xs">
                      Iedere score loopt van −100 tot +100. Een score rond nul
                      betekent geen sterke voorkeur op die as.
                    </p>
                  </ScrollRevealItem>
                </div>
                <ScrollRevealItem>
                  <div className="border-t border-rule">
                    {DIMENSIONS.map((d, i) => (
                      <DimensionBar
                        key={d.id}
                        dimension={d.id}
                        value={result.dimensions[d.id]}
                        index={i}
                      />
                    ))}
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* POLITICI */}
            <section
              id="politici"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={3}>Vergelijk met politici</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Welke politici staan dichtbij jouw posities?
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
                    <div>
                      <ScatterPlot
                        user={result.dimensions}
                        points={politicians.map((p) => ({
                          id: String(p.id),
                          label: p.name,
                          sublabel: `${p.party} · ${p.country}`,
                          vector: p.positionVector,
                        }))}
                        initialX="economic"
                        initialY="social"
                      />
                    </div>
                    <div>
                      <p className="kicker mb-4">Rangschikking</p>
                      <RankedList
                        matches={rankedPoliticians}
                        limit={20}
                        highlightFirst
                      />
                    </div>
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* LANDEN */}
            <section
              id="landen"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={4}>Vergelijk met landen</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Op welk land lijkt jouw profiel het meest?
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
                    <div className="lg:order-2">
                      <ScatterPlot
                        user={result.dimensions}
                        points={countries.map((c) => ({
                          id: String(c.id),
                          label: c.name,
                          sublabel: c.description,
                          vector: c.positionVector,
                        }))}
                        initialX="economic"
                        initialY="governance"
                      />
                    </div>
                    <div className="lg:order-1">
                      <p className="kicker mb-4">Rangschikking</p>
                      <RankedList matches={rankedCountries} highlightFirst />
                    </div>
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* DELEN */}
            <section
              id="delen"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12 pb-8"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={5}>Deel of vergelijk</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Bewaar je profiel, of leg het naast iemand anders.
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10">
                    <ShareBlock
                      shareId={result.shareId}
                      ideologyName={ideo.name}
                    />
                  </div>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                      href={`/vergelijk?a=${result.shareId}`}
                      className="btn btn-secondary"
                    >
                      <Repeat size={16} strokeWidth={1.8} />
                      Vergelijk met een ander profiel
                    </Link>
                    <Link href="/methodiek" className="btn-ghost">
                      <BookOpen size={14} strokeWidth={1.8} />
                      Lees de methodiek
                    </Link>
                    <Link href="/quiz/standard" className="btn-ghost">
                      Doe de quiz opnieuw
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </Link>
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}

function MetaPill({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <span className="inline-flex items-baseline gap-2 border border-rule px-3 py-1.5 text-xs">
      <span className="mono text-[0.62rem] tracking-wider text-ink-muted">
        {label.toUpperCase()}
      </span>
      <span className={capitalize ? "capitalize text-ink-2" : "text-ink-2"}>
        {value}
      </span>
    </span>
  );
}

function tierLabel(tier: string): string {
  if (tier === "quick") return "Quick · 30 vragen";
  if (tier === "extended") return "Uitgebreid · 80 vragen";
  return "Standaard · 50 vragen";
}
