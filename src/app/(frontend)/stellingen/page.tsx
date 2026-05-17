import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";
import { THEMES, type ThemeId } from "@/lib/themes";
import { getAllQuestionsSeed, type QuestionRecord } from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/stellingen";
const PAGE_TITLE = "Stellingen-bibliotheek";
const PAGE_DESCRIPTION =
  "Alle stellingen die het kompas voedt, met context, voor- en tegenargumenten, bronnen en thema's.";

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

export default async function StellingenOverviewPage() {
  const all = await getAllQuestionsSeed();

  const byDimension = new Map<DimensionId, QuestionRecord[]>();
  for (const q of all) {
    if (!byDimension.has(q.dimension)) byDimension.set(q.dimension, []);
    byDimension.get(q.dimension)!.push(q);
  }

  const byTheme = new Map<ThemeId, number>();
  for (const q of all) {
    for (const t of q.themes) {
      byTheme.set(t, (byTheme.get(t) ?? 0) + 1);
    }
  }

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Stellingen", item: PAGE_PATH },
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
          <Kicker number="A1">Stellingen-bibliotheek</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            {all.length} stellingen,{" "}
            <em className="display-italic font-light text-navy">
              uitgelegd
            </em>
            .
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Iedere stelling met haar achterliggende context, de sterkste
            argumenten voor en tegen, bronnen en het thema waarop ze raakt.
            Geordend per dimensie zodat je per as ziet wat de quiz meet.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      {/* Thema-overview */}
      <section className="mt-16 md:mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>Per thema</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <ul className="mt-6 flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <li key={t.id}>
                  <span className="inline-flex items-baseline gap-2 border border-rule px-3 py-2 text-xs">
                    <span className="text-ink">{t.label}</span>
                    <span className="mono tabular-nums text-ink-subtle">
                      {byTheme.get(t.id) ?? 0}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Per dimensie */}
      <section className="mt-16 md:mt-20 border-t border-ink pt-10 space-y-16">
        {DIMENSIONS.map((d, dIdx) => {
          const list = byDimension.get(d.id) ?? [];
          return (
            <div key={d.id} id={d.id}>
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={dIdx + 2}>{d.label}</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    {d.poleNegative.label}
                    <span className="text-ink-subtle font-light mx-2">/</span>
                    {d.polePositive.label}
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-3 max-w-2xl text-sm text-ink-2 leading-relaxed">
                    {d.description}{" "}
                    <span className="mono text-[0.65rem] tracking-wider text-ink-subtle ml-1">
                      {list.length} STELLINGEN
                    </span>
                  </p>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <ul className="mt-8 border-t border-rule">
                    {list.map((q) => (
                      <li key={q.id} className="border-b border-rule">
                        <Link
                          href={`/stelling/${q.id}`}
                          className="group block py-5 md:py-6 no-underline"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[60px_1fr_auto] gap-3 lg:gap-8 items-baseline">
                            <p className="mono text-[0.65rem] tracking-wider text-ink-subtle">
                              {q.id.toUpperCase()}
                            </p>
                            <p className="text-base md:text-lg text-ink leading-snug group-hover:text-navy transition-colors">
                              {q.statement}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              {q.themes.map((t) => (
                                <span
                                  key={t}
                                  className="mono text-[0.6rem] tracking-wider text-ink-muted border border-rule px-1.5 py-0.5"
                                >
                                  {t.toUpperCase()}
                                </span>
                              ))}
                              <ArrowRight
                                size={14}
                                strokeWidth={1.8}
                                className="text-ink-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all"
                              />
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </ScrollRevealItem>
              </ScrollReveal>
            </div>
          );
        })}
      </section>
    </Container>
  );
}
