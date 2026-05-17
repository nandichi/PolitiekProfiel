import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import {
  GLOSSARY,
  GLOSSARY_BY_LETTER,
  CATEGORY_LABEL,
  type GlossaryCategory,
} from "@/data/woordenboek";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/woordenboek";
const PAGE_TITLE = "Woordenboek politieke termen";
const PAGE_DESCRIPTION =
  "Begrijpelijke uitleg van politieke begrippen: instituties, ideologie, fiscaal, Europa, en meer. Bedoeld als naslag bij ieder politiek debat.";

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

export default function WoordenboekPage() {
  const totalTerms = GLOSSARY.length;
  const letters = Array.from(GLOSSARY_BY_LETTER.keys());

  const byCategory = new Map<GlossaryCategory, number>();
  for (const t of GLOSSARY) {
    byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + 1);
  }

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Woordenboek", item: PAGE_PATH },
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
          <Kicker number="A7">Woordenboek</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            {totalTerms} politieke termen,{" "}
            <em className="display-italic font-light text-navy">
              klip en klaar
            </em>
            .
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Wat is een motie van wantrouwen? Wat doet de Raad van State?
            Wat betekent ‘subsidiariteit’? Hier vind je korte definities en
            langere uitleg per begrip. Bedoeld als naslag, niet als
            encyclopedie.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      {/* Letter-anker */}
      <section className="mt-12 border-t border-rule pt-6">
        <nav aria-label="Spring naar letter">
          <ul className="flex flex-wrap gap-1">
            {letters.map((l) => (
              <li key={l}>
                <a
                  href={`#letter-${l}`}
                  className="mono text-xs tracking-wider text-ink-2 hover:text-navy border border-rule px-2.5 py-1.5 no-underline"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Categorieën */}
      <section className="mt-10">
        <Kicker number={1}>Per categorie</Kicker>
        <ul className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABEL) as GlossaryCategory[]).map((cat) => (
            <li key={cat}>
              <span className="inline-flex items-baseline gap-2 border border-rule px-3 py-2 text-xs">
                <span className="text-ink">{CATEGORY_LABEL[cat]}</span>
                <span className="mono tabular-nums text-ink-subtle">
                  {byCategory.get(cat) ?? 0}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Alfabetisch */}
      <section className="mt-16 md:mt-20 border-t border-ink pt-10 space-y-16">
        {letters.map((l) => {
          const terms = GLOSSARY_BY_LETTER.get(l) ?? [];
          return (
            <div key={l} id={`letter-${l}`}>
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <div className="flex items-baseline gap-6 border-b border-ink pb-3">
                    <span className="display text-5xl md:text-6xl text-navy">
                      {l}
                    </span>
                    <span className="mono text-[0.65rem] tracking-wider text-ink-subtle">
                      {terms.length} TERMEN
                    </span>
                  </div>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <ul className="mt-6 border-t border-rule">
                    {terms.map((t) => (
                      <li key={t.slug} className="border-b border-rule">
                        <Link
                          href={`/woordenboek/${t.slug}`}
                          className="group block py-5 no-underline"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-3 lg:gap-8 items-baseline">
                            <p className="display text-lg text-ink group-hover:text-navy transition-colors">
                              {t.term}
                            </p>
                            <p className="text-sm text-ink-2 leading-relaxed max-w-3xl">
                              {t.short}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="mono text-[0.6rem] tracking-wider text-ink-muted border border-rule px-1.5 py-0.5">
                                {CATEGORY_LABEL[t.category].toUpperCase()}
                              </span>
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
