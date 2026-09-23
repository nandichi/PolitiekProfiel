import { useId } from "react";
import { cx } from "@/lib/cx";

interface FiveAxisMarkProps {
  title?: string;
  className?: string;
}

const Y_POSITIONS = [14, 32, 50, 68, 86] as const;
const X_POSITIONS = [38, 62, 48, 71, 29] as const;

export function FiveAxisMark({
  title = "Vijf onafhankelijke politieke meetassen",
  className,
}: FiveAxisMarkProps) {
  const titleId = useId();

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-labelledby={titleId}
      className={cx("h-auto w-full", className)}
    >
      <title id={titleId}>{title}</title>
      {Y_POSITIONS.map((y, index) => {
        const x = X_POSITIONS[index];
        return (
          <g key={y} data-axis={index + 1}>
            <line
              x1="4"
              x2="96"
              y1={y}
              y2={y}
              vectorEffect="non-scaling-stroke"
              className="stroke-rule-strong"
            />
            {index === 0 && (
              <circle cx={x} cy={y} r="3.5" className="fill-signal" />
            )}
            {index === 1 && (
              <rect
                x={x - 3.5}
                y={y - 3.5}
                width="7"
                height="7"
                className="fill-ink"
              />
            )}
            {index === 2 && (
              <rect
                x={x - 3.5}
                y={y - 3.5}
                width="7"
                height="7"
                transform={`rotate(45 ${x} ${y})`}
                className="fill-canvas stroke-ink"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {index === 3 && (
              <path
                d={`M ${x} ${y - 4.5} L ${x + 4.5} ${y + 3.5} L ${x - 4.5} ${y + 3.5} Z`}
                className="fill-signal"
              />
            )}
            {index === 4 && (
              <path
                d={`M ${x - 4} ${y} H ${x + 4} M ${x} ${y - 4} V ${y + 4}`}
                className="stroke-ink stroke-[1.75]"
                vectorEffect="non-scaling-stroke"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
