import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { StickyIndex } from "@/components/StickyIndex";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { DIMENSIONS } from "@/lib/dimensions";
import {
  buildArticleSchema,
  buildBreadcrumbList,
  buildFaqPage,
  jsonLdString,
} from "@/lib/structured-data";
import type { Metadata } from "next";

const PAGE_PATH = "/methodiek";
const PAGE_PUBLISHED = "2026-01-15";
const PAGE_MODIFIED = "2026-05-16";
const PAGE_TITLE = "Methodiek";
const PAGE_DESCRIPTION =
  "Hoe PolitiekProfiel politieke houding meet: vijf onafhankelijke dimensies, gebalanceerde stellingen, transparante scoring op −100 tot +100. Lees over de werking, de aannames en de beperkingen.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: "Methodiek · PolitiekProfiel",
    description:
      "Vijf onafhankelijke dimensies, gebalanceerde stellingen, transparante scoring. Geen één-as label.",
    url: PAGE_PATH,
    type: "article",
    publishedTime: PAGE_PUBLISHED,
    modifiedTime: PAGE_MODIFIED,
    authors: ["https://naoufalandichi.nl"],
  },
};

const INDEX = [
  { id: "intro", label: "Aanleiding" },
  { id: "dimensies", label: "De vijf dimensies" },
  { id: "vraagstelling", label: "Vraagstelling" },
  { id: "scoring", label: "Scoring" },
  { id: "beperkingen", label: "Beperkingen" },
];

const FAQ_ENTRIES = [
  {
    question: "Hoe meet PolitiekProfiel mijn politieke houding?",
    answer:
      "PolitiekProfiel meet je politieke houding op vijf onafhankelijke dimensies: economisch (vrije markt vs sterke staat), sociaal-cultureel (conservatief vs progressief), burgerrechten (autoritair vs libertair), bestuur (nationaal-soeverein vs multilevel/EU) en systeemvertrouwen (wantrouwen vs vertrouwen). Per dimensie worden gebalanceerde stellingen voorgelegd en je antwoorden vertaald naar een score van −100 tot +100.",
  },
  {
    question: "Hoe komen de scores tot stand?",
    answer:
      "Elk antwoord krijgt een waarde van −2 (volledig mee oneens) tot +2 (volledig mee eens). De score per dimensie wordt berekend als: raw = Σ(direction × antwoord × gewicht), genormaliseerd door de som van absolute gewichten over beantwoorde vragen, geschaald naar het bereik −100 tot +100. Overgeslagen vragen worden niet meegenomen in de normalisatie.",
  },
  {
    question: "Hoe wordt mijn dichtstbijzijnde ideologie of politicus bepaald?",
    answer:
      "Je profiel is een vector in een vijfdimensionale ruimte. De dichtstbijzijnde ideologie, politicus of land wordt bepaald via Euclidische afstand in die ruimte. Posities van politici en landen zijn schattingen op basis van publieke indices, partijprogramma's en debatten.",
  },
  {
    question: "Waarom vijf dimensies en niet één links-rechts schaal?",
    answer:
      "Een enkele links-rechts as kan onafhankelijke politieke houdingen niet vangen. Een conservatief op cultuur kan economisch links zijn; een libertair kan EU-gezind zijn. Vijf onafhankelijke dimensies geven een rijker en eerlijker beeld dan een gereduceerd één-as label.",
  },
  {
    question: "Is dit een stemwijzer?",
    answer:
      "Nee. PolitiekProfiel is geen stemwijzer en geen wetenschappelijke meting, maar een instrument voor reflectie. Het laat zien waar je staat ten opzichte van ideologische posities, niet welke partij je zou moeten stemmen.",
  },
  {
    question: "Hoe worden stellingen gekozen?",
    answer:
      "Per dimensie staan evenveel stellingen die richting de positieve pool wijzen als richting de negatieve pool, zodat een 'mee eens' nooit eenzijdig één kant op weegt. We kiezen concrete en actuele beleidsstellingen, geen vage platitudes. Bij elke stelling zijn context, argumenten voor en tegen, en bronnen beschikbaar.",
  },
];

