import { dimensionMeta } from "@/lib/dimensions";

export interface StanceItem {
  questionId: number;
  statement: string;
  derivedStance?: string | null;
  dimension: string;
  /** Dimensie-positie: `direction * value`. Wordt gebruikt voor sortering. */
  signedValue: number;
  /** Oorspronkelijk antwoord van de gebruiker (-2 t/m +2, exclusief 0). */
  value: number;
  weight: number;
  themes?: string[];
}

interface StanceExtractProps {
  items: StanceItem[];
  emptyText?: string;
}

export function StanceExtract({ items, emptyText }: StanceExtractProps) {
  if (items.length === 0) {
    return (
      <p className="text-ink-muted text-sm">
        {emptyText ??
          "We konden geen sterke standpunten distilleren uit je antwoorden. Beantwoord meer stellingen sterk eens of oneens om hier punten te zien."}
      </p>
    );
  }

  return (
    <ol className="space-y-7">
      {items.map((item, i) => {
        const dim = dimensionMeta(item.dimension as Parameters<typeof dimensionMeta>[0]);
        // Tag- en stance-richting baseren we op het oorspronkelijke antwoord
        // (`value`), niet op `signedValue`. Anders kan een +1 antwoord op een
        // stelling met negatieve dimensie-richting verschijnen als "oneens"
        // terwijl de gebruiker eens aanklikte. De sortering blijft wel op
        // signedValue * weight gebeuren (in stance-extract.ts).
        const direction = item.value >= 0 ? "eens" : "oneens";
        const intensity = Math.abs(item.value) >= 2 ? "sterk" : "matig";
        // derivedStance is in de CMS opgeslagen in eens-vorm. Bij een oneens-
        // antwoord (value < 0) zou die zin het tegenovergestelde uitdrukken
        // van wat de gebruiker vindt, dus vallen we dan terug op een correcte
        // negatie-zin. De feitelijke stelling wordt eronder los getoond.
        const stanceText =
          item.value > 0 && item.derivedStance
            ? item.derivedStance
            : agreementFallback(item.value);
        return (
          <li
            key={item.questionId}
            className="grid grid-cols-[auto_1fr] gap-5 border-t border-rule pt-5 first:border-t-0 first:pt-0"
          >
            <span className="mono text-xs tabular-nums text-ink-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="kicker mb-2">
                {dim.shortLabel} · {intensity} {direction}
              </p>
              <p className="display text-lg md:text-xl leading-snug text-ink wrap-break-word [hyphens:auto]">
                {stanceText}
              </p>
              <p className="mt-3 text-xs text-ink-muted italic wrap-break-word">
                Op stelling: &ldquo;{item.statement}&rdquo;
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function agreementFallback(value: number): string {
  const strength = Math.abs(value) === 2 ? "sterk" : "in zekere mate";
  if (value > 0) {
    return `Je bent het ${strength} eens met de stelling.`;
  }
  return `Je bent het ${strength} oneens met de stelling.`;
}
