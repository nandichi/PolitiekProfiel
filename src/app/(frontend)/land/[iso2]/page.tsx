import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { DimensionBar } from "@/components/DimensionBar";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { DIMENSIONS } from "@/lib/dimensions";
import {
  getAllCountriesSeed,
  getCountryByCodeSeed,
  getAllPoliticiansSeed,
} from "@/lib/seed-readers";
import { distance } from "@/lib/scoring";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ iso2: string }>;
}

export function generateStaticParams() {
  return getAllCountriesSeed().map((c) => ({
    iso2: c.countryCode.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { iso2 } = await params;
  const c = getCountryByCodeSeed(iso2);
  if (!c) return {};
  const path = `/land/${iso2.toLowerCase()}`;
  return {
    title: `${c.name} — politieke positie`,
    description: c.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${c.name} · PolitiekProfiel`,
      description: c.description,
      url: path,
      type: "article",
    },
  };
}

export default async function LandDetailPage({ params }: PageProps) {
  const { iso2 } = await params;
  const country = getCountryByCodeSeed(iso2);
  if (!country) notFound();

  const localPoliticians = getAllPoliticiansSeed().filter(
    (p) => p.country.toLowerCase() === country.name.toLowerCase(),
  );

  const allCountries = getAllCountriesSeed();
  const closeCountries = allCountries
    .filter((c) => c.countryCode !== country.countryCode)
    .map((c) => ({
      ...c,
      d: distance(country.positionVector, c.positionVector),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 4);

  const path = `/land/${iso2.toLowerCase()}`;
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Landen", item: "/landen" },
    { name: country.name, item: path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <Container width="bleed" className="pt-10 md:pt-16">
        <Link
          href="/landen"
          className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink no-underline mb-6"
        >
          <ArrowLeft size={14} strokeWidth={1.8} />
          Alle landen
        </Link>

        <ScrollReveal variant="stagger" immediate>
          <ScrollRevealItem>
            <Kicker>{country.countryCode}</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <h1
              className="display mt-6 max-w-4xl"
              style={{ letterSpacing: "-0.025em" }}
            >
              {country.name}
            </h1>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-6 max-w-2xl text-base md:text-lg text-ink-2 leading-relaxed">
              {country.description}
            </p>
          </ScrollRevealItem>
        </ScrollReveal>
      </Container>

      {/* Dimensies */}
      <section className="mt-16 md:mt-20 border-t border-ink">
        <Container width="bleed" className="py-12 md:py-16">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Op de vijf dimensies</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                {country.name} in cijfers.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <div className="mt-10 max-w-3xl">
                {DIMENSIONS.map((d, i) => (
                  <DimensionBar
                    key={d.id}
                    dimension={d.id}
                    value={country.positionVector[d.id]}
                    index={i}
                  />
                ))}
              </div>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <p className="mt-8 mono text-[0.65rem] tracking-wider text-ink-subtle max-w-3xl">
                BRONNEN: {country.sources.map((s) => s.label).join(" · ").toUpperCase()}
              </p>
            </ScrollRevealItem>
          </ScrollReveal>
        </Container>
      </section>

      {/* Politici uit dit land */}
      {localPoliticians.length > 0 && (
        <section className="border-t border-rule bg-paper-50/40">
          <Container width="bleed" className="py-14 md:py-20">
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>Politici uit {country.name}</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
                  {localPoliticians.map((p) => (
                    <li key={p.slug} className="border border-rule bg-paper p-5">
                      <Link
                        href={`/politici/${p.slug}`}
                        className="block no-underline group"
                      >
                        <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                          {p.party.toUpperCase()}
                        </p>
                        <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                          {p.name}
                        </p>
                        <p className="mt-1 text-xs text-ink-muted">{p.role}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollRevealItem>
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Dichtbij gelegen landen */}
      <section className="border-t border-rule">
        <Container width="bleed" className="py-14 md:py-20">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={3}>Dichtbij op de vijf assen</Kicker>
              <h2 className="display mt-5 max-w-3xl">
                Vier landen die {country.name} het meest benaderen.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
                {closeCountries.map((c) => (
                  <li key={c.countryCode} className="border border-rule bg-paper p-5">
                    <Link
                      href={`/land/${c.countryCode.toLowerCase()}`}
                      className="block no-underline group"
                    >
                      <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                        {c.countryCode}
                      </p>
                      <p className="display mt-1.5 text-lg leading-tight text-ink group-hover:text-navy transition-colors">
                        {c.name}
                      </p>
                      <p className="mt-3 mono text-[0.65rem] tracking-wider text-ink-subtle">
                        AFSTAND {Math.round(c.d)}
                      </p>
                      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-2 group-hover:text-navy transition-colors">
                        Bekijk
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
    </>
  );
}
