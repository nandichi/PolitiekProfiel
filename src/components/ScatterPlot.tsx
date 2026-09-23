"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { dimensionMeta, type DimensionId } from "@/lib/dimensions";
import { AxisSelect } from "@/components/viz/AxisSelect";
import { VizTooltip } from "@/components/viz/Tooltip";
import { MeasureMarker } from "@/components/viz/MeasureMarker";

export interface ScatterPoint {
  id: string;
  label: string;
  sublabel?: string;
  vector: Record<DimensionId, number>;
}

interface ScatterPlotProps {
  user: Record<DimensionId, number>;
  points: ScatterPoint[];
  initialX?: DimensionId;
  initialY?: DimensionId;
  userLabel?: string;
}

const CHART_SIZE = 600;
const PADDING = 52;
const INNER = CHART_SIZE - PADDING * 2;
const HALF = CHART_SIZE / 2;

function toPx(value: number): number {
  const clamped = Math.max(-100, Math.min(100, value));
  return PADDING + ((clamped + 100) / 200) * INNER;
}

function signed(value: number): string {
  return (value > 0 ? "+" : "") + value;
}

export function ScatterPlot({
  user,
  points,
  initialX = "economic",
  initialY = "social",
  userLabel = "Jij",
}: ScatterPlotProps) {
  const [xDim, setXDim] = useState<DimensionId>(initialX);
  const [yDim, setYDim] = useState<DimensionId>(initialY);
  const reduce = useReducedMotion();
  const xMeta = dimensionMeta(xDim);
  const yMeta = dimensionMeta(yDim);
  const transition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 220, damping: 28 };

  const userPos = useMemo(
    () => ({
      x: toPx(user[xDim]),
      y: CHART_SIZE - toPx(user[yDim]),
    }),
    [user, xDim, yDim],
  );

  const placed = useMemo(
    () =>
      points.map((point) => {
        const x = toPx(point.vector[xDim]);
        const y = CHART_SIZE - toPx(point.vector[yDim]);
        return {
          ...point,
          x,
          y,
          distance: Math.hypot(x - userPos.x, y - userPos.y),
        };
      }),
    [points, xDim, yDim, userPos.x, userPos.y],
  );

  const nearestIds = useMemo(
    () =>
      [...placed]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map((point) => point.id),
    [placed],
  );

  return (
    <div className="min-w-0 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AxisSelect
          value={xDim}
          onChange={setXDim}
          label="Horizontale as"
          disabledIds={[yDim]}
        />
        <AxisSelect
          value={yDim}
          onChange={setYDim}
          label="Verticale as"
          disabledIds={[xDim]}
        />
      </div>

      <div className="border border-rule bg-canvas-raised p-2 sm:p-3">
        <svg
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label={
            "Vergelijking op " + xMeta.label + " en " + yMeta.label
          }
        >
          <rect
            x={PADDING}
            y={PADDING}
            width={INNER}
            height={INNER}
            fill="var(--color-canvas-raised)"
            stroke="var(--color-rule-strong)"
            strokeWidth="1.5"
          />

          {[25, 75].flatMap((percent) => [
            <line
              key={"vertical-" + percent}
              x1={PADDING + (INNER * percent) / 100}
              y1={PADDING}
              x2={PADDING + (INNER * percent) / 100}
              y2={CHART_SIZE - PADDING}
              stroke="var(--color-rule)"
              strokeDasharray="2 6"
            />,
            <line
              key={"horizontal-" + percent}
              x1={PADDING}
              y1={PADDING + (INNER * percent) / 100}
              x2={CHART_SIZE - PADDING}
              y2={PADDING + (INNER * percent) / 100}
              stroke="var(--color-rule)"
              strokeDasharray="2 6"
            />,
          ])}

          <line
            x1={PADDING}
            y1={HALF}
            x2={CHART_SIZE - PADDING}
            y2={HALF}
            stroke="var(--color-rule-strong)"
            strokeWidth="1.5"
          />
          <line
            x1={HALF}
            y1={PADDING}
            x2={HALF}
            y2={CHART_SIZE - PADDING}
            stroke="var(--color-rule-strong)"
            strokeWidth="1.5"
          />

          {[-100, 0, 100].map((value) => (
            <g key={"x-tick-" + value}>
              <line
                x1={toPx(value)}
                y1={HALF - 5}
                x2={toPx(value)}
                y2={HALF + 5}
                stroke="var(--color-rule-strong)"
              />
              <text
                x={toPx(value)}
                y={CHART_SIZE - 24}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontFamily="var(--font-mono)"
                fontSize="11"
              >
                {signed(value)}
              </text>
            </g>
          ))}
          {[-100, 0, 100].map((value) => (
            <g key={"y-tick-" + value}>
              <line
                x1={HALF - 5}
                y1={CHART_SIZE - toPx(value)}
                x2={HALF + 5}
                y2={CHART_SIZE - toPx(value)}
                stroke="var(--color-rule-strong)"
              />
              <text
                x="24"
                y={CHART_SIZE - toPx(value) + 4}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontFamily="var(--font-mono)"
                fontSize="11"
              >
                {signed(value)}
              </text>
            </g>
          ))}

          {placed
            .filter((point) => nearestIds.includes(point.id))
            .map((point) => (
              <motion.line
                key={"line-" + point.id}
                initial={false}
                animate={{
                  x1: userPos.x,
                  y1: userPos.y,
                  x2: point.x,
                  y2: point.y,
                }}
                transition={transition}
                stroke="var(--color-signal)"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                opacity="0.7"
              />
            ))}

          {placed.map((point) => {
            const nearest = nearestIds.includes(point.id);
            return (
              <VizTooltip
                key={point.id}
                content={
                  <div className="max-w-56">
                    <div className="font-semibold text-canvas">{point.label}</div>
                    {point.sublabel ? (
                      <div className="mt-1 text-[0.65rem] leading-snug text-canvas/75 [overflow-wrap:anywhere]">
                        {point.sublabel}
                      </div>
                    ) : null}
                    <div className="mt-1.5 text-[0.62rem] tracking-wider text-canvas/75">
                      {signed(point.vector[xDim])}, {signed(point.vector[yDim])}
                    </div>
                  </div>
                }
              >
                <motion.g
                  initial={false}
                  animate={{ x: point.x, y: point.y }}
                  transition={transition}
                  className="cursor-pointer outline-none"
                  role="img"
                  tabIndex={0}
                  aria-label={
                    point.label +
                    ": " +
                    signed(point.vector[xDim]) +
                    " op " +
                    xMeta.label +
                    ", " +
                    signed(point.vector[yDim]) +
                    " op " +
                    yMeta.label
                  }
                  whileHover={reduce ? undefined : { scale: 1.25 }}
                  whileFocus={reduce ? undefined : { scale: 1.25 }}
                >
                  {nearest ? (
                    <rect
                      x="-7"
                      y="-7"
                      width="14"
                      height="14"
                      fill="var(--color-canvas-raised)"
                      stroke="var(--color-signal)"
                      strokeWidth="3"
                    />
                  ) : (
                    <circle
                      cx="0"
                      cy="0"
                      r="5.5"
                      fill="var(--color-canvas-raised)"
                      stroke="var(--color-rule-strong)"
                      strokeWidth="2"
                    />
                  )}
                </motion.g>
              </VizTooltip>
            );
          })}

          <motion.g
            initial={false}
            animate={{ x: userPos.x, y: userPos.y }}
            transition={transition}
            aria-label={userLabel}
          >
            <path
              d="M0 -14 14 0 0 14 -14 0Z"
              fill="var(--color-canvas-raised)"
              stroke="var(--color-chart-marker)"
              strokeWidth="2.5"
            />
            <path
              d="M-7 0H7M0-7V7"
              stroke="var(--color-chart-marker)"
              strokeWidth="2"
            />
            <text
              x="20"
              y="4"
              fill="var(--color-ink)"
              fontFamily="var(--font-sans)"
              fontSize="13"
              fontWeight="700"
            >
              {userLabel}
            </text>
          </motion.g>
        </svg>
      </div>

      <div className="grid gap-3 border-t border-rule pt-4 text-xs text-text-muted sm:grid-cols-2">
        <AxisPoles
          axis="Horizontaal"
          negative={xMeta.poleNegative.label}
          positive={xMeta.polePositive.label}
        />
        <AxisPoles
          axis="Verticaal"
          negative={yMeta.poleNegative.label}
          positive={yMeta.polePositive.label}
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-3 text-xs text-text-muted">
        <span className="inline-flex items-center gap-2">
          <MeasureMarker shape="diamond" size={12} className="text-chart-marker" />
          {userLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <MeasureMarker shape="square" size={12} className="text-signal" />
          Drie dichtste punten
        </span>
        <span className="inline-flex items-center gap-2">
          <MeasureMarker shape="circle" size={11} className="text-rule-strong" />
          Overige punten
        </span>
      </div>
    </div>
  );
}

function AxisPoles({
  axis,
  negative,
  positive,
}: {
  axis: string;
  negative: string;
  positive: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mono text-[0.6rem] tracking-[0.12em] text-text-muted">
        {axis.toUpperCase()}
      </p>
      <p
        lang="nl"
        className="mt-1 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 leading-snug text-ink-raised [hyphens:auto] [overflow-wrap:anywhere]"
      >
        <span>← {negative}</span>
        <span aria-hidden className="text-rule-strong">
          /
        </span>
        <span className="text-right">{positive} →</span>
      </p>
    </div>
  );
}
