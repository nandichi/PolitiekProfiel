import type { Metadata } from "next";
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

const PAGE_PATH = "/ai-transparantie";
const PAGE_PUBLISHED = "2026-05-17";
const PAGE_MODIFIED = "2026-05-17";
const PAGE_TITLE = "AI-transparantie";
const PAGE_DESCRIPTION =
  "Hoe PolitiekProfiel AI gebruikt: alleen vooraf, voor educatieve duiding, met audit-trail, en zonder ooit jouw antwoorden naar een AI-model te sturen.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "AI-transparantie · PolitiekProfiel",
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["https://naoufalandichi.nl"],
  },
};

const INDEX = [
  { id: "intro", label: "Aanleiding" },
  { id: "wat", label: "Wat we genereren" },
  { id: "nooit", label: "Wat we niet doen" },
  { id: "kwaliteit", label: "Kwaliteitsbewaking" },
  { id: "model", label: "Model & prompts" },
  { id: "geen-runtime", label: "Geen runtime AI" },
];

export default function AiTransparantiePage() {
  const articleLd = buildArticleSchema({
    path: PAGE_PATH,
    headline: "AI-transparantie — hoe PolitiekProfiel AI inzet",
    description: PAGE_DESCRIPTION,
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_MODIFIED,
    articleSection: "Transparantie",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "AI-transparantie", item: PAGE_PATH },
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
                <Kicker number={1}>Open over AI</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1
                  className="display mt-6"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  AI als redactioneel hulpmiddel,
                  <span className="block">
                    <em className="display-italic font-light text-navy">
                      nooit met jouw data.
                    </em>
                  </span>
                </h1>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-8 text-lg md:text-xl text-ink-2 leading-relaxed">
                  PolitiekProfiel gebruikt AI om bezoekers hun profiel beter te
                  laten begrijpen. We zijn open over wat we genereren, hoe we
                  het doen, en wat we expliciet <strong>niet</strong> doen.
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <section
            id="wat"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>Wat we genereren</Kicker>
                <h2 className="display mt-5">
                  Vooraf, eenmalig, gecached — ongeveer 210 stukjes content.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <ul>
                    <li>
                      <strong>Per ideologie</strong> — een uitgebreid essay
                      van 600-800 woorden, een leeslijst, sterkste argumenten
                      vóór en respectvolle tegenargumenten.
                    </li>
                    <li>
                      <strong>Per dimensie × score-bucket</strong> — uitleg
                      over wat een sterk negatieve tot sterk positieve score
                      op die as betekent.
                    </li>
                    <li>
                      <strong>Per ideologie × thema</strong> — hoe denkt deze
                      stroming doorgaans over klimaat, zorg, migratie,
                      economie, EU, democratie en wonen.
                    </li>
                    <li>
                      <strong>Per paradox-type</strong> — wat het betekent als
                      je antwoorden binnen of tussen dimensies elkaar
                      tegenspreken, en waarom dat geen probleem hoeft te zijn.
                    </li>
                  </ul>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <section
            id="nooit"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={3}>Wat we expliciet niet doen</Kicker>
                <h2 className="display mt-5">
                  Drie harde grenzen die we niet overschrijden.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 grid grid-cols-1 gap-5">
                  <NoBlock
                    title="Geen runtime data naar AI"
                    body="Niet je antwoorden, niet je dimensie-scores, niet je paradoxen, niet je IP-adres. Niets verlaat onze infrastructuur richting AI tijdens jouw bezoek."
                  />
                  <NoBlock
                    title="Geen persoonlijke duiding"
                    body="Iedereen met dezelfde ideologie en score-bucket ziet dezelfde voorgekauwde tekst. Geen op maat gemaakte AI-output per gebruiker."
                  />
                  <NoBlock
                    title="Geen ranking, geen stemadvies"
                    body="AI doet geen partijvergelijking voor jou persoonlijk, geeft geen stemadvies en treedt nooit op als beslisser."
                  />
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <section
            id="kwaliteit"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={4}>Kwaliteitsbewaking</Kicker>
                <h2 className="display mt-5">
                  Audit-trail, redactionele controle, handmatige overrides.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <ul>
                    <li>
                      Iedere generatie wordt opgeslagen met{" "}
                      <strong>prompt, model en datum</strong> als audit-trail.
                    </li>
                    <li>
                      Een redactionele check loopt na het genereren over
                      balans, toon, nuance en correcte representatie van
                      uiteenlopende politieke stromingen.
                    </li>
                    <li>
                      Handmatige aanpassingen via de Payload-editor zijn
                      altijd mogelijk. Een aangepaste tekst wordt gemarkeerd
                      als <code className="mono text-sm">humanEdited</code>.
                    </li>
                    <li>
                      Bij her-generatie wordt elk slot beoordeeld op kosten en
                      alleen vervangen als de redactie dat goedkeurt.
                    </li>
                  </ul>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <section
            id="model"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={5}>Model & prompts</Kicker>
                <h2 className="display mt-5">
                  OpenAI, met strenge richtlijnen.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <p>
                    We gebruiken <strong>OpenAI</strong> met een tekstmodel
                    dat geoptimaliseerd is voor Nederlandstalige content en
                    lage hallucinatie. Het exacte model is per slot zichtbaar
                    in de audit-trail (
                    <code className="mono text-sm">model</code> veld).
                  </p>
                  <p>Onze prompt-engineering volgt deze principes:</p>
                  <ul>
                    <li>Streng gebalanceerd; geen partij-promotie.</li>
                    <li>
                      Citeert geen actuele politici direct (om
                      actualiteit-drift te voorkomen).
                    </li>
                    <li>Nederlandse taal, editorial register, rust en nuance.</li>
                    <li>
                      Bron-aanduiding waar mogelijk (&lsquo;klassieke
                      argumentatie&rsquo;, &lsquo;academische
                      literatuur&rsquo;).
                    </li>
                    <li>Geen polariserende framing of activistische taal.</li>
                  </ul>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          <section
            id="geen-runtime"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12 pb-16"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={6}>Geen runtime AI</Kicker>
                <h2 className="display mt-5">
                  Op je resultaatpagina is geen AI-call actief.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <p>
                    Alles wat je leest is gecached uit eerdere, gecontroleerde
                    batches. Open je daarna een ander resultaat? Dezelfde
                    teksten worden hergebruikt zonder enige nieuwe aanroep.
                  </p>
                  <p>
                    Lees ook onze{" "}
                    <a href="/privacy" className="underline">
                      privacy-belofte
                    </a>{" "}
                    en de{" "}
                    <a href="/methodiek" className="underline">
                      methodiek
                    </a>{" "}
                    voor de bredere context.
                  </p>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>
        </div>
      </div>
    </Container>
  );
}

function NoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-rule p-5 md:p-6 bg-paper-100">
      <p className="kicker mb-2">{title}</p>
      <p className="text-ink-2 leading-relaxed text-sm md:text-base">{body}</p>
    </div>
  );
}
