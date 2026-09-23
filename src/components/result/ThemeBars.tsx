"use client";

import { motion, useReducedMotion } from "motion/react";
import { THEMES, type ThemeId, type ThemeScores } from "@/lib/themes";
import { themeCoverageLabel, themeCoverageState } from "@/lib/theme-coverage";
import { MeasureMarker } from "@/components/viz/MeasureMarker";

const TICKS = [-100, 0, 100];

interface ThemeBarsProps {
  scores: ThemeScores;
  /** Aantal beantwoorde vragen per thema, als dat bekend is. */
  coverage?: Partial<Record<ThemeId, number>>;
}

function position(value: number): number {
  return (Math.max(-100, Math.min(100, value)) + 100) / 2;
}

function signed(value: number): string {
  const rounded = Math.round(value);
  return (rounded > 0 ? "+" : "") + rounded;
}

export function ThemeBars({ scores, coverage }: ThemeBarsProps) {
  return (
    <div className="border-t border-rule">
      {THEMES.map((theme, index) =>
        themeCoverageState(coverage?.[theme.id]) === "geen" ? (
          <ThemeWithoutQuestions
            key={theme.id}
            theme={theme.id}
            index={index}
          />
        ) : (
          <ThemeRow
            key={theme.id}
            theme={theme.id}
            value={Number.isFinite(scores[theme.id]) ? scores[theme.id] : 0}
            index={index}
            coverageLabel={themeCoverageLabel(coverage?.[theme.id])}
          />
        ),
      )}
    </div>
  );
}

function ThemeWithoutQuestions({
  theme,
  index,
}: {
  theme: ThemeId;
  index: number;
}) {
  const meta = THEMES.find((item) => item.id === theme)!;
  return (
    <div className="border-b border-rule py-5 last:border-b-0 sm:py-6">
      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <span className="mono hidden pt-0.5 text-[0.65rem] tabular-nums text-text-muted sm:inline">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <p className="kicker">{meta.label}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            Geen vragen over dit thema in jouw quiz.
          </p>
        </div>
      </div>
    </div>
  );
}

function ThemeRow({
  theme,
  value,
  index,
  coverageLabel,
}: {
  theme: ThemeId;
  value: number;
  index: number;
  coverageLabel?: string | null;
}) {
  const meta = THEMES.find((item) => item.id === theme)!;
  const reduce = useReducedMotion();
  const left = position(value);

  return (
    <div
      className="border-b border-rule py-5 last:border-b-0 sm:py-6"
      aria-label={meta.label + ": " + signed(value)}
    >
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <span className="mono hidden pt-0.5 text-[0.65rem] tabular-nums text-text-muted sm:inline">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <MeasureMarker
                shape="circle"
                size={10}
                className="shrink-0 text-chart-marker"
              />
              <p className="kicker">{meta.label}</p>
            </div>
            <h3
              lang="nl"
              className="display mt-1 text-base leading-tight text-ink [hyphens:auto] [overflow-wrap:anywhere] sm:text-lg"
            >
              {meta.poleNegative.label}
              <span aria-hidden className="mx-2 font-normal text-text-muted">
                /
              </span>
              {meta.polePositive.label}
            </h3>
          </div>
        </div>
        <span className="mono shrink-0 border-l border-rule pl-3 text-lg font-semibold tabular-nums leading-none text-ink sm:pl-5 sm:text-xl">
          {signed(value)}
        </span>
      </div>

      <div className="relative h-8 select-none" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-chart-track" />
        <div className="absolute inset-x-0 top-[calc(50%+4px)] border-t border-dotted border-rule" />
        {TICKS.map((tick) => (
          <span
            key={tick}
            className={
              "absolute top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-rule-strong " +
              (tick === 0 ? "h-6" : "h-3")
            }
            style={{ left: position(tick) + "%" }}
          />
        ))}
        <motion.span
          initial={false}
          animate={{ left: left + "%" }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 240, damping: 28 }
          }
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-canvas p-0.5 text-chart-marker"
        >
          <MeasureMarker shape="circle" size={14} />
        </motion.span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-4 text-xs leading-snug text-text-muted">
        <span lang="nl" className="min-w-0 [hyphens:auto] [overflow-wrap:anywhere]">
          <span aria-hidden className="mono mr-1">
            ←
          </span>
          {meta.poleNegative.label}
        </span>
        <span
          lang="nl"
          className="min-w-0 text-right [hyphens:auto] [overflow-wrap:anywhere]"
        >
          {meta.polePositive.label}
          <span aria-hidden className="mono ml-1">
            →
          </span>
        </span>
      </div>

      {coverageLabel ? (
        <p className="mt-2 text-xs text-text-muted">{coverageLabel}</p>
      ) : null}
    </div>
  );
}
