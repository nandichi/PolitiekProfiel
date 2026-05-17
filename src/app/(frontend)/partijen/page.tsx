import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import {
  getAllPartiesSeed,
  getActiveDutchParties,
} from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/partijen";
const PAGE_TITLE = "Partijen";
const PAGE_DESCRIPTION =
  "Alle Nederlandse, Europese en Amerikaanse partijen op de vijf dimensies, met programma-samenvatting, fractieleider en coalitiestatus per mei 2026.";

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

const COALITION_LABEL = {
  governing: "Coalitie",
  opposition: "Oppositie",
  splinter: "Afgesplitst",
  none: "—",
} as const;

export default function PartijenOverviewPage() {
  const all = getAllPartiesSeed();
  const nl = getActiveDutchParties();
  const eu = all.filter((p) => p.region === "EU");
  const us = all.filter((p) => p.region === "US");

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Partijen", item: PAGE_PATH },
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
          <Kicker number="B1">Partijen</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Partijen,{" "}
            <em className="display-italic font-light text-navy">geordend</em>{" "}
            op zetels en spectrum.
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Per partij: positie op de vijf dimensies, fractieleider, zetels TK
            2025, coalitiestatus en — voor de grootste partijen — een
            redactionele samenvatting van het verkiezingsprogramma per thema.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      {/* Tweede Kamer */}
      <section className="mt-16 md:mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>Tweede Kamer — peildatum 17 mei 2026</Kicker>
            <h2 className="display mt-5 max-w-3xl">
              {nl.length} partijen met zetels in de Kamer.
            </h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 max-w-2xl text-sm text-ink-muted">
              Uitslag verkiezingen 29 oktober 2025, gecorrigeerd voor de
              afsplitsing van Groep Markuszower / De Nederlandse Alliantie op
              20 januari 2026. Coalitie = kabinet-Jetten (D66 + VVD + CDA).
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <ul className="mt-8 border-t border-rule">
              {nl.map((p, i) => (
                <li key={p.slug} className="border-b border-rule">
                  <Link
                    href={`/partij/${p.slug}`}
                    className="group block py-5 md:py-6 no-underline"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_1.4fr_120px_180px_auto] gap-3 lg:gap-6 items-center">
                      <p className="index-num text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <div>
                        <p className="display text-lg text-ink group-hover:text-navy transition-colors">
                          {p.name}
                        </p>
                        <p className="mono text-[0.62rem] tracking-wider text-ink-subtle mt-0.5">
                          {p.abbreviation.toUpperCase()}
                        </p>
                      </div>
                      <p className="text-sm text-ink-2 leading-snug">
                        {p.factionLeader ?? p.leader ?? "—"}
                        {p.coalitionStatus && (
                          <span className="ml-2 mono text-[0.6rem] tracking-wider text-ink-muted">
                            {COALITION_LABEL[p.coalitionStatus].toUpperCase()}
                          </span>
                        )}
                      </p>
                      <p className="mono tabular-nums text-sm text-ink">
                        {p.seatsTK2025 ?? 0}{" "}
                        <span className="text-ink-muted text-xs">zetels</span>
                      </p>
                      <MiniVector vector={p.positionVector} size="sm" />
                      <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                        className="text-ink-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* EU-fracties */}
      {eu.length > 0 && (
        <section className="mt-20 border-t border-ink pt-10">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={2}>Europese partijfamilies</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                {eu.length} EU-fracties op de vijf dimensies.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eu.map((p) => (
                  <li key={p.slug} className="border border-rule bg-paper p-5">
                    <Link
                      href={`/partij/${p.slug}`}
                      className="block no-underline group"
                    >
                      <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                        EU · {p.abbreviation.toUpperCase()}
                      </p>
                      <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                        {p.name}
                      </p>
                      <div className="mt-4">
                        <MiniVector vector={p.positionVector} size="sm" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollRevealItem>
          </ScrollReveal>
        </section>
      )}

      {/* Amerikaanse partijen */}
      {us.length > 0 && (
        <section className="mt-20 border-t border-ink pt-10">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={3}>Amerikaanse partijen</Kicker>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                {us.map((p) => (
                  <li key={p.slug} className="border border-rule bg-paper p-5">
                    <Link
                      href={`/partij/${p.slug}`}
                      className="block no-underline group"
                    >
                      <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                        US · {p.abbreviation.toUpperCase()}
                      </p>
                      <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                        {p.name}
                      </p>
                      <div className="mt-4">
                        <MiniVector vector={p.positionVector} size="sm" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollRevealItem>
          </ScrollReveal>
        </section>
      )}
    </Container>
  );
}
