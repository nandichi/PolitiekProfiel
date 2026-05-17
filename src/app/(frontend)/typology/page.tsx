import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import {
  listTypologyClusters,
  getTotalProfileCount,
  MIN_COHORT_SIZE,
} from "@/lib/cohort";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/typology";
const PAGE_TITLE = "Typology-clusters";
const PAGE_DESCRIPTION =
  "Acht archetypes van het Nederlandse politieke spectrum, gevoed door anonieme PolitiekProfiel-data. Bedoeld als spiegel, niet als label.";

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

export default async function TypologyPage() {
  const [clusters, total] = await Promise.all([
    listTypologyClusters().catch(() => []),
    getTotalProfileCount().catch(() => 0),
  ]);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Typology-clusters", item: PAGE_PATH },
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
          <Kicker number="C2">Typology-clusters</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Acht{" "}
            <em className="display-italic font-light text-navy">archetypes</em>{" "}
            van de Nederlandse kiezer.
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Geïnspireerd op Pew Research&rsquo;s politieke typologie, vertaald
            naar het Nederlandse vijf-dimensionale model. Acht hand-gecureerde
            archetypes; voor elk tonen we de gemiddelde positie van het
            cohort PolitiekProfiel-deelnemers dat erin valt.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-12 border-t border-ink pt-8">
        <p className="kicker mb-3">Privacy</p>
        <p className="text-sm text-ink-2 leading-relaxed max-w-3xl">
          We tonen alleen clusters waar ≥{MIN_COHORT_SIZE} profielen in vallen
          (k-anonimiteit). Een cluster verschijnt dus pas als er voldoende
          deelnemers zijn. We slaan geen extra metadata op buiten wat al in
          het anonieme resultaat staat. Lees de{" "}
          <Link href="/privacy" className="text-navy">
            privacyverklaring
          </Link>{" "}
          voor de volledige uitleg.
        </p>
      </section>

      {clusters.length === 0 ? (
        <section className="mt-16 border-t border-ink pt-10 max-w-3xl">
          <Kicker number={1}>Nog geen voldoende-grote clusters</Kicker>
          <p className="mt-4 text-sm text-ink-2 leading-relaxed">
            Er zijn op dit moment nog geen typology-clusters waar voldoende
            deelnemers in vallen om geaggregeerd te tonen. Doe zelf de quiz -
            jouw bijdrage helpt mee om dit landschap zichtbaar te maken.
          </p>
          <p className="mt-2 text-xs text-ink-muted">
            Totaal aantal profielen vandaag:{" "}
            <span className="mono tabular-nums">
              {total.toLocaleString("nl-NL")}
            </span>
          </p>
          <Link href="/quiz/standard" className="btn btn-primary mt-6">
            Doe de quiz
          </Link>
        </section>
      ) : (
        <section className="mt-16 border-t border-ink pt-10">
          <ScrollReveal variant="stagger">
            <ScrollRevealItem>
              <Kicker number={1}>Clusters</Kicker>
              <h2 className="display mt-5">
                {clusters.length} archetypes met voldoende deelnemers.
              </h2>
            </ScrollRevealItem>
            <ScrollRevealItem>
              <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                {clusters.map((c) => (
                  <li key={c.name} className="border border-rule bg-paper p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="display text-xl text-ink">{c.name}</p>
                      <p className="mono tabular-nums text-xs text-ink-muted">
                        n={c.size.toLocaleString("nl-NL")}
                      </p>
                    </div>
                    <p className="mt-3 text-sm text-ink-2 leading-relaxed">
                      {c.description}
                    </p>
                    <div className="mt-5">
                      <MiniVector vector={c.centroid} showLabels />
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollRevealItem>
          </ScrollReveal>
        </section>
      )}

      <section className="mt-16 border-t border-ink pt-10 max-w-3xl">
        <p className="kicker mb-3">Hoe is dit berekend?</p>
        <p className="text-sm text-ink-2 leading-relaxed">
          Voor elk archetype kiezen we een doel-vector op de vijf dimensies.
          Daarna zoeken we in de geanonimiseerde resultaten-database het cohort
          (op basis van afgeronde bucket-positie) dat het dichtst bij die
          doel-vector ligt en ≥{MIN_COHORT_SIZE} deelnemers heeft. We tonen
          het gemiddelde van dat cohort, niet de doel-vector zelf. Zo verschilt
          de getoonde positie van wat we &lsquo;verwachtten&rsquo;. Een ruwe
          Pew-stijl k-means clustering zit op de roadmap.
        </p>
      </section>
    </Container>
  );
}
