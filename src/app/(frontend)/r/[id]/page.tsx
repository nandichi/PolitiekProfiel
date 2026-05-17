import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Repeat, BookOpen } from "lucide-react";
import { Container } from "@/components/Container";
import { DimensionBar } from "@/components/DimensionBar";
import { ScatterPlot } from "@/components/ScatterPlot";
import { RankedList } from "@/components/RankedList";
import { ShareBlock } from "@/components/ShareBlock";
import { StickyIndex } from "@/components/StickyIndex";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { AiContentBlock, AiContentItemList } from "@/components/result/AiContentBlock";
import { ConfidenceIndicator } from "@/components/result/ConfidenceIndicator";
import { ThemeBars } from "@/components/result/ThemeBars";
import { ParadoxList, type ParadoxItemContext } from "@/components/result/ParadoxList";
import { PartyContext } from "@/components/result/PartyContext";
import { StanceExtract } from "@/components/result/StanceExtract";
import { getResult } from "@/lib/results-store";
import {
  getAllCountries,
  getAllParties,
  getAllPoliticians,
  getIdeologyBySlug,
} from "@/lib/result-data";
import { DIMENSIONS, dimensionMeta } from "@/lib/dimensions";
import { rankByDistance } from "@/lib/scoring";
import { THEMES } from "@/lib/themes";
import { scoreToBucket } from "@/lib/buckets";
import { confidenceBand, confidenceBandLabel } from "@/lib/confidence";
import {
  dimensionBucketSlug,
  getAiContentBySlug,
  getAiContentBySlugs,
  ideologyArgumentsAgainstSlug,
  ideologyArgumentsForSlug,
  ideologyEssaySlug,
  ideologyReadingSlug,
  ideologyThemeSlug,
  paradoxSlug,
} from "@/lib/ai-content";
import type { ParadoxType } from "@/lib/paradox";
import { extractStances, getQuestionsByIds } from "@/lib/stance-extract";

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
  { id: "dimensies", label: "Vijf dimensies" },
  { id: "themas", label: "Zeven thema's" },
  { id: "standpunten", label: "Standpunten" },
  { id: "paradoxen", label: "Paradoxen" },
  { id: "partijen", label: "Partij-context" },
  { id: "politici", label: "Politici" },
  { id: "landen", label: "Landen" },
  { id: "delen", label: "Delen" },
];

