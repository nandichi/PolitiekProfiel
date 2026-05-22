import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getActiveDutchParties } from "@/lib/seed-readers";
import {
  findCoalitions,
  presetCoalitions,
  type CoalitionInput,
} from "@/lib/coalition";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import { CoalitionResultExplorer } from "@/components/coalition/CoalitionResultExplorer";
import { CoalitionBuilder } from "@/components/coalition/CoalitionBuilder";
import { getResult } from "@/lib/results-store";

interface PageProps {
  searchParams: Promise<{ r?: string }>;
}

const PAGE_PATH = "/coalitie";
const PAGE_TITLE = "Coalitie-simulator";
const PAGE_DESCRIPTION =
  "Bouw zelf een coalitie en zie live hoeveel zetels je hebt, waar de coalitie politiek staat en hoeveel spanning er zit tussen de partijen.";

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

export default async function CoalitiePage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const result = sp.r ? await getResult(sp.r) : null;

  const partiesSeed = getActiveDutchParties();
  const pool: CoalitionInput[] = partiesSeed.map((p) => ({
    slug: p.slug,
    name: p.name,
    abbreviation: p.abbreviation,
    seats: p.seatsTK2025 ?? 0,
    vector: p.positionVector,
    coalitionStatus: p.coalitionStatus,
  }));

  const presets = presetCoalitions(pool);

  // Niet-gepersonaliseerde top 12: kleinste spreads. Blijft beschikbaar als
  // secundaire ontdekkingsweg onder de interactieve builder.
  const defaultCoalitions = findCoalitions({
    parties: pool,
    majority: 76,
    maxSize: 5,
    limit: 20,
  });

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Coalitie-simulator", item: PAGE_PATH },
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
          <Kicker number="B5">Coalitie-simulator</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Bouw jouw coalitie,{" "}
            <em className="display-italic font-light text-navy">
              meet de spanning
            </em>
            .
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Met de zetelverdeling van de Tweede Kamer (TK 2025) zoek je
            zelf naar een meerderheid van 76 zetels. Per geselecteerde
            combinatie zie je het zetel-gewogen zwaartepunt op de vijf
            dimensies en de maximale onderlinge afstand &mdash; een ruwe
            maat voor politieke spanning binnen de coalitie.
          </p>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/quiz/standard" className="btn btn-primary">
              Doe de quiz voor jouw match
            </Link>
            <Link href="/vergelijk" className="btn btn-ghost">
              Heb je al een resultaat?
            </Link>
          </div>
        </ScrollRevealItem>
      </ScrollReveal>

      {/* Builder + share-link input */}
      <section className="mt-16 md:mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>Interactieve coalition-builder</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 max-w-2xl text-sm text-ink-muted">
              Plak je share-link of share-ID om je eigen vector mee te nemen.
              Werkt ook zonder; dan zie je alleen de coalitie-positie.
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-6">
              <CoalitionResultExplorer pool={pool} />
            </div>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-10">
              <CoalitionBuilder
                pool={pool}
                userVector={result?.dimensions}
                userShareId={result?.shareId}
                presets={presets}
              />
            </div>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Rekenkundig kleinste meerderheden — secundaire ontdekking */}
      <section className="mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={2}>Of laat het algoritme suggesties doen</Kicker>
            <h2 className="display mt-5 max-w-3xl">
              Twaalf combinaties met 76+ zetels en lage onderlinge spanning.
            </h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 max-w-2xl text-sm text-ink-muted">
              Geen rekening gehouden met uitsluitingen of politieke voorkeuren.
              Puur arithmetisch. Gesorteerd op spread &mdash; de maximale
              afstand tussen partijen binnen de coalitie. Klik een combinatie
              om hem in de builder hierboven te bekijken (gebruik daarvoor de
              partij-knoppen).
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <ul className="mt-8 border-t border-rule">
              {defaultCoalitions
                .slice()
                .sort((a, b) => a.spread - b.spread)
                .slice(0, 12)
                .map((c, i) => (
                  <li key={i} className="border-b border-rule py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_140px_120px] gap-3 lg:gap-6 items-center">
                      <p className="index-num text-xs">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <ul className="flex flex-wrap gap-2">
                        {c.parties.map((p) => (
                          <li key={p.slug}>
                            <Link
                              href={`/partij/${p.slug}`}
                              className="inline-flex items-baseline gap-2 border border-rule px-2.5 py-1 text-xs text-ink-2 no-underline hover:text-navy"
                            >
                              <span>{p.abbreviation}</span>
                              <span className="mono tabular-nums text-[0.6rem] text-ink-subtle">
                                {p.seats}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <p className="mono tabular-nums text-sm text-ink">
                        {c.totalSeats}{" "}
                        <span className="text-ink-muted text-xs">zetels</span>
                      </p>
                      <div>
                        <p className="mono text-[0.6rem] tracking-wider text-ink-subtle">
                          SPREAD
                        </p>
                        <p className="mono tabular-nums text-sm text-ink">
                          {Math.round(c.spread)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      {/* Disclaimer */}
      <section className="mt-20 border-t border-ink pt-10 max-w-3xl">
        <p className="kicker mb-3">Geen stemadvies</p>
        <p className="text-sm text-ink-2 leading-relaxed">
          Deze simulator rekent op afstanden tussen partijposities op vijf
          dimensies. Een lage afstand zegt niets over haalbaarheid in de
          praktijk: politiek wordt mede bepaald door uitsluitingen,
          persoonlijke verhoudingen en thema-prioriteiten. Voor de echte
          formatie zie de publicaties van de informateur en parlement.com.
        </p>
        <div className="mt-6">
          <MiniVector
            vector={{
              economic: 0,
              social: 0,
              civil: 0,
              governance: 0,
              trust: 0,
            }}
            showLabels
            size="sm"
          />
        </div>
      </section>
    </Container>
  );
}
