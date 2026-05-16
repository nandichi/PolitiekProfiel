import { dimensionMeta, type DimensionId } from "@/lib/dimensions";

interface DimensionBarProps {
  dimension: DimensionId;
  value: number;
  compareValue?: number;
  compareLabel?: string;
}

export function DimensionBar({
  dimension,
  value,
  compareValue,
  compareLabel,
}: DimensionBarProps) {
  const meta = dimensionMeta(dimension);
  const left = (value + 100) / 2; // -100..100 -> 0..100 percentage
  const compareLeft =
    compareValue !== undefined ? (compareValue + 100) / 2 : null;

  return (
    <div className="py-5 border-b border-rule last:border-b-0">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <p className="kicker">{meta.label}</p>
          <h3 className="serif text-lg leading-tight mt-1">{meta.shortLabel}</h3>
        </div>
        <span className="serif text-2xl tabular-nums text-ink">
          {value > 0 ? "+" : ""}
          {value}
        </span>
      </div>
      <div className="relative h-9 bg-paper-100 border border-rule">
        {/* center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rule-strong" />
        {/* compare marker (politici/landen) */}
        {compareLeft !== null && (
          <div
            className="absolute top-0 bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${compareLeft}%` }}
          >
            <div className="w-px h-full bg-warm/80" />
          </div>
        )}
        {/* user marker */}
        <div
          className="absolute top-0 bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: `${left}%` }}
        >
          <div className="w-[3px] h-full bg-ink" />
        </div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-ink-muted">
        <span>← {meta.poleNegative.label}</span>
        <span>{meta.polePositive.label} →</span>
      </div>
      {compareValue !== undefined && compareLabel && (
        <p className="mt-2 text-xs text-ink-muted">
          <span className="inline-block w-2 h-2 bg-warm align-middle mr-1.5" />
          {compareLabel}: {compareValue > 0 ? "+" : ""}
          {compareValue}
        </p>
      )}
    </div>
  );
}
