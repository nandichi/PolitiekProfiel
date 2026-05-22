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
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import {
  getActiveDutchParties,
  getAllCountriesSeed,
  getAllIdeologiesSeed,
  getAllPoliticiansSeed,
  getAllQuestionsSeed,
} from "@/lib/seed-readers";
import { GLOSSARY } from "@/data/woordenboek";

const PAGE_PATH = "/verkennen";
const PAGE_TITLE = "Verken het kompas";
const PAGE_DESCRIPTION =
  "Politici, partijen, ideologieën, landen, stellingen en een politiek woordenboek: alles wat het kompas voedt, doorbladerbaar en uitlegbaar.";

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

interface HubEntry {
  kicker: string;
  href: string;
  title: string;
  description: string;
  meta: string;
}

export default async function VerkennenPage() {
  const [questions, parties, politicians, countries, ideologies] =
    await Promise.all([
      getAllQuestionsSeed(),
      Promise.resolve(getActiveDutchParties()),
      Promise.resolve(getAllPoliticiansSeed()),
      Promise.resolve(getAllCountriesSeed()),
      Promise.resolve(getAllIdeologiesSeed()),
    ]);

  const entries: HubEntry[] = [
    {
      kicker: "A1",
      href: "/stellingen",
      title: "Stellingen-bibliotheek",
      description:
        "Elke stelling met context, voor- en tegenargumenten, bronnen en thema's. Voor wie wil weten waarom er gevraagd wordt wat er gevraagd wordt.",
      meta: `${questions.length} STELLINGEN · ${questions.filter((q) => q.tiers.includes("quick")).length} IN DE QUICK QUIZ`,
    },
    {
      kicker: "A2",
      href: "/ideologieen",
      title: "Ideologieën",
      description:
        "Zestien politieke stromingen, hun kernwaarden, voorbeelden en hoe ze zich in 2026 verhouden tot Nederlandse partijen.",
      meta: `${ideologies.length} IDEOLOGIEËN`,
    },
    {
      kicker: "A3",
      href: "/politici",
      title: "Politici",
      description:
        "Nederlandse en internationale politici op de vijf dimensies. Per persoon: vector, ideologische verwantschap, partij en bio.",
      meta: `${politicians.length} POLITICI`,
    },
    {
      kicker: "B1",
      href: "/partijen",
      title: "Partijen",
      description:
        "Alle partijen met een Tweede Kamer-zetel anno mei 2026, met fractievoorzitter, ideologische verwantschap en CPB-status.",
      meta: `${parties.length} PARTIJEN MET ZETELS`,
    },
    {
      kicker: "A4",
      href: "/landen",
      title: "Landen",
      description:
        "Hoe staan landen op de vijf dimensies? Korte profielen, regeringssamenstelling en context.",
      meta: `${countries.length} LANDEN`,
    },
    {
      kicker: "A7",
      href: "/woordenboek",
      title: "Woordenboek",
      description:
        "Nederlandse politieke termen helder uitgelegd, van AOW en kabinetsformatie tot subsidiariteit en trias politica.",
      meta: `${GLOSSARY.length} TERMEN`,
    },
    {
      kicker: "B5",
      href: "/coalitie",
      title: "Coalitie-simulator",
      description:
        "Welke combinatie van partijen ligt het dichtst bij jouw profiel? Geen stemadvies, wel een denkoefening.",
      meta: "EXPERIMENTEEL",
    },
    {
      kicker: "B6",
      href: "/turing-test",
      title: "Ideological Turing Test",
      description:
        "Raad uit welk politiek kamp een citaat komt. Mini-game tegen je eigen vooroordelen.",
      meta: "EXPERIMENTEEL",
    },
    {
      kicker: "C1",
      href: "/evolutie",
      title: "Politieke evolutie",
      description:
        "Bewaar je shareID's en zie hoe je profiel zich over tijd ontwikkelt. Geen account; jij beheert je eigen reeks.",
      meta: "VOOR HERHAALDE QUIZZEN",
    },
    {
      kicker: "C2",
      href: "/typology",
      title: "Typology-clusters",
      description:
        "Acht archetypes van de Nederlandse kiezer, gevoed door anonieme aggregaten van eerdere profielen. Bedoeld als spiegel, niet als label.",
      meta: "K-ANONIEM · ≥50 PROFIELEN",
    },
    {
      kicker: "D3",
      href: "/citaten",
      title: "Citaten-bibliotheek",
      description:
        "Eén-zin samenvattingen per ideologie als shareable PNG-kaart, geschikt voor essays, blogs en sociale media.",
      meta: `${ideologies.length} CITAAT-KAARTEN`,
    },
  ];

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: PAGE_PATH },
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
          <Kicker number="NL · 2026">Verken het kompas</Kicker>
        </ScrollRevealItem>

        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Alles wat het kompas voedt,{" "}
            <em className="display-italic font-light text-navy">openbaar</em>.
          </h1>
        </ScrollRevealItem>

        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            De vragenlijst is niet het einde. Hier vind je de stellingen,
            ideologieën, politici, partijen, landen en termen die het profiel
            opbouwen, zonder ranking en zonder oordeel.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-16 md:mt-20 border-t border-ink">
        <ScrollReveal variant="stagger">
          <ul>
            {entries.map((e) => (
              <ScrollRevealItem as="li" key={e.href}>
                <Link
                  href={e.href}
                  className="group block border-b border-rule py-8 md:py-10 no-underline"
                >
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[80px_1fr_auto] lg:gap-12 items-baseline">
                    <p className="index-num text-sm">{e.kicker}</p>
                    <div className="min-w-0">
                      <h2 className="display text-3xl md:text-4xl leading-tight text-ink group-hover:text-navy transition-colors">
                        {e.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-ink-2 leading-relaxed">
                        {e.description}
                      </p>
                      <p className="mt-4 mono text-[0.65rem] tracking-wider text-ink-subtle">
                        {e.meta}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      strokeWidth={1.6}
                      className="text-ink-muted group-hover:text-navy group-hover:translate-x-1 transition-all hidden lg:block"
                    />
                  </div>
                </Link>
              </ScrollRevealItem>
            ))}
          </ul>
        </ScrollReveal>
      </section>
    </Container>
  );
}
