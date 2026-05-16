import { Container } from "@/components/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Wat we wel en niet opslaan over jou. Hoe we omgaan met politieke voorkeur als bijzondere persoonsgegevens.",
};

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-rule">
        <Container className="py-16">
          <p className="kicker mb-3">Privacy</p>
          <h1 className="serif">Hoe we omgaan met jouw gegevens.</h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Politieke voorkeur valt onder &lsquo;bijzondere persoonsgegevens&rsquo; in de
            AVG. We hebben PolitiekProfiel ontworpen om je hierin maximaal te
            beschermen.
          </p>
        </Container>
      </header>

      <section className="border-b border-rule">
        <Container width="narrow" className="py-16">
          <div className="editorial-prose">
            <h2 className="serif mb-2">Wat we wel opslaan</h2>
            <p>
              Wanneer je een quiz invult en op &lsquo;Bekijk mijn profiel&rsquo; klikt,
              slaan we het volgende anoniem op:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Een willekeurige share-ID van 12 tekens</li>
              <li>De vijf dimensiescores en de berekende ideologie</li>
              <li>Het aantal beantwoorde en overgeslagen vragen</li>
              <li>Het tijdstip van aanmaken</li>
            </ul>
            <p>
              Iedereen met de link kan dit resultaat zien. Wil je niet dat je
              resultaat permanent online staat? Maak dan geen profiel aan, of
              deel de link niet.
            </p>

            <h2 className="serif mt-12 mb-2">Wat we NIET opslaan</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Je naam, e-mail of enig persoonlijk identificerend gegeven</li>
              <li>Je IP-adres of user-agent</li>
              <li>Tracking-cookies of marketing-pixels</li>
              <li>Je individuele antwoorden per vraag</li>
            </ul>

            <h2 className="serif mt-12 mb-2">Tussentijdse opslag in je browser</h2>
            <p>
              Tijdens het invullen bewaren we je voortgang in je browser
              (localStorage). Zo kun je later terugkomen en doorgaan. Deze
              gegevens verlaten je apparaat niet, en je kunt ze wissen via de
              instellingen van je browser of door op &lsquo;Opnieuw beginnen&rsquo; te
              klikken.
            </p>

            <h2 className="serif mt-12 mb-2">Verwijderverzoek</h2>
            <p>
              Wil je dat we jouw opgeslagen resultaat verwijderen? Stuur een
              e-mail naar{" "}
              <a href="mailto:privacy@politiekprofiel.nl">
                privacy@politiekprofiel.nl
              </a>{" "}
              met de share-ID en we verwijderen het binnen 14 dagen.
            </p>

            <h2 className="serif mt-12 mb-2">Cookies</h2>
            <p>
              We gebruiken geen tracking- of advertentiecookies. We laten een
              functionele cookieconsent-banner zien om dit te bevestigen. Je
              kunt deze banner sluiten; je hoeft niets te accepteren of
              weigeren omdat we niets in cookies zetten.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
