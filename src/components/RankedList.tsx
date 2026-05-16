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
    <ol className="divide-y divide-rule border-y border-rule">
      {shown.map((m, idx) => (
        <li
          key={m.item.id}
          className={`flex items-center justify-between gap-4 py-3 ${
            highlightFirst && idx === 0 ? "bg-accent-soft/40 px-3 -mx-3" : ""
          }`}
        >
          <div className="flex items-baseline gap-3 min-w-0">
            <span className="serif text-sm text-ink-muted tabular-nums w-6">
              {idx + 1}.
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink truncate">{m.item.primary}</p>
              {m.item.secondary && (
                <p className="text-xs text-ink-muted truncate">{m.item.secondary}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block w-24 h-1.5 bg-paper-200">
              <div
                className="h-full bg-ink"
                style={{ width: `${m.similarity}%` }}
              />
            </div>
            <span className="tabular-nums text-sm text-ink-muted w-12 text-right">
              {m.similarity}%
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
