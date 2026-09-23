"use client";

import { motion, useReducedMotion } from "motion/react";
import { dimensionMeta, type DimensionId } from "@/lib/dimensions";
import {
  MeasureMarker,
  dimensionMarkerShape,
} from "@/components/viz/MeasureMarker";

interface DimensionBarProps {
  dimension: DimensionId;
  value: number;
  compareValue?: number;
  compareLabel?: string;
  index?: number;
}

const TICKS = [-100, -50, 0, 50, 100];

function position(value: number): number {
  return (Math.max(-100, Math.min(100, value)) + 100) / 2;
}

function signed(value: number): string {
  const rounded = Math.round(value);
  return (rounded > 0 ? "+" : "") + rounded;
}

export function DimensionBar({
  dimension,
  value,
  compareValue,
  compareLabel,
  index,
}: DimensionBarProps) {
  const meta = dimensionMeta(dimension);
  const reduce = useReducedMotion();
  const userLeft = position(value);
  const compareLeft =
    compareValue === undefined ? null : position(compareValue);
  const markerShape = dimensionMarkerShape(dimension);

  return (
    <div
      className="border-b border-rule py-5 last:border-b-0 sm:py-6"
      aria-label={
        meta.label +
        ": " +
        signed(value) +
        ", tussen " +
        meta.poleNegative.label +
        " en " +
        meta.polePositive.label
      }
    >
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          {index !== undefined ? (
            <span className="mono hidden pt-0.5 text-[0.65rem] tabular-nums text-text-muted sm:inline">
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MeasureMarker
                shape={markerShape}
                size={12}
                className="shrink-0 text-chart-marker"
              />
              <p className="kicker">{meta.label}</p>
            </div>
            <h3
              lang="nl"
              className="display mt-1 text-lg leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere] sm:text-xl"
            >
              {meta.poleNegative.label}
              <span aria-hidden className="mx-2 font-normal text-text-muted">
                /
              </span>
              {meta.polePositive.label}
            </h3>
          </div>
        </div>
        <div className="shrink-0 border-l border-rule pl-3 text-right sm:pl-5">
          <span className="mono block text-[0.58rem] tracking-[0.14em] text-text-muted">
            POSITIE
          </span>
          <span className="mono mt-1 block text-xl font-semibold tabular-nums leading-none text-ink sm:text-2xl">
            {signed(value)}
          </span>
        </div>
      </div>

      <div className="relative h-10 select-none" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-chart-track" />
        <div className="absolute inset-x-0 top-[calc(50%+4px)] border-t border-dotted border-rule" />
        {TICKS.map((tick) => (
          <span
            key={tick}
            className={
              "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-rule-strong " +
              (tick === 0 ? "h-7 w-px" : "h-3 w-px")
            }
            style={{ left: position(tick) + "%" }}
          />
        ))}

        {compareLeft !== null ? (
          <div
            className="absolute inset-y-0 -translate-x-1/2 border-l-2 border-dashed border-signal"
            style={{ left: compareLeft + "%" }}
          >
            <span className="absolute left-1/2 top-0 -translate-x-1/2 bg-canvas px-0.5 text-signal">
              <MeasureMarker shape="square" size={9} />
            </span>
          </div>
        ) : null}

        <motion.span
          initial={false}
          animate={{ left: userLeft + "%" }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 240, damping: 28 }
          }
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas p-0.5 text-chart-marker"
        >
          <MeasureMarker shape={markerShape} size={16} />
        </motion.span>
      </div>

      <div
        className="relative mt-1 h-4 mono text-[0.62rem] tabular-nums text-text-muted"
        aria-hidden
      >
        {TICKS.map((tick, index_) => {
          const edge = index_ === 0 || index_ === TICKS.length - 1;
          return (
            <span
              key={tick}
              className="absolute top-0"
              style={
                index_ === 0
                  ? { left: 0 }
                  : index_ === TICKS.length - 1
                    ? { right: 0 }
                    : {
                        left: position(tick) + "%",
                        transform: "translateX(-50%)",
                      }
              }
            >
              {edge || tick === 0 ? signed(tick) : "·"}
            </span>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs leading-snug text-text-muted">
        <span lang="nl" className="min-w-0 [hyphens:auto] [overflow-wrap:anywhere]">
          <span className="mono mr-1" aria-hidden>
            ←
          </span>
          {meta.poleNegative.label}
        </span>
        <span
          lang="nl"
          className="min-w-0 text-right [hyphens:auto] [overflow-wrap:anywhere]"
        >
          {meta.polePositive.label}
          <span className="mono ml-1" aria-hidden>
            →
          </span>
        </span>
      </div>

      {compareValue !== undefined && compareLabel ? (
        <p className="mt-3 flex items-center gap-2 text-xs text-text-muted">
          <span
            aria-hidden
            className="inline-block h-3 w-3 shrink-0 border-2 border-dashed border-signal"
          />
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {compareLabel}: {signed(compareValue)}
          </span>
        </p>
      ) : null}
    </div>
  );
}
