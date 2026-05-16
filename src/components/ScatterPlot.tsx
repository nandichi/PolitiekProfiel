"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { dimensionMeta, type DimensionId } from "@/lib/dimensions";
import { AxisSelect } from "@/components/viz/AxisSelect";
import { VizTooltip } from "@/components/viz/Tooltip";

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
const PADDING = 44;
const INNER = CHART_SIZE - PADDING * 2;
const HALF = CHART_SIZE / 2;

function toPx(value: number): number {
  return PADDING + ((value + 100) / 200) * INNER;
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

  const xMeta = dimensionMeta(xDim);
  const yMeta = dimensionMeta(yDim);

  const userPos = useMemo(
    () => ({
      cx: toPx(user[xDim]),
      cy: CHART_SIZE - toPx(user[yDim]),
    }),
    [user, xDim, yDim]
  );

  const placed = useMemo(
    () =>
      points.map((p) => {
        const cx = toPx(p.vector[xDim]);
        const cy = CHART_SIZE - toPx(p.vector[yDim]);
        const dx = cx - userPos.cx;
        const dy = cy - userPos.cy;
        const distance = Math.hypot(dx, dy);
        return { ...p, cx, cy, distance };
      }),
    [points, xDim, yDim, userPos.cx, userPos.cy]
  );

  // Top 3 closest for leaderlines / highlights
  const top3Ids = useMemo(() => {
    return [...placed]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((p) => p.id);
  }, [placed]);

  return (
    <div className="space-y-5">
      {/* Axis controls */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          className="w-full h-auto"
          role="img"
          aria-label={`Scatterplot van ${xMeta.label} en ${yMeta.label}`}
        >
          {/* Quadrant shading */}
          <rect
            x={PADDING}
            y={PADDING}
            width={INNER / 2}
            height={INNER / 2}
            fill="var(--color-paper-50)"
          />
          <rect
            x={HALF}
            y={PADDING}
            width={INNER / 2}
            height={INNER / 2}
            fill="var(--color-paper-100)"
            opacity={0.6}
          />
          <rect
            x={PADDING}
            y={HALF}
            width={INNER / 2}
            height={INNER / 2}
            fill="var(--color-paper-100)"
            opacity={0.6}
          />
          <rect
            x={HALF}
            y={HALF}
            width={INNER / 2}
            height={INNER / 2}
            fill="var(--color-paper-50)"
          />

          {/* Outer border */}
          <rect
            x={PADDING}
            y={PADDING}
            width={INNER}
            height={INNER}
            fill="none"
            stroke="var(--color-rule-strong)"
            strokeWidth={1}
          />

          {/* Grid */}
          {[25, 75].map((p) => (
            <line
              key={`vx${p}`}
              x1={PADDING + (INNER * p) / 100}
              y1={PADDING}
              x2={PADDING + (INNER * p) / 100}
              y2={CHART_SIZE - PADDING}
              stroke="var(--color-rule)"
              strokeDasharray="2 4"
            />
          ))}
          {[25, 75].map((p) => (
            <line
              key={`vy${p}`}
              x1={PADDING}
              y1={PADDING + (INNER * p) / 100}
              x2={CHART_SIZE - PADDING}
              y2={PADDING + (INNER * p) / 100}
              stroke="var(--color-rule)"
              strokeDasharray="2 4"
            />
          ))}

          {/* Center axes */}
          <line
            x1={PADDING}
            y1={HALF}
            x2={CHART_SIZE - PADDING}
            y2={HALF}
            stroke="var(--color-rule-strong)"
            strokeWidth={1}
          />
          <line
            x1={HALF}
            y1={PADDING}
            x2={HALF}
            y2={CHART_SIZE - PADDING}
            stroke="var(--color-rule-strong)"
            strokeWidth={1}
          />

          {/* Axis labels - mono. fontSize via inline style (px) zodat de tekst
              NIET meeschaalt met de viewBox; op smalle viewports blijft hij
              leesbaar in plaats van te krimpen tot 5px. */}
          <text
            x={PADDING + 6}
            y={HALF - 8}
            style={{ fontSize: "0.78rem" }}
            fill="var(--color-ink-muted)"
            fontFamily="var(--font-plex)"
            letterSpacing="0.04em"
          >
            ← {xMeta.poleNegative.label.toUpperCase()}
          </text>
          <text
            x={CHART_SIZE - PADDING - 6}
            y={HALF - 8}
            style={{ fontSize: "0.78rem" }}
            textAnchor="end"
            fill="var(--color-ink-muted)"
            fontFamily="var(--font-plex)"
            letterSpacing="0.04em"
          >
            {xMeta.polePositive.label.toUpperCase()} →
          </text>
          <text
            x={HALF + 8}
            y={PADDING + 14}
            style={{ fontSize: "0.78rem" }}
            fill="var(--color-ink-muted)"
            fontFamily="var(--font-plex)"
            letterSpacing="0.04em"
          >
            ↑ {yMeta.polePositive.label.toUpperCase()}
          </text>
          <text
            x={HALF + 8}
            y={CHART_SIZE - PADDING - 6}
            style={{ fontSize: "0.78rem" }}
            fill="var(--color-ink-muted)"
            fontFamily="var(--font-plex)"
            letterSpacing="0.04em"
          >
            ↓ {yMeta.poleNegative.label.toUpperCase()}
          </text>

          {/* Corner coords — alleen op grotere viewports zichtbaar via een
              wrapper-group, omdat ze op mobiel onleesbaar zouden zijn. */}
          <g className="hidden sm:inline">
            {[
              { x: PADDING + 6, y: CHART_SIZE - PADDING - 8, t: "-100,-100" },
              {
                x: CHART_SIZE - PADDING - 6,
                y: CHART_SIZE - PADDING - 8,
                t: "+100,-100",
                anchor: "end" as const,
              },
              { x: PADDING + 6, y: PADDING + 14, t: "-100,+100" },
              {
                x: CHART_SIZE - PADDING - 6,
                y: PADDING + 14,
                t: "+100,+100",
                anchor: "end" as const,
              },
            ].map((c, i) => (
              <text
                key={i}
                x={c.x}
                y={c.y}
                style={{ fontSize: "0.68rem" }}
                fill="var(--color-ink-subtle)"
                fontFamily="var(--font-plex)"
                textAnchor={c.anchor ?? "start"}
              >
                ({c.t})
              </text>
            ))}
          </g>

          {/* Leaderlines top-3 */}
          <AnimatePresence>
            {placed
              .filter((p) => top3Ids.includes(p.id))
              .map((p) => (
                <motion.line
                  key={`line-${p.id}-${xDim}-${yDim}`}
                  x1={userPos.cx}
                  y1={userPos.cy}
                  x2={p.cx}
                  y2={p.cy}
                  stroke="var(--color-navy)"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                />
              ))}
          </AnimatePresence>

          {/* Points */}
          {placed.map((p) => {
            const isTop = top3Ids.includes(p.id);
            return (
              <VizTooltip
                key={`${p.id}-${xDim}-${yDim}`}
                content={
                  <div>
                    <div className="text-paper">{p.label}</div>
                    {p.sublabel && (
                      <div className="text-paper/70 text-[0.65rem] mt-0.5">
                        {p.sublabel}
                      </div>
                    )}
                    <div className="text-paper/70 text-[0.62rem] mt-1 tracking-wider">
                      ({signed(p.vector[xDim])}, {signed(p.vector[yDim])})
                    </div>
                  </div>
                }
              >
                <motion.g
                  className="cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  style={{ originX: `${p.cx}px`, originY: `${p.cy}px` }}
                >
                  <motion.circle
                    layoutId={`pt-${p.id}`}
                    cx={p.cx}
                    cy={p.cy}
                    r={isTop ? 7 : 5.5}
                    fill={isTop ? "var(--color-navy)" : "var(--color-paper)"}
                    stroke="var(--color-navy)"
                    strokeWidth={1.5}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 26,
                    }}
                  />
                </motion.g>
              </VizTooltip>
            );
          })}

          {/* User marker */}
          <motion.g
            layoutId="user-marker"
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            <circle
              cx={userPos.cx}
              cy={userPos.cy}
              r={16}
              fill="var(--color-paper)"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <circle
              cx={userPos.cx}
              cy={userPos.cy}
              r={5}
              fill="var(--color-ink)"
            />
          </motion.g>
          <text
            x={userPos.cx + 22}
            y={userPos.cy + 4}
            style={{ fontSize: "0.85rem" }}
            fontWeight={600}
            fill="var(--color-ink)"
            fontFamily="var(--font-inter)"
          >
            {userLabel}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-muted pt-2 border-t border-rule">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="w-3 h-3 border border-ink rounded-full bg-paper relative"
          >
            <span className="absolute inset-[3px] bg-ink rounded-full" />
          </span>
          Jij
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-navy" />
          Top-3 dichtstbij
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className="w-2.5 h-2.5 rounded-full bg-paper border border-navy"
          />
          Overige
        </span>
      </div>
    </div>
  );
}

function signed(n: number): string {
  return n > 0 ? `+${n}` : `${n}`;
}
