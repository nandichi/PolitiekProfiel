import { DIMENSIONS } from "@/lib/dimensions";
import type { DimensionScores } from "@/lib/scoring";
import { cx } from "@/lib/cx";

interface MiniVectorProps {
  vector: DimensionScores;
  /** Optioneel: tweede vector voor side-by-side vergelijking (bv. gebruikersprofiel). */
  compareVector?: DimensionScores;
  className?: string;
  /** Toont dimensiekoppen onder de bars. Default: false. */
  showLabels?: boolean;
  size?: "sm" | "md";
}

/**
 * Server-rendered compacte 5-dimensionale weergave als rijtje voltmeters.
 * Bedoeld voor lijst-cards (politici/partijen/landen overview), niet voor
 * de detail-pagina (gebruik daar `DimensionBar`).
 */
export function MiniVector({
  vector,
  compareVector,
  className,
  showLabels = false,
  size = "md",
}: MiniVectorProps) {
  const barH = size === "sm" ? "h-1" : "h-1.5";
  const trackH = size === "sm" ? "h-3" : "h-4";
  return (
    <div className={cx("space-y-2", className)}>
      <ul className="grid grid-cols-5 gap-2 md:gap-3">
        {DIMENSIONS.map((d) => {
          const v = vector[d.id];
          const userLeft = ((v + 100) / 200) * 100;
          const compare = compareVector?.[d.id];
          const compareLeft =
            compare !== undefined ? ((compare + 100) / 200) * 100 : null;
          return (
            <li key={d.id} className="min-w-0">
              <div className={cx("relative", trackH)}>
                <div
                  className={cx(
                    "absolute inset-x-0 top-1/2 -translate-y-1/2 bg-paper-100 border border-rule",
                    barH,
                  )}
                />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rule-strong" />
                {compareLeft !== null && (
                  <span
                    aria-hidden
                    className="absolute top-0 bottom-0 w-px bg-terra"
                    style={{
                      left: `${compareLeft}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
                <span
                  aria-hidden
                  className="absolute top-0 bottom-0 flex items-center"
                  style={{
                    left: `${userLeft}%`,
                    transform: "translateX(-50%)",
                  }}
                >
                  <span className="block w-2 h-2 bg-ink rotate-45" />
                </span>
              </div>
              {showLabels && (
                <p className="mono text-[0.6rem] tracking-wider text-ink-muted mt-1.5 text-center">
                  {d.shortLabel.toUpperCase()}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