export default async function ResultPage({ params }: Args) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const [ideo, politicians, countries, allParties] = await Promise.all([
    getIdeologyBySlug(result.ideologySlug),
    getAllPoliticians(),
    getAllCountries(),
    getAllParties(),
  ]);
  if (!ideo) notFound();

  const parties = allParties.filter((p) =>
    Array.isArray(p.ideologySlugs) && p.ideologySlugs.includes(ideo.slug),
  );

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

  const overallConfidence = result.confidence
    ? Math.round(
        (DIMENSIONS.reduce((s, d) => s + (result.confidence?.[d.id] ?? 0), 0) /
          DIMENSIONS.length),
      )
    : null;

  const dimensionSlugs = DIMENSIONS.map((d) =>
    dimensionBucketSlug(d.id, scoreToBucket(result.dimensions[d.id])),
  );
  const themeSlugs = THEMES.map((t) => ideologyThemeSlug(ideo.slug, t.id));
  const paradoxSlugs = (result.paradoxes ?? []).map((p) =>
    paradoxSlug(p.type as ParadoxType),
  );

  const [
    essayContent,
    readingContent,
    argumentsForContent,
    argumentsAgainstContent,
    dimensionBucketMap,
    themeMap,
    paradoxMap,
  ] = await Promise.all([
    getAiContentBySlug(ideologyEssaySlug(ideo.slug)),
    getAiContentBySlug(ideologyReadingSlug(ideo.slug)),
    getAiContentBySlug(ideologyArgumentsForSlug(ideo.slug)),
    getAiContentBySlug(ideologyArgumentsAgainstSlug(ideo.slug)),
    getAiContentBySlugs(dimensionSlugs),
    getAiContentBySlugs(themeSlugs),
    getAiContentBySlugs(paradoxSlugs),
  ]);

  const stances = result.answers ? await extractStances(result.answers, 6) : [];

  const paradoxExampleIds = (result.paradoxes ?? [])
    .flatMap((p) => p.exampleQuestionIds ?? []);
  const paradoxExampleMap = await getQuestionsByIds(paradoxExampleIds);

  const paradoxItems: ParadoxItemContext[] = (result.paradoxes ?? []).map((p) => ({
    signal: {
      type: p.type as ParadoxType,
      severity: p.severity,
      dimension: p.dimension as Parameters<typeof dimensionMeta>[0] | undefined,
      theme: p.theme as never,
      description: p.description ?? "",
      exampleQuestionIds: p.exampleQuestionIds ?? [],
    },
    aiContent: paradoxMap.get(paradoxSlug(p.type as ParadoxType)) ?? null,
    examples: (p.exampleQuestionIds ?? [])
      .map((qid) => paradoxExampleMap.get(qid))
      .filter((q): q is { id: number; statement: string } => Boolean(q)),
  }));

  return (
    <div>
      <Container width="bleed" className="pt-10 md:pt-16">
        <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-[220px_1fr]">
          <StickyIndex items={INDEX_ITEMS} topOffset={96} />

          <div className="min-w-0">
            {/* SECTIE 1 — PROFIEL */}
            <section id="profiel" className="scroll-mt-32">
              <ScrollReveal variant="stagger" immediate>
                <ScrollRevealItem>
                  <Kicker number={1}>Jouw politieke profiel</Kicker>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <h1
                    lang="nl"
                    className="display mt-6 text-ink leading-[0.95] wrap-break-word [hyphens:auto]"
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
                  <div className="mt-8 flex flex-wrap items-center gap-2">
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
                    {overallConfidence !== null && (
                      <ConfidenceIndicator
                        score={overallConfidence}
                        label="Vertrouwen"
                      />
                    )}
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>

              <div className="mt-16 md:mt-20 max-w-3xl">
                <Kicker>Wat houdt dit profiel in?</Kicker>
                <div className="mt-5">
                  <AiContentBlock
                    content={essayContent}
                    fallback={undefined}
                    variant="prose"
                    showSourceNote
                  />
                </div>

                {ideo.examplePeople?.length ? (
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
                ) : null}
              </div>
            </section>

            {/* SECTIE 2 — DIMENSIES */}
            <section
              id="dimensies"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end mb-8">
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
                    {DIMENSIONS.map((d, i) => {
                      const value = result.dimensions[d.id];
                      const dimConfidence = result.confidence?.[d.id];
                      const bucket = scoreToBucket(value);
                      const bucketContent = dimensionBucketMap.get(
                        dimensionBucketSlug(d.id, bucket),
                      );
                      return (
                        <div key={d.id}>
                          <DimensionBar
                            dimension={d.id}
                            value={value}
                            index={i}
                          />
                          {(bucketContent || dimConfidence !== undefined) && (
                            <div className="pb-7 -mt-1 grid grid-cols-1 md:grid-cols-[1fr_auto] md:gap-8 md:items-start">
                              <div className="max-w-2xl">
                                <AiContentBlock
                                  content={bucketContent}
                                  variant="compact"
                                />
                              </div>
                              {dimConfidence !== undefined && (
                                <div className="mt-4 md:mt-1">
                                  <ConfidenceIndicator
                                    score={dimConfidence}
                                    label="Vertrouwen op deze as"
                                  />
                                  <p className="mt-2 text-xs text-ink-muted max-w-56">
                                    {confidenceExplain(dimConfidence)}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 3 — THEMA'S */}
            <section
              id="themas"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-end mb-8">
                  <ScrollRevealItem>
                    <Kicker number={3}>Zeven beleidsthema&apos;s</Kicker>
                    <h2 className="display mt-5">
                      Hoe je denkt per onderwerp.
                    </h2>
                  </ScrollRevealItem>
                  <ScrollRevealItem>
                    <p className="text-sm text-ink-muted max-w-xs">
                      Thema-scores zijn afgeleid uit relevante stellingen en
                      vullen het dimensie-profiel aan met concrete politieke
                      onderwerpen.
                    </p>
                  </ScrollRevealItem>
                </div>

                {result.themeScores ? (
                  <>
                    <ScrollRevealItem>
                      <ThemeBars scores={result.themeScores} />
                    </ScrollRevealItem>
                    <ScrollRevealItem>
                      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {THEMES.map((t) => {
                          const themeContent = themeMap.get(
                            ideologyThemeSlug(ideo.slug, t.id),
                          );
                          if (!themeContent) return null;
                          return (
                            <div
                              key={t.id}
                              className="border-t border-rule pt-5"
                            >
                              <p className="kicker mb-2">{t.label}</p>
                              <AiContentBlock
                                content={themeContent}
                                variant="compact"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </ScrollRevealItem>
                  </>
                ) : (
                  <p className="text-ink-muted text-sm">
                    Voor dit resultaat zijn nog geen thema-scores beschikbaar.
                    Doe de quiz opnieuw om thema-data te krijgen.
                  </p>
                )}
              </ScrollReveal>
            </section>

            {/* SECTIE 4 — STANDPUNTEN */}
            <section
              id="standpunten"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={4}>Wat je waarschijnlijk vindt</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Zes concrete standpunten gedistilleerd uit je antwoorden.
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                    Server-side afgeleid uit jouw sterkste antwoorden. Geen AI
                    en geen externe analyse — pure regelgebaseerde extractie
                    van je eigen keuzes.
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10">
                    <StanceExtract items={stances} />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 5 — PARADOXEN */}
            <section
              id="paradoxen"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={5}>Interne spanningen</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Waar je antwoorden elkaar mogelijk tegenspreken.
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                    Spanningen tussen antwoorden zijn niet per se fout. Ze
                    kunnen wijzen op een genuanceerde positie, een
                    onderbelichte afweging of een onderwerp waar je nog over
                    nadenkt.
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10">
                    <ParadoxList items={paradoxItems} />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 6 — PARTIJ-CONTEXT */}
            <section
              id="partijen"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={6}>Partij-context per regio</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Welke partijen sluiten doorgaans aan bij jouw ideologie?
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                    PolitiekProfiel rangschikt geen partijen voor jou
                    persoonlijk. We tonen wel welke partijen in hoofdlijnen
                    overeenkomen met de ideologie waar jouw profiel het
                    sterkst op lijkt — Nederland, Europa, Verenigde Staten.
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10">
                    <PartyContext parties={parties} ideologyName={ideo.name} />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 7 — POLITICI */}
            <section
              id="politici"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={7}>Vergelijk met politici</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Welke politici staan dichtbij jouw posities?
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
                    <div className="min-w-0">
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
                    <div className="min-w-0">
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

            {/* SECTIE 8 — LANDEN */}
            <section
              id="landen"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={8}>Vergelijk met landen</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Op welk land lijkt jouw profiel het meest?
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
                    <div className="min-w-0 lg:order-2">
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
                    <div className="min-w-0 lg:order-1">
                      <p className="kicker mb-4">Rangschikking</p>
                      <RankedList matches={rankedCountries} highlightFirst />
                    </div>
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 9 — DELEN */}
            <section
              id="delen"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12 pb-8"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={9}>Deel, lees verder of vergelijk</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Bewaar je profiel, leg het naast iemand anders, of duik
                    dieper in deze ideologie.
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

                {(argumentsForContent || argumentsAgainstContent) && (
                  <ScrollRevealItem>
                    <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {argumentsForContent && (
                        <div className="border-t border-rule pt-6">
                          <p className="kicker mb-3">
                            Sterkste argumenten voor jouw kant
                          </p>
                          <AiContentItemList content={argumentsForContent} />
                        </div>
                      )}
                      {argumentsAgainstContent && (
                        <div className="border-t border-rule pt-6">
                          <p className="kicker mb-3">Wat zou een ander zeggen?</p>
                          <AiContentItemList content={argumentsAgainstContent} />
                        </div>
                      )}
                    </div>
                  </ScrollRevealItem>
                )}

                {readingContent && (
                  <ScrollRevealItem>
                    <div className="mt-14 border-t border-rule pt-6">
                      <p className="kicker mb-3">Lees verder</p>
                      <AiContentItemList content={readingContent} />
                    </div>
                  </ScrollRevealItem>
                )}

                <ScrollRevealItem>
                  <div className="mt-12 flex flex-wrap gap-3">
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

function confidenceExplain(score: number): string {
  const band = confidenceBand(score);
  if (band === "hoog") {
    return `${confidenceBandLabel(band)} — meerdere consistente antwoorden, sterk profiel op deze as.`;
  }
  if (band === "gemiddeld") {
    return `${confidenceBandLabel(band)} — redelijke maar nog niet uitgekristalliseerde positie.`;
  }
  return `${confidenceBandLabel(band)} — weinig sterke antwoorden of veel variatie. Meer vragen geven hier scherper beeld.`;
}
