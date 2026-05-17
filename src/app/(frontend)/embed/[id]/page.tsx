import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Kicker } from "@/components/Kicker";
import { CodeBlock } from "@/components/CodeBlock";
import {
  ScrollReveal,
  ScrollRevealItem,
} from "@/components/motion/ScrollReveal";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://politiekprofiel.nl";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Embed · ${id}`,
    robots: { index: false, follow: false },
    alternates: { canonical: `/embed/${id}` },
  };
}

export default async function EmbedConfigPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();
  const ideology = await getIdeologyBySlug(result.ideologySlug);
  const ideoName = ideology?.name ?? "politiek profiel";

  const embedUrl = `${SITE}/widget/profiel/${id}`;
  const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="520"
  style="border:1px solid #dcd8c9;background:#fafaf7;max-width:520px"
  loading="lazy"
  referrerpolicy="no-referrer"
  title="PolitiekProfiel: ${ideoName}"
></iframe>`;

  const ogImage = `${SITE}/api/og/${id}`;
  const imgCode = `<a href="${SITE}/r/${id}" target="_blank" rel="noopener">
  <img
    src="${ogImage}"
    width="600"
    alt="PolitiekProfiel: ${ideoName}"
    loading="lazy"
  />
</a>`;

  return (
    <Container width="bleed" className="pt-12 md:pt-20 pb-24">
      <ScrollReveal variant="stagger" immediate>
        <ScrollRevealItem>
          <Kicker number="D2">Embed</Kicker>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <h1
            className="display mt-6 max-w-4xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            Deel jouw profiel als een{" "}
            <em className="display-italic font-light text-navy">widget</em>.
          </h1>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-8 max-w-2xl text-base text-ink-2 leading-relaxed">
            Plak één van onderstaande snippets in je blog, essay of website. Geen
            tracking, geen externe scripts: alleen een iframe of statische
            afbeelding. Niet bedoeld voor commercieel her-gebruik.
          </p>
        </ScrollRevealItem>
        <ScrollRevealItem>
          <p className="mt-2 max-w-2xl text-xs text-ink-muted">
            <Link href={`/r/${id}`} className="hover:text-navy">
              ← Terug naar profiel {id}
            </Link>
          </p>
        </ScrollRevealItem>
      </ScrollReveal>

      <section className="mt-16 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={1}>Live widget (iframe)</Kicker>
            <h2 className="display mt-5 max-w-3xl">
              Interactieve mini-versie, altijd synchroon met je profiel.
            </h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl items-start">
              <div>
                <p className="kicker mb-3">Preview</p>
                <iframe
                  src={`/widget/profiel/${id}`}
                  width="100%"
                  height={520}
                  style={{
                    border: "1px solid var(--rule)",
                    background: "var(--paper)",
                    maxWidth: 520,
                  }}
                  loading="lazy"
                  title={`PolitiekProfiel: ${ideoName}`}
                />
              </div>
              <div>
                <p className="kicker mb-3">HTML</p>
                <CodeBlock code={iframeCode} language="html" />
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      <section className="mt-20 border-t border-ink pt-10">
        <ScrollReveal variant="stagger">
          <ScrollRevealItem>
            <Kicker number={2}>Statische afbeelding</Kicker>
            <h2 className="display mt-5 max-w-3xl">
              Voor blogs of newsletters waar je liever geen iframe gebruikt.
            </h2>
          </ScrollRevealItem>
          <ScrollRevealItem>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl items-start">
              <div>
                <p className="kicker mb-3">Preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/og/${id}`}
                  alt={`PolitiekProfiel: ${ideoName}`}
                  width={600}
                  className="border border-rule"
                />
              </div>
              <div>
                <p className="kicker mb-3">HTML</p>
                <CodeBlock code={imgCode} language="html" />
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollReveal>
      </section>

      <section className="mt-20 border-t border-ink pt-10 max-w-3xl">
        <Kicker number={3}>Spelregels</Kicker>
        <ul className="mt-5 list-disc pl-5 space-y-2 text-sm text-ink-2 leading-relaxed">
          <li>
            Bron-vermelding naar{" "}
            <code className="mono text-xs">politiekprofiel.nl</code> is verplicht
            bij her-publicatie.
          </li>
          <li>
            De widget is bedoeld voor educatief / journalistiek gebruik. Niet
            voor commerciële kiezerstargeting.
          </li>
          <li>
            We zetten geen cookies in het iframe. Mocht je toch consent vragen,
            is dat niet nodig; er is geen tracking.
          </li>
          <li>
            Het profiel-ID staat ongewijzigd; iedereen die de embed ziet kan
            doorklikken naar de volledige resultaatpagina.
          </li>
        </ul>
      </section>
    </Container>
  );
}
