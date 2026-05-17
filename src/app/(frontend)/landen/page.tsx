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

      <ScrollReveal variant="stagger" immediate>
        <ScrollRevealItem>
          <Kicker number="A4">Landen</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Hoe positioneren landen{" "}
            <em className="display-italic font-light text-navy">
              zich politiek
            </em>
            ?
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Korte profielen op basis van V-Dem Liberal Democracy Index, Heritage
            Index of Economic Freedom, Eurobarometer en RSF Press Freedom Index.
            Het is een momentopname; politieke regimes verschuiven.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-16 md:mt-20 border-t border-ink">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border-x border-b border-rule">
          {countries.map((c) => (
            <li key={c.countryCode} className="bg-paper">
              <Link
                href={`/land/${c.countryCode.toLowerCase()}`}
                className="group block p-6 md:p-7 no-underline h-full"
              >
                <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                  {c.countryCode}
                </p>
                <h2 className="display mt-1.5 text-xl md:text-2xl leading-tight text-ink group-hover:text-navy transition-colors">
                  {c.name}
                </h2>
                <p className="mt-3 text-sm text-ink-2 leading-relaxed [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                  {c.description}
                </p>
                <div className="mt-5">
                  <MiniVector vector={c.positionVector} size="sm" />
                </div>
                <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink group-hover:text-navy transition-colors">
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
