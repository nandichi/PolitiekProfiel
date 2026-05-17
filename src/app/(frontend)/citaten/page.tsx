import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getAllIdeologiesSeed } from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/citaten";
const PAGE_TITLE = "Citaten-bibliotheek";
const PAGE_DESCRIPTION =
  "Shareable citaat-kaarten met de kernzin van elke politieke ideologie. Voor wie wil delen wat een stroming nu eigenlijk gelooft.";

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

export default function CitatenPage() {
  const ideologies = getAllIdeologiesSeed();
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Citaten", item: PAGE_PATH },
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
          <Kicker number="D3">Citaten</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Wat zegt een{" "}
            <em className="display-italic font-light text-navy">stroming</em>{" "}
            in één zin?
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Voor elke ideologie genereren we een citaat-kaart op basis van de
            kernbeschrijving, bedoeld om te delen op sociale media of in een
            essay. Geen partijpropaganda, wel de stroming in haar eigen taal.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-16 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>{ideologies.length} ideologieën</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
              {ideologies.map((ideo) => (
                <li
                  key={ideo.slug}
                  className="border border-rule bg-paper p-6 flex flex-col"
                >
                  <p className="mono text-[0.62rem] tracking-wider text-ink-subtle uppercase">
                    {ideo.spectrumPosition.replace(/-/g, " ")}
                  </p>
                  <p className="display mt-2 text-2xl text-ink leading-tight">
                    {ideo.name}
                  </p>
                  <p className="mt-4 text-sm text-ink-2 leading-relaxed flex-1">
                    {ideo.shortDescription}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3 items-center">
                    <Link
                      href={`/ideologie/${ideo.slug}`}
                      className="text-sm text-ink hover:text-navy"
                    >
                      Lees ideologie →
                    </Link>
                    <a
                      href={`/api/citaat/${ideo.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink-2 hover:text-navy"
                    >
                      Bekijk kaart
                    </a>
                    <a
                      href={`/api/citaat/${ideo.slug}`}
                      download={`politiekprofiel-citaat-${ideo.slug}.png`}
                      className="btn-ghost text-xs"
                    >
                      Download PNG
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      <section className="mt-20 border-t border-ink pt-10 max-w-3xl">
        <Kicker number={2}>Hoe te gebruiken</Kicker>
        <p className="mt-4 text-sm text-ink-2 leading-relaxed">
          De citaat-kaarten zijn vrij te gebruiken in artikelen, essays en op
          sociale media, mits met bronvermelding naar{" "}
          <code className="mono text-xs">politiekprofiel.nl</code>. Klik op een
          kaart om de PNG (1200×630, ideaal voor X/LinkedIn/Facebook) te
          downloaden. De citaten zijn afgeleid uit de eigen
          ideologie-beschrijvingen op deze site; géén toegeschreven uitspraken
          van politici.
        </p>
      </section>
    </Container>
  );
}
