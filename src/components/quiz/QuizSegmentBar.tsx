"use client";

import { motion, useReducedMotion } from "motion/react";
import type { AnswerValue } from "@/lib/dimensions";
import { cx } from "@/lib/cx";

const OPTIONS: Array<{ value: AnswerValue; label: string; short: string }> = [
  { value: -2, label: "Helemaal oneens", short: "−2" },
  { value: -1, label: "Oneens", short: "−1" },
  { value: 0, label: "Neutraal", short: "0" },
  { value: 1, label: "Eens", short: "+1" },
  { value: 2, label: "Helemaal eens", short: "+2" },
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
  const reduceMotion = useReducedMotion();

  return (
    <fieldset disabled={disabled} className="border-y border-rule-strong">
      <legend className="sr-only">Kies je antwoord</legend>
      <div
        role="radiogroup"
        aria-label="Antwoord op de stelling"
        className="grid grid-cols-1 sm:grid-cols-5"
      >
        {OPTIONS.map((option, index) => {
          const isSelected = selected === option.value;
          const selectedSurface = (
            <span
              aria-hidden
              className="absolute inset-0 bg-ink"
            />
          );

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              className={cx(
                "group relative z-0 flex min-h-11 w-full min-w-0 items-center justify-between gap-4 px-4 py-3 text-left",
                "border-b border-rule last:border-b-0 sm:min-h-24 sm:flex-col sm:justify-center sm:gap-2 sm:border-b-0 sm:border-r sm:px-2 sm:text-center sm:last:border-r-0",
                "transition-colors focus-visible:z-20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-raised",
                isSelected
                  ? "text-canvas-raised"
                  : "text-ink hover:bg-canvas-pressed",
              )}
            >
              {isSelected &&
                (reduceMotion ? (
                  selectedSurface
                ) : (
                  <motion.span
                    aria-hidden
                    layoutId="quiz-segment-selected"
                    className="absolute inset-0 bg-ink"
                    transition={{
                      type: "spring",
                      stiffness: 360,
                      damping: 30,
                    }}
                  />
                ))}

              <span className="relative z-10 flex min-w-0 items-center gap-3 sm:flex-col sm:gap-2">
                <span
                  aria-hidden
                  className={cx(
                    "h-2.5 w-2.5 shrink-0 border",
                    index === 2 && "rotate-45",
                    isSelected
                      ? "border-focus bg-focus"
                      : "border-rule-strong bg-transparent group-hover:border-ink",
                  )}
                />
                <span className="text-[0.95rem] font-semibold leading-tight sm:text-[0.8rem]">
                  {option.label}
                </span>
              </span>
              <span
                aria-hidden
                className={cx(
                  "mono relative z-10 shrink-0 text-[0.68rem] tabular-nums tracking-wider",
                  isSelected ? "text-canvas-raised" : "text-text-muted",
                )}
              >
                {option.short}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
