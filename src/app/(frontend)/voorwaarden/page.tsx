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

const PAGE_PATH = "/voorwaarden";
const PAGE_PUBLISHED = "2026-05-19";
const PAGE_MODIFIED = "2026-05-19";
const PAGE_DESCRIPTION =
  "Algemene voorwaarden voor het gebruik van PolitiekProfiel: spelregels, intellectueel eigendom, gedragsregels en de uitsluiting van aansprakelijkheid.";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Algemene voorwaarden · PolitiekProfiel",
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["https://naoufalandichi.nl"],
  },
};

const INDEX = [
  { id: "intro", label: "Inleiding" },
  { id: "definities", label: "Definities" },
  { id: "toepasselijkheid", label: "Toepasselijkheid" },
  { id: "gebruik", label: "Gebruik & gedrag" },
  { id: "content", label: "Aard van de inhoud" },
  { id: "ip", label: "Intellectueel eigendom" },
  { id: "ugc", label: "Door jou geplaatste content" },
  { id: "betaald", label: "Betaalde diensten" },
  { id: "aansprakelijkheid", label: "Aansprakelijkheid" },
  { id: "vrijwaring", label: "Vrijwaring" },
  { id: "overmacht", label: "Overmacht" },
  { id: "wijzigingen", label: "Wijzigingen" },
  { id: "beeindiging", label: "Beëindiging" },
  { id: "recht", label: "Recht & geschillen" },
  { id: "contact", label: "Contact" },
];

