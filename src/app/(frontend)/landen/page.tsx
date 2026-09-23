import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { MiniVector } from "@/components/MiniVector";
import { ContentMasthead } from "@/components/content/PublicContent";
import { getAllCountriesSeed } from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/landen";
const PAGE_TITLE = "Landen";
const PAGE_DESCRIPTION =
  "Hoe staan landen op de vijf dimensies? Korte profielen op basis van V-Dem, Heritage, Eurobarometer en RSF.";

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

export default function LandenOverviewPage() {
  const countries = getAllCountriesSeed()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "nl"));

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Landen", item: PAGE_PATH },
  ]);

  return (
    <Container width="bleed" className="pt-12 md:pt-20 pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <ContentMasthead
        code="A4"
        eyebrow="Landen"
        title="Hoe positioneren landen zich politiek?"
        intro={
          <p>
            Korte profielen op basis van V-Dem Liberal Democracy Index, Heritage
            Index of Economic Freedom, Eurobarometer en RSF Press Freedom Index.
            Het is een momentopname; politieke regimes verschuiven.
          </p>
        }
        noteTitle="Vergelijking"
        note={<p>{countries.length} landen, alfabetisch geordend en op dezelfde vijf assen gezet.</p>}
      />

      <section className="mt-16 md:mt-20 border-t border-ink">
        <ul className="border-t border-rule-strong divide-y divide-rule">
          {countries.map((c) => (
            <li key={c.countryCode}>
              <Link
                href={`/land/${c.countryCode.toLowerCase()}`}
                className="group grid grid-cols-5 gap-x-4 gap-y-4 py-6 no-underline md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:items-center lg:gap-x-6"
              >
                <p className="col-span-1 mono text-[0.62rem] tracking-wider text-text-muted lg:col-span-2">
                  {c.countryCode}
                </p>
                <div className="col-span-4 min-w-0 md:col-span-5 lg:col-span-7">
                  <h2 className="display text-xl leading-tight text-ink transition-colors group-hover:text-signal-pressed md:text-2xl">
                    {c.name}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-raised">
                    {c.description}
                  </p>
                </div>
                <div className="col-start-2 col-span-4 md:col-start-auto md:col-span-4 lg:col-span-5">
                  <MiniVector vector={c.positionVector} size="sm" />
                </div>
                <p className="col-start-2 col-span-4 inline-flex items-center gap-1.5 text-xs font-medium text-ink transition-colors group-hover:text-signal-pressed md:col-start-auto md:col-span-1 lg:col-span-1">
                  Landenprofiel
                  <ArrowRight size={12} strokeWidth={1.8} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
