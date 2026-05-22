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
  getAiContentBySlug,
  getAiContentBySlugs,
  ideologyArgumentsAgainstSlug,
  ideologyArgumentsForSlug,
  ideologyEssaySlug,
  ideologyReadingSlug,
  ideologyThemeSlug,
} from "@/lib/ai-content";
import { AiContentBlock, AiContentItemList } from "@/components/result/AiContentBlock";
import {
  getAllIdeologiesSeed,
  getAllPartiesSeed,
  getIdeologyBySlugSeed,
} from "@/lib/seed-readers";
import { THEMES } from "@/lib/themes";
import {
  buildArticleSchema,
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const SPECTRUM_LABEL: Record<string, string> = {
  "ver-links": "Ver-links",
  links: "Links",
  "centrum-links": "Centrum-links",
  centrum: "Centrum",
  "centrum-rechts": "Centrum-rechts",
  rechts: "Rechts",
  "ver-rechts": "Ver-rechts",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllIdeologiesSeed().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ideology = getIdeologyBySlugSeed(slug);
  if (!ideology) return {};
  const title = `${ideology.name}: ideologie`;
  const desc = ideology.shortDescription;
  const path = `/ideologie/${slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: `${ideology.name} · PolitiekProfiel`,
      description: desc,
      url: path,
      type: "article",
    },
  };
}

export default async function IdeologieDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ideology = getIdeologyBySlugSeed(slug);
  if (!ideology) notFound();

  // AI-content slots ophalen (kan ontbreken, afhankelijk van of de generator
  // gedraaid is). Page rendert ook gracieus zonder.
  const slots = await getAiContentBySlugs([
    ideologyEssaySlug(slug),
    ideologyReadingSlug(slug),
    ideologyArgumentsForSlug(slug),
    ideologyArgumentsAgainstSlug(slug),
    ...THEMES.map((t) => ideologyThemeSlug(slug, t.id)),
  ]);

  const essay = slots.get(ideologyEssaySlug(slug)) ?? null;
  const reading = slots.get(ideologyReadingSlug(slug)) ?? null;
  const argFor = slots.get(ideologyArgumentsForSlug(slug)) ?? null;
  const argAgainst = slots.get(ideologyArgumentsAgainstSlug(slug)) ?? null;

  const relatedParties = getAllPartiesSeed().filter((p) =>
    p.ideologySlugs.includes(slug),
  );
  const otherIdeologies = getAllIdeologiesSeed().filter((i) => i.slug !== slug);

  const path = `/ideologie/${slug}`;
  const articleLd = buildArticleSchema({
    path,
    headline: `${ideology.name}: een politieke deepdive`,
    description: ideology.shortDescription,
    datePublished: "2026-05-01",
    dateModified: "2026-05-17",
    articleSection: "Ideologieën",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Ideologieën", item: "/ideologieen" },
    { name: ideology.name, item: path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdString([articleLd, breadcrumbLd]),
        }}
      />

      <Container width="bleed" className="pt-10 md:pt-16">
        <Link
          href="/ideologieen"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink no-underline mb-6"
        >
          <ArrowLeft size={14} strokeWidth={1.8} />
          Alle ideologieën
        </Link>

        <ScrollReveal variant="stagger" immediate>
          <ScrollRevealItem>
            <Kicker number="A2">
              Ideologie · {SPECTRUM_LABEL[ideology.spectrumPosition]}
            </Kicker>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <h1
              className="display mt-6 max-w-4xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              {ideology.name}
            </h1>
          </ScrollRevealItem>

          <ScrollRevealItem>
            <p className="mt-6 max-w-2xl text-lg text-ink-2 leading-relaxed">
              {ideology.shortDescription}
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Vector */}
      <section className="mt-16 md:mt-20 border-t border-ink">
        <Container width="bleed" className="py-12 md:py-16">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Profielpositie</Kicker>
              <h2 className="display mt-5">Op de vijf dimensies.</h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="mt-10 max-w-3xl">
                {DIMENSIONS.map((d, i) => (
                  <DimensionBar
                    key={d.id}
                    dimension={d.id}
                    value={ideology.profileVector[d.id]}
                    index={i}
                  />
                ))}
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Essay */}
      <section className="border-t border-rule">
        <Container width="bleed" className="py-16 md:py-24">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={2}>Essay</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                Waar deze stroming voor staat.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="mt-8 max-w-3xl">
                <AiContentBlock
                  content={essay}
                  fallback={ideology.description}
                />
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Voorbeelden */}
      {ideology.examplePeople.length > 0 && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-16 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={3}>Voorbeelden</Kicker>
                <h2 className="display mt-5">Wie staat ervoor bekend?</h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                  {ideology.examplePeople.map((p, i) => (
                    <li
                      key={i}
                      className="border border-rule p-4 md:p-5 bg-paper"
                    >
                      <span className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1.5 text-ink leading-snug">{p}</p>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Argumenten voor / tegen */}
      {(argFor || argAgainst) && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-16 md:py-24">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={4}>Argumenten</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  De sterkste argumenten voor én tegen.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl">
                  <div>
                    <p className="kicker mb-4">Argumenten vóór</p>
                    <AiContentItemList
                      content={argFor}
                      emptyText="Nog niet beschikbaar."
                    />
                  </div>
                  <div>
                    <p className="kicker mb-4">Argumenten tegen</p>
                    <AiContentItemList
                      content={argAgainst}
                      emptyText="Nog niet beschikbaar."
                    />
                  </div>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Verder lezen */}
      {reading && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-16 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={5}>Verder lezen</Kicker>
                <h2 className="display mt-5">Bronnen en denkers.</h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 max-w-3xl">
                  <AiContentItemList content={reading} />
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Verwante partijen */}
      {relatedParties.length > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-16 md:py-24">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={6}>Verwante partijen</Kicker>
                <h2 className="display mt-5 max-w-3xl">
                  Partijen die in hoofdlijnen bij deze stroming aansluiten.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-3 mb-8 max-w-3xl">
                  <p className="text-xs text-ink-2 leading-relaxed border border-navy/30 bg-navy/3 px-4 py-3">
                    Dit is geen stemwijzer. Een partij past zelden volledig
                    binnen één stroming.
                  </p>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-5xl">
                  {relatedParties.map((p) => (
                    <li key={p.slug} className="border-t border-rule pt-5">
                      <Link
                        href={`/partij/${p.slug}`}
                        className="no-underline group block"
                      >
                        <div className="flex items-baseline justify-between gap-3 mb-1">
                          <h3 className="display text-lg md:text-xl text-ink leading-tight group-hover:text-navy transition-colors">
                            {p.name}
                          </h3>
                          <span className="mono text-[0.65rem] tracking-wider text-ink-muted">
                            {p.abbreviation}
                          </span>
                        </div>
                        <p className="text-sm text-ink-2 leading-relaxed">
                          {p.description}
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

      {/* Andere ideologieën */}
      <section className="border-t border-rule">
        <Container width="bleed" className="py-16 md:py-20">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker>Andere stromingen</Kicker>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ul className="mt-6 flex flex-wrap gap-3">
                {otherIdeologies.map((i) => (
                  <li key={i.slug}>
                    <Link
                      href={`/ideologie/${i.slug}`}
                      className="inline-flex items-center gap-1.5 border border-rule px-3 py-2 text-xs text-ink-2 hover:bg-paper-50 hover:text-ink no-underline"
                    >
                      {i.name}
                      <ArrowRight size={12} strokeWidth={1.8} />
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
