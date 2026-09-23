import { DIMENSIONS } from "@/lib/dimensions";
import type { DimensionScores } from "@/lib/scoring";
import { cx } from "@/lib/cx";
import {
  MeasureMarker,
  dimensionMarkerShape,
} from "@/components/viz/MeasureMarker";

interface MiniVectorProps {
  vector: DimensionScores;
  compareVector?: DimensionScores;
  className?: string;
  showLabels?: boolean;
  size?: "sm" | "md";
}

function position(value: number): number {
  return (Math.max(-100, Math.min(100, value)) + 100) / 2;
}

/** Compact, server-rendered view of five independent measurements. */
export function MiniVector({
  vector,
  compareVector,
  className,
  showLabels = false,
  size = "md",
}: MiniVectorProps) {
  return (
    <div className={cx("min-w-0", className)}>
      <ul className="grid grid-cols-5 gap-1.5 sm:gap-2 md:gap-3">
        {DIMENSIONS.map((dimension) => {
          const value = vector[dimension.id];
          const compare = compareVector?.[dimension.id];
          const markerShape = dimensionMarkerShape(dimension.id);
          return (
            <li
              key={dimension.id}
              className="min-w-0"
              aria-label={dimension.label + ": " + value}
            >
              <div
                className={cx(
                  "relative",
                  size === "sm" ? "h-5" : "h-6",
                )}
                aria-hidden
              >
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-chart-track" />
                <span className="absolute inset-x-0 top-[calc(50%+3px)] border-t border-dotted border-rule" />
                <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-rule-strong" />
                {compare !== undefined ? (
                  <span
                    className="absolute inset-y-0 -translate-x-1/2 border-l border-dashed border-signal text-signal"
                    style={{ left: position(compare) + "%" }}
                  >
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 bg-canvas">
                      <MeasureMarker shape="square" size={7} />
                    </span>
                  </span>
                ) : null}
                <span
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas p-px text-chart-marker"
                  style={{ left: position(value) + "%" }}
                >
                  <MeasureMarker
                    shape={markerShape}
                    className="bg-ink [background-color:transparent]"
                    size={size === "sm" ? 9 : 11}
                  />
                </span>
              </div>
              {showLabels ? (
                <p className="mono mt-1 text-center text-[0.52rem] tracking-[0.05em] text-text-muted [overflow-wrap:anywhere] sm:text-[0.58rem]">
                  {dimension.shortLabel.toUpperCase()}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
