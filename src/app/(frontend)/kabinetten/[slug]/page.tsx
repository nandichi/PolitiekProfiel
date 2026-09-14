import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { CABINETS, CABINET_REVIEWED, getCabinetBySlug } from "@/data/cabinets";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CABINETS.map((cabinet) => ({ slug: cabinet.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cabinet = getCabinetBySlug(slug);
  if (!cabinet) return { title: "Kabinet niet gevonden" };

  const description = `${cabinet.name}: ${cabinet.started} tot ${cabinet.ended}. Wat dit kabinet bereikte, wat niet werd gehaald en waarom het eindigde.`;

  return {
    title: cabinet.name,
    description,
    alternates: { canonical: `/kabinetten/${cabinet.slug}` },
    openGraph: {
      title: `${cabinet.name} · PolitiekProfiel`,
      description,
      url: `/kabinetten/${cabinet.slug}`,
      type: "article",
    },
  };
}

export default async function CabinetDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cabinet = getCabinetBySlug(slug);
  if (!cabinet) notFound();

  const path = `/kabinetten/${cabinet.slug}`;
  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Kabinetten", item: "/kabinetten" },
    { name: cabinet.name, item: path },
  ]);

  const meta = [
    { term: "Periode", value: `${cabinet.started} tot ${cabinet.ended}` },
    { term: "Zittingsduur", value: cabinet.daysInOffice },
    { term: "Partijen", value: cabinet.parties.join(" · ") },
    { term: "Zetels", value: cabinet.seats },
  ];

  return (
    <Container width="bleed" className="pt-12 md:pt-20 pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <ScrollReveal variant="stagger" immediate>
        <ScrollRevealItem>
          <Kicker number="B2">Kabinetten</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            {cabinet.name}
          </h1>
        </ScrollRevealItem>
      </ScrollReveal>

      <ScrollReveal variant="stagger">
        <ScrollRevealItem>
          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-rule border border-rule max-w-5xl">
            {meta.map((item) => (
              <div key={item.term} className="bg-paper p-5">
                <dt className="mono text-[0.62rem] tracking-wider text-ink-muted uppercase">
                  {item.term}
                </dt>
                <dd className="mt-2 text-sm text-ink leading-relaxed">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </ScrollRevealItem>

        <ScrollRevealItem>
          <div className="mt-12 max-w-3xl border-t border-rule pt-6">
            <p className="kicker">Waarom dit kabinet eindigde</p>
            <p className="mt-3 text-base text-ink-2 leading-relaxed">
              {cabinet.endReason}
            </p>
          </div>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-20 border-t border-ink pt-10">
        <Kicker number={1}>Wat is bereikt</Kicker>
        <h2 className="display mt-5 max-w-3xl">
          Maatregelen die dit kabinet daadwerkelijk heeft doorgevoerd.
        </h2>
        <ol className="mt-10 max-w-4xl divide-y divide-rule border-y border-rule">
          {cabinet.achievements.map((claim, index) => (
            <li key={claim.claim} className="grid grid-cols-[2rem_1fr] gap-4 py-5">
              <span className="mono text-xs text-ink-muted pt-1.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-base text-ink-2 leading-relaxed">
                  {claim.claim}
                </p>
                <a
                  href={claim.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-block text-xs text-ink-muted underline decoration-rule hover:text-ink"
                >
                  Bron bij deze maatregel
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 border-t border-ink pt-10">
        <Kicker number={2}>Wat niet is gehaald</Kicker>
        <h2 className="display mt-5 max-w-3xl">
          Doelen die wel zijn belooft maar geen wet of uitvoering werden.
        </h2>
        <ol className="mt-10 max-w-4xl divide-y divide-rule border-y border-rule">
          {cabinet.unfulfilled.map((claim, index) => (
            <li key={claim.claim} className="grid grid-cols-[2rem_1fr] gap-4 py-5">
              <span className="mono text-xs text-ink-muted pt-1.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-base text-ink-2 leading-relaxed">
                  {claim.claim}
                </p>
                <a
                  href={claim.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-block text-xs text-ink-muted underline decoration-rule hover:text-ink"
                >
                  Bron bij dit punt
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 border-t border-ink pt-10">
        <Kicker number={3}>Opvallend</Kicker>
        <div className="mt-6 max-w-3xl border border-rule bg-paper p-6">
          <p className="text-base text-ink leading-relaxed">
            {cabinet.interestingFact}
          </p>
          <a
            href={cabinet.interestingFactSource}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-block text-xs text-ink-muted underline decoration-rule hover:text-ink"
          >
            Bron bij dit feit
          </a>
        </div>
      </section>

      <div className="mt-16 flex flex-wrap gap-3">
        <Link href="/kabinetten" className="btn-ghost">
          Alle kabinetten
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
        <Link href="/partijen" className="btn-ghost">
          Partijen
          <ArrowRight size={14} strokeWidth={1.8} />
        </Link>
      </div>

      <p className="mt-10 max-w-3xl text-sm text-ink-muted leading-relaxed">
        Elke bewering op deze pagina verwijst naar een bron. Het onderscheid
        tussen een voornemen in een coalitieakkoord en een aangenomen of
        uitgevoerde maatregel is bewust aangehouden. Bijgewerkt op{" "}
        {CABINET_REVIEWED}.
      </p>
    </Container>
  );
}
