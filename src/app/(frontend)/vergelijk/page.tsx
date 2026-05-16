import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { DimensionBar } from "@/components/DimensionBar";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";
import { CompareLookup } from "@/components/CompareLookup";
import { buildBreadcrumbList, jsonLdString } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Vergelijk",
  description:
    "Twee politieke profielen naast elkaar. Vergelijk jouw resultaat met dat van een vriend, een politicus of een ideologie op de vijf onafhankelijke dimensies.",
  alternates: { canonical: "/vergelijk" },
  openGraph: {
    title: "Vergelijk · PolitiekProfiel",
    description:
      "Twee profielen naast elkaar op de vijf dimensies. Zonder oordeel, met nuance.",
    url: "/vergelijk",
    type: "website",
  },
};

type Args = { searchParams: Promise<{ a?: string; b?: string }> };

export default async function ComparePage({ searchParams }: Args) {
  const params = await searchParams;
  const aId = params.a ?? null;
  const bId = params.b ?? null;

  const [a, b] = await Promise.all([
    aId ? getResult(aId) : Promise.resolve(null),
    bId ? getResult(bId) : Promise.resolve(null),
  ]);

  const [ideoA, ideoB] = await Promise.all([
    a ? getIdeologyBySlug(a.ideologySlug) : Promise.resolve(null),
    b ? getIdeologyBySlug(b.ideologySlug) : Promise.resolve(null),
  ]);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Vergelijk", item: "/vergelijk" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />
      {/* Hero */}
      <Container width="bleed" className="pt-12 md:pt-20 pb-12">
        <ScrollReveal variant="stagger" immediate>
          <ScrollRevealItem>
            <Link
              href="/"
              className="kicker inline-flex items-center gap-2 text-ink-muted hover:text-ink no-underline mb-7"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              <span>Terug naar start</span>
            </Link>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <Kicker>Vergelijking</Kicker>
            <h1
              className="display mt-5 max-w-4xl"
              style={{ letterSpacing: "-0.022em" }}
            >
              Twee profielen, vijf assen,{" "}
              <em className="display-italic font-light text-navy">
                één overzicht.
              </em>
            </h1>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-7 max-w-2xl text-lg text-ink-2 leading-relaxed">
              Plak twee deelbare links of share-IDs. Je ziet hoe twee profielen
              op elke as overlappen of verschillen.
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Lookup */}
      <section className="border-y border-rule bg-paper-50/40">
        <Container width="bleed" className="py-10 md:py-14">
          <CompareLookup aPrefill={aId ?? ""} bPrefill={bId ?? ""} />
        </Container>
      </section>

      {!a && !b && (
        <Container width="bleed" className="py-20">
          <div className="border-l-2 border-rule-strong pl-6 max-w-2xl">
            <p className="kicker mb-3">Nog geen profielen</p>
            <p className="text-ink-2 text-lg leading-relaxed">
              Voer hierboven twee share-IDs of links in om profielen naast
              elkaar te zien.
            </p>
          </div>
        </Container>
      )}

      {a && !b && (
        <Container width="bleed" className="py-20">
          <div className="border-l-2 border-navy pl-6 max-w-2xl">
            <p className="kicker mb-3">Profiel A geladen</p>
            <p className="text-ink-2 text-lg leading-relaxed">
              Voeg een tweede share-ID toe om de vergelijking te zien.
            </p>
          </div>
        </Container>
      )}

      {a && b && (
        <>
          <section className="border-b border-rule">
            <Container width="bleed" className="py-16 md:py-20">
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={1}>Profielen</Kicker>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-8 grid gap-12 lg:gap-16 lg:grid-cols-2 relative">
                    <div
                      aria-hidden
                      className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-rule"
                    />
                    <ProfileSummary
                      letter="A"
                      label="Profiel A"
                      ideologyName={ideoA?.name ?? a.ideologySlug}
                      shortDescription={ideoA?.shortDescription}
                      shareId={a.shareId}
                      accent="ink"
                    />
                    <ProfileSummary
                      letter="B"
                      label="Profiel B"
                      ideologyName={ideoB?.name ?? b.ideologySlug}
                      shortDescription={ideoB?.shortDescription}
                      shareId={b.shareId}
                      accent="terra"
                    />
                  </div>
                </ScrollRevealItem>
              </ScrollReveal>
            </Container>
          </section>

          <section>
            <Container width="bleed" className="py-16 md:py-20">
              <ScrollReveal variant="stagger">
                <ScrollRevealItem>
                  <Kicker number={2}>Vergelijking per dimensie</Kicker>
                  <h2 className="display mt-5 max-w-3xl">
                    Waar overlappen jullie, en waar lopen jullie uiteen?
                  </h2>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <div className="mt-10 border-t border-rule">
                    {DIMENSIONS.map((d, i) => (
                      <DimensionBar
                        key={d.id}
                        dimension={d.id}
                        value={a.dimensions[d.id]}
                        compareValue={b.dimensions[d.id]}
                        compareLabel="Profiel B"
                        index={i}
                      />
                    ))}
                  </div>
                </ScrollRevealItem>
                <ScrollRevealItem>
                  <p className="mt-6 text-xs text-ink-muted flex items-center gap-4 flex-wrap">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden
                        className="inline-block w-3 h-[3px] bg-ink"
                      />
                      Profiel A
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <svg
                        width="14"
                        height="3"
                        aria-hidden
                        className="inline-block"
                      >
                        <line
                          x1="0"
                          y1="1.5"
                          x2="14"
                          y2="1.5"
                          stroke="var(--color-terra)"
                          strokeWidth="2"
                          strokeDasharray="3 2"
                        />
                      </svg>
                      Profiel B
                    </span>
                  </p>
                </ScrollRevealItem>
              </ScrollReveal>
            </Container>
          </section>
        </>
      )}
    </>
  );
}

function ProfileSummary({
  letter,
  label,
  ideologyName,
  shortDescription,
  shareId,
  accent,
}: {
  letter: string;
  label: string;
  ideologyName: string;
  shortDescription?: string;
  shareId: string;
  accent: "ink" | "terra";
}) {
  const accentClass = accent === "terra" ? "text-terra" : "text-ink";
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className={`display text-3xl leading-none ${accentClass}`}
          aria-hidden
        >
          {letter}
        </span>
        <span className="kicker">{label}</span>
      </div>
      <h3 className="display text-3xl md:text-4xl leading-tight text-ink">
        {ideologyName}
      </h3>
      {shortDescription && (
        <p className="mt-4 text-ink-2 leading-relaxed">{shortDescription}</p>
      )}
      <p className="mt-6 mono text-xs tracking-wider text-ink-muted">
        SHARE · {shareId}
      </p>
    </div>
  );
}

export const dynamic = "force-dynamic";
