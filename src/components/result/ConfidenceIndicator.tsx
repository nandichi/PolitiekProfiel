import { confidenceBand, confidenceBandLabel } from "@/lib/confidence";
import { cx } from "@/lib/cx";

interface ConfidenceIndicatorProps {
  score: number;
  label?: string;
  size?: "sm" | "md";
}

export function ConfidenceIndicator({
  score,
  label = "Duidelijkheid van dit patroon",
  size = "sm",
}: ConfidenceIndicatorProps) {
  const band = confidenceBand(score);
  const bandLabel = confidenceBandLabel(band);
  const clamped = Math.max(0, Math.min(100, score));
  const filled = Math.round((clamped / 100) * 5);

  return (
    <div
      className={cx(
        "inline-grid max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border border-rule px-3 py-2",
        size === "md" ? "text-sm" : "text-xs",
      )}
      title={bandLabel + ", score " + score + " van 100"}
    >
      <span
        className={cx(
          "mono min-w-0 tracking-[0.1em] text-text-muted [overflow-wrap:anywhere]",
          size === "md" ? "text-[0.68rem]" : "text-[0.6rem]",
        )}
      >
        {label.toUpperCase()}
      </span>
      <span className="font-semibold capitalize text-ink">{band}</span>
      <span
        aria-hidden
        className="col-span-2 grid h-2 grid-cols-5 items-end gap-1"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cx(
              "block border border-rule-strong",
              index < filled ? "bg-chart-marker" : "bg-canvas-raised",
            )}
            style={{ height: 3 + index }}
          />
        ))}
      </span>
      <span className="sr-only">
        {label}: {score} van 100, niveau {bandLabel.toLowerCase()}.
      </span>
    </div>
  );
}