export default function MethodiekPage() {
  const articleLd = buildArticleSchema({
    path: PAGE_PATH,
    headline: "Methodiek — hoe PolitiekProfiel politieke houding meet",
    description: PAGE_DESCRIPTION,
    datePublished: PAGE_PUBLISHED,
    dateModified: PAGE_MODIFIED,
    articleSection: "Methodologie",
  });
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Methodiek", item: PAGE_PATH },
  ]);
  const faqLd = buildFaqPage(FAQ_ENTRIES, PAGE_PATH);

  return (
    <Container width="bleed" className="pt-12 md:pt-20">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: jsonLdString([articleLd, breadcrumbLd, faqLd]),
        }}
      />
      <div className="grid grid-cols-1 gap-10 lg:gap-16 lg:grid-cols-[220px_1fr]">
        <StickyIndex items={INDEX} topOffset={96} />

        <div className="min-w-0 max-w-3xl">
          {/* Intro */}
          <section id="intro" className="scroll-mt-32">
            <ScrollReveal variant="stagger" immediate>
              <ScrollRevealItem>
                <Kicker number={1}>Onze methodiek</Kicker>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <h1
                  className="display mt-6"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  Politiek meten
                  <span className="block">
                    <em className="display-italic font-light text-navy">
                      zonder karikatuur.
                    </em>
                  </span>
                </h1>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <p className="mt-8 text-lg md:text-xl text-ink-2 leading-relaxed">
                  We willen niet weten of je &lsquo;links&rsquo; of
                  &lsquo;rechts&rsquo; bent. We willen weten waar je staat op
                  vijf onafhankelijke politieke vragen. Dat geeft een rijker en
                  eerlijker beeld dan een enkele as.
                </p>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          {/* Dimensies */}
          <section
            id="dimensies"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={2}>De vijf assen</Kicker>
                <h2 className="display mt-5">
                  Vijf onafhankelijke politieke houdingen.
                </h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-10 space-y-8">
                  {DIMENSIONS.map((d, i) => (
                    <article
                      key={d.id}
                      className="grid grid-cols-1 gap-5 lg:grid-cols-[80px_1fr] border-b border-rule pb-8 last:border-b-0"
                    >
                      <div>
                        <p className="index-num text-sm">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="kicker mt-1.5">{d.shortLabel}</p>
                      </div>
                      <div>
                        <h3 className="display text-2xl md:text-3xl leading-tight">
                          {d.poleNegative.label}
                          <span className="text-ink-subtle font-light mx-2">
                            /
                          </span>
                          {d.polePositive.label}
                        </h3>
                        <p className="mt-3 text-ink-2 leading-relaxed">
                          {d.description}
                        </p>
                        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="border-l-2 border-ink pl-4">
                            <dt className="kicker mb-1.5">
                              {d.poleNegative.label}
                            </dt>
                            <dd className="text-sm text-ink-2 leading-relaxed">
                              {d.poleNegative.description}
                            </dd>
                          </div>
                          <div className="border-l-2 border-navy pl-4">
                            <dt className="kicker mb-1.5">
                              {d.polePositive.label}
                            </dt>
                            <dd className="text-sm text-ink-2 leading-relaxed">
                              {d.polePositive.description}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  ))}
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          {/* Vraagstelling */}
          <section
            id="vraagstelling"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={3}>Vragen en balans</Kicker>
                <h2 className="display mt-5">Hoe kiezen we stellingen?</h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <p>
                    Per dimensie staan stellingen die{" "}
                    <strong>richting de positieve pool</strong>
                    {" "}
                    wijzen, en even veel stellingen die{" "}
                    <strong>richting de negatieve pool</strong>
                    {" "}
                    wijzen. Zo kan een &lsquo;mee eens&rsquo; nooit eenzijdig
                    één kant op wegen; de balans is wiskundig ingebouwd.
                  </p>
                  <p>
                    We kiezen <strong>concrete en actuele stellingen</strong>.
                    Geen vage platitudes (&lsquo;Iedereen verdient een eerlijke
                    kans&rsquo;) maar specifieke beleidskeuzes. Bij elke
                    stelling kun je via het achtergrond-paneel de context,
                    argumenten <em>vóór</em> en <em>tegen</em>, en bronnen
                    raadplegen.
                  </p>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          {/* Scoring */}
          <section
            id="scoring"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={4}>Scoring</Kicker>
                <h2 className="display mt-5">Hoe komen de scores tot stand?</h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <p>
                    Elk antwoord krijgt een waarde van <strong>−2</strong>{" "}
                    (volledig mee oneens) tot <strong>+2</strong>{" "}
                    (volledig mee eens). Neutraal telt als 0; overgeslagen wordt
                    niet meegenomen in de normalisatie.
                  </p>
                </div>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 border border-rule p-6 md:p-8 bg-paper-50/60">
                  <p className="kicker mb-4">Formule per dimensie</p>
                  <pre className="mono text-sm leading-relaxed text-ink overflow-x-auto whitespace-pre">
                    {`raw    = Σ ( direction × antwoord × gewicht )
maxW   = Σ ( |gewicht|  ) over beantwoorde vragen
score  = ( raw / ( maxW × 2 ) ) × 100   →  [-100 … +100]`}
                  </pre>
                </div>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <p>
                    Je profiel is een vector in een 5-dimensionale ruimte. De
                    dichtstbijzijnde ideologie, politicus of land wordt bepaald
                    via de <strong>Euclidische afstand</strong> in die ruimte.
                  </p>
                </div>
              </ScrollRevealItem>
            </ScrollReveal>
          </section>

          {/* Beperkingen */}
          <section
            id="beperkingen"
            className="mt-20 md:mt-28 scroll-mt-32 border-t border-ink pt-12 pb-16"
          >
            <ScrollReveal variant="stagger">
              <ScrollRevealItem>
                <Kicker number={5}>Beperkingen</Kicker>
                <h2 className="display mt-5">Wat dit kompas niet is.</h2>
              </ScrollRevealItem>
              <ScrollRevealItem>
                <div className="mt-8 editorial-prose">
                  <p>
                    Dit kompas is geen <strong>stemwijzer</strong>
                    {" "}
                    en geen wetenschappelijke meting. Het is een instrument voor
                    reflectie. We werken met geschatte profielposities van
                    politici en landen die we afleiden uit publieke indices,
                    programma&apos;s en debatten. Posities zijn discutabel, en
                    wij bouwen graag verder op feedback.
                  </p>
                  <p>
                    Politiek is bovendien meer dan een vragenlijst kan vangen.
                    Zie jouw resultaat als een gespreksopener met jezelf, niet
                    als een eindoordeel.
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
