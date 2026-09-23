import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
import { ContentMasthead } from "@/components/content/PublicContent";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getAllPoliticiansSeed } from "@/lib/seed-readers";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/politici";
const PAGE_TITLE = "Politici";
const PAGE_DESCRIPTION =
  "Nederlandse en internationale politici op de vijf dimensies. Geactualiseerd op 14 september 2026, na de Tweede Kamerverkiezingen van 29 oktober 2025 en de beëdiging van kabinet-Jetten.";

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

export default function PoliticiOverviewPage() {
  const all = getAllPoliticiansSeed();
  const nl = all.filter((p) => !p.isInternational);
  const intl = all.filter((p) => p.isInternational);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Politici", item: PAGE_PATH },
  ]);

  return (
    <Container width="bleed" className="pt-12 md:pt-20 pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }}
      />

      <ContentMasthead
        code="A3"
        eyebrow="Politici"
        title="Bekende politici op de vijf assen."
        intro={
          <p>
            Posities zijn schattingen op basis van publieke standpunten,
            verkiezingsprogramma&apos;s en Kieskompas. Per politicus: dichtstbijzijnde
            ideologie, bio, en alle vijf scores. Geactualiseerd 14 september 2026.
          </p>
        }
        noteTitle="Meetwijze"
        note={<p>Vijf losse dimensies per persoon, zonder totaalscore of stemadvies.</p>}
      />

      <Section
        title="Nederland: kabinet en Kamer"
        kickerNum={1}
        subtitle={`${nl.length} politici. Inclusief premier Rob Jetten, vicepremier Yeşilgöz, fractievoorzitters en Groep Markuszower.`}
      >
        <PoliticianGrid items={nl} />
      </Section>

      <Section
        title="Internationaal"
        kickerNum={2}
        subtitle={`${intl.length} politici uit VS, EU-kernlanden en Canada, als referentiepunt op de vijf dimensies.`}
      >
        <PoliticianGrid items={intl} />
      </Section>
    </Container>
  );
}

function Section({
  title,
  subtitle,
  kickerNum,
  children,
}: {
  title: string;
  subtitle: string;
  kickerNum: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 md:mt-20 border-t border-ink pt-10">
      <ScrollReveal variant="stagger">
        <ScrollRevealItem>
          <Kicker number={kickerNum}>{title}</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-3 max-w-2xl text-ink-raised leading-relaxed text-sm md:text-base">
            {subtitle}
          </p>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <div className="mt-8">{children}</div>
        </ScrollRevealItem>
      </ScrollReveal>
    </section>
  );
}

function PoliticianGrid({
  items,
}: {
  items: ReturnType<typeof getAllPoliticiansSeed>;
}) {
  return (
    <ul className="border-t border-rule-strong divide-y divide-rule">
      {items.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/politici/${p.slug}`}
            className="group grid min-h-28 grid-cols-5 gap-x-4 gap-y-4 py-5 no-underline md:grid-cols-10 md:gap-x-5 lg:grid-cols-15 lg:items-center lg:gap-x-6 lg:py-6"
          >
            <p className="col-span-1 mono text-[0.62rem] tracking-wider text-text-muted lg:col-span-2">
              {p.party.toUpperCase()}
            </p>
            <div className="col-span-4 min-w-0 md:col-span-5 lg:col-span-6">
              <h3 className="display text-xl leading-tight text-ink transition-colors group-hover:text-signal-pressed md:text-2xl">
                {p.name}
              </h3>
              <p className="mt-1 text-xs text-text-muted">{p.role}</p>
            </div>
            <div className="col-start-2 col-span-4 md:col-start-auto md:col-span-4 lg:col-span-5">
              <MiniVector vector={p.positionVector} size="sm" />
            </div>
            <p className="col-start-2 col-span-4 inline-flex items-center justify-end gap-1.5 text-xs font-semibold text-ink transition-colors group-hover:text-signal-pressed md:col-start-auto md:col-span-1 lg:col-span-2">
              <span className="sr-only">Profiel van {p.name}</span>
              <ArrowRight size={12} strokeWidth={1.8} />
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
