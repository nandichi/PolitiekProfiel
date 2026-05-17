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
import { getAllIdeologiesSeed } from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/ideologieen";
const PAGE_TITLE = "Ideologieën";
const PAGE_DESCRIPTION =
  "Twaalf politieke stromingen, hun kernwaarden, voorbeelden en hoe ze zich verhouden tot Nederlandse partijen anno 2026.";

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

const SPECTRUM_LABEL: Record<string, string> = {
  "ver-links": "Ver-links",
  links: "Links",
  "centrum-links": "Centrum-links",
  centrum: "Centrum",
  "centrum-rechts": "Centrum-rechts",
  rechts: "Rechts",
  "ver-rechts": "Ver-rechts",
};

const SPECTRUM_ORDER = [
  "ver-links",
  "links",
  "centrum-links",
  "centrum",
  "centrum-rechts",
  "rechts",
  "ver-rechts",
];

export default function IdeologieenPage() {
  const ideologies = getAllIdeologiesSeed()
    .slice()
    .sort(
      (a, b) =>
        SPECTRUM_ORDER.indexOf(a.spectrumPosition) -
        SPECTRUM_ORDER.indexOf(b.spectrumPosition),
    );

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Ideologieën", item: PAGE_PATH },
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
          <Kicker number="A2">Ideologieën</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Twaalf manieren om de wereld te ordenen,{" "}
            <em className="display-italic font-light text-navy">
              zonder hokjes
            </em>
            .
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Geen ideologie is een toetssteen voor 'goed' of 'fout'. Wij beschrijven
            ze als coherente verzamelingen ideeën, met hun kerngedachten, hun
            voorbeelden en de bijbehorende positie op de vijf dimensies.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-16 md:mt-20 border-t border-ink">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border-x border-b border-rule">
          {ideologies.map((i, idx) => (
            <li key={i.slug} className="bg-paper">
              <Link
                href={`/ideologie/${i.slug}`}
                className="group block p-7 md:p-9 no-underline h-full"
              >
                <div className="flex items-baseline justify-between gap-4 mb-3">
                  <span className="index-num text-xs">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="mono text-[0.65rem] tracking-wider text-ink-subtle">
                    {SPECTRUM_LABEL[i.spectrumPosition] ?? i.spectrumPosition}
                  </span>
                </div>
                <h2 className="display text-2xl md:text-3xl leading-tight text-ink group-hover:text-navy transition-colors">
                  {i.name}
                </h2>
                <p className="mt-3 text-ink-2 leading-relaxed text-sm md:text-base">
                  {i.shortDescription}
                </p>
                <div className="mt-6">
                  <MiniVector vector={i.profileVector} />
                </div>
                <p className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-ink group-hover:text-navy transition-colors">
                  Lees deepdive
                  <ArrowRight size={14} strokeWidth={1.8} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
