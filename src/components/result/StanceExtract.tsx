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
        // Toon de letterlijke stelling met het daadwerkelijke antwoord erboven.
        // Zo leest de bezoeker terug wat hij koos, zonder een generieke of
        // door taalmodellen geformuleerde conclusie over zijn opvattingen.
        const stanceText = item.statement;
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
              <p className="mt-3 text-xs text-ink-muted">
                Letterlijke stelling uit jouw quiz
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
