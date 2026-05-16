"use client";

import { useMemo, useState } from "react";
import {
  DIMENSIONS,
  dimensionMeta,
  type DimensionId,
} from "@/lib/dimensions";

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

const CHART_SIZE = 560;
const PADDING = 32;
const INNER = CHART_SIZE - PADDING * 2;

function toPx(value: number, axisLength: number): number {
  return PADDING + ((value + 100) / 200) * axisLength;
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
  const [hovered, setHovered] = useState<string | null>(null);

  const xMeta = dimensionMeta(xDim);
  const yMeta = dimensionMeta(yDim);

  const placed = useMemo(
    () =>
      points.map((p) => ({
        ...p,
        cx: toPx(p.vector[xDim], INNER),
        cy: CHART_SIZE - toPx(p.vector[yDim], INNER),
      })),
    [points, xDim, yDim],
  );

  const userPos = {
    cx: toPx(user[xDim], INNER),
    cy: CHART_SIZE - toPx(user[yDim], INNER),
  };

  const hoveredPoint = placed.find((p) => p.id === hovered);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="kicker">Horizontale as</span>
          <select
            value={xDim}
            onChange={(e) => setXDim(e.target.value as DimensionId)}
            className="mt-1 w-full border border-ink-muted bg-paper px-3 py-2 text-ink"
          >
            {DIMENSIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="kicker">Verticale as</span>
          <select
            value={yDim}
            onChange={(e) => setYDim(e.target.value as DimensionId)}
            className="mt-1 w-full border border-ink-muted bg-paper px-3 py-2 text-ink"
          >
            {DIMENSIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
          className="w-full h-auto bg-paper-100 border border-rule"
          role="img"
          aria-label={`Scatterplot van ${xMeta.label} en ${yMeta.label}`}
        >
          {/* grid */}
          <line
            x1={PADDING}
            y1={CHART_SIZE / 2}
            x2={CHART_SIZE - PADDING}
            y2={CHART_SIZE / 2}
            stroke="var(--color-rule-strong)"
          />
          <line
            x1={CHART_SIZE / 2}
            y1={PADDING}
            x2={CHART_SIZE / 2}
            y2={CHART_SIZE - PADDING}
            stroke="var(--color-rule-strong)"
          />
          {[25, 50, 75].map((p) => (
            <line
              key={`vx${p}`}
              x1={PADDING + (INNER * p) / 100}
              y1={PADDING}
              x2={PADDING + (INNER * p) / 100}
              y2={CHART_SIZE - PADDING}
              stroke="var(--color-rule)"
              strokeDasharray="2 3"
            />
          ))}
          {[25, 50, 75].map((p) => (
            <line
              key={`vy${p}`}
              x1={PADDING}
              y1={PADDING + (INNER * p) / 100}
              x2={CHART_SIZE - PADDING}
              y2={PADDING + (INNER * p) / 100}
              stroke="var(--color-rule)"
              strokeDasharray="2 3"
            />
          ))}
          {/* axis labels */}
          <text
            x={PADDING + 4}
            y={CHART_SIZE / 2 - 6}
            fontSize="11"
            fill="var(--color-ink-muted)"
          >
            ← {xMeta.poleNegative.label}
          </text>
          <text
            x={CHART_SIZE - PADDING - 4}
            y={CHART_SIZE / 2 - 6}
            fontSize="11"
            textAnchor="end"
            fill="var(--color-ink-muted)"
          >
            {xMeta.polePositive.label} →
          </text>
          <text
            x={CHART_SIZE / 2 + 6}
            y={PADDING + 14}
            fontSize="11"
            fill="var(--color-ink-muted)"
          >
            ↑ {yMeta.polePositive.label}
          </text>
          <text
            x={CHART_SIZE / 2 + 6}
            y={CHART_SIZE - PADDING - 6}
            fontSize="11"
            fill="var(--color-ink-muted)"
          >
            ↓ {yMeta.poleNegative.label}
          </text>

          {/* politicians/countries */}
          {placed.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.cx}
                cy={p.cy}
                r="6"
                fill="var(--color-warm)"
                opacity="0.85"
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered((h) => (h === p.id ? null : h))}
              />
              {hovered === p.id && (
                <g>
                  <rect
                    x={Math.min(p.cx + 8, CHART_SIZE - 180)}
                    y={Math.max(p.cy - 32, 8)}
                    width={170}
                    height={28}
                    fill="var(--color-paper)"
                    stroke="var(--color-rule-strong)"
                  />
                  <text
                    x={Math.min(p.cx + 16, CHART_SIZE - 172)}
                    y={Math.max(p.cy - 14, 26)}
                    fontSize="12"
                    fill="var(--color-ink)"
                  >
                    {p.label}
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* user marker */}
          <g>
            <circle
              cx={userPos.cx}
              cy={userPos.cy}
              r="12"
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth="2"
            />
            <circle cx={userPos.cx} cy={userPos.cy} r="4" fill="var(--color-ink)" />
            <text
              x={userPos.cx + 16}
              y={userPos.cy + 4}
              fontSize="12"
              fontWeight="600"
              fill="var(--color-ink)"
            >
              {userLabel}
            </text>
          </g>
        </svg>
      </div>

      {hoveredPoint && (
        <p className="text-sm text-ink-muted">
          {hoveredPoint.label}
          {hoveredPoint.sublabel ? ` — ${hoveredPoint.sublabel}` : ""}
        </p>
      )}
    </div>
  );
}
