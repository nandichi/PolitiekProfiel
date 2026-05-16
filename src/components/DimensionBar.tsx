"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { dimensionMeta, type DimensionId } from "@/lib/dimensions";
import { CountUp } from "@/components/motion/CountUp";

interface DimensionBarProps {
  dimension: DimensionId;
  value: number;
  compareValue?: number;
  compareLabel?: string;
  index?: number;
}

const TICKS = [-100, -50, 0, 50, 100];

export function DimensionBar({
  dimension,
  value,
  compareValue,
  compareLabel,
  index,
}: DimensionBarProps) {
  const meta = dimensionMeta(dimension);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const userLeft = (value + 100) / 2;
  const compareLeft =
    compareValue !== undefined ? (compareValue + 100) / 2 : null;

  return (
    <div ref={ref} className="py-7 border-b border-rule last:border-b-0">
      {/* Header row: index, label, score */}
      <div className="flex items-start justify-between gap-6 mb-5">
        <div className="flex items-baseline gap-4 min-w-0">
          {index !== undefined && (
            <span className="index-num text-xs hidden sm:inline">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <div className="min-w-0">
            <p className="kicker mb-1.5">{meta.label}</p>
            <h3 className="display text-xl md:text-2xl leading-tight text-ink">
              {meta.poleNegative.label}
              <span className="text-ink-subtle font-light mx-2">/</span>
              {meta.polePositive.label}
            </h3>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="kicker mb-1 hidden sm:block">Score</p>
          <span className="display tabular-nums text-3xl md:text-4xl text-ink leading-none">
            <CountUp value={value} />
          </span>
        </div>
      </div>

      {/* Voltmeter */}
      <div className="relative h-12 select-none">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[6px] bg-paper-100 border-y border-rule" />
        {/* Center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rule-strong" />

        {/* Tickmarks */}
        {TICKS.map((tick) => {
          const left = ((tick + 100) / 200) * 100;
          const isCenter = tick === 0;
          return (
            <div
              key={tick}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              style={{ left: `${left}%`, transform: "translateX(-50%)" }}
              aria-hidden
            >
              <div
                className={`w-px ${
                  isCenter ? "h-full bg-rule-strong" : "h-2.5 bg-rule-strong mt-[18px]"
                }`}
              />
            </div>
          );
        })}

        {/* Compare marker */}
        {compareLeft !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.45 }}
            className="absolute top-1 bottom-1 pointer-events-none"
            style={{ left: `${compareLeft}%`, transform: "translateX(-50%)" }}
          >
            <svg
              width="2"
              height="100%"
              className="block"
              aria-hidden
              preserveAspectRatio="none"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100%"
                stroke="var(--color-terra)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </svg>
          </motion.div>
        )}

        {/* User marker */}
        <motion.div
          initial={{ left: "50%", opacity: 0 }}
          animate={
            inView
              ? { left: `${userLeft}%`, opacity: 1 }
              : { left: "50%", opacity: 0 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  left: { type: "spring", stiffness: 220, damping: 26, delay: 0.1 },
                  opacity: { duration: 0.2, delay: 0.1 },
                }
          }
          style={{ transform: "translateX(-50%)" }}
          className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
        >
          <div className="w-2 h-2 bg-ink rotate-45" />
          <div className="w-[3px] flex-1 bg-ink" />
          <div className="w-2 h-2 bg-ink rotate-45" />
        </motion.div>
      </div>

      {/* Tick labels */}
      <div
        className="relative mt-2 mono text-[0.7rem] text-ink-muted tabular-nums"
        aria-hidden
      >
        {TICKS.map((tick) => {
          const left = ((tick + 100) / 200) * 100;
          return (
            <span
              key={tick}
              className="absolute top-0"
              style={{ left: `${left}%`, transform: "translateX(-50%)" }}
            >
              {tick > 0 ? `+${tick}` : tick}
            </span>
          );
        })}
      </div>

      {/* Pole labels */}
      <div className="flex justify-between mt-7 text-xs">
        <span className="text-ink-muted">
          <span className="mono mr-1.5 text-[0.65rem]">←</span>
          {meta.poleNegative.label}
        </span>
        <span className="text-ink-muted">
          {meta.polePositive.label}
          <span className="mono ml-1.5 text-[0.65rem]">→</span>
        </span>
      </div>

      {/* Compare legend */}
      {compareValue !== undefined && compareLabel && (
        <p className="mt-3 text-xs text-ink-muted flex items-center gap-2">
          <svg width="14" height="2" aria-hidden className="inline-block">
            <line
              x1="0"
              y1="1"
              x2="14"
              y2="1"
              stroke="var(--color-terra)"
              strokeWidth="2"
              strokeDasharray="3 2"
            />
          </svg>
          <span>
            {compareLabel}:{" "}
            <span className="mono tabular-nums text-ink">
              {compareValue > 0 ? "+" : ""}
              {compareValue}
            </span>
          </span>
        </p>
      )}
    </div>
  );
}
