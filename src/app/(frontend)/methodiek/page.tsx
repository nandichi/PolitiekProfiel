import { Container } from "@/components/Container";
import { DIMENSIONS } from "@/lib/dimensions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodiek",
  description:
    "Hoe we politieke profielen meten: vijf dimensies, eerlijke balans, neutrale stellingen.",
};

export default function MethodiekPage() {
  return (
    <>
      <header className="border-b border-rule">
        <Container className="py-16 md:py-20">
          <p className="kicker mb-3">Onze methodiek</p>
          <h1 className="serif">
            Politiek meten zonder karikatuur.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            We willen niet weten of je &lsquo;links&rsquo; of &lsquo;rechts&rsquo; bent. We
            willen weten waar je staat op vijf onafhankelijke politieke vragen.
            Dat geeft een rijker en eerlijker beeld dan een enkele as.
          </p>
        </Container>
      </header>

      <section className="border-b border-rule">
        <Container className="py-16">
          <p className="kicker mb-6">De vijf assen</p>
          <div className="grid gap-6 md:grid-cols-2">
            {DIMENSIONS.map((d) => (
              <article
                key={d.id}
                className="border border-rule p-6"
              >
                <p className="kicker mb-2">{d.label}</p>
                <h2 className="serif text-xl leading-tight mb-3">
                  {d.poleNegative.label} ↔ {d.polePositive.label}
                </h2>
                <p className="text-sm text-ink-soft mb-4">{d.description}</p>
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="kicker text-xs">{d.poleNegative.label}</dt>
                    <dd className="text-ink-soft">
                      {d.poleNegative.description}
                    </dd>
                  </div>
                  <div>
                    <dt className="kicker text-xs">{d.polePositive.label}</dt>
                    <dd className="text-ink-soft">
                      {d.polePositive.description}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container width="narrow" className="py-16">
          <p className="kicker mb-4">Vragen en balans</p>
          <h2 className="serif mb-6">Hoe kiezen we stellingen?</h2>
          <div className="editorial-prose">
            <p>
              Per dimensie staan acht stellingen die <strong>richting de
              positieve pool</strong> wijzen en acht <strong>richting de
              negatieve pool</strong>. Zo kan een &lsquo;mee eens&rsquo; nooit
              eenzijdig één kant op wegen — de balans is wiskundig ingebouwd.
            </p>
            <p>
              We kiezen <strong>concrete en actuele stellingen</strong>. Geen
              vage platitudes (&lsquo;Iedereen verdient een eerlijke kans&rsquo;)
              maar specifieke beleidskeuzes. Bij elke stelling kun je via het
              info-icoon de achtergrond, argumenten <em>vóór</em> en <em>tegen</em>{" "}
              en bronnen raadplegen.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container width="narrow" className="py-16">
          <p className="kicker mb-4">Scoring</p>
          <h2 className="serif mb-6">Hoe komen de scores tot stand?</h2>
          <div className="editorial-prose">
            <p>
              Elk antwoord krijgt een waarde van <strong>-2</strong> (volledig
              mee oneens) tot <strong>+2</strong> (volledig mee eens). Neutraal
              en overgeslagen tellen mee als 0 (overgeslagen wordt niet
              genormaliseerd).
            </p>
            <p>
              De ruwe score wordt vermenigvuldigd met de richting (+1 of -1) en
              een gewicht. Vervolgens normaliseren we per dimensie naar een
              schaal van <strong>-100 tot +100</strong>, op basis van het maximaal
              haalbare gewicht van beantwoorde vragen.
            </p>
            <p>
              Je profiel is dus een vector in een 5-dimensionale ruimte. De
              dichtstbijzijnde ideologie wordt bepaald via Euclidische afstand.
            </p>
          </div>
        </Container>
      </section>

      <section>
        <Container width="narrow" className="py-16">
          <p className="kicker mb-4">Beperkingen</p>
          <h2 className="serif mb-6">Wat dit kompas niet is</h2>
          <div className="editorial-prose">
            <p>
              Dit kompas is geen <strong>stemwijzer</strong> en geen
              wetenschappelijke meting. Het is een instrument voor reflectie. We
              werken met geschatte profielposities van politici en landen die we
              afleiden uit publieke indices, programma's en debatten. Posities
              zijn discutabel, en wij bouwen graag verder op feedback.
            </p>
            <p>
              Politiek is bovendien meer dan een vragenlijst kan vangen. Zie
              jouw resultaat als een gespreksopener met jezelf — niet als een
              eindoordeel.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
