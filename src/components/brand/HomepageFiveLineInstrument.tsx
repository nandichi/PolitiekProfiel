"use client";

import { useEffect, useState } from "react";
import { stagger, useAnimate, useReducedMotion } from "motion/react";

const LINE_LABELS = [
  "Meetlijn 01",
  "Meetlijn 02",
  "Meetlijn 03",
  "Meetlijn 04",
  "Meetlijn 05",
] as const;

const INITIAL_POSITIONS = [50, 50, 50, 50, 50] as const;

export function HomepageFiveLineInstrument() {
  const [scope, animate] = useAnimate();
  const reduceMotion = useReducedMotion();
  const [positions, setPositions] = useState<number[]>([...INITIAL_POSITIONS]);

  useEffect(() => {
    if (reduceMotion) return;

    const playIntro = async () => {
      await animate(
        "[data-measure-line]",
        { opacity: [0.72, 1], scaleX: [0.94, 1] },
        { duration: 0.38, delay: stagger(0.045), ease: "easeOut" },
      );
      await animate(
        "[data-measure-marker]",
        { opacity: [0.74, 1], scale: [0.82, 1] },
        { duration: 0.22, delay: stagger(0.035), ease: "easeOut" },
      );
    };

    void playIntro();
  }, [animate, reduceMotion]);

  return (
    <div
      ref={scope}
      className="border border-canvas/25 bg-ink-raised p-4 sm:p-7 lg:p-8"
    >
      <div className="flex items-start justify-between gap-4 border-b border-canvas/25 pb-4 sm:gap-6 sm:pb-5">
        <div>
          <p className="mono text-[0.66rem] uppercase tracking-[0.18em] text-canvas/60">
            Interactief meetvlak
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-canvas/80">
            Vijf lijnen blijven vijf lijnen. Verplaats de meetpunten om het
            instrument te proberen.
          </p>
        </div>
        <span className="mono shrink-0 border border-canvas/30 px-2 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-focus">
          Nulmeting
        </span>
      </div>

      <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-6">
        {LINE_LABELS.map((label, index) => (
          <div key={label} className="grid grid-cols-[4.75rem_1fr] items-center gap-3 sm:grid-cols-[5.25rem_1fr] sm:gap-4">
            <label
              htmlFor={"homepage-measure-line-" + String(index + 1)}
              className="mono text-[0.64rem] uppercase tracking-[0.12em] text-canvas/55"
            >
              {label}
            </label>
            <div className="relative h-10 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-focus sm:h-11">
              <div
                data-measure-line
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px origin-left bg-canvas/50"
              />
              <div aria-hidden="true" className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
                {Array.from({ length: 11 }, (_, tick) => (
                  <span
                    key={tick}
                    className={
                      tick === 0 || tick === 5 || tick === 10
                        ? "h-3 w-px bg-canvas/55"
                        : "h-1.5 w-px bg-canvas/30"
                    }
                  />
                ))}
              </div>
              <span
                data-measure-marker
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: positions[index] + "%" }}
              >
                <InstrumentMarker index={index} />
              </span>
              <input
                id={"homepage-measure-line-" + String(index + 1)}
                type="range"
                min="0"
                max="100"
                value={positions[index]}
                aria-valuetext={"Demonstratiepositie " + String(positions[index])}
                onChange={(event) => {
                  const next = [...positions];
                  next[index] = Number(event.currentTarget.value);
                  setPositions(next);
                }}
                className="absolute inset-x-0 top-1/2 h-10 w-full -translate-y-1/2 cursor-ew-resize opacity-0 sm:h-11"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-canvas/25 pt-3 sm:mt-7 sm:gap-5 sm:pt-4">
        <p className="mono text-[0.62rem] uppercase tracking-[0.12em] text-canvas/50">
          0 / registratie / 100
        </p>
        <button
          type="button"
          onClick={() => setPositions([...INITIAL_POSITIONS])}
          className="min-h-11 border-b border-canvas/50 text-sm font-semibold text-canvas transition-colors hover:border-focus hover:text-focus"
        >
          Zet terug op nul
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-canvas/55">
        Dit is een demonstratie van de meetwijze, geen profiel of uitslag.
      </p>
    </div>
  );
}

function InstrumentMarker({ index }: { index: number }) {
  if (index === 0) {
    return <span className="block size-4 border-2 border-focus bg-ink-raised" />;
  }
  if (index === 1) {
    return <span className="block size-4 rounded-full border-2 border-focus bg-ink-raised" />;
  }
  if (index === 2) {
    return <span className="block size-3.5 rotate-45 border-2 border-focus bg-ink-raised" />;
  }
  if (index === 3) {
    return (
      <span className="relative block size-4">
        <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-focus" />
        <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-focus" />
      </span>
    );
  }
  return (
    <span
      className="block size-[1.1rem] border-2 border-focus bg-ink-raised"
      style={{ clipPath: "polygon(50% 0, 100% 28%, 82% 100%, 18% 100%, 0 28%)" }}
    />
  );
}
