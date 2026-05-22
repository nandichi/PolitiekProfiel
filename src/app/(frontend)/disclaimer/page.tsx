import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { StickyIndex } from "@/components/StickyIndex";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import {
  buildArticleSchema,
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";
import type { Metadata } from "next";

const PAGE_PATH = "/disclaimer";
const PAGE_PUBLISHED = "2026-05-19";
const PAGE_MODIFIED = "2026-05-19";
const PAGE_DESCRIPTION =
  "Disclaimer van PolitiekProfiel: politieke neutraliteit, geen stem- of juridisch advies, en de uitdrukkelijke uitsluiting van aansprakelijkheid voor interpretaties.";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Disclaimer · PolitiekProfiel",
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["https://naoufalandichi.nl"],
  },
};

const INDEX = [
  { id: "intro", label: "Strekking" },
  { id: "neutraliteit", label: "Politieke neutraliteit" },
  { id: "geen-advies", label: "Geen advies" },
  { id: "duiding", label: "Duiding & interpretatie" },
  { id: "bronnen", label: "Bronnen & citaten" },
  { id: "links", label: "Externe links" },
  { id: "beschikbaarheid", label: "Beschikbaarheid" },
  { id: "aansprakelijkheid", label: "Aansprakelijkheid" },
  { id: "melding", label: "Meldingen" },
];

