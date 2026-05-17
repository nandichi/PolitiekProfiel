import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import {
  GLOSSARY,
  GLOSSARY_BY_SLUG,
  CATEGORY_LABEL,
} from "@/data/woordenboek";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = GLOSSARY_BY_SLUG.get(slug);
  if (!t) return {};
  const path = `/woordenboek/${slug}`;
  return {
    title: `${t.term} — definitie`,
    description: t.short,
    alternates: { canonical: path },
    openGraph: {
      title: `${t.term} · Woordenboek · PolitiekProfiel`,
      description: t.short,
      url: path,
      type: "article",
    },
  };
}

export default async function WoordenboekDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const term = GLOSSARY_BY_SLUG.get(slug);
  if (!term) notFound();

  const related = (term.related ?? [])
    .map((s) => GLOSSARY_BY_SLUG.get(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const sameCategory = GLOSSARY.filter(
    (t) => t.category === term.category && t.slug !== term.slug,
  ).slice(0, 6);

  const path = `/woordenboek/${slug}`;
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Woordenboek", item: "/woordenboek" },
    { name: term.term, item: path },
  ]);

  const definedTermLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.short,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "PolitiekProfiel Woordenboek",
      url: "https://politiekprofiel.nl/woordenboek",
    },
    url: `https://politiekprofiel.nl${path}`,
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
        dangerouslySetInnerHTML={{ __html: jsonLdString(definedTermLd) }}
      />

      <Container width="bleed" className="pt-10 md:pt-16">
        <Link
          href="/woordenboek"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink no-underline mb-6"
        >
          <ArrowLeft size={14} strokeWidth={1.8} />
          Hele woordenboek
        </Link>

        <ScrollReveal variant="stagger" immediate>
          <ScrollRevealItem>
            <Kicker>{CATEGORY_LABEL[term.category]}</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <h1
              className="display mt-6 max-w-4xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              {term.term}
            </h1>
          </ScrollRevealItem>
          {term.aliases && term.aliases.length > 0 && (
            <ScrollRevealItem>
              <p className="mt-4 text-sm text-ink-muted">
                Ook bekend als:{" "}
                {term.aliases.map((a, i) => (
                  <span key={a}>
                    <em>{a}</em>
                    {i < term.aliases!.length - 1 && <span>, </span>}
                  </span>
                ))}
              </p>
            </ScrollRevealItem>
          )}
          <ScrollRevealItem>
            <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
              {term.short}
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Uitleg */}
      <section className="mt-16 md:mt-20 border-t border-ink">
        <Container width="bleed" className="py-12 md:py-16">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Uitleg</Kicker>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="editorial-prose mt-6 max-w-3xl text-base md:text-lg text-ink-2 leading-relaxed">
                {term.long.split(/\n\n+/).map((p, i) => (
                  <p key={i} className={i === 0 ? "" : "mt-4"}>
                    {p}
                  </p>
                ))}
              </div>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Zie ook */}
      {related.length > 0 && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>Zie ook</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
                  {related.map((r) => (
                    <li key={r.slug} className="border border-rule bg-paper p-5">
                      <Link
                        href={`/woordenboek/${r.slug}`}
                        className="block no-underline group"
                      >
                        <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                          {CATEGORY_LABEL[r.category].toUpperCase()}
                        </p>
                        <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                          {r.term}
                        </p>
                        <p className="mt-2 text-sm text-ink-2 leading-snug">
                          {r.short}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-2 group-hover:text-navy">
                          Lees
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

      {/* Zelfde categorie */}
      {sameCategory.length > 0 && (
        <section className="border-t border-rule">
          <Container width="bleed" className="py-12 md:py-16">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={related.length > 0 ? 3 : 2}>
                  Meer uit {CATEGORY_LABEL[term.category]}
                </Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 border-t border-rule max-w-3xl">
                  {sameCategory.map((s) => (
                    <li key={s.slug} className="border-b border-rule">
                      <Link
                        href={`/woordenboek/${s.slug}`}
                        className="group block py-4 no-underline"
                      >
                        <div className="flex items-baseline gap-4">
                          <p className="display text-base text-ink group-hover:text-navy transition-colors min-w-[160px]">
                            {s.term}
                          </p>
                          <p className="text-sm text-ink-2 leading-snug flex-1">
                            {s.short}
                          </p>
                          <ArrowRight
                            size={14}
                            strokeWidth={1.8}
                            className="text-ink-muted group-hover:text-navy transition-colors shrink-0"
                          />
                        </div>
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
