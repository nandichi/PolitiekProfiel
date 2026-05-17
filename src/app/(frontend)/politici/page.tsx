import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { MiniVector } from "@/components/MiniVector";
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
  "Nederlandse en internationale politici op de vijf dimensies. Geactualiseerd voor mei 2026, na de Tweede Kamerverkiezingen van 29 oktober 2025 en de beëdiging van kabinet-Jetten.";

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

      <ScrollReveal variant="stagger" immediate>
        <ScrollRevealItem>
          <Kicker number="A3">Politici</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Bekende politici{" "}
            <em className="display-italic font-light text-navy">
              op de vijf assen
            </em>
            .
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            Posities zijn schattingen op basis van publieke standpunten,
            verkiezingsprogramma's en Kieskompas. Per politicus: dichtstbijzijnde
            ideologie, bio, en alle vijf scores. Geactualiseerd 17 mei 2026.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <Section
        title="Nederland: kabinet en Kamer"
        kickerNum={1}
        subtitle={`${nl.length} politici. Inclusief premier Rob Jetten, vicepremier Yeşilgöz, fractievoorzitters en nieuwe partijleider DNA.`}
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
          <p className="mt-3 max-w-2xl text-ink-2 leading-relaxed text-sm md:text-base">
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
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
      {items.map((p) => (
        <li key={p.slug} className="bg-paper">
          <Link
            href={`/politici/${p.slug}`}
            className="group block p-6 md:p-7 no-underline h-full"
          >
            <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
              {p.party.toUpperCase()}
            </p>
            <h3 className="display mt-1.5 text-xl md:text-2xl leading-tight text-ink group-hover:text-navy transition-colors">
              {p.name}
            </h3>
            <p className="mt-1 text-xs text-ink-muted">{p.role}</p>
            <div className="mt-5">
              <MiniVector vector={p.positionVector} size="sm" />
            </div>
            <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-ink group-hover:text-navy transition-colors">
              Profiel
              <ArrowRight size={12} strokeWidth={1.8} />
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
