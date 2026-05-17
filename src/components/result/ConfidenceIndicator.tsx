import { confidenceBand, confidenceBandLabel } from "@/lib/confidence";
import { cx } from "@/lib/cx";

interface ConfidenceIndicatorProps {
  score: number;
  label?: string;
  size?: "sm" | "md";
}

export function ConfidenceIndicator({
  score,
  label = "Vertrouwen",
  size = "sm",
}: ConfidenceIndicatorProps) {
  const band = confidenceBand(score);
  const bandLabel = confidenceBandLabel(band);
  const filled = Math.round((Math.max(0, Math.min(100, score)) / 100) * 5);
  const dots = Array.from({ length: 5 }).map((_, i) => i < filled);

  return (
    <div
      className={cx(
        "inline-flex items-center gap-3 border border-rule px-3 py-1.5",
        size === "md" ? "text-sm" : "text-xs",
      )}
      title={`${bandLabel} · score ${score}/100`}
    >
      <span
        className={cx(
          "mono tracking-wider text-ink-muted",
          size === "md" ? "text-[0.7rem]" : "text-[0.62rem]",
        )}
      >
        {label.toUpperCase()}
      </span>
      <span aria-hidden className="flex items-center gap-1">
        {dots.map((on, i) => (
          <span
            key={i}
            className={cx(
              "block w-1.5 h-1.5 rounded-full",
              on
                ? band === "hoog"
                  ? "bg-navy"
                  : band === "gemiddeld"
                    ? "bg-ink"
                    : "bg-ink-muted"
                : "bg-rule",
            )}
          />
        ))}
      </span>
      <span className="capitalize text-ink-2">{band}</span>
      <span className="sr-only">
        Vertrouwen-score: {score} van 100, niveau {bandLabel.toLowerCase()}.
      </span>
    </div>
  );
}
