import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { TuringGame } from "@/components/turing/TuringGame";
import { pickQuotes, TURING_QUOTES } from "@/data/turing-quotes";
import {
  buildBreadcrumbList,
  jsonLdString,
} from "@/lib/structured-data";

const PAGE_PATH = "/turing-test";
const PAGE_TITLE = "Ideological Turing Test";
const PAGE_DESCRIPTION =
  "Acht citaten uit het Nederlandse debat — kun jij raden welk kamp ze uitspreekt? Geen partij-quiz, maar een retoriek-test.";

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

interface PageProps {
  searchParams: Promise<{ seed?: string; n?: string }>;
}

export default async function TuringTestPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const seed = sp.seed ? Number(sp.seed) : Math.floor(Math.random() * 1_000_000);
  const n = sp.n ? Math.max(3, Math.min(15, Number(sp.n))) : 8;
  const quotes = pickQuotes(n, seed);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Ideological Turing Test", item: PAGE_PATH },
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
          <Kicker number="B6">Ideological Turing Test</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Raad het kamp,{" "}
            <em className="display-italic font-light text-navy">
              niet de partij
            </em>
            .
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-lg text-ink-2 leading-relaxed">
            {n} willekeurige citaten uit het Nederlandse politieke debat (2024-2026).
            Voor elk citaat: zou een linkse politicus, een midden-politicus
            of een rechtse politicus dit gezegd hebben? Geen valstrik —
            wel een spiegel voor hoe goed je politieke retoriek leest.
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <div className="mt-12">
        <TuringGame quotes={quotes} />
      </div>

      <section className="mt-16 border-t border-ink pt-10 max-w-3xl">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>Hoe werkt deze test?</Kicker>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <p className="mt-4 text-sm text-ink-2 leading-relaxed">
              Citaten komen uit Kamerdebatten, verkiezingsprogramma's of openbare
              interviews uit 2024-2026. Sommige zijn geparafraseerd voor
              leesbaarheid (gemarkeerd). De bibliotheek bevat {TURING_QUOTES.length}{" "}
              citaten verdeeld over drie kampen — links, midden, rechts. We
              gokken niet op partij omdat partijen overlappen; we gokken op
              kamp omdat retoriek meestal wel verraadt waar iemand staat.
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/turing-test?n=12"
                className="btn btn-ghost"
              >
                12 citaten
              </Link>
              <Link
                href={`/turing-test?seed=${Math.floor(Math.random() * 1_000_000)}`}
                className="btn btn-ghost"
              >
                Nieuwe ronde
              </Link>
            </div>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>
    </Container>
  );
}
