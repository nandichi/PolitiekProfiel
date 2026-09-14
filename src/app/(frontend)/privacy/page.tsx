import { Container } from "@/components/Container";
import Link from "next/link";
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

const PAGE_PATH = "/privacy";
const PAGE_PUBLISHED = "2026-01-15";
const PAGE_MODIFIED = "2026-09-14";
const PAGE_DESCRIPTION =
  "Welke gegevens PolitiekProfiel verwerkt voor een quiz, betaling, resultaatlink en contactverzoek. Politieke antwoorden worden niet gebruikt voor advertentietracking.";

export const metadata: Metadata = {
  title: "Privacy",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "Privacy · PolitiekProfiel",
    description:
      "Een resultaat gebruikt een deelbare link. We gebruiken geen advertentiecookies of gedragsanalyse van quizantwoorden.",
    url: PAGE_PATH,
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["https://naoufalandichi.nl"],
  },
};

const INDEX = [
  { id: "intro", label: "Inleiding" },
  { id: "resultaat", label: "Quizresultaat" },
  { id: "contact", label: "Contact en e-mail" },
  { id: "betaling", label: "Betaling" },
  { id: "browser", label: "Je browser" },
  { id: "delen", label: "Delen en verwijderen" },
  { id: "cookies", label: "Cookies en analytics" },
];

export default function PrivacyPage() {
  const articleLd = buildArticleSchema({
    path: PAGE_PATH,
    headline: "Privacyverklaring: hoe we omgaan met jouw gegevens",
    description: PAGE_DESCRIPTION,
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_MODIFIED,
    articleSection: "Privacy",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Privacy", item: PAGE_PATH },
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
                <Kicker>Privacy</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1 className="display mt-6" style={{ letterSpacing: "-0.025em" }}>
                  Hoe we omgaan met
                  <span className="block">
                    <em className="display-italic font-light text-navy">
                      jouw gegevens.
                    </em>
                  </span>
                </h1>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-8 text-lg md:text-xl text-ink-2 leading-relaxed">
                  Politieke opvattingen verdienen extra zorg. PolitiekProfiel
                  vraagt geen account voor een quiz, gebruikt geen
                  advertentiecookies en verzamelt sinds 14 september 2026 geen
                  nieuw quizgedrag voor analyse.
                  Wel is een resultaat via een deelbare link beschikbaar. Lees
                  daarom hieronder precies wat er gebeurt.
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <Block id="resultaat" kicker="01 · Quizresultaat" title="Wat bij een profiel wordt bewaard." accent="ink">
            <p>
              Als je op <strong>Bekijk mijn profiel</strong> klikt, maken we
              een willekeurige share-ID van 12 tekens. Onder die ID bewaren we
              de antwoordwaarden, dimensiescores, gekozen ideologie, aantallen
              beantwoorde en overgeslagen vragen en het aanmaaktijdstip. De
              antwoordwaarden zijn nodig om op je resultaatpagina te laten zien
              welke stellingen jouw profiel onderbouwen.
            </p>
            <p>
              We vragen voor een quiz geen naam of e-mailadres. Dat maakt een
              resultaat niet automatisch ongevoelig: politieke antwoorden kunnen
              iets over iemand zeggen. Daarom gebruiken we ze niet voor reclame,
              profilering of gedragsanalyse.
            </p>
          </Block>

          <Block id="contact" kicker="02 · Contact en e-mail" title="Wat er gebeurt als je zelf contact opneemt." accent="terra">
            <p>
              Het contactformulier verwerkt je naam, e-mailadres en bericht om
              te kunnen reageren. Als je vrijwillig een resultaatlink per e-mail
              laat sturen, verwerken we daarvoor je e-mailadres en de
              resultaatlink. Deze berichten lopen via onze e-maildienst en komen
              binnen in de werkmailbox van PolitiekProfiel.
            </p>
            <p>
              Om misbruik van de formulieren te beperken, houdt de server een
              IP-adres tijdelijk in het geheugen bij voor een limiet op verzoeken.
              Dat is geen onderdeel van je quizprofiel en wordt niet in de
              applicatiedatabase opgeslagen.
            </p>
            <p>
              Deel in een contactbericht alleen wat nodig is. Stuur geen
              politieke antwoorden mee als een share-ID of link voldoende is.
            </p>
          </Block>

          <Block id="betaling" kicker="03 · Betaling" title="Betaling staat los van je politieke profiel." accent="ink">
            <p>
              Betalingen verlopen via Stripe Checkout. Stripe verwerkt de
              betaalgegevens, de betalingsreferentie en, afhankelijk van de
              betaalmethode, contactgegevens voor de betaling en bon. Voor
              toegang gebruiken we een apart toegangstoken. Dat token bevat geen
              politieke score of antwoordwaarden.
            </p>
            <p>
              Onze hosting en gegevensopslag gebruiken Vercel en Firebase. Voor
              contact- en resultaatmails gebruiken we een e-maildienst. Deze
              technische dienstverleners ontvangen gegevens voor de onderdelen
              die zij uitvoeren. Lees voor hun eigen verwerking ook hun
              privacyinformatie.
            </p>
          </Block>

          <Block id="browser" kicker="04 · Je browser" title="Voortgang blijft op je eigen apparaat." accent="ink">
            <p>
              Tijdens het invullen bewaart je browser voortgang in localStorage:
              de getoonde vragen, je antwoorden en je plek in de quiz. Dat is
              nodig om na een refresh verder te kunnen. Je kunt deze gegevens
              verwijderen via je browserinstellingen of door opnieuw te beginnen.
            </p>
            <p>
              Sinds 14 september 2026 maken we geen vaste tracking-ID aan. We registreren niet welke
              vraag je opent, hoeveel tijd je per vraag gebruikt of welke
              antwoorden je als gedragsdata invoert.
            </p>
            <p>
              Voor die datum werden bij sommige quizsessies technische
              eventgegevens opgeslagen, waaronder een willekeurige pogingcode
              en antwoordwaarden. Deze historische gegevens zijn niet publiek
              toegankelijk. Nieuwe sessies voegen zulke gegevens niet meer toe.
            </p>
          </Block>

          <Block id="delen" kicker="05 · Delen en verwijderen" title="Een resultaatlink is een sleutel." accent="ink">
            <p>
              Iedereen die je share-link heeft, kan het resultaat zien. Stuur de
              link daarom alleen naar mensen met wie je dit wilt delen. Deel je hem
              op sociale media of in een externe embed, dan kunnen dat platform en
              anderen de inhoud kopiëren of bewaren. We tonen geen openbare
              resultatenlijst en blokkeren rechtstreekse databasetoegang voor bezoekers.
            </p>
            <p>
              Wil je een resultaat laten verwijderen? Stuur via het{" "}
              <Link href="/contact" className="underline">contactformulier</Link>{" "}
              de share-ID of de volledige link. We bevestigen de ontvangst en
              behandelen het verzoek zo snel mogelijk. Resultaten verlopen nu
              niet automatisch; vraag verwijdering als je de link niet wilt
              behouden.
            </p>
          </Block>

          <Block id="cookies" kicker="06 · Cookies en analytics" title="Geen advertentiecookies." accent="ink" last>
            <p>
              PolitiekProfiel gebruikt geen advertentie- of trackingcookies en
              geen externe webanalyse. Er is geen
              cookiebanner, omdat we geen toestemming vragen voor zulke cookies.
              LocalStorage voor quizvoortgang is geen cookie en kun je zelf
              wissen.
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
