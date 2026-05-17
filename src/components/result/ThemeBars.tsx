"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { THEMES, type ThemeId, type ThemeScores } from "@/lib/themes";

const TICKS = [-100, 0, 100];

interface ThemeBarsProps {
  scores: ThemeScores;
}

export function ThemeBars({ scores }: ThemeBarsProps) {
  return (
    <div className="border-t border-rule">
      {THEMES.map((t, i) => (
        <ThemeRow
          key={t.id}
          theme={t.id}
          value={Number.isFinite(scores[t.id]) ? scores[t.id] : 0}
          index={i}
        />
      ))}
    </div>
  );
}

function ThemeRow({
  theme,
  value,
  index,
}: {
  theme: ThemeId;
  value: number;
  index: number;
}) {
  const meta = THEMES.find((t) => t.id === theme)!;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  const left = ((value + 100) / 200) * 100;
  const sign = value > 0 ? "+" : value === 0 ? "" : "";

  return (
    <div ref={ref} className="py-6 border-b border-rule last:border-b-0">
      <div className="flex items-start justify-between gap-5 mb-4">
        <div className="flex items-baseline gap-4 min-w-0">
          <span className="index-num text-xs hidden sm:inline">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="kicker mb-1">{meta.label}</p>
            <h3
              lang="nl"
              className="display text-lg md:text-xl leading-tight text-ink wrap-break-word [hyphens:auto]"
            >
              {meta.poleNegative.label}
              <span className="text-ink-subtle font-light mx-2">/</span>
              {meta.polePositive.label}
            </h3>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="display tabular-nums text-2xl md:text-3xl text-ink leading-none">
            {sign}
            {value}
          </span>
        </div>
      </div>

      <div className="relative h-7 select-none">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[5px] bg-paper-100 border-y border-rule" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-rule-strong" />
        {TICKS.map((t) => {
          const x = ((t + 100) / 200) * 100;
          return (
            <div
              key={t}
              className="absolute top-0 bottom-0 w-px bg-rule-strong"
              style={{ left: `${x}%`, transform: "translateX(-50%)" }}
              aria-hidden
            />
          );
        })}
        <motion.div
          initial={{ left: "50%", opacity: 0 }}
          animate={
            inView
              ? { left: `${left}%`, opacity: 1 }
              : { left: "50%", opacity: 0 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  left: { type: "spring", stiffness: 220, damping: 26 },
                  opacity: { duration: 0.2 },
                }
          }
          style={{ transform: "translateX(-50%)" }}
          className="absolute top-0 bottom-0 flex items-center pointer-events-none"
        >
          <span className="block w-2.5 h-2.5 rotate-45 bg-ink" />
        </motion.div>
      </div>

      <div className="mt-2 flex justify-between text-xs text-ink-muted">
        <span>
          <span className="mono mr-1.5 text-[0.65rem]">←</span>
          {meta.poleNegative.label}
        </span>
        <span className="text-right">
          {meta.polePositive.label}
          <span className="mono ml-1.5 text-[0.65rem]">→</span>
        </span>
      </div>
    </div>
  );
}
