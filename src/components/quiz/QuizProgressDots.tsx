"use client";

import { motion } from "motion/react";
import { DIMENSIONS, type DimensionId } from "@/lib/dimensions";
import { cx } from "@/lib/cx";

interface QuizProgressDotsProps {
  perDimensionTotal: Record<DimensionId, number>;
  perDimensionAnswered: Record<DimensionId, number>;
  currentDimension: DimensionId;
}

export function QuizProgressDots({
  perDimensionTotal,
  perDimensionAnswered,
  currentDimension,
}: QuizProgressDotsProps) {
  return (
    <div className="flex items-center gap-3 md:gap-5">
      {DIMENSIONS.map((d) => {
        const total = perDimensionTotal[d.id] ?? 0;
        const answered = perDimensionAnswered[d.id] ?? 0;
        const pct = total > 0 ? (answered / total) * 100 : 0;
        const isCurrent = d.id === currentDimension;
        return (
          <div
            key={d.id}
            className={cx(
              "flex-1 min-w-0 transition-opacity",
              isCurrent ? "opacity-100" : "opacity-65",
            )}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className={cx(
                  "kicker text-[0.62rem] truncate",
                  isCurrent ? "text-ink" : "text-ink-muted",
                )}
              >
                {d.shortLabel}
              </span>
              <span
                className={cx(
                  "mono text-[0.62rem] tabular-nums shrink-0 ml-2",
                  isCurrent ? "text-ink" : "text-ink-subtle",
                )}
              >
                {answered}/{total}
              </span>
            </div>
            <div className="relative h-[3px] bg-paper-100">
              <motion.div
                className={cx(
                  "absolute inset-y-0 left-0",
                  isCurrent ? "bg-ink" : "bg-ink-muted",
                )}
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 220, damping: 28 }}
              />
              {isCurrent && (
                <motion.div
                  layoutId="dim-progress-active"
                  className="absolute -bottom-1.5 h-1 w-1 bg-ink rotate-45"
                  style={{ left: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
