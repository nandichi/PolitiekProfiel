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

const PAGE_PATH = "/herroepingsrecht";
const PAGE_PUBLISHED = "2026-05-19";
const PAGE_MODIFIED = "2026-05-19";
const PAGE_DESCRIPTION =
  "Herroepingsrecht, refundregels en betaalvoorwaarden voor de betaalde quizzen van PolitiekProfiel. 14 dagen bedenktijd, met heldere uitzonderingen.";

export const metadata: Metadata = {
  title: "Herroepingsrecht & refunds",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Herroepingsrecht & refunds · PolitiekProfiel",
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["https://naoufalandichi.nl"],
  },
};

const INDEX = [
  { id: "intro", label: "Samenvatting" },
  { id: "totstandkoming", label: "Totstandkoming" },
  { id: "prijzen", label: "Prijzen & BTW" },
  { id: "levering", label: "Levering" },
  { id: "herroeping", label: "Herroepingsrecht" },
  { id: "uitzonderingen", label: "Uitzonderingen" },
  { id: "hoe-herroepen", label: "Hoe te herroepen" },
  { id: "refund", label: "Refund-procedure" },
  { id: "klachten", label: "Klachten" },
  { id: "misbruik", label: "Misbruik" },
];

export default function HerroepingsrechtPage() {
  const articleLd = buildArticleSchema({
    path: PAGE_PATH,
    headline: "Herroepingsrecht, refunds en betaalvoorwaarden",
    description: PAGE_DESCRIPTION,
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_MODIFIED,
    articleSection: "Juridisch",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Herroepingsrecht", item: PAGE_PATH },
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
                <Kicker>Betalen</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1
                  className="display mt-6"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  Herroepingsrecht
                  <span className="block">
                    <em className="display-italic font-light text-navy">
                      & refunds.
                    </em>
                  </span>
                </h1>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-8 text-lg md:text-xl text-ink-2 leading-relaxed">
                  Betaal je voor een quiz, dan heb je standaard{" "}
                  <strong>14 dagen bedenktijd</strong> &mdash; zonder opgaaf
                  van reden. Op deze pagina staat exact hoe het werkt, wat de
                  uitzonderingen zijn en hoe je geld terugkrijgt.
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
            id="totstandkoming"
            kicker="01 · Totstandkoming"
            title="Wanneer de overeenkomst tot stand komt."
            accent="ink"
          >
            <p>
              De koop van een betaalde quiz komt tot stand op het moment dat
              Stripe ons bevestigt dat de betaling is gelukt. Vanaf dat
              moment ontvang je toegang tot de digitale inhoud (in de regel
              direct, via een toegangstoken in je browser). Wij ontvangen
              geen kaartgegevens; daarvoor verwijzen we naar het
              privacybeleid van Stripe en onze eigen{" "}
              <a href="/privacy">privacyverklaring</a>.
            </p>
            <p>
              Voor de betaalde quizzen verwijst de bestelpagina naar deze
              voorwaarden. Door op de betaalknop te klikken bevestig je dat
              je deze pagina hebt gelezen en ermee instemt.
            </p>
          </Block>

          <Block
            id="prijzen"
            kicker="02 · Prijzen & BTW"
            title="Wat je betaalt en hoe."
            accent="ink"
          >
            <p>
              Alle prijzen op de website worden weergegeven in euro&apos;s en
              zijn inclusief BTW voor zover die wettelijk verschuldigd is.
              Eventuele transactiekosten van betaalmethodes worden
              afzonderlijk getoond voordat je betaalt. Aanbiedingen,
              kortingen en kortingscodes gelden alleen binnen de daarbij
              vermelde voorwaarden en termijn.
            </p>
            <p>
              Wij behouden ons het recht voor om kennelijke prijsfouten te
              corrigeren. Als een prijs evident onjuist is (bijvoorbeeld
              door een typefout of technische storing) zijn wij niet
              gehouden tot levering tegen die foutieve prijs en bieden we
              je de keuze tussen levering tegen de juiste prijs of
              kosteloze ontbinding.
            </p>
          </Block>

          <Block
            id="levering"
            kicker="03 · Levering"
            title="Hoe je toegang krijgt."
            accent="ink"
          >
            <p>
              Een betaalde quiz wordt digitaal geleverd: direct na de
              geslaagde betaling krijg je in je browser toegang tot de
              uitgebreide variant van de quiz en het bijbehorende
              profiel. Er is geen fysieke levering, geen account-aanmaak
              en geen verzending per e-mail vereist om toegang te
              krijgen.
            </p>
            <p>
              Het toegangstoken leeft in je browser. Wis je je
              browsergegevens of wissel je van apparaat zonder de link te
              bewaren, dan kan toegang verloren gaan. Bewaar daarom de
              betalingsbevestiging die Stripe je toestuurt; daarmee
              kunnen we toegang opnieuw activeren.
            </p>
          </Block>

          <Block
            id="herroeping"
            kicker="04 · Herroepingsrecht"
            title="14 dagen bedenktijd."
            accent="ink"
          >
            <p>
              Als consument heb je het recht om binnen{" "}
              <strong>veertien (14) dagen</strong> na de aankoop de
              overeenkomst zonder opgave van redenen te ontbinden. De
              termijn gaat in op de dag waarop de overeenkomst tot stand
              komt (zie hierboven). Tijdens deze periode kun je je beroep
              op het herroepingsrecht uitoefenen via de procedure verderop.
            </p>
            <p>
              Voor zakelijke kopers (handelend in de uitoefening van beroep
              of bedrijf) geldt geen wettelijk herroepingsrecht. Wij
              hanteren in dat geval geen vrijwillige bedenktijd, tenzij we
              dat uitdrukkelijk en schriftelijk hebben bevestigd.
            </p>
          </Block>

          <Block
            id="uitzonderingen"
            kicker="05 · Uitzonderingen"
            title="Wanneer de bedenktijd vervalt."
            accent="terra"
          >
            <p>
              Het herroepingsrecht geldt <strong>niet</strong> wanneer je
              uitdrukkelijk hebt gevraagd om directe levering van de
              digitale inhoud en daarbij hebt verklaard dat je afziet van
              het herroepingsrecht zodra de inhoud is geleverd. Concreet:
            </p>
            <ul>
              <li>
                wanneer je op de bestelpagina expliciet aanvinkt dat je
                direct toegang wilt en afstand doet van je herroepingsrecht,
                en de inhoud volledig is geleverd, vervalt het
                herroepingsrecht in zoverre;
              </li>
              <li>
                wanneer je de quiz inhoudelijk hebt afgerond (alle vragen
                ingevuld en het resultaat opgehaald) binnen de bedenktijd,
                geldt de digitale dienst als volledig geleverd en kunnen
                wij een verzoek tot herroeping op basis van
                consumentenrecht weigeren;
              </li>
              <li>
                op maat gemaakte rapporten of inhoud die op jouw
                specificatie is samengesteld, vallen niet onder het
                herroepingsrecht.
              </li>
            </ul>
            <p>
              Buiten deze gevallen blijft de 14-dagen bedenktijd staan.
              Twijfel je of jouw situatie onder een uitzondering valt? Mail
              ons dan eerst voordat je tot aankoop overgaat.
            </p>
          </Block>

          <Block
            id="hoe-herroepen"
            kicker="06 · Hoe te herroepen"
            title="De ontbinding inroepen."
            accent="ink"
          >
            <p>
              Om de overeenkomst te herroepen stuur je binnen de
              bedenktijd een ondubbelzinnige verklaring naar{" "}
              <a href="mailto:info@politiekprofiel.nl">
                info@politiekprofiel.nl
              </a>
              . Vermeld in elk geval:
            </p>
            <ul>
              <li>jouw naam en e-mailadres dat is gebruikt bij de betaling;</li>
              <li>de datum van aankoop en het bedrag;</li>
              <li>
                een referentie van de transactie (Stripe-betalingsreferentie of
                ontvangstbewijs);
              </li>
              <li>
                een korte verklaring dat je gebruik wilt maken van je
                herroepingsrecht.
              </li>
            </ul>
            <p>
              Een opgaaf van reden is niet vereist. Je kunt ook gebruikmaken
              van het modelformulier voor herroeping uit Bijlage I van
              Richtlijn 2011/83/EU; ook dat sturen we op verzoek per mail
              toe.
            </p>
          </Block>

          <Block
            id="refund"
            kicker="07 · Refund-procedure"
            title="Hoe je je geld terugkrijgt."
            accent="ink"
          >
            <p>
              Na ontvangst van een geldig herroepingsverzoek bevestigen
              wij dit per e-mail. Vervolgens betalen wij het volledige
              aankoopbedrag binnen veertien (14) dagen terug, via
              hetzelfde betaalmiddel waarmee je hebt betaald, tenzij we
              een ander middel met je afspreken. Voor de terugbetaling
              brengen wij geen kosten in rekening.
            </p>
            <p>
              Wij behouden ons het recht voor om eventueel reeds gebruikte
              of geleverde delen van de dienst niet terug te betalen
              wanneer je de uitzondering op het herroepingsrecht hebt
              geaccepteerd (zie hierboven). De volledige
              betaalreferentie blijft bij Stripe vindbaar.
            </p>
          </Block>

          <Block
            id="klachten"
            kicker="08 · Klachten"
            title="Niet tevreden? Eerst praten."
            accent="ink"
          >
            <p>
              Klachten over de uitvoering van de overeenkomst moeten
              binnen een redelijke termijn na ontdekking duidelijk
              omschreven worden ingediend bij{" "}
              <a href="mailto:info@politiekprofiel.nl">
                info@politiekprofiel.nl
              </a>
              . We streven naar een reactie binnen veertien dagen. Komen we
              er samen niet uit, dan kun je het geschil voorleggen via het{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                ODR-platform van de Europese Commissie
              </a>{" "}
              of aan de bevoegde Nederlandse rechter. Wij zijn niet
              aangesloten bij een aparte geschillencommissie.
            </p>
          </Block>

          <Block
            id="misbruik"
            kicker="09 · Misbruik"
            title="Wanneer een refund wordt geweigerd."
            accent="terra"
            last
          >
            <p>
              Wij behouden ons het recht voor om een refund- of
              herroepingsverzoek te weigeren of te vertragen wanneer er
              gegronde aanwijzingen zijn van misbruik, waaronder:
            </p>
            <ul>
              <li>
                herhaaldelijk aankopen plaatsen, gebruiken en herroepen op
                een wijze die het doel van het herroepingsrecht
                ondermijnt;
              </li>
              <li>
                betaling met een betaalmiddel dat aantoonbaar niet aan jou
                toebehoort of waarvoor onvoldoende identificatie is;
              </li>
              <li>
                het ontwijken van een eerdere blokkering van een
                gebruikersaccount of betaalmuur;
              </li>
              <li>
                het delen, doorverkopen of geautomatiseerd uitvragen van
                betaalde resultaten in strijd met de{" "}
                <a href="/voorwaarden">algemene voorwaarden</a>.
              </li>
            </ul>
            <p>
              In alle andere gevallen verlenen we het herroepingsrecht
              ruimhartig &mdash; we vinden het belangrijker dat je een
              eerlijke ervaring hebt dan dat we discussies winnen.
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
