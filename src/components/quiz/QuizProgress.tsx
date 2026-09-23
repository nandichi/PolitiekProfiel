"use client";

import { motion, useReducedMotion } from "motion/react";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const reduceMotion = useReducedMotion();
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(1, current), safeTotal);
  const scale = safeCurrent / safeTotal;
  const fillClass = "absolute inset-y-0 left-0 w-full origin-left bg-signal";

  return (
    <div className="w-full" aria-label="Voortgang van de quiz">
      <p className="mono text-sm font-medium tabular-nums text-ink">
        Vraag {safeCurrent} van {safeTotal}
      </p>
      <div
        role="progressbar"
        aria-label={`Vraag ${safeCurrent} van ${safeTotal}`}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
        className="relative mt-3 h-1.5 w-full overflow-hidden bg-chart-track"
      >
        {reduceMotion ? (
          <span className={fillClass} style={{ transform: `scaleX(${scale})` }} />
        ) : (
          <motion.span
            className={fillClass}
            initial={false}
            animate={{ scaleX: scale }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          />
        )}
      </div>
    </div>
  );
}
