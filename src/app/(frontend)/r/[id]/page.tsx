import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Repeat, BookOpen, Lock } from "lucide-react";
import { Container } from "@/components/Container";
import { PaidTierButtons } from "@/components/PaidTierButtons";
import { DimensionBar } from "@/components/DimensionBar";
import { ScatterPlot } from "@/components/ScatterPlot";
import { RankedList } from "@/components/RankedList";
import { ShareBlock } from "@/components/ShareBlock";
import { EmailResultLinkBlock } from "@/components/EmailResultLinkBlock";
import { SocialShareGrid } from "@/components/result/SocialShareGrid";
import { ImageDownloads } from "@/components/result/ImageDownloads";
import { DeleteResultButton } from "@/components/result/DeleteResultButton";
import { StickyIndex } from "@/components/StickyIndex";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { BackToTop } from "@/components/result/BackToTop";
import { readingMinutesFor } from "@/lib/reading-time";
import { ConfidenceIndicator } from "@/components/result/ConfidenceIndicator";
import { ThemeBars } from "@/components/result/ThemeBars";
import { ParadoxList, type ParadoxItemContext } from "@/components/result/ParadoxList";
import { PartyContext } from "@/components/result/PartyContext";
import { PartyStatementCompare } from "@/components/result/PartyStatementCompare";
import { PersonalProfile } from "@/components/result/PersonalProfile";
import { AnswerAtlas } from "@/components/result/AnswerAtlas";
import { PivotalAnswers } from "@/components/result/PivotalAnswers";
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
import type { AnswerValue } from "@/lib/dimensions";
import { confidenceBand, confidenceBandLabel } from "@/lib/confidence";
import { paradoxDescription, type ParadoxType } from "@/lib/paradox";
import { getQuestionsByIds } from "@/lib/stance-extract";
import { hasClearDimensionDirection } from "@/lib/result-presentation";
import { createPersonalProfile } from "@/lib/result-profile-narrative";
import { deriveAnswerAtlas } from "@/lib/result-answer-atlas";
import { derivePivotalAnswers } from "@/lib/result-pivotal-answers";
import { getQuestionPoolForTier } from "@/lib/quiz-data";
import { PARTY_POSITIONS } from "@/data/party-positions";
import { buildPartyComparisons } from "@/lib/party-position-comparison";

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
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noarchive: true,
        noimageindex: true,
      },
    },
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

/** Antwoordwaarden die de scorer accepteert; alles daarbuiten negeren we. */
const ANSWER_VALUES = [-2, -1, 0, 1, 2] as const;

const INDEX_ITEMS = [
  { id: "profiel", label: "Profiel" },
  { id: "dimensies", label: "Vijf dimensies" },
  { id: "themas", label: "Zeven thema's" },
  { id: "antwoordkaart", label: "Je antwoordkaart" },
  { id: "kantelpunten", label: "Wat als je anders had geantwoord" },
  { id: "steelman", label: "Andere richting" },
  { id: "paradoxen", label: "Paradoxen" },
  { id: "partijen", label: "Partij-context" },
  { id: "partijstandpunten", label: "Partijstandpunten" },
  { id: "politici", label: "Politici" },
  { id: "landen", label: "Landen" },
  { id: "delen", label: "Delen & export" },
];

