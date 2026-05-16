import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { StickyIndex } from "@/components/StickyIndex";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Wat we wel en niet opslaan over jou. Hoe we omgaan met politieke voorkeur als bijzondere persoonsgegevens.",
};

const INDEX = [
  { id: "intro", label: "Inleiding" },
  { id: "wel", label: "Wat we wel opslaan" },
  { id: "niet", label: "Wat we niet opslaan" },
  { id: "lokaal", label: "Lokale opslag" },
  { id: "verwijderen", label: "Verwijderen" },
  { id: "cookies", label: "Cookies" },
];

export default function PrivacyPage() {
  return (
    <Container width="bleed" className="pt-12 md:pt-20">
      <div className="grid gap-10 lg:gap-16 lg:grid-cols-[220px_1fr]">
        <StickyIndex items={INDEX} topOffset={96} />

        <div className="min-w-0 max-w-3xl">
          <section id="intro" className="scroll-mt-32">
            <ScrollReveal variant="stagger" immediate>
              <ScrollRevealItem>
                <Kicker>Privacy</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1
                  className="display mt-6"
                  style={{ letterSpacing: "-0.025em" }}
                >
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
                  Politieke voorkeur valt onder &lsquo;bijzondere
                  persoonsgegevens&rsquo; in de AVG. We hebben PolitiekProfiel
                  ontworpen om je hierin maximaal te beschermen.
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          {/* Wat we wel opslaan */}
          <Block
            id="wel"
            kicker="01 · Wat we opslaan"
            title="Wat we wel opslaan."
            accent="ink"
          >
            <p>
              Wanneer je een quiz invult en op &lsquo;Bekijk mijn
              profiel&rsquo; klikt, slaan we het volgende{" "}
              <strong>anoniem</strong> op:
            </p>
            <ul>
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
          </Block>

          {/* Wat we niet opslaan */}
          <Block
            id="niet"
            kicker="02 · Wat we niet opslaan"
            title="Wat we NIET opslaan."
            accent="terra"
          >
            <ul>
              <li>
                Je naam, e-mail of enig persoonlijk identificerend gegeven
              </li>
              <li>Je IP-adres of user-agent</li>
              <li>Tracking-cookies of marketing-pixels</li>
              <li>Je individuele antwoorden per vraag</li>
            </ul>
          </Block>

          {/* Lokale opslag */}
          <Block
            id="lokaal"
            kicker="03 · Lokale opslag"
            title="Tussentijdse opslag in je browser."
            accent="ink"
          >
            <p>
              Tijdens het invullen bewaren we je voortgang in je browser
              (localStorage). Zo kun je later terugkomen en doorgaan. Deze
              gegevens verlaten je apparaat niet, en je kunt ze wissen via de
              instellingen van je browser of door op &lsquo;Opnieuw
              beginnen&rsquo; te klikken.
            </p>
          </Block>

          {/* Verwijderen */}
          <Block
            id="verwijderen"
            kicker="04 · Recht op verwijdering"
            title="Een verwijderverzoek indienen."
            accent="ink"
          >
            <p>
              Wil je dat we jouw opgeslagen resultaat verwijderen? Stuur een
              e-mail naar{" "}
              <a href="mailto:privacy@politiekprofiel.nl">
                privacy@politiekprofiel.nl
              </a>{" "}
              met de share-ID, en we verwijderen het binnen 14 dagen.
            </p>
          </Block>

          {/* Cookies */}
          <Block
            id="cookies"
            kicker="05 · Cookies"
            title="Cookies."
            accent="ink"
            last
          >
            <p>
              We gebruiken geen tracking- of advertentiecookies. We laten een
              functionele cookieconsent-banner zien om dit te bevestigen. Je
              kunt deze banner sluiten; je hoeft niets te accepteren of
              weigeren omdat we niets in cookies zetten.
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