export default function VoorwaardenPage() {
  const articleLd = buildArticleSchema({
    path: PAGE_PATH,
    headline: "Algemene voorwaarden van PolitiekProfiel",
    description: PAGE_DESCRIPTION,
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_MODIFIED,
    articleSection: "Juridisch",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Algemene voorwaarden", item: PAGE_PATH },
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
                <Kicker>Juridisch</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1
                  className="display mt-6"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  Algemene
                  <span className="block">
                    <em className="display-italic font-light text-navy">
                      voorwaarden.
                    </em>
                  </span>
                </h1>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-8 text-lg md:text-xl text-ink-2 leading-relaxed">
                  Deze voorwaarden regelen het gebruik van PolitiekProfiel. Door
                  de site te bezoeken of een quiz te gebruiken aanvaard je
                  ze. Lees ze rustig door: ze beschermen jou én ons.
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
            id="definities"
            kicker="01 · Definities"
            title="Wat we bedoelen met deze woorden."
            accent="ink"
          >
            <ul>
              <li>
                <strong>Aanbieder / wij / ons:</strong> Naoufal Andichi, de
                natuurlijke persoon die PolitiekProfiel exploiteert, bereikbaar
                via{" "}
                <a href="mailto:info@politiekprofiel.nl">
                  info@politiekprofiel.nl
                </a>
                .
              </li>
              <li>
                <strong>Website / dienst:</strong> de website PolitiekProfiel,
                bereikbaar via politiekprofiel.nl, inclusief alle pagina&apos;s,
                quizzen, tools en API&apos;s die daar onder worden aangeboden.
              </li>
              <li>
                <strong>Gebruiker / jij:</strong> iedereen die de website
                bezoekt, een quiz invult of op andere wijze gebruik maakt van
                de dienst, ongeacht of dit een betaalde of gratis variant
                betreft.
              </li>
              <li>
                <strong>Quiz:</strong> elk vragenformulier op de website dat
                tot doel heeft een politiek profiel of een gerelateerde
                indicatie te genereren.
              </li>
              <li>
                <strong>Resultaat / profiel:</strong> de uitslag, scores,
                ideologische duiding, partij-vergelijking en alle andere
                afgeleide informatie die wordt getoond op basis van jouw
                antwoorden.
              </li>
              <li>
                <strong>Inhoud:</strong> alle teksten, afbeeldingen, data,
                grafieken, video en code op de website.
              </li>
            </ul>
          </Block>

          <Block
            id="toepasselijkheid"
            kicker="02 · Toepasselijkheid"
            title="Wanneer deze voorwaarden gelden."
            accent="ink"
          >
            <p>
              Deze voorwaarden zijn van toepassing op elk gebruik van de
              website, op elke overeenkomst tussen jou en ons, en op alle
              voorafgaande en nakomende handelingen die daarmee verband
              houden. Door de website te bezoeken of een quiz te starten
              verklaar je deze voorwaarden te hebben gelezen, begrepen en
              aanvaard.
            </p>
            <p>
              Eventuele algemene voorwaarden van jou of van derden worden
              uitdrukkelijk van de hand gewezen. Afwijkingen op deze
              voorwaarden gelden alleen wanneer wij die schriftelijk hebben
              bevestigd.
            </p>
            <p>
              Indien een bepaling van deze voorwaarden nietig of vernietigbaar
              blijkt, blijven de overige bepalingen onverkort van kracht. De
              nietige of vernietigde bepaling wordt vervangen door een
              bepaling die qua strekking zoveel mogelijk overeenkomt met de
              oorspronkelijke.
            </p>
          </Block>

          <Block
            id="gebruik"
            kicker="03 · Gebruik & gedrag"
            title="Wat je wel en niet mag doen."
            accent="ink"
          >
            <p>
              Je gebruikt de dienst op een wijze die niet onrechtmatig is en
              die de werking, beschikbaarheid of integriteit van de website
              niet aantast. In het bijzonder is het niet toegestaan om:
            </p>
            <ul>
              <li>
                geautomatiseerde scripts, scrapers of bots in te zetten,
                anders dan publiek toegestane crawlers binnen redelijke
                grenzen;
              </li>
              <li>
                de dienst te belasten met een onevenredig groot aantal
                verzoeken, of te proberen toegang te krijgen tot delen waarvoor
                je geen rechten hebt;
              </li>
              <li>
                beveiligingsmaatregelen, rate limits of betaalmuren te
                omzeilen, of pogingen daartoe te ondernemen;
              </li>
              <li>
                quiz-resultaten of share-links structureel te verzamelen,
                op te slaan, te koppelen aan personen of door te verkopen;
              </li>
              <li>
                de inhoud te gebruiken voor het trainen van AI- of
                taalmodellen zonder onze voorafgaande schriftelijke
                toestemming;
              </li>
              <li>
                misleidende, beledigende, racistische, discriminerende,
                bedreigende of anderszins onrechtmatige uitingen aan de
                dienst toe te voegen of via de dienst te verspreiden.
              </li>
            </ul>
            <p>
              Wij behouden ons het recht voor om toegang te blokkeren,
              gegevens te verwijderen of juridische stappen te nemen bij
              overtreding van deze regels, zonder dat dit een recht op
              schadevergoeding doet ontstaan.
            </p>
          </Block>

          <Block
            id="content"
            kicker="04 · Aard van de inhoud"
            title="Wat PolitiekProfiel wél en niet is."
            accent="terra"
          >
            <p>
              PolitiekProfiel biedt een <strong>educatief instrument</strong>{" "}
              voor zelfreflectie over politieke voorkeuren. De dienst is
              uitdrukkelijk <strong>geen</strong> stemadvies, geen
              psychologisch advies, geen juridisch advies en geen
              wetenschappelijke meting van persoonlijkheid of ideologie.
            </p>
            <p>
              Politieke duidingen, ideologische clusters, vergelijkingen met
              partijen, politici en historische bewegingen zijn{" "}
              <strong>interpretaties</strong> op basis van publieke bronnen,
              partijprogramma&apos;s en redactionele keuzes. Ze
              vertegenwoordigen niet het standpunt van die partijen of
              personen zelf, en zijn niet bedoeld als feitelijke,
              wetenschappelijke of onbetwistbare uitspraak.
            </p>
            <p>
              De inhoud kan op enig moment onvolledig, gedateerd of onjuist
              zijn. Wij doen redelijke inspanningen om accuraat te zijn, maar
              geven geen enkele garantie over juistheid, volledigheid,
              actualiteit of geschiktheid voor een specifiek doel. Voor de
              volledige aansprakelijkheidsuitsluiting verwijzen we naar onze{" "}
              <a href="/disclaimer">disclaimer</a>.
            </p>
          </Block>

          <Block
            id="ip"
            kicker="05 · Intellectueel eigendom"
            title="Wie eigenaar is van wat je ziet."
            accent="ink"
          >
            <p>
              Alle intellectuele eigendomsrechten op de website en de daarop
              aangeboden inhoud, waaronder ontwerp, code, teksten,
              quizvragen, dimensies, scoringsmethodiek, ideologie-clusters,
              datavisualisaties, illustraties, fotografie en het merk
              PolitiekProfiel, berusten uitsluitend bij ons of bij onze
              licentiegevers.
            </p>
            <p>
              Je mag de inhoud bekijken, delen via de daarvoor bedoelde
              share-functies en in beperkte mate citeren mits bronvermelding
              en een link terug naar de oorspronkelijke pagina. Iedere
              andere vorm van reproductie, hergebruik, framing, scraping,
              datamining, herpublicatie of commerciële exploitatie is
              uitdrukkelijk verboden zonder onze voorafgaande schriftelijke
              toestemming.
            </p>
            <p>
              Wij gebruiken bronnen, citaten en logo&apos;s van derden onder
              de relevante uitzonderingen in het auteursrecht (waaronder
              citaat- en nieuwsuitzondering). Wie meent dat zijn rechten
              worden geschonden kan dat melden via{" "}
              <a href="mailto:info@politiekprofiel.nl">
                info@politiekprofiel.nl
              </a>
              ; wij beoordelen meldingen serieus en handelen waar nodig
              binnen redelijke termijn.
            </p>
          </Block>

          <Block
            id="ugc"
            kicker="06 · Door jou geplaatste content"
            title="Wat er gebeurt met antwoorden en share-links."
            accent="ink"
          >
            <p>
              Door op &lsquo;Bekijk mijn profiel&rsquo; te klikken, een share-link
              te genereren of een formulier te versturen, geef je ons een
              wereldwijde, niet-exclusieve, royalty-vrije, sublicentieerbare
              en overdraagbare licentie om de geanonimiseerde gegevens te
              gebruiken voor: het tonen van jouw resultaatpagina, het
              berekenen van cohort-aggregaten, het verbeteren van de dienst
              en wetenschappelijk of journalistiek onderzoek in geaggregeerde
              vorm.
            </p>
            <p>
              Deze licentie strekt zich niet uit tot direct identificerende
              gegevens; die slaan we ook niet op. Voor de exacte werking
              verwijzen we naar onze{" "}
              <a href="/privacy">privacyverklaring</a>.
            </p>
            <p>
              Je staat ervoor in dat alles wat je via vrije invoervelden of
              andere kanalen aan ons verstrekt geen inbreuk maakt op rechten
              van derden en niet in strijd is met wet- en regelgeving. Wij
              kunnen dergelijke bijdragen op elk moment verwijderen.
            </p>
          </Block>

          <Block
            id="betaald"
            kicker="07 · Betaalde diensten"
            title="Voorwaarden voor betaalde quizzen."
            accent="ink"
          >
            <p>
              Sommige varianten van de quiz (zoals de uitgebreide quiz) zijn
              alleen toegankelijk na betaling. Betalingen verlopen via
              Stripe; wij ontvangen geen kaartgegevens. De koop komt tot
              stand op het moment dat de betaling door Stripe is bevestigd.
            </p>
            <p>
              Prijzen worden getoond inclusief eventuele BTW, voor zover
              wettelijk vereist. De levering bestaat uit directe toegang tot
              digitale inhoud. Voor herroepingsrecht, refunds en specifieke
              betaalvoorwaarden geldt de aparte pagina{" "}
              <a href="/herroepingsrecht">Herroepingsrecht & refunds</a>, die
              integraal onderdeel uitmaakt van deze voorwaarden.
            </p>
            <p>
              Toegangstokens en eventuele kortingscodes zijn persoonlijk en
              niet overdraagbaar. Misbruik (zoals het delen, doorverkopen of
              massaal genereren van codes) kan leiden tot directe blokkering
              zonder restitutie.
            </p>
          </Block>

          <Block
            id="aansprakelijkheid"
            kicker="08 · Aansprakelijkheid"
            title="Waarvoor wij niet aansprakelijk zijn."
            accent="terra"
          >
            <p>
              <strong>De dienst wordt aangeboden &lsquo;as is&rsquo; en &lsquo;as
              available&rsquo;.</strong> Voor zover wettelijk toegestaan
              sluiten wij elke aansprakelijkheid uit voor schade die op
              welke wijze dan ook voortvloeit uit of verband houdt met:
            </p>
            <ul>
              <li>
                de juistheid, volledigheid, actualiteit of betrouwbaarheid
                van de getoonde inhoud, waaronder profielen, ideologische
                duiding, partij-vergelijkingen en historische context;
              </li>
              <li>
                beslissingen die je neemt op basis van de inhoud van de
                website, zoals stemkeuzes, lidmaatschap, deelname aan
                campagnes of publieke uitlatingen;
              </li>
              <li>
                de manier waarop derden jouw resultaat of share-link
                interpreteren, publiceren, citeren of tegen jou gebruiken;
              </li>
              <li>
                onvrede met de uitslag, ideologische clustering of
                vergelijking, of het gevoel dat het profiel jou niet
                vertegenwoordigt;
              </li>
              <li>
                tijdelijke of permanente onbeschikbaarheid van de dienst,
                bugs, dataverlies, verlies van share-IDs of het wegvallen
                van betaal- of e-mailproviders;
              </li>
              <li>
                inhoud, links, gedragingen of producten van derden waarnaar
                wordt verwezen of die via de dienst bereikbaar zijn;
              </li>
              <li>
                indirecte schade, gevolgschade, gederfde winst, gemiste
                besparingen, reputatieschade en immateriële schade van
                welke aard dan ook.
              </li>
            </ul>
            <p>
              Indien en voor zover op ons ondanks het voorgaande toch enige
              aansprakelijkheid komt te rusten, is die in alle gevallen
              beperkt tot het bedrag dat je in de twaalf maanden vóór de
              schadeveroorzakende gebeurtenis daadwerkelijk aan ons hebt
              betaald, met een absoluut maximum van honderd euro (€&nbsp;100)
              per gebeurtenis of reeks van samenhangende gebeurtenissen.
              Aansprakelijkheid voor schade ontstaan door opzet of bewuste
              roekeloosheid van ons wordt niet uitgesloten.
            </p>
            <p>
              Elke aanspraak op vergoeding van schade vervalt twaalf maanden
              na het moment waarop je daarmee redelijkerwijs bekend kon zijn,
              tenzij dwingend recht een langere termijn voorschrijft.
            </p>
          </Block>

          <Block
            id="vrijwaring"
            kicker="09 · Vrijwaring"
            title="Wanneer jij ons vrijwaart."
            accent="ink"
          >
            <p>
              Je vrijwaart ons voor alle aanspraken van derden die verband
              houden met of voortvloeien uit jouw gebruik van de dienst, het
              door jou delen, publiceren of bespreken van een
              quiz-resultaat, het schenden van deze voorwaarden of het
              schenden van rechten van derden. Deze vrijwaring omvat
              redelijke kosten van juridische bijstand en eventuele
              proceskosten.
            </p>
          </Block>

          <Block
            id="overmacht"
            kicker="10 · Overmacht"
            title="Als iets buiten onze macht ligt."
            accent="ink"
          >
            <p>
              Wij zijn niet aansprakelijk voor tekortkomingen in de nakoming
              die het gevolg zijn van overmacht. Daaronder verstaan we onder
              meer: storingen of uitval van hostingdiensten, betaalproviders,
              e-mailproviders, internetverbindingen, certificaatautoriteiten
              of CDN&apos;s; cyberaanvallen, ransomware en sabotage;
              wetswijzigingen of overheidsbevelen; pandemieën, oorlog,
              terreur en stakingen. Tijdens overmacht worden onze
              verplichtingen opgeschort.
            </p>
          </Block>

          <Block
            id="wijzigingen"
            kicker="11 · Wijzigingen"
            title="Hoe we deze voorwaarden updaten."
            accent="ink"
          >
            <p>
              Wij kunnen deze voorwaarden van tijd tot tijd wijzigen,
              bijvoorbeeld om wetswijzigingen of nieuwe functionaliteit te
              verwerken. De actuele versie staat altijd op deze pagina,
              voorzien van een versienummer en datum. Wanneer een wijziging
              wezenlijk in jouw nadeel werkt, doen we redelijke inspanningen
              om dat zichtbaar te communiceren. Door de dienst na een
              wijziging te blijven gebruiken aanvaard je de bijgewerkte
              voorwaarden.
            </p>
          </Block>

          <Block
            id="beeindiging"
            kicker="12 · Beëindiging"
            title="Wanneer toegang wordt beëindigd."
            accent="ink"
          >
            <p>
              Wij kunnen op elk moment, zonder voorafgaande aankondiging en
              zonder gehouden te zijn tot schadevergoeding, jouw toegang
              tot (delen van) de dienst beëindigen of opschorten wanneer er
              een redelijk vermoeden bestaat van schending van deze
              voorwaarden, misbruik van de dienst, of wanneer wettelijke of
              technische redenen dat noodzakelijk maken. De bepalingen die
              naar hun aard bedoeld zijn om na beëindiging te blijven
              gelden, blijven gelden.
            </p>
          </Block>

          <Block
            id="recht"
            kicker="13 · Recht & geschillen"
            title="Welk recht geldt en waar je naartoe kunt."
            accent="ink"
          >
            <p>
              Op deze voorwaarden en op alle overeenkomsten en geschillen
              die daaruit voortvloeien is uitsluitend{" "}
              <strong>Nederlands recht</strong> van toepassing, met
              uitsluiting van het Weens Koopverdrag.
            </p>
            <p>
              Geschillen worden bij uitsluiting voorgelegd aan de bevoegde
              Nederlandse rechter in het arrondissement van onze woonplaats,
              tenzij dwingend recht een andere rechter aanwijst. Voor
              consumenten geldt aanvullend dat zij binnen één maand na ons
              beroep op deze forumkeuze kunnen kiezen voor de wettelijk
              bevoegde rechter.
            </p>
            <p>
              Consumenten kunnen geschillen ook melden via het{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
              >
                ODR-platform van de Europese Commissie
              </a>
              . Wij zijn niet verplicht en niet voornemens deel te nemen
              aan een geschillencommissie, tenzij wettelijk vereist.
            </p>
          </Block>

          <Block
            id="contact"
            kicker="14 · Contact"
            title="Hoe je ons bereikt."
            accent="ink"
            last
          >
            <p>
              Vragen over deze voorwaarden, een melding van onrechtmatige
              inhoud of een verzoek tot inzage of verwijdering kun je
              sturen naar{" "}
              <a href="mailto:info@politiekprofiel.nl">
                info@politiekprofiel.nl
              </a>
              . We reageren binnen een redelijke termijn, in de regel binnen
              veertien dagen.
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
