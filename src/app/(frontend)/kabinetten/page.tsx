import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import {
  CABINETS,
  CABINET_RECORDS,
  CABINET_RECORD_GROUPS,
  CABINET_REVIEWED,
} from "@/data/cabinets";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/kabinetten";
const PAGE_TITLE = "Kabinetten";
const PAGE_DESCRIPTION =
  "Alle Nederlandse kabinetten sinds 1994: wie meeregeerde, hoe lang, waarom het eindigde, wat aantoonbaar is bereikt en wat beloofd maar niet gehaald is.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title: `${PAGE_TITLE} · PolitiekProfiel`,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "website",
  },
};

export default function KabinettenOverviewPage() {
  const sitting = CABINETS.filter((cabinet) => cabinet.sitting);
  const past = CABINETS.filter((cabinet) => !cabinet.sitting);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: PAGE_TITLE, item: PAGE_PATH },
  ]);

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
            Wat coalities{" "}
            <em className="display-italic font-light text-navy">beloofden</em>{" "}
            en wat er terechtkwam.
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Per kabinet sinds 1994: welke partijen meeregeerden, hoe lang het
            zat, waarom het eindigde, welke maatregelen aantoonbaar zijn
            doorgevoerd en welke doelen wel zijn belooft maar niet gehaald.
          </p>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-5 max-w-2xl text-sm text-ink-muted leading-relaxed">
            Een coalitieakkoord is een voornemen, geen wet. Daarom staat bij elke
            bewering of het om een aangenomen of uitgevoerde maatregel gaat, en
            niet om een ambitie uit een akkoord. Elke bewering heeft een bron.
            Bijgewerkt op {CABINET_REVIEWED}.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      {sitting.length > 0 && (
        <section className="mt-16 md:mt-20 border-t border-ink pt-10">
          <Kicker number="Zittend">Nu aan het werk</Kicker>
          <ul className="mt-8 grid grid-cols-1 gap-4 max-w-3xl">
            {sitting.map((cabinet) => (
              <li key={cabinet.slug} className="border border-rule bg-paper p-5">
                <Link
                  href={`/kabinetten/${cabinet.slug}`}
                  className="block no-underline group"
                >
                  <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                    {cabinet.started} tot nu
                  </p>
                  <p className="display mt-1.5 text-2xl leading-tight text-ink group-hover:text-navy transition-colors">
                    {cabinet.name}
                  </p>
                  <p className="mt-3 text-sm text-ink-2 leading-snug">
                    {cabinet.parties.join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                    {cabinet.daysInOffice}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-20 border-t border-ink pt-10">
        <Kicker number={1}>
          Alle kabinetten, nieuwste eerst
        </Kicker>
        <h2 className="display mt-5 max-w-3xl">
          {past.length} afgeronde kabinetten sinds 1994.
        </h2>
        <ul className="mt-10 border-t border-rule">
          {past
            .slice()
            .reverse()
            .map((cabinet, index) => (
              <li key={cabinet.slug} className="border-b border-rule">
                <Link
                  href={`/kabinetten/${cabinet.slug}`}
                  className="group block py-6 no-underline"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[40px_1.2fr_1fr_auto] gap-3 lg:gap-8 items-baseline">
                    <p className="index-num text-xs">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <div>
                      <p className="display text-xl text-ink group-hover:text-navy transition-colors">
                        {cabinet.name}
                      </p>
                      <p className="mono text-[0.62rem] tracking-wider text-ink-subtle mt-1">
                        {cabinet.started} tot {cabinet.ended}
                      </p>
                    </div>
                    <p className="text-sm text-ink-2 leading-snug">
                      {cabinet.parties.join(" · ")}
                    </p>
                    <ArrowRight
                      size={14}
                      strokeWidth={1.8}
                      className="text-ink-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </section>
      <section className="mt-20 border-t border-ink pt-10">
        <Kicker number={2}>Records en uitzonderingen</Kicker>
        <h2 className="display mt-5 max-w-3xl">
          Wat in de parlementaire geschiedenis maar één keer gebeurde.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-ink-muted">
          De langste en de kortste kabinetten, de traagste en de snelste
          formaties, en de uitzonderingen die het stelsel zelf blootleggen.
        </p>

        <div className="mt-10 space-y-12">
          {CABINET_RECORD_GROUPS.map((group) => {
            const records = CABINET_RECORDS.filter(
              (record) => record.group === group.id,
            );
            if (records.length === 0) return null;
            return (
              <div key={group.id}>
                <p className="kicker">{group.label}</p>
                <ol className="mt-5 max-w-4xl divide-y divide-rule border-y border-rule">
                  {records.map((record) => (
                    <li
                      key={record.claim}
                      className="grid grid-cols-[1fr_auto] gap-4 py-5"
                    >
                      <div className="min-w-0">
                        <p className="text-base text-ink-2 leading-relaxed">
                          {record.claim}
                        </p>
                        <a
                          href={record.sourceUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="mt-2 inline-block text-xs text-ink-muted underline decoration-rule hover:text-ink"
                        >
                          Bron bij dit record
                        </a>
                      </div>
                      {record.numbers ? (
                        <p className="mono tabular-nums text-xs text-ink-muted text-right max-w-40 pt-1">
                          {record.numbers}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

    </Container>
  );
}
