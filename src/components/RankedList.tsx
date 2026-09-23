import { cx } from "@/lib/cx";
import { type RankedMatch, type VectorTarget } from "@/lib/scoring";

interface ItemWithMeta extends VectorTarget {
  id: string;
  primary: string;
  secondary?: string;
}

export function RankedList<T extends ItemWithMeta>({
  matches,
  limit,
  highlightFirst = false,
}: {
  matches: RankedMatch<T>[];
  limit?: number;
  highlightFirst?: boolean;
}) {
  const shown = limit ? matches.slice(0, limit) : matches;

  return (
    <ol className="relative border-t border-rule">
      {shown.map((match, index) => {
        const highlighted = highlightFirst && index < 3;
        const similarity = Math.max(0, Math.min(100, match.similarity));
        return (
          <li
            key={match.item.id}
            className={cx(
              "relative grid min-w-0 grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-rule py-3.5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-3",
              highlighted ? "pl-3" : "pl-0",
            )}
          >
            {highlighted ? (
              <span
                aria-hidden
                className="absolute inset-y-2 left-0 w-0.5 bg-signal"
              />
            ) : null}
            <span
              className={cx(
                "mono text-[0.68rem] tabular-nums",
                highlighted ? "font-semibold text-ink" : "text-text-muted",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p
                lang="nl"
                className="display text-[1rem] leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere] sm:text-[1.06rem]"
              >
                {match.item.primary}
              </p>
              {match.item.secondary ? (
                <p
                  lang="nl"
                  className="mt-1 line-clamp-2 text-xs leading-snug text-text-muted [hyphens:auto] [overflow-wrap:anywhere]"
                >
                  {match.item.secondary}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span
                aria-hidden
                className="relative hidden h-3 w-16 border-y border-rule xl:block xl:w-24"
              >
                <span className="absolute inset-x-0 top-1/2 border-t border-dotted border-rule-strong" />
                <span
                  className="absolute inset-y-0 left-0 border-r-2 border-chart-marker"
                  style={{ width: similarity + "%" }}
                />
              </span>
              <span className="mono min-w-10 text-right text-xs tabular-nums text-text-muted">
                {similarity}%
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
