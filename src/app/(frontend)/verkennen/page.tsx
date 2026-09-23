import type { Metadata } from "next";
import { Container } from "@/components/Container";
import {
  ContentMasthead,
  RuledLink,
  RuledList,
} from "@/components/content/PublicContent";
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
import { CABINETS } from "@/data/cabinets";

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

type GroupId = "questions" | "people" | "history" | "tools";

interface HubEntry {
  group: GroupId;
  kicker: string;
  href: string;
  title: string;
  description: string;
  meta: string;
}

const GROUPS: Array<{ id: GroupId; label: string; description: string }> = [
  {
    id: "questions",
    label: "Vragen en methode",
    description: "De vragenbank, politieke stromingen, begrippen en het denkraam achter de meting.",
  },
  {
    id: "people",
    label: "Partijen en personen",
    description: "Publieke profielen van partijen en politici op vijf afzonderlijke assen.",
  },
  {
    id: "history",
    label: "Landen en geschiedenis",
    description: "Vergelijkende landenprofielen en kabinetten sinds 1994.",
  },
  {
    id: "tools",
    label: "Tools en experimenten",
    description: "Interactieve verkenningen, tijdlijnen en deelbare publicatievormen.",
  },
];

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
      group: "questions",
      kicker: "A1",
      href: "/stellingen",
      title: "Stellingen-bibliotheek",
      description:
        "Elke stelling met context, voor- en tegenargumenten, bronnen en thema's. Voor wie wil weten waarom er gevraagd wordt wat er gevraagd wordt.",
      meta: `${questions.length} STELLINGEN · ${questions.filter((q) => q.tiers.includes("quick")).length} IN DE QUICK QUIZ`,
    },
    {
      group: "questions",
      kicker: "A2",
      href: "/ideologieen",
      title: "Ideologieën",
      description:
        "Zestien politieke stromingen, hun kernwaarden, voorbeelden en hoe ze zich in 2026 verhouden tot Nederlandse partijen.",
      meta: `${ideologies.length} IDEOLOGIEËN`,
    },
    {
      group: "people",
      kicker: "A3",
      href: "/politici",
      title: "Politici",
      description:
        "Nederlandse en internationale politici op de vijf dimensies. Per persoon: vector, ideologische verwantschap, partij en bio.",
      meta: `${politicians.length} POLITICI`,
    },
    {
      group: "people",
      kicker: "B1",
      href: "/partijen",
      title: "Partijen",
      description:
        "Alle Tweede Kamer-fracties per 14 september 2026, met fractievoorzitter, ideologische verwantschap en CPB-status.",
      meta: `${parties.length} PARTIJEN MET ZETELS`,
    },
    {
      group: "history",
      kicker: "B2",
      href: "/kabinetten",
      title: "Kabinetten",
      description:
        "Twaalf kabinetten sinds 1994: wie meeregeerde, hoe lang, waarom het eindigde, wat is bereikt en wat niet.",
      meta: `${CABINETS.length} KABINETTEN`,
    },
    {
      group: "history",
      kicker: "A4",
      href: "/landen",
      title: "Landen",
      description:
        "Hoe staan landen op de vijf dimensies? Korte profielen, regeringssamenstelling en context.",
      meta: `${countries.length} LANDEN`,
    },
    {
      group: "questions",
      kicker: "A7",
      href: "/woordenboek",
      title: "Woordenboek",
      description:
        "Nederlandse politieke termen helder uitgelegd, van AOW en kabinetsformatie tot subsidiariteit en trias politica.",
      meta: `${GLOSSARY.length} TERMEN`,
    },
    {
      group: "tools",
      kicker: "B5",
      href: "/coalitie",
      title: "Coalitie-simulator",
      description:
        "Welke combinatie van partijen ligt het dichtst bij jouw profiel? Geen stemadvies, wel een denkoefening.",
      meta: "EXPERIMENTEEL",
    },
    {
      group: "tools",
      kicker: "B6",
      href: "/turing-test",
      title: "Retoriekspel",
      description:
        "Raad welk politiek kamp een retorisch fragment het beste typeert. Een mini-game zonder partijadvies.",
      meta: "EXPERIMENTEEL",
    },
    {
      group: "tools",
      kicker: "C1",
      href: "/evolutie",
      title: "Politieke evolutie",
      description:
        "Bewaar je shareID's en zie hoe je profiel zich over tijd ontwikkelt. Geen account; jij beheert je eigen reeks.",
      meta: "VOOR HERHAALDE QUIZZEN",
    },
    {
      group: "questions",
      kicker: "C2",
      href: "/typology",
      title: "Politieke typologie",
      description:
        "Lees hoe politieke typologieën en de vijf assen werken, zonder klantresultaten te groeperen of analyseren.",
      meta: "PRIVACYVEILIG DENKRAAM",
    },
    {
      group: "tools",
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
    <Container width="bleed" className="pb-24 pt-10 md:pt-16">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <ContentMasthead
        code="NL · 2026"
        eyebrow="Verken het kompas"
        title="Alles wat het kompas voedt, openbaar."
        intro={
          <p>
            De vragenlijst is niet het einde. Hier vind je de stellingen,
            ideologieën, politici, partijen, landen en termen die het profiel
            opbouwen, zonder ranking en zonder oordeel.
          </p>
        }
        noteTitle="Register"
        note={<p>{entries.length} openbare ingangen, geordend in vier dossiers.</p>}
      />

      <div className="mt-14 space-y-16 md:mt-20 md:space-y-20">
        {GROUPS.map((group, groupIndex) => {
          const groupEntries = entries.filter((entry) => entry.group === group.id);
          return (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <div className="grid grid-cols-5 gap-x-4 gap-y-4 border-t border-ink pt-5 md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:gap-x-6">
                <p className="col-span-1 font-mono text-[0.68rem] font-semibold tracking-[0.12em] text-signal">
                  {String(groupIndex + 1).padStart(2, "0")}
                </p>
                <div className="col-span-4 md:col-span-6 lg:col-span-8">
                  <h2
                    id={`group-${group.id}`}
                    className="font-display text-3xl font-extrabold leading-none tracking-[-0.035em] md:text-4xl"
                  >
                    {group.label}
                  </h2>
                </div>
                <p className="col-start-2 col-span-4 text-sm leading-6 text-text-muted md:col-start-auto md:col-span-3 lg:col-span-5">
                  {group.description}
                </p>
              </div>

              <RuledList className="mt-7">
                {groupEntries.map((entry) => (
                  <RuledLink
                    key={entry.href}
                    href={entry.href}
                    code={entry.kicker}
                    title={entry.title}
                    description={entry.description}
                    meta={entry.meta}
                  />
                ))}
              </RuledList>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
