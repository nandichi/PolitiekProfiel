import { dimensionMeta } from "@/lib/dimensions";

export interface StanceItem {
  questionId: number;
  statement: string;
  derivedStance?: string | null;
  dimension: string;
  signedValue: number;
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
        const direction = item.signedValue >= 0 ? "eens" : "oneens";
        const intensity = Math.abs(item.signedValue) >= 2 ? "sterk" : "matig";
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
                {item.derivedStance ?? quoteFallback(item.statement, item.signedValue)}
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

function quoteFallback(statement: string, signedValue: number): string {
  if (signedValue > 0) {
    return `Je bent het ${Math.abs(signedValue) === 2 ? "sterk" : "in zekere mate"} eens met de stelling.`;
  }
  return `Je bent het ${Math.abs(signedValue) === 2 ? "sterk" : "in zekere mate"} oneens met de stelling.`;
}
