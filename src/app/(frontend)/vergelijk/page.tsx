import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { DimensionBar } from "@/components/DimensionBar";
import { getResult } from "@/lib/results-store";
import { getIdeologyBySlug } from "@/lib/result-data";
import { DIMENSIONS } from "@/lib/dimensions";
import { CompareLookup } from "@/components/CompareLookup";

type Args = { searchParams: Promise<{ a?: string; b?: string }> };

export default async function ComparePage({ searchParams }: Args) {
  const params = await searchParams;
  const aId = params.a ?? null;
  const bId = params.b ?? null;

  const [a, b] = await Promise.all([
    aId ? getResult(aId) : Promise.resolve(null),
    bId ? getResult(bId) : Promise.resolve(null),
  ]);

  const [ideoA, ideoB] = await Promise.all([
    a ? getIdeologyBySlug(a.ideologySlug) : Promise.resolve(null),
    b ? getIdeologyBySlug(b.ideologySlug) : Promise.resolve(null),
  ]);

  return (
    <>
      <header className="border-b border-rule">
        <Container className="py-16">
          <Link
            href="/"
            className="kicker inline-flex items-center gap-2 text-ink-muted hover:text-ink mb-6"
          >
            <ArrowLeft size={14} strokeWidth={1.7} />
            terug naar start
          </Link>
          <h1 className="serif">Vergelijk twee politieke profielen</h1>
          <p className="mt-4 text-ink-soft max-w-2xl">
            Plak hieronder twee deelbare links of de share-IDs. Je ziet hoe
            twee profielen op elke as overlappen of verschillen.
          </p>
        </Container>
      </header>

      <section className="border-b border-rule">
        <Container className="py-10">
          <CompareLookup aPrefill={aId ?? ""} bPrefill={bId ?? ""} />
        </Container>
      </section>

      {!a && !b && (
        <Container className="py-16">
          <p className="text-ink-muted">
            Voer hierboven twee share-IDs of links in om profielen naast elkaar
            te zien.
          </p>
        </Container>
      )}

      {a && b && (
        <>
          <section className="border-b border-rule">
            <Container className="py-16">
              <div className="grid gap-10 md:grid-cols-2">
                <ProfileSummary
                  label="Profiel A"
                  ideologyName={ideoA?.name ?? a.ideologySlug}
                  shortDescription={ideoA?.shortDescription}
                  shareId={a.shareId}
                />
                <ProfileSummary
                  label="Profiel B"
                  ideologyName={ideoB?.name ?? b.ideologySlug}
                  shortDescription={ideoB?.shortDescription}
                  shareId={b.shareId}
                />
              </div>
            </Container>
          </section>

          <section>
            <Container className="py-16">
              <p className="kicker mb-6">Scoresvergelijking per dimensie</p>
              <div>
                {DIMENSIONS.map((d) => (
                  <DimensionBar
                    key={d.id}
                    dimension={d.id}
                    value={a.dimensions[d.id]}
                    compareValue={b.dimensions[d.id]}
                    compareLabel="Profiel B"
                  />
                ))}
              </div>
              <p className="mt-6 text-xs text-ink-muted">
                De zwarte streep is Profiel A, de oranje streep Profiel B.
              </p>
            </Container>
          </section>
        </>
      )}

      {a && !b && (
        <Container className="py-16">
          <p className="text-ink-muted">
            We hebben Profiel A geladen. Voeg een tweede share-ID toe om te
            vergelijken.
          </p>
        </Container>
      )}
    </>
  );
}

function ProfileSummary({
  label,
  ideologyName,
  shortDescription,
  shareId,
}: {
  label: string;
  ideologyName: string;
  shortDescription?: string;
  shareId: string;
}) {
  return (
    <div className="border border-rule p-6">
      <p className="kicker mb-2">{label}</p>
      <h2 className="serif text-2xl leading-tight">{ideologyName}</h2>
      {shortDescription && (
        <p className="mt-3 text-sm text-ink-soft">{shortDescription}</p>
      )}
      <p className="mt-4 text-xs text-ink-muted font-mono">
        share-id: {shareId}
      </p>
    </div>
  );
}

export const dynamic = "force-dynamic";
