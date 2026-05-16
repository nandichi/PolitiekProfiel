import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Repeat, Share2 } from "lucide-react";
import { Container } from "@/components/Container";
import { DimensionBar } from "@/components/DimensionBar";
import { ScatterPlot } from "@/components/ScatterPlot";
import { RankedList } from "@/components/RankedList";
import { LexicalRenderer } from "@/components/LexicalRenderer";
import { ShareBlock } from "@/components/ShareBlock";
import { getResult } from "@/lib/results-store";
import {
  getAllCountries,
  getAllPoliticians,
  getIdeologyBySlug,
} from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";
import { rankByDistance } from "@/lib/scoring";

type Args = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) return { title: "Resultaat niet gevonden" };
  const ideo = await getIdeologyBySlug(result.ideologySlug);
  const name = ideo?.name ?? "Politiek profiel";
  return {
    title: `${name}`,
    description: ideo?.shortDescription ?? "Bekijk dit politieke profiel.",
    openGraph: {
      title: `${name} — PolitiekProfiel`,
      description: ideo?.shortDescription ?? "Bekijk dit politieke profiel.",
      images: [
        {
          url: `/api/og/${id}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — PolitiekProfiel`,
      description: ideo?.shortDescription ?? "Bekijk dit politieke profiel.",
      images: [`/api/og/${id}`],
    },
  };
}

export default async function ResultPage({ params }: Args) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const [ideo, politicians, countries] = await Promise.all([
    getIdeologyBySlug(result.ideologySlug),
    getAllPoliticians(),
    getAllCountries(),
  ]);
  if (!ideo) notFound();

  const rankedPoliticians = rankByDistance(
    result.dimensions,
    politicians.map((p) => ({
      id: String(p.id),
      primary: p.name,
      secondary: `${p.party} · ${p.country}`,
      vector: p.positionVector,
    })),
  );
  const rankedCountries = rankByDistance(
    result.dimensions,
    countries.map((c) => ({
      id: String(c.id),
      primary: c.name,
      secondary: c.description,
      vector: c.positionVector,
    })),
  );

  return (
    <>
      <header className="border-b border-rule">
        <Container className="py-16 md:py-20">
          <p className="kicker mb-3">Jouw politieke profiel</p>
          <h1 className="serif font-medium leading-[1.05] max-w-4xl">
            {ideo.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft leading-relaxed">
            {ideo.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-ink-muted">
            <span className="border border-rule px-2 py-1">
              Lengte: {tierLabel(result.tier)}
            </span>
            <span className="border border-rule px-2 py-1">
              {result.answeredCount} beantwoord
              {result.skippedCount > 0
                ? ` · ${result.skippedCount} overgeslagen`
                : ""}
            </span>
            <span className="border border-rule px-2 py-1 capitalize">
              {ideo.spectrumPosition.replace("-", " ")}
            </span>
          </div>
        </Container>
      </header>

      <section className="border-b border-rule">
        <Container className="py-16">
          <p className="kicker mb-6">Je scores op vijf assen</p>
          <div>
            {DIMENSIONS.map((d) => (
              <DimensionBar
                key={d.id}
                dimension={d.id}
                value={result.dimensions[d.id]}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container className="py-16">
          <p className="kicker mb-6">Wat houdt dit profiel in?</p>
          <div className="editorial-prose max-w-2xl">
            <LexicalRenderer value={ideo.description} />
          </div>
          {ideo.examplePeople?.length ? (
            <div className="mt-10 border-t border-rule pt-6 max-w-2xl">
              <p className="kicker mb-3">Bekende voorbeelden</p>
              <ul className="flex flex-wrap gap-2 text-sm">
                {ideo.examplePeople.map((ex, i) => (
                  <li
                    key={i}
                    className="border border-rule px-3 py-1 text-ink-soft"
                  >
                    {ex.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container width="wide" className="py-16">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="kicker mb-3">Vergelijk met politici</p>
              <h2 className="serif mb-6">
                Welke politici staan dichtbij jouw posities?
              </h2>
              <ScatterPlot
                user={result.dimensions}
                points={politicians.map((p) => ({
                  id: String(p.id),
                  label: p.name,
                  sublabel: `${p.party} · ${p.country}`,
                  vector: p.positionVector,
                }))}
                initialX="economic"
                initialY="social"
              />
            </div>
            <div>
              <p className="kicker mb-3">Op afstand</p>
              <RankedList
                matches={rankedPoliticians}
                limit={20}
                highlightFirst
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container width="wide" className="py-16">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="kicker mb-3">Vergelijk met landen</p>
              <h2 className="serif mb-6">
                Op welk land lijkt jouw profiel het meest?
              </h2>
              <ScatterPlot
                user={result.dimensions}
                points={countries.map((c) => ({
                  id: String(c.id),
                  label: c.name,
                  sublabel: c.description,
                  vector: c.positionVector,
                }))}
                initialX="economic"
                initialY="governance"
              />
            </div>
            <div>
              <p className="kicker mb-3">Op afstand</p>
              <RankedList matches={rankedCountries} highlightFirst />
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule">
        <Container className="py-16">
          <p className="kicker mb-4">Deel of vergelijk</p>
          <h2 className="serif mb-6">Bewaar je profiel of vergelijk met iemand anders</h2>
          <ShareBlock shareId={result.shareId} ideologyName={ideo.name} />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/vergelijk?a=${result.shareId}`}
              className="btn-secondary"
            >
              <Repeat size={16} strokeWidth={1.7} />
              Vergelijk met een ander profiel
            </Link>
            <Link href="/quiz/standard" className="btn-ghost">
              Doe de quiz opnieuw
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
            <Link href="/methodiek" className="btn-ghost">
              <Share2 size={16} strokeWidth={1.7} />
              Lees onze methodiek
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function tierLabel(tier: string): string {
  if (tier === "quick") return "Quick (30 vragen)";
  if (tier === "extended") return "Uitgebreid (80 vragen)";
  return "Standaard (50 vragen)";
}
