import type { Metadata } from "next";
import Link from "next/link";
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

const PAGE_PATH = "/typology";
const PAGE_TITLE = "Politieke typologie";
const PAGE_DESCRIPTION =
  "Een uitleg van politieke typologieën en de vijf assen van PolitiekProfiel, zonder analyse van klantresultaten.";

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

export default function TypologyPage() {
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Politieke typologie", item: PAGE_PATH },
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
          <Kicker number="C2">Politieke typologie</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Begrijp politieke richtingen,
            <em className="display-italic font-light text-navy"> zonder bezoekers te groeperen</em>.
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Politieke labels kunnen een nuttige eerste ingang zijn, maar ze zijn
            nooit een volledige beschrijving van een persoon. Daarom zijn de
            typologiepagina en resultatenpagina niet langer gebaseerd op
            geaggregeerde klantresultaten.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-16 border-t border-ink pt-10 max-w-3xl">
        <Kicker number={1}>Wat je hier wel vindt</Kicker>
        <h2 className="display mt-5">Vijf assen als denkraam.</h2>
        <p className="mt-5 text-ink-2 leading-relaxed">
          PolitiekProfiel ordent antwoorden langs vijf onafhankelijke assen:
          economie, samenleving, burgerrechten, bestuur en institutioneel
          vertrouwen. Die assen zijn een hulpmiddel om verschillen en
          afwegingen te bespreken. Ze zijn geen diagnose, partijadvies of vast
          etiket.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/methodiek" className="btn btn-primary">
            Lees de methodiek
          </Link>
          <Link href="/ideologie" className="btn btn-ghost">
            Verken ideologieën
          </Link>
        </div>
      </section>

      <section className="mt-16 border-t border-ink pt-10 max-w-3xl">
        <Kicker number={2}>Privacykeuze</Kicker>
        <h2 className="display mt-5">Jouw resultaat blijft van jou.</h2>
        <p className="mt-5 text-ink-2 leading-relaxed">
          De site gebruikt nieuwe resultaten niet om openbare groepen,
          archetypen of gemiddelden te berekenen. Een resultaat is alleen
          beschikbaar voor iemand met de deelbare link. Deel die link daarom
          alleen met mensen die je je politieke antwoorden wilt laten zien.
        </p>
        <Link href="/privacy" className="mt-6 inline-block text-sm text-navy hover:text-ink">
          Lees hoe resultaatlinks en gegevensverwijdering werken →
        </Link>
      </section>
    </Container>
  );
}