export default function DisclaimerPage() {
  const articleLd = buildArticleSchema({
    path: PAGE_PATH,
    headline: "Disclaimer van PolitiekProfiel",
    description: PAGE_DESCRIPTION,
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_MODIFIED,
    articleSection: "Juridisch",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Disclaimer", item: PAGE_PATH },
  ]);

  return (
    <Container width="bleed" className="pt-12 md:pt-20">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdString([articleLd, breadcrumbLd]),
        }}
      />
      <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-[220px_1fr]">
        <StickyIndex items={INDEX} topOffset={96} />

        <div className="min-w-0 max-w-3xl">
          <section id="intro" className="scroll-mt-32">
            <ScrollReveal variant="stagger" immediate>
              <ScrollRevealItem>
                <Kicker>Disclaimer</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1
                  className="display mt-6"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  Geen advies.
                  <span className="block">
                    <em className="display-italic font-light text-navy">
                      Geen oordeel.
                    </em>
                  </span>
                </h1>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-8 text-lg md:text-xl text-ink-2 leading-relaxed">
                  PolitiekProfiel is een educatief instrument voor
                  zelfreflectie, niet meer en niet minder. Deze disclaimer
                  legt vast wat dat juridisch betekent — voor jou, voor ons,
                  en voor wie ooit een conclusie aan een resultaat probeert
                  te koppelen.
                </p>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-6 mono text-xs text-ink-muted tracking-wide">
                  Versie 1.0 · laatst bijgewerkt op 19 mei 2026
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <Block
            id="neutraliteit"
            kicker="01 · Politieke neutraliteit"
            title="Onafhankelijk, niet onpartijdig over feiten."
            accent="ink"
          >
            <p>
              PolitiekProfiel is geen politieke partij, geen
              belangenorganisatie en geen campagne. We zijn niet gelieerd
              aan, gefinancierd door of namens enige partij, kandidaat,
              fractie, denktank of overheidsinstelling. Onze methodiek,
              vragen en duiding zijn ontwikkeld vanuit een{" "}
              <strong>onafhankelijke redactionele lijn</strong>.
            </p>
            <p>
              Dat betekent niet dat de inhoud waardevrij is. Het selecteren
              van dimensies, het wegen van stellingen en het toekennen van
              ideologische clusters vergt keuzes. Die keuzes proberen we
              transparant te maken op de pagina{" "}
              <a href="/methodiek">methodiek</a>. We staan voor die keuzes,
              maar zien ze niet als de enige denkbare waarheid.
            </p>
            <p>
              Verwijzingen naar partijen, politici, ideologieën of historische
              bewegingen zijn nadrukkelijk geen kwalificatie van die
              partij, persoon of beweging als &lsquo;goed&rsquo; of
              &lsquo;slecht&rsquo;. We beschrijven posities; we adviseren
              niet over keuzes.
            </p>
          </Block>

          <Block
            id="geen-advies"
            kicker="02 · Geen advies"
            title="Wat PolitiekProfiel uitdrukkelijk niet is."
            accent="terra"
          >
            <p>De inhoud van PolitiekProfiel is geen:</p>
            <ul>
              <li>
                <strong>stemadvies</strong> of aanbeveling om op een
                specifieke partij of persoon te stemmen;
              </li>
              <li>
                <strong>juridisch advies</strong>, ook niet over kiesrecht,
                campagneregels, demonstratierecht of vergelijkbare
                onderwerpen;
              </li>
              <li>
                <strong>psychologisch, medisch of pedagogisch advies</strong>;
                de uitslag is geen indicatie van persoonlijkheid, intellectie
                of geschiktheid voor enig doel;
              </li>
              <li>
                <strong>wetenschappelijke meting</strong> van persoonlijkheid,
                ideologische identiteit of gedragsvoorspelling;
              </li>
              <li>
                <strong>journalistieke uitspraak</strong> over individuele
                politici buiten de context van publieke standpunten en
                openbaar beschikbare bronnen.
              </li>
            </ul>
            <p>
              Beslissingen die je neemt op basis van de inhoud van de
              website &mdash; over stemmen, lidmaatschap, donaties,
              publicaties of uitlatingen &mdash; neem je volledig op eigen
              verantwoordelijkheid.
            </p>
          </Block>

          <Block
            id="duiding"
            kicker="03 · Duiding & interpretatie"
            title="Een profiel is een interpretatie, geen identiteit."
            accent="ink"
          >
            <p>
              Een resultaat is een momentopname op basis van een beperkte set
              vragen. Het profiel, de ideologische clustering en
              vergelijkingen met partijen of politici zijn statistische en
              redactionele <strong>interpretaties</strong>, geen feitelijke
              vaststelling van wie je bent of wat je gelooft.
            </p>
            <p>
              De uitslag kan veranderen wanneer je dezelfde vragen op een
              ander moment, in een andere stemming of met andere voorbeelden
              in gedachten beantwoordt. Dat is normaal. Wij claimen niet te
              kunnen voorspellen op wie je zou moeten stemmen, en wijzen
              elke aansprakelijkheid af voor onvrede met of consequenties
              van een specifieke uitslag.
            </p>
            <p>
              Wanneer een derde &mdash; werkgever, journalist, familielid,
              algoritme of overheid &mdash; jouw resultaat tegen je gebruikt
              of er een conclusie aan verbindt, is dat de
              verantwoordelijkheid van die derde, niet van ons. Deel je
              share-link daarom alleen met wie je vertrouwt; zie ook de{" "}
              <a href="/privacy">privacyverklaring</a>.
            </p>
          </Block>

          <Block
            id="bronnen"
            kicker="04 · Bronnen & citaten"
            title="Hoe we omgaan met externe informatie."
            accent="ink"
          >
            <p>
              We baseren ons op publiek toegankelijke bronnen, waaronder
              partijprogramma&apos;s, parlementaire stukken, openbare
              uitspraken en gespecialiseerde databases. Citaten worden
              opgenomen onder het citaatrecht en voorzien van bronvermelding
              waar mogelijk. Wij doen redelijke inspanningen om bronnen
              correct en actueel weer te geven, maar geven geen garantie
              op volledigheid of juistheid van die bronnen zelf.
            </p>
            <p>
              Zie je een fout, een verouderd citaat of een onjuiste
              toeschrijving? Mail{" "}
              <a href="mailto:info@politiekprofiel.nl">
                info@politiekprofiel.nl
              </a>{" "}
              en we bekijken het zo snel mogelijk.
            </p>
          </Block>

          <Block
            id="links"
            kicker="05 · Externe links"
            title="Wij beheren niet wat we niet zelf publiceren."
            accent="ink"
          >
            <p>
              De website bevat links naar externe websites en bronnen.
              Wij hebben geen controle over de inhoud, het beleid, de
              beschikbaarheid of de privacypraktijken van die externe
              partijen. Het volgen van zo&apos;n link is voor eigen
              rekening en risico. Wij aanvaarden geen aansprakelijkheid
              voor schade die voortvloeit uit gebruik van externe sites,
              ook niet wanneer de link op onze website blijft staan nadat
              de externe inhoud is gewijzigd of verwijderd.
            </p>
          </Block>

          <Block
            id="beschikbaarheid"
            kicker="06 · Beschikbaarheid"
            title="Best effort, geen garantie."
            accent="ink"
          >
            <p>
              Wij streven naar een continu beschikbare dienst, maar geven
              geen garantie op ononderbroken werking, vrij van fouten of
              op een bepaald prestatieniveau. Onderhoud, updates,
              storingen, beveiligingsincidenten of beslissingen van
              leveranciers kunnen tijdelijk leiden tot onbeschikbaarheid
              of dataverlies. Voor de gevolgen daarvan zijn wij niet
              aansprakelijk.
            </p>
          </Block>

          <Block
            id="aansprakelijkheid"
            kicker="07 · Aansprakelijkheid"
            title="Verwijzing naar de algemene voorwaarden."
            accent="terra"
          >
            <p>
              Voor de volledige beperking en uitsluiting van
              aansprakelijkheid &mdash; inclusief het maximumbedrag, de
              verval- en klachttermijnen en de uitgesloten schadesoorten
              &mdash; verwijzen we integraal naar het hoofdstuk{" "}
              <a href="/voorwaarden#aansprakelijkheid">
                Aansprakelijkheid in de algemene voorwaarden
              </a>
              . Die bepalingen maken onlosmakelijk deel uit van deze
              disclaimer.
            </p>
            <p>
              Niets in deze disclaimer beoogt aansprakelijkheid uit te
              sluiten of te beperken die op grond van dwingend
              consumentenrecht of openbare orde niet kan worden
              uitgesloten, zoals aansprakelijkheid voor opzet of bewuste
              roekeloosheid van ons.
            </p>
          </Block>

          <Block
            id="melding"
            kicker="08 · Meldingen"
            title="Wanneer iets onjuist of schadelijk is."
            accent="ink"
            last
          >
            <p>
              Vermoed je een fout, een onrechtmatige uitlating, een
              schending van auteursrecht of een ander serieus probleem?
              Stuur dan een onderbouwde melding naar{" "}
              <a href="mailto:info@politiekprofiel.nl">
                info@politiekprofiel.nl
              </a>{" "}
              met de exacte vindplaats (URL), de aard van de klacht en
              voldoende context om te beoordelen. We reageren binnen een
              redelijke termijn en handelen waar nodig.
            </p>
          </Block>
        </div>
      </div>
    </Container>
  );
}

function Block({
  id,
  kicker,
  title,
  children,
  accent,
  last = false,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  accent: "ink" | "terra";
  last?: boolean;
}) {
  const accentClass = accent === "terra" ? "text-terra" : "text-ink";
  return (
    <section
      id={id}
      className={`mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12 ${
        last ? "pb-16" : ""
      }`}
    >
      <ScrollReveal variant="stagger">
        <ScrollRevealItem>
          <p className="kicker">{kicker}</p>
          <h2 className={`display mt-4 ${accentClass}`}>{title}</h2>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <div className="mt-6 editorial-prose">{children}</div>
        </ScrollRevealItem>
      </ScrollReveal>
    </section>
  );
}
