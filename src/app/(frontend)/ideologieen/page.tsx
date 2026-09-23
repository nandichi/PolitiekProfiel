import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { MiniVector } from "@/components/MiniVector";
import { ContentMasthead } from "@/components/content/PublicContent";
import { getAllIdeologiesSeed } from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/ideologieen";
const PAGE_TITLE = "Ideologieën";
const PAGE_DESCRIPTION =
  "Zestien politieke stromingen, hun kernwaarden, voorbeelden en hoe ze zich verhouden tot Nederlandse partijen anno 2026.";

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

      <ContentMasthead
        code="A2"
        eyebrow="Ideologieën"
        title="Zestien manieren om de wereld te ordenen, zonder hokjes."
        intro={
          <p>
            Geen ideologie is een toetssteen voor &apos;goed&apos; of &apos;fout&apos;. Wij beschrijven
            ze als coherente verzamelingen ideeën, met hun kerngedachten, hun
            voorbeelden en de bijbehorende positie op de vijf dimensies.
          </p>
        }
        noteTitle="Leeswijzer"
        note={<p>De spectrumpositie ordent de lijst. De vijf assen tonen de inhoudelijke verschillen.</p>}
      />

      <section className="mt-16 md:mt-20 border-t border-ink">
        <ul className="border-t border-rule-strong divide-y divide-rule">
          {ideologies.map((i, idx) => (
            <li key={i.slug}>
              <Link
                href={`/ideologie/${i.slug}`}
                className="group grid grid-cols-5 gap-x-4 gap-y-4 py-6 no-underline md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:items-center lg:gap-x-6"
              >
                <div className="col-span-1 flex flex-col gap-2 lg:col-span-2">
                  <span className="index-num text-xs">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="mono text-[0.65rem] tracking-wider text-text-muted">
                    {SPECTRUM_LABEL[i.spectrumPosition] ?? i.spectrumPosition}
                  </span>
                </div>
                <div className="col-span-4 min-w-0 md:col-span-5 lg:col-span-7">
                  <h2 className="display text-2xl leading-tight text-ink transition-colors group-hover:text-signal-pressed md:text-3xl">
                    {i.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-raised md:text-base">
                    {i.shortDescription}
                  </p>
                </div>
                <div className="col-start-2 col-span-4 md:col-start-auto md:col-span-4 lg:col-span-5">
                  <MiniVector vector={i.profileVector} />
                </div>
                <p className="col-start-2 col-span-4 inline-flex items-center gap-2 text-xs font-medium text-ink transition-colors group-hover:text-signal-pressed md:col-start-auto md:col-span-1 lg:col-span-1">
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
