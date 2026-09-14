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
const PAGE_TITLE = "Retoriekspel";
const PAGE_DESCRIPTION =
  "Acht redactionele oefenfragmenten over Nederlandse politieke retoriek. Raad welk ideologisch kamp het fragment het beste typeert.";

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
  const seed = sp.seed ? Number(sp.seed) : 20260914;
  const n = sp.n ? Math.max(3, Math.min(15, Number(sp.n))) : 8;
  const quotes = pickQuotes(n, seed);

  const breadcrumbLd = buildBreadcrumbList([
    { name: "Start", item: "/" },
    { name: "Verkennen", item: "/verkennen" },
    { name: "Retoriekspel", item: PAGE_PATH },
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
          <Kicker number="B6">Retoriekspel</Kicker>
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
            {n} redactionele oefenfragmenten, geschreven om verschillende
            politieke retoriek te herkennen. Bij elk fragment kies je het kamp
            dat er het beste bij past: links, midden of rechts. Het zijn geen
            letterlijke uitspraken van politici en geen partijadvies.
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
              De bibliotheek bevat {TURING_QUOTES.length} redactionele oefenfragmenten,
              verdeeld over drie kampen: links,
              midden en rechts. Een standaardronde toont er 8; een langere
              ronde toont er 12. De labels beschrijven een retorische stijl,
              geen persoon, partij of wetenschappelijke meting. Gebruik de
              gewone quiz als je je eigen antwoorden inhoudelijk wilt terugzien.
            </p>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/turing-test?n=12"
                className="btn btn-ghost"
              >
                Langere ronde (12)
              </Link>
              <Link
                href={`/turing-test?seed=${seed + 1}&n=${n}`}
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