export default async function ResultPage({ params }: Args) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();
  const isFreeResult = result.tier === "quick";
  const isExtendedResult = result.tier === "extended";

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

  const themeResultCards = result.themeScores
    ? THEMES.map((theme) => ({
        theme,
        score: result.themeScores?.[theme.id] ?? 0,
      }))
    : [];

  const personalProfile = createPersonalProfile({
    ideologyName: ideo.name,
    dimensions: result.dimensions,
    themeScores: result.themeScores,
    confidence: result.confidence,
    answeredCount: result.answeredCount,
    totalQuestions: result.totalQuestions,
  });

  const answerAtlasThemeOrder = result.themeScores
    ? [...THEMES]
        .sort(
          (a, b) =>
            Math.abs(result.themeScores?.[b.id] ?? 0) -
            Math.abs(result.themeScores?.[a.id] ?? 0),
        )
        .map((theme) => theme.id)
    : [];
  const answerAtlas = result.answers
    ? await deriveAnswerAtlas(
        result.answers.map((answer) => ({
          questionId: answer.questionId,
          value: answer.value,
        })),
        answerAtlasThemeOrder,
        isExtendedResult ? 2 : 1,
      )
    : [];

  // Kantelpunten: dezelfde scoringsregel, één keer opnieuw doorgerekend op het
  // omdraaien van één antwoord. Oude rapporten met positiegebaseerde vraag-ID's
  // vallen buiten de statische vragenlijst en leveren hier dus niets op; de
  // sectie verbergt zichzelf dan.
  const pivotalPool = await getQuestionPoolForTier(result.tier);
  const pivotalAnswers = result.answers
    ? derivePivotalAnswers({
        questions: pivotalPool.map((question) => ({
          id: question.id,
          dimension: question.dimension,
          direction: question.direction,
          weight: question.weight,
          statement: question.statement,
          theme:
            question.themes?.find((theme) =>
              answerAtlasThemeOrder.includes(theme),
            ) ?? question.themes?.[0],
        })),
        answers: result.answers.flatMap((answer) =>
          answer.value !== null && ANSWER_VALUES.includes(answer.value as never)
            ? [{ questionId: answer.questionId, value: answer.value as AnswerValue }]
            : [],
        ),
        scores: result.dimensions,
        limit: isExtendedResult ? 5 : 3,
      })
    : [];

  const partyComparisons = result.answers
    ? buildPartyComparisons({
        answers: result.answers,
        questions: pivotalPool.map((question) => ({
          id: question.id,
          statement: question.statement,
        })),
        positionSets: PARTY_POSITIONS,
        parties: allParties
          .filter((party) => party.region === "NL")
          .map((party) => ({
            slug: party.slug,
            name: party.name,
            abbreviation: party.abbreviation,
            region: party.region,
            regionType: party.regionType,
            country: party.country,
            description: party.description,
            founded: party.founded,
            leader: party.leader,
            websiteUrl: party.websiteUrl,
          })),
        limit: isExtendedResult ? 8 : 6,
      })
    : [];

  const steelmanCandidates = DIMENSIONS.map((dimension) => {
    const yourScore = result.dimensions[dimension.id];
    if (Math.abs(yourScore) < 40) return null;
    return { dimension, yourScore };
  }).filter((candidate): candidate is NonNullable<typeof candidate> => Boolean(candidate));


  const paradoxExampleIds = (result.paradoxes ?? [])
    .flatMap((p) => p.exampleQuestionIds ?? []);
  const paradoxExampleMap = await getQuestionsByIds(paradoxExampleIds);

  const paradoxItems: ParadoxItemContext[] = (result.paradoxes ?? []).map((p) => {
    const type = p.type as ParadoxType;
    // Render altijd de live `paradoxDescription(type)`. De waarde uit Firestore
    // is een snapshot van het moment van submit en bevat dus voor oudere
    // resultaten nog de oude formuleringen (incl. em-dashes). Door hier de
    // huidige code-tekst te gebruiken, werken stijl- of inhoudelijke
    // aanpassingen direct door in alle bestaande én nieuwe resultaten.
    const description = paradoxDescription(type) || p.description || "";
    return {
      signal: {
        type,
        severity: p.severity,
        dimension: p.dimension as Parameters<typeof dimensionMeta>[0] | undefined,
        theme: p.theme as never,
        description,
        exampleQuestionIds: p.exampleQuestionIds ?? [],
      },
      examples: (p.exampleQuestionIds ?? [])
        .map((qid) => paradoxExampleMap.get(qid))
        .filter((q): q is { id: number; statement: string } => Boolean(q)),
    };
  });

  // Leestijden volgen alleen de redactioneel beheerde, regelgebaseerde inhoud
  // die op deze pagina staat. Er wordt geen gegenereerde tekst meegeteld.
  const sectionMinutes: Record<string, number> = {
    profiel: readingMinutesFor(ideo.shortDescription, ideo.description),
    dimensies: readingMinutesFor(
      ...DIMENSIONS.flatMap((dimension) => [
        dimension.poleNegative.description,
        dimension.polePositive.description,
      ]),
    ),
    themas: readingMinutesFor(
      ...themeResultCards.flatMap(({ theme }) => [
        theme.description,
        theme.poleNegative.description,
        theme.polePositive.description,
      ]),
    ),
    antwoordkaart: readingMinutesFor(
      ...answerAtlas.flatMap((section) =>
        section.entries.flatMap((entry) => [entry.question, entry.explanation]),
      ),
    ),

    kantelpunten: readingMinutesFor(
      ...pivotalAnswers.flatMap((item) => [item.statement]),
    ),
    steelman: readingMinutesFor(
      ...steelmanCandidates.map((candidate) =>
        candidate.yourScore > 0
          ? candidate.dimension.poleNegative.description
          : candidate.dimension.polePositive.description,
      ),
    ),
    paradoxen: readingMinutesFor(
      ...paradoxItems.map((item) => item.signal.description),
    ),
    partijen: readingMinutesFor(
      ...parties.flatMap((party) => [party.name, party.description]),
    ),
    partijstandpunten: readingMinutesFor(
      ...partyComparisons.flatMap((comparison) => [
        comparison.party.name,
        ...comparison.agreements.map((item) => item.statement),
        ...comparison.differences.map((item) => item.statement),
      ]),
    ),
    politici: readingMinutesFor(
      ...rankedPoliticians
        .slice(0, isExtendedResult ? 30 : 20)
        .map((politician) => `${politician.item.primary} ${politician.item.secondary}`),
    ),
    landen: readingMinutesFor(
      ...rankedCountries
        .slice(0, 15)
        .map((country) => `${country.item.primary} ${country.item.secondary}`),
    ),
    delen: readingMinutesFor(
      ...ideo.furtherReading.flatMap((book) => [book.title, book.note]),
    ),
  };

  const visibleIndexItems = isFreeResult
    ? [
        ...INDEX_ITEMS.filter((it) => it.id === "profiel" || it.id === "dimensies"),
        { id: "premium", label: "Volledig rapport" },
      ]
    : INDEX_ITEMS;

  const indexItems = visibleIndexItems.map((it) => ({
    ...it,
    readingMinutes: sectionMinutes[it.id],
  }));

  return (
    <div>
      <Container width="bleed" className="pt-10 md:pt-16">
        <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-[220px_1fr]">
          <StickyIndex items={indexItems} topOffset={96} />

          <div className="min-w-0">
            {/* SECTIE 1 · PROFIEL */}
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
                        label="Duidelijkheid van dit patroon"
                      />
                    )}
                  </div>
                  {isExtendedResult && (
                    <div className="mt-6 max-w-2xl border border-navy/30 bg-navy/5 p-5">
                      <p className="kicker mb-2">Uitgebreide verdieping</p>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        Dit resultaat is gebaseerd op de langste quiz. Daarom
                        tonen we per thema twee onderbouwende antwoorden in
                        plaats van één, en vergelijken we met meer politici.
                      </p>
                    </div>
                  )}
                </ScrollRevealItem>
              </ScrollReveal>

              {!isFreeResult && <PersonalProfile profile={personalProfile} />}

              <div className="mt-16 md:mt-20 max-w-3xl">
                <Kicker>Wat houdt dit profiel in?</Kicker>
                <div className="mt-5">
                  {isFreeResult ? (
                    <InlinePaywall
                      title="De volledige profieluitleg is onderdeel van het betaalde rapport."
                      body="Je gratis uitslag geeft de kern: profielnaam en vijf assen. Met de standaard quiz krijg je de volledige duiding, context en leesverdieping."
                    />
                  ) : (
                    <StaticProse text={ideo.description} />
                  )}
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

            {/* SECTIE 2 · DIMENSIES */}
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
                    {DIMENSIONS.map((dimension, index) => {
                      const value = result.dimensions[dimension.id];
                      const dimConfidence = result.confidence?.[dimension.id];
                      const hasDirection = hasClearDimensionDirection(value);
                      const matchedPole =
                        value >= 0
                          ? dimension.polePositive
                          : dimension.poleNegative;
                      return (
                        <div key={dimension.id}>
                          <DimensionBar
                            dimension={dimension.id}
                            value={value}
                            index={index}
                          />
                          <div className="pb-7 mt-5 md:mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto] md:gap-8 md:items-start">
                            <div className="max-w-2xl">
                              {isFreeResult ? (
                                <p className="text-sm text-ink-muted leading-relaxed">
                                  De gratis indicatie toont je positie op deze
                                  as. De volledige betaalde analyse legt uit
                                  wat deze score politiek betekent en waar de
                                  nuance zit.
                                </p>
                              ) : hasDirection ? (
                                  <>
                                    <p className="kicker mb-2">
                                      Jouw richting: {matchedPole.label}
                                    </p>
                                    <p className="text-sm text-ink-2 leading-relaxed">
                                      {matchedPole.description}
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p className="kicker mb-2">Geen duidelijke richting</p>
                                    <p className="text-sm text-ink-2 leading-relaxed">
                                      Je antwoorden liggen op deze as dicht bij het midden. Daaruit
                                      volgt geen sterke voorkeur voor een van beide polen.
                                    </p>
                                  </>
                                )}
                            </div>
                            {dimConfidence !== undefined && (
                              <div className="mt-4 md:mt-1">
                                <ConfidenceIndicator
                                  score={dimConfidence}
                                  label="Duidelijkheid op deze as"
                                />
                                <p className="mt-2 text-xs text-ink-muted max-w-56">
                                  {confidenceExplain(dimConfidence)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {isFreeResult ? (
              <FreeResultPaywall />
            ) : (
              <>
            {/* SECTIE 3 · THEMA'S */}
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
                      <ThemeBars
                        scores={result.themeScores}
                        coverage={result.themeCoverage}
                      />
                    </ScrollRevealItem>
                    <ScrollRevealItem>
                      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {themeResultCards.map(({ theme, score }) => {
                          const position = describeThemeScore(theme, score);
                          return (
                            <div key={theme.id} className="border-t border-rule pt-5">
                              <p className="kicker mb-2">{theme.label}</p>
                              <p className="display text-lg leading-snug text-ink">
                                {position.label}
                              </p>
                              <p className="mt-2 text-sm text-ink-2 leading-relaxed">
                                {position.description}
                              </p>
                              <p className="mt-3 text-xs text-ink-muted">
                                Score {formatScore(score)} op basis van de beantwoorde
                                vragen bij dit thema.
                              </p>
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

            {/* SECTIE 3b · ANTWOORDKAART */}
            {answerAtlas.length > 0 ? (
              <div id="antwoordkaart" className="mt-24 md:mt-32 scroll-mt-32">
                <AnswerAtlas sections={answerAtlas} />
              </div>
            ) : null}

            {pivotalAnswers.length > 0 ? (
              <div id="kantelpunten" className="mt-24 md:mt-32 scroll-mt-32">
                <PivotalAnswers items={pivotalAnswers} />
              </div>
            ) : null}

            {/* SECTIE 4 · STEELMAN: BESTE TEGEN-ARGUMENT */}
            {steelmanCandidates.length > 0 && (
              <section
                id="steelman"
                className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
              >
                <ScrollReveal variant="stagger">
                  <ScrollRevealItem>
                    <Kicker number="4b">De andere richting</Kicker>
                    <h2 className="display mt-5 max-w-3xl">
                      De tegenoverliggende positie op assen waar je duidelijk uitslaat.
                    </h2>
                  </ScrollRevealItem>
                  <ScrollRevealItem>
                    <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                      Bij een duidelijke score tonen we het andere uiteinde van
                      dezelfde schaal. Gebruik dit als een korte check van de
                      afweging die achter je score zit.
                    </p>
                  </ScrollRevealItem>
                  <ScrollRevealItem>
                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl">
                      {steelmanCandidates.map((candidate) => (
                        <div
                          key={candidate.dimension.id}
                          className="border-t border-rule pt-5"
                        >
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="kicker">{candidate.dimension.label}</p>
                            <p className="mono tabular-nums text-xs text-ink-muted">
                              JOUW SCORE {formatScore(candidate.yourScore)}
                            </p>
                          </div>
                          <p className="display text-lg mt-2 text-ink leading-snug">
                            {candidate.yourScore > 0
                              ? candidate.dimension.poleNegative.label
                              : candidate.dimension.polePositive.label}
                          </p>
                          <p className="mt-2 text-sm text-ink-2 leading-relaxed">
                            {candidate.yourScore > 0
                              ? candidate.dimension.poleNegative.description
                              : candidate.dimension.polePositive.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollRevealItem>
                </ScrollReveal>
              </section>
            )}


            {/* SECTIE 5 · PARADOXEN */}
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

            {/* SECTIE 6 · PARTIJ-CONTEXT */}
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
                    sterkst op lijkt, voor Nederland, Europa en de Verenigde
                    Staten.
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10">
                    <PartyContext parties={parties} ideologyName={ideo.name} />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 6b · STELLINGEN PER PARTIJ */}
            <section
              id="partijstandpunten"
              className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12"
            >
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number="6b">Stellingen per partij</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Niet alleen een label: zie waar jouw antwoorden aansluiten.
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-4 max-w-2xl text-sm text-ink-muted">
                    Hieronder vergelijken we je letterlijke antwoorden met de
                    gecontroleerde bronnen van Nederlandse partijen. Alleen jouw
                    eigen beantwoorde stellingen tellen mee.
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10">
                    <PartyStatementCompare
                      comparisons={partyComparisons}
                      answeredCount={result.answeredCount}
                      isExtended={isExtendedResult}
                    />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 7 · POLITICI */}
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
                        limit={isExtendedResult ? 30 : 20}
                        highlightFirst
                      />
                    </div>
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </section>

            {/* SECTIE 8 · LANDEN */}
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

            {/* SECTIE 9 · DELEN */}
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
                    <DeleteResultButton shareId={result.shareId} />
                  </div>
                </ScrollRevealItem>

                {/* Mail mij deze link (opt-in) */}
                <ScrollRevealItem>
                  <div className="mt-6">
                    <EmailResultLinkBlock shareId={result.shareId} />
                  </div>
                </ScrollRevealItem>

                {/* Social media delen */}
                <ScrollRevealItem>
                  <div className="mt-14 border-t border-rule pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                      <p className="kicker">Deel op social media</p>
                      <p className="text-xs text-ink-muted max-w-md">
                        Eén klik. Geen redirect via een derde-partij, geen
                        tracking-pixel.
                      </p>
                    </div>
                    <SocialShareGrid
                      shareId={result.shareId}
                      ideologyName={ideo.name}
                    />
                  </div>
                </ScrollRevealItem>

                {/* Downloadable images */}
                <ScrollRevealItem>
                  <div className="mt-14 border-t border-rule pt-6">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
                      <p className="kicker">Download als afbeelding</p>
                      <p className="text-xs text-ink-muted max-w-md">
                        Drie formaten, klaar voor verhaal, post of
                        link-preview.
                      </p>
                    </div>
                    <ImageDownloads
                      shareId={result.shareId}
                      ideologyName={ideo.name}
                    />
                  </div>
                </ScrollRevealItem>

                {ideo.furtherReading.length > 0 && (
                  <ScrollRevealItem>
                    <div className="mt-14 border-t border-rule pt-6">
                      <p className="kicker mb-3">Verder lezen</p>
                      <ul className="max-w-3xl divide-y divide-rule border-t border-rule">
                        {ideo.furtherReading.map((book) => (
                          <li key={book.url} className="py-4">
                            <a
                              href={book.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="no-underline text-ink hover:text-navy"
                            >
                              <span className="display text-lg leading-tight">
                                {book.title}
                              </span>
                              <span className="block mt-1 text-sm text-ink-2">
                                {book.author}
                                {book.publisher ? ` · ${book.publisher}` : ""}
                              </span>
                              <span className="block mt-2 text-sm text-ink-muted leading-relaxed">
                                {book.note}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
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
                    <Link
                      href={`/evolutie?ids=${result.shareId}`}
                      className="btn-ghost"
                    >
                      Voeg toe aan je evolutie
                      <ArrowRight size={14} strokeWidth={1.8} />
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
              </>
            )}
          </div>
        </div>
      </Container>
      <BackToTop threshold={0.5} />
    </div>
  );
}

function InlinePaywall({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative overflow-hidden border border-rule bg-paper-50 p-5">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-paper"
      />
      <div className="relative">
        <p className="kicker mb-2 inline-flex items-center gap-2">
          <Lock size={13} strokeWidth={1.8} />
          Betaalde verdieping
        </p>
        <p className="display text-xl leading-tight text-ink">{title}</p>
        <p className="mt-3 text-sm text-ink-2 leading-relaxed">{body}</p>
        <div className="mt-5">
          <PaidTierButtons
            options={[
              {
                tier: "standard",
                className: "btn btn-primary",
                children: (
                  <>
                    Ontgrendel voor 5 euro
                    <ArrowRight size={16} strokeWidth={1.8} />
                  </>
                ),
              },
              {
                tier: "extended",
                className: "btn btn-secondary",
                children: <>Uitgebreid voor 10 euro</>,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function FreeResultPaywall() {
  const locked = [
    "zeven thema-scores",
    "uitgesproken antwoorden",
    "andere richtingen op de vijf assen",
    "paradoxen",
    "partij-context",
    "politici- en landenvergelijking",
    "delen, evolutie en downloads",
  ];

  return (
    <section
      id="premium"
      className="mt-24 md:mt-32 scroll-mt-32 border-t border-ink pt-12 pb-8"
    >
      <ScrollReveal variant="stagger">
        <ScrollRevealItem>
          <Kicker number={3}>Volledig rapport</Kicker>
          <h2 className="display mt-5 max-w-3xl">
            Je gratis uitslag is een indicatie. De verdieping zit in het
            betaalde rapport.
          </h2>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-4 max-w-2xl text-sm text-ink-muted leading-relaxed">
            Je ziet nu de profielnaam en vijf dimensies. Met de standaard of
            uitgebreide quiz krijg je meer vragen, scherpere confidence en alle
            contextsecties die helpen om je uitslag echt te begrijpen.
          </p>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="border border-rule bg-paper-50 p-6 md:p-8">
              <p className="kicker mb-5 inline-flex items-center gap-2">
                <Lock size={14} strokeWidth={1.8} />
                Vergrendeld in gratis
              </p>
              <ul className="grid grid-cols-1 gap-3 text-sm text-ink-2 md:grid-cols-2">
                {locked.map((item) => (
                  <li key={item} className="border-t border-rule pt-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-ink p-6 md:p-8">
              <p className="kicker mb-3">Aanbevolen</p>
              <h3 className="display text-2xl leading-tight">
                Start de standaard quiz.
              </h3>
              <p className="mt-4 text-sm text-ink-2 leading-relaxed">
                Voor 5 euro krijg je een volledig rapport op basis van 50
                stellingen. Wil je maximale nuance, kies dan de uitgebreide quiz
                van 80 vragen.
              </p>
              <div className="mt-6">
                <PaidTierButtons
                  options={[
                    {
                      tier: "standard",
                      className: "btn btn-primary",
                      children: (
                        <>
                          Koop standaard voor 5 euro
                          <ArrowRight size={16} strokeWidth={1.8} />
                        </>
                      ),
                    },
                    {
                      tier: "extended",
                      className: "btn btn-secondary",
                      children: <>Uitgebreid voor 10 euro</>,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </ScrollRevealItem>
      </ScrollReveal>
    </section>
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
  if (tier === "quick") return "Quick · 15 vragen";
  if (tier === "extended") return "Uitgebreid · 80 vragen";
  return "Standaard · 50 vragen";
}

function confidenceExplain(score: number): string {
  const band = confidenceBand(score);
  if (band === "hoog") {
    return `${confidenceBandLabel(band)}. Meerdere consistente antwoorden, sterk profiel op deze as.`;
  }
  if (band === "gemiddeld") {
    return `${confidenceBandLabel(band)}. Redelijke maar nog niet uitgekristalliseerde positie.`;
  }
  return `${confidenceBandLabel(band)}. Weinig sterke antwoorden of veel variatie. Meer vragen geven hier scherper beeld.`;
}

function StaticProse({ text }: { text: string }) {
  return (
    <div className="space-y-5 text-ink-2 leading-relaxed">
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => (
          <p key={paragraph} className="text-base md:text-lg">
            {paragraph}
          </p>
        ))}
    </div>
  );
}

function formatScore(score: number): string {
  const rounded = Math.round(score);
  return `${rounded > 0 ? "+" : ""}${rounded}`;
}

function describeThemeScore(
  theme: (typeof THEMES)[number],
  score: number,
): { label: string; description: string } {
  if (Math.abs(score) < 20) {
    return {
      label: "Geen uitgesproken richting",
      description:
        "Je antwoorden liggen tussen beide richtingen. Op dit thema is de uitkomst een oriëntatie, geen duidelijke voorkeur.",
    };
  }
  return score > 0 ? theme.polePositive : theme.poleNegative;
}
