import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Scale,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/Container";
import { DIMENSIONS, TIER_QUESTION_COUNT } from "@/lib/dimensions";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-20 md:py-28">
          <p className="kicker mb-6">Een onafhankelijk kompas</p>
          <h1 className="max-w-3xl serif font-medium leading-[1.02]">
            Politiek is meer dan
            <em className="font-light text-accent"> links</em> of
            <em className="font-light text-accent"> rechts</em>.
            <br />
            Zie waar je écht staat.
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-ink-soft leading-relaxed">
            Een rustig, doordacht profiel op <strong>vijf onafhankelijke
            dimensies</strong>. Geen scorelijst voor partijen. Geen reclame. Wel
            heldere uitleg, ruimte voor twijfel, en herkenbare vergelijking met
            politici en landen.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/quiz/standard" className="btn-primary">
              Start de standaard quiz
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
            <Link href="/methodiek" className="btn-secondary">
              Lees eerst de methodiek
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container className="py-20">
          <div className="grid gap-10 md:grid-cols-3">
            <Header
              kicker="01 · Vraagstelling"
              title="Concreet, actueel, gebalanceerd"
              body="80 stellingen die de redactie zorgvuldig heeft opgesteld. Voor en tegen krijgen evenveel ruimte; informeer jezelf vóór je antwoordt."
              Icon={Scale}
            />
            <Header
              kicker="02 · Methodiek"
              title="Vijf dimensies, geen karikatuur"
              body="Economisch, sociaal-cultureel, burgerrechten, bestuur en systeemvertrouwen. Je krijgt vijf onafhankelijke scores, geen één-as label."
              Icon={Sparkles}
            />
            <Header
              kicker="03 · Privacy"
              title="Geen account, geen tracking"
              body="We slaan resultaten anoniem op zodat je ze kunt delen via een korte link. Geen IP-adres, geen analytics, geen cookies behalve een functioneel consent."
              Icon={ShieldCheck}
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container width="wide" className="py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end mb-12">
            <div>
              <p className="kicker mb-3">Kies een lengte</p>
              <h2 className="serif max-w-2xl">
                Een snelle indicatie of een grondig portret. Jij bepaalt.
              </h2>
            </div>
            <p className="text-sm text-ink-muted max-w-sm">
              Je voortgang wordt automatisch in je browser bewaard, dus je kunt
              altijd later doorgaan.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <TierCard
              tier="quick"
              title="Quick"
              minutes="5 min"
              tagline="Korte indicatie van waar je staat."
            />
            <TierCard
              tier="standard"
              title="Standaard"
              minutes="10 min"
              tagline="Onze aanbevolen lengte voor een degelijk profiel."
              recommended
            />
            <TierCard
              tier="extended"
              title="Uitgebreid"
              minutes="20 min"
              tagline="Diepgaande analyse met de meeste nuances."
            />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <p className="kicker mb-6">De vijf assen</p>
          <h2 className="serif max-w-2xl mb-10">
            Politiek laat zich niet samenpersen tot één lijn. Dit zijn de
            vijf dimensies waarin wij meten.
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DIMENSIONS.map((d) => (
              <article key={d.id} className="border border-rule p-6">
                <p className="kicker mb-2">{d.label}</p>
                <h3 className="serif text-xl leading-tight mb-3">
                  {d.poleNegative.label} ↔ {d.polePositive.label}
                </h3>
                <p className="text-sm text-ink-soft">{d.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function Header({
  kicker,
  title,
  body,
  Icon,
}: {
  kicker: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 text-ink-muted mb-4">
        <Icon size={20} strokeWidth={1.5} />
        <p className="kicker">{kicker}</p>
      </div>
      <h3 className="serif text-xl leading-tight mb-3">{title}</h3>
      <p className="text-sm text-ink-soft">{body}</p>
    </div>
  );
}

function TierCard({
  tier,
  title,
  minutes,
  tagline,
  recommended = false,
}: {
  tier: "quick" | "standard" | "extended";
  title: string;
  minutes: string;
  tagline: string;
  recommended?: boolean;
}) {
  const count = TIER_QUESTION_COUNT[tier];
  return (
    <Link
      href={`/quiz/${tier}`}
      className={`group relative block border ${
        recommended
          ? "border-ink bg-ink text-paper"
          : "border-rule bg-paper hover:border-ink"
      } transition-colors p-8`}
    >
      {recommended && (
        <span className="absolute -top-3 left-6 bg-paper text-ink border border-ink px-2 py-0.5 text-xs uppercase tracking-widest">
          Aanbevolen
        </span>
      )}
      <div className="flex items-baseline justify-between">
        <h3
          className={`serif text-2xl ${
            recommended ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h3>
        <span
          className={`tabular-nums text-sm ${
            recommended ? "text-paper/70" : "text-ink-muted"
          } inline-flex items-center gap-1.5`}
        >
          <Clock3 size={14} strokeWidth={1.6} />
          {minutes}
        </span>
      </div>
      <p
        className={`mt-3 text-sm ${
          recommended ? "text-paper/80" : "text-ink-soft"
        }`}
      >
        {tagline}
      </p>
      <div
        className={`mt-8 flex items-end justify-between border-t ${
          recommended ? "border-paper/30" : "border-rule"
        } pt-4`}
      >
        <span
          className={`serif text-4xl tabular-nums ${
            recommended ? "text-paper" : "text-ink"
          }`}
        >
          {count}
        </span>
        <span
          className={`text-xs uppercase tracking-widest ${
            recommended ? "text-paper/70" : "text-ink-muted"
          }`}
        >
          Stellingen
        </span>
      </div>
      <span
        className={`mt-6 inline-flex items-center gap-2 text-sm ${
          recommended ? "text-paper" : "text-ink"
        } group-hover:underline`}
      >
        Begin
        <ArrowRight size={16} strokeWidth={1.7} />
      </span>
    </Link>
  );
}
