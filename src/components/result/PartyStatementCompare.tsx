import Link from "next/link";
import type { PositionBasis } from "@/data/party-positions";
import type { PartyComparison } from "@/lib/party-position-comparison";
import { PartyMark } from "@/components/parties/PartyMark";

function sourceLabel(basis: PositionBasis) {
  if (basis === "beide") return "programma + stemgedrag";
  if (basis === "stemgedrag") return "stemgedrag";
  return "programma";
}

function EvidenceList({
  items,
  empty,
}: {
  items: PartyComparison["agreements"];
  empty: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-muted leading-relaxed">{empty}</p>;
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={`${item.statement}-${item.partyStance}`} className="border-t border-rule pt-4">
          <p className="text-sm text-ink leading-relaxed">{item.statement}</p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
            <span>Jij: {item.userAnswerLabel}</span>
            <span>Partij: {item.partyStanceLabel}</span>
            <span>{sourceLabel(item.basis)}</span>
          </div>
          {item.quote ? (
            <p className="mt-2 border-l-2 border-rule-strong pl-3 text-xs italic text-ink-2 leading-relaxed">
              “{item.quote}”
            </p>
          ) : null}
          {item.note ? (
            <p className="mt-2 text-xs text-ink-muted leading-relaxed">{item.note}</p>
          ) : null}
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-xs text-navy underline underline-offset-2 hover:text-ink"
          >
            Bron openen
          </a>
        </li>
      ))}
    </ul>
  );
}

function basisCountLabel(comparison: PartyComparison): string {
  const parts: string[] = [];
  if (comparison.basisCounts.programma) {
    parts.push(`${comparison.basisCounts.programma} programma`);
  }
  if (comparison.basisCounts.stemgedrag) {
    parts.push(`${comparison.basisCounts.stemgedrag} stemgedrag`);
  }
  if (comparison.basisCounts.beide) {
    parts.push(`${comparison.basisCounts.beide} beide`);
  }
  return parts.join(" · ") || "geen vergelijkbare antwoorden";
}

export function PartyStatementCompare({
  comparisons,
  answeredCount,
  isExtended,
}: {
  comparisons: PartyComparison[];
  answeredCount: number;
  isExtended: boolean;
}) {
  if (comparisons.length === 0) {
    return (
      <div className="border border-rule bg-paper-100 p-5 md:p-7">
        <p className="kicker mb-2">Nog geen partijvergelijking</p>
        <p className="text-sm text-ink-2 leading-relaxed">
          Er zijn nog geen gecontroleerde partijstandpunten gekoppeld aan de
          beantwoorde vragen in dit rapport.
        </p>
      </div>
    );
  }

  return (
    <div>
      <aside className="border border-navy/30 bg-navy/3 px-4 py-4 md:px-5 md:py-5 text-sm text-ink-2 leading-relaxed max-w-3xl">
        <p className="kicker mb-2 text-navy">Eerst antwoorden, dan vergelijken</p>
        <p>
          Deze laag staat bewust pas in je resultaat. Als je partijstandpunten
          vooraf leest, kunnen ze je eigen antwoorden kleuren. De percentages
          hieronder zijn daarom geen stemadvies en ook geen voorspelling: ze
          tellen alleen jouw beantwoorde stellingen waarop een partij een
          publiek standpunt heeft.
        </p>
      </aside>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {comparisons.map((comparison, index) => {
          const enoughEvidence = comparison.consideredAnswers >= 5;
          const percentage = enoughEvidence && comparison.matchPercentage !== null
            ? `${comparison.matchPercentage}%`
            : "te weinig data";

          return (
            <article
              key={comparison.partySlug}
              className="border border-rule bg-paper-100 p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <PartyMark slug={comparison.partySlug} abbreviation={comparison.party.abbreviation} />
                  <div className="min-w-0">
                    <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">
                      {String(index + 1).padStart(2, "0")} · {comparison.party.abbreviation}
                    </p>
                    <h3 className="display mt-1 text-xl leading-tight text-ink wrap-break-word [hyphens:auto]">
                      {comparison.party.name}
                    </h3>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="mono text-[0.62rem] tracking-wider text-ink-subtle">RUWE OVEREENKOMST</p>
                  <p className="display mt-1 text-2xl leading-none text-navy" aria-label={`Ruwe overeenkomst: ${percentage}`}>
                    {percentage}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-ink-2 leading-relaxed">
                {comparison.matchingAnswers} van {comparison.consideredAnswers} vergelijkbare antwoorden komen overeen.
                {comparison.noPositionAnswers > 0
                  ? ` Bij ${comparison.noPositionAnswers} beantwoorde stelling${comparison.noPositionAnswers === 1 ? "" : "en"} heeft deze partij geen publiek standpunt.`
                  : ""}
              </p>
              <p className="mt-3 mono text-[0.62rem] tracking-wider text-ink-subtle">
                {basisCountLabel(comparison)} · {answeredCount} antwoorden in jouw rapport
              </p>
              <Link
                href={`/partij/${comparison.partySlug}`}
                className="mt-3 inline-flex text-xs text-navy underline underline-offset-2 hover:text-ink"
              >
                Open partijprofiel
              </Link>

              <details className="mt-6 border-t border-rule pt-4" open={index === 0}>
                <summary className="cursor-pointer list-none text-sm font-medium text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy">
                  Bekijk waar de overeenkomst en verschillen zitten
                </summary>
                <div className="mt-5 space-y-7">
                  <section>
                    <p className="kicker mb-3">Waar het aansluit</p>
                    <EvidenceList
                      items={comparison.agreements.slice(0, isExtended ? 4 : 2)}
                      empty="In de geselecteerde voorbeelden is geen duidelijke overlap gevonden."
                    />
                  </section>
                  <section>
                    <p className="kicker mb-3">Waar het verschilt</p>
                    <EvidenceList
                      items={comparison.differences.slice(0, isExtended ? 4 : 2)}
                      empty="In de geselecteerde voorbeelden is geen duidelijk verschil gevonden."
                    />
                  </section>
                </div>
              </details>
            </article>
          );
        })}
      </div>

      <p className="mt-6 max-w-3xl text-xs text-ink-muted leading-relaxed">
        Geen partijstandpunt betekent niet automatisch dat de partij het ermee
        eens of oneens is. De selectie hierboven is een transparante
        vergelijking van bronnen en antwoorden, geen ranglijst van wat je zou
        moeten stemmen. Open de bron bij een stelling om de context zelf te
        lezen.
      </p>
    </div>
  );
}
