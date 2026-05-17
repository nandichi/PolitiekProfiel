"use client";

import { motion } from "motion/react";
import type { AnswerValue } from "@/lib/dimensions";
import { cx } from "@/lib/cx";

const OPTIONS: Array<{ value: AnswerValue; label: string; short: string }> = [
  { value: -2, label: "Volledig oneens", short: "−2" },
  { value: -1, label: "Oneens", short: "−1" },
  { value: 0, label: "Neutraal", short: "0" },
  { value: 1, label: "Eens", short: "+1" },
  { value: 2, label: "Volledig eens", short: "+2" },
];

interface QuizSegmentBarProps {
  selected: AnswerValue | null | undefined;
  onChange: (value: AnswerValue) => void;
  disabled?: boolean;
}

export function QuizSegmentBar({
  selected,
  onChange,
  disabled,
}: QuizSegmentBarProps) {
  return (
    <fieldset
      disabled={disabled}
      className="border border-rule-strong bg-paper"
    >
      <legend className="sr-only">Antwoordkeuze</legend>

      {/* Pole labels: altijd zichtbaar zodat op mobiel zonder lange button-
          labels nog duidelijk is welke pool waar zit. */}
      <div className="flex items-baseline justify-between px-3 sm:px-5 pt-3 sm:pt-4 pb-1 sm:pb-2">
        <span className="kicker">← Oneens</span>
        <span className="kicker">Eens →</span>
      </div>

      <div
        role="radiogroup"
        aria-label="Antwoord op de stelling"
        className="grid grid-cols-5 relative"
      >
        {OPTIONS.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.value)}
              className={cx(
                "relative min-w-0 px-1 sm:px-2 py-4 sm:py-6 text-center transition-colors group focus:outline-none",
                isSelected ? "text-paper" : "text-ink hover:bg-paper-50",
              )}
            >
              {isSelected && (
                <motion.span
                  layoutId="quiz-segment-selected"
                  className="absolute inset-0 bg-ink"
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 30,
                  }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center gap-1 sm:gap-1.5">
                <span
                  className={cx(
                    "mono text-[0.78rem] tabular-nums tracking-wider",
                    isSelected ? "text-paper" : "text-ink-muted",
                  )}
                >
                  {opt.short}
                </span>
                {/* Volledige label vanaf sm; daaronder is te krap voor 5 kolommen */}
                <span
                  className={cx(
                    "hidden sm:block text-[0.78rem] sm:text-[0.85rem] leading-tight font-medium",
                    isSelected ? "text-paper" : "text-ink",
                  )}
                >
                  {opt.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Track underneath */}
      <div className="px-3 sm:px-5 pb-3 sm:pb-4 pt-1">
        <div className="relative h-px bg-rule">
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-1 h-2 bg-rule-strong" />
        </div>
      </div>
    </fieldset>
  );
}
