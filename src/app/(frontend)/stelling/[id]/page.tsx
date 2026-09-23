import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { ContentMasthead } from "@/components/content/PublicContent";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { dimensionMeta } from "@/lib/dimensions";
import {
  getAllQuestionsSeed,
  getQuestionByIdSeed,
  getRelatedQuestions,
} from "@/lib/seed-readers";
import { THEMES } from "@/lib/themes";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const all = await getAllQuestionsSeed();
  return all.map((q) => ({ id: q.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const q = await getQuestionByIdSeed(id);
  if (!q) return {};
  const path = `/stelling/${id}`;
  return {
    title: `${q.statement.slice(0, 80)}…`,
    description: q.info.context,
    alternates: { canonical: path },
    openGraph: {
      title: "Stelling · PolitiekProfiel",
      description: q.statement,
      url: path,
      type: "article",
    },
  };
}

const DIRECTION_LABEL = {
  positive: "Mee eens trekt naar +",
  negative: "Mee eens trekt naar −",
} as const;

const TIER_LABEL = {
  quick: "Quick (15)",
  standard: "Standaard (50)",
  extended: "Uitgebreid (80)",
} as const;

export default async function StellingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const q = await getQuestionByIdSeed(id);
  if (!q) notFound();

  const dim = dimensionMeta(q.dimension);
  const related = await getRelatedQuestions(id, 4);
  const themeMeta = q.themes
    .map((t) => THEMES.find((m) => m.id === t))
    .filter((t): t is (typeof THEMES)[number] => Boolean(t));

  const path = `/stelling/${id}`;
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Stellingen", item: "/stellingen" },
    { name: `Stelling ${id.toUpperCase()}`, item: path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <Container width="bleed" className="pt-10 md:pt-16">
        <ContentMasthead
          backHref="/stellingen"
          backLabel="Alle stellingen"
          eyebrow={`${id.toUpperCase()} · ${dim.label}`}
          title={<span lang="nl">{q.statement}</span>}
          noteTitle="Meetregel"
          note={<p>{DIRECTION_LABEL[q.direction]} · gewicht {(q.weight ?? 1).toFixed(1).toString()}</p>}
        />

        {/* Meta-strip */}
        <ScrollReveal>
          <ScrollRevealItem>
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-rule border border-rule max-w-3xl">
              <Meta term="Dimensie" value={dim.label} />
              <Meta term="Richting" value={DIRECTION_LABEL[q.direction]} />
              <Meta
                term="Gewicht"
                value={(q.weight ?? 1).toFixed(1).toString()}
              />
              <Meta
                term="Tier(s)"
                value={q.tiers.map((t) => TIER_LABEL[t].split(" ")[0]).join(", ")}
              />
            </dl>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Context */}
      <section className="mt-16 md:mt-20 border-t border-ink">
        <Container width="bleed" className="py-12 md:py-16">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Context</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                Wat speelt er rond deze stelling?
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-6 max-w-3xl text-base md:text-lg text-ink-raised leading-relaxed">
                {q.info.context}
              </p>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Argumenten */}
      <section className="border-t border-rule bg-canvas-raised/40">
        <Container width="bleed" className="py-14 md:py-20">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={2}>Argumenten</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                De sterkste argumenten voor én tegen.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl">
                <div>
                  <p className="kicker mb-4">Argumenten vóór</p>
                  <ul className="space-y-4">
                    {q.info.argumentsFor.map((a, i) => (
                      <li
                        key={i}
                        className="border-l-2 border-ink pl-4 text-ink-raised leading-relaxed"
                      >
                        <p>{a}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="kicker mb-4">Argumenten tegen</p>
                  <ul className="space-y-4">
                    {q.info.argumentsAgainst.map((a, i) => (
                      <li
                        key={i}
                        className="border-l-2 border-signal pl-4 text-ink-raised leading-relaxed"
                      >
                        <p>{a}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Thema's */}
      {themeMeta.length > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={3}>Beleidsthema&apos;s waarop deze stelling raakt</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
                  {themeMeta.map((t) => (
                    <li key={t.id} className="border border-rule bg-canvas p-5">
                      <p className="kicker mb-1">{t.shortLabel}</p>
                      <h3 className="display text-lg leading-tight text-ink">
                        {t.label}
                      </h3>
                      <p className="mt-2 text-sm text-ink-raised leading-relaxed">
                        {t.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Bronnen */}
      {q.info.sources.length > 0 && (
        <section className="border-t border-rule bg-canvas-raised/40">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={4}>Bronnen</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 max-w-3xl border-t border-rule">
                  {q.info.sources.map((s, i) => (
                    <li key={i} className="border-b border-rule py-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-baseline gap-2 text-ink no-underline hover:text-signal"
                      >
                        <span className="mono text-[0.62rem] tracking-wider text-text-muted shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm leading-snug">
                          {s.label}
                          <ExternalLink
                            size={12}
                            strokeWidth={1.8}
                            className="inline-block ml-1.5 mb-0.5 text-text-muted"
                          />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Gerelateerd */}
      {related.length > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={5}>Gerelateerde stellingen</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                  {related.map((r) => (
                    <li
                      key={r.id}
                      className="border border-rule bg-canvas p-5"
                    >
                      <Link
                        href={`/stelling/${r.id}`}
                        className="block no-underline group"
                      >
                        <p className="mono text-[0.62rem] tracking-wider text-text-muted">
                          {r.id.toUpperCase()} · {dimensionMeta(r.dimension).shortLabel.toUpperCase()}
                        </p>
                        <p className="mt-2 text-ink leading-snug group-hover:text-signal transition-colors">
                          {r.statement}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-raised group-hover:text-signal">
                          Lees uitleg
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
    <div className="bg-canvas p-4">
      <dt className="kicker mb-1">{term}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
