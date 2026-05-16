"use client";

import { motion, useReducedMotion } from "motion/react";
import { DIMENSIONS } from "@/lib/dimensions";

const SEED_VALUES = [-32, 18, 24, -8, 42];
const AMPLITUDE = 14;

export function LiveAxes() {
  const reduce = useReducedMotion();

  return (
    <div className="w-full h-full flex flex-col gap-5 md:gap-7">
      <div className="flex items-baseline justify-between">
        <p className="kicker">Vijf dimensies · live</p>
        <span className="mono text-[0.62rem] text-ink-subtle tracking-wider">
          -100 · 0 · +100
        </span>
      </div>

      <div className="flex flex-col gap-5 md:gap-6">
        {DIMENSIONS.map((d, i) => {
          const base = SEED_VALUES[i];
          const left = ((base + 100) / 200) * 100;
          return (
            <div key={d.id} className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <div className="w-[110px] md:w-[130px]">
                <p className="mono text-[0.62rem] tracking-wider text-ink-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="display text-sm md:text-base text-ink leading-tight mt-0.5">
                  {d.shortLabel}
                </p>
              </div>

              <div className="relative h-5">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-rule-strong" />
                <div className="absolute left-1/2 top-1 bottom-1 w-px bg-rule-strong/70" />

                <motion.div
                  className="absolute top-0 bottom-0 flex flex-col items-center"
                  initial={{ left: `${left}%` }}
                  animate={
                    reduce
                      ? { left: `${left}%` }
                      : {
                          left: [
                            `${left}%`,
                            `${Math.max(0, Math.min(100, left + AMPLITUDE))}%`,
                            `${left}%`,
                            `${Math.max(0, Math.min(100, left - AMPLITUDE))}%`,
                            `${left}%`,
                          ],
                        }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          duration: 9 + i * 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.4,
                        }
                  }
                  style={{ transform: "translateX(-50%)" }}
                >
                  <div className="w-1.5 h-1.5 bg-ink rotate-45" />
                  <div className="w-px flex-1 bg-ink/70" />
                  <div className="w-1.5 h-1.5 bg-ink rotate-45" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 pt-4 border-t border-rule flex items-center justify-between">
        <p className="text-xs text-ink-muted">
          Een schets, niet een uitkomst.
        </p>
        <span className="mono text-[0.62rem] tracking-widest text-ink-subtle">
          DEMO
        </span>
      </div>
    </div>
  );
}
