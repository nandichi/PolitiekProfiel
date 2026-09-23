"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DIMENSIONS } from "@/lib/dimensions";
import { distance, type DimensionScores } from "@/lib/scoring";
import { MiniVector } from "@/components/MiniVector";
import { cx } from "@/lib/cx";
import type { CoalitionInput, PresetCoalition } from "@/lib/coalition";

interface CoalitionBuilderProps {
  pool: CoalitionInput[];
  userVector?: DimensionScores;
  userShareId?: string;
  presets?: PresetCoalition[];
}

const COALITION_STATUS_LABELS: Record<
  NonNullable<CoalitionInput["coalitionStatus"]>,
  string
> = {
  governing: "Coalitie",
  opposition: "Oppositie",
  splinter: "Splinter",
  none: "Onbekend",
};

function centroidOf(parties: ReadonlyArray<CoalitionInput>): DimensionScores | null {
  if (parties.length === 0) return null;
  const totalSeats = parties.reduce((s, p) => s + p.seats, 0) || 1;
  const sum: DimensionScores = {
    economic: 0,
    social: 0,
    civil: 0,
    governance: 0,
    trust: 0,
  };
  for (const p of parties) {
    sum.economic += p.vector.economic * p.seats;
    sum.social += p.vector.social * p.seats;
    sum.civil += p.vector.civil * p.seats;
    sum.governance += p.vector.governance * p.seats;
    sum.trust += p.vector.trust * p.seats;
  }
  return {
    economic: sum.economic / totalSeats,
    social: sum.social / totalSeats,
    civil: sum.civil / totalSeats,
    governance: sum.governance / totalSeats,
    trust: sum.trust / totalSeats,
  };
}

function spreadOf(parties: ReadonlyArray<CoalitionInput>): number {
  if (parties.length < 2) return 0;
  let max = 0;
  for (let i = 0; i < parties.length; i++) {
    for (let j = i + 1; j < parties.length; j++) {
      const d = distance(parties[i].vector, parties[j].vector);
      if (d > max) max = d;
    }
  }
  return max;
}

function tensionLabel(spread: number): string {
  if (spread < 80) return "harmonieus";
  if (spread < 140) return "werkbaar";
  if (spread < 200) return "uitdagend";
  return "polariserend";
}

export function CoalitionBuilder({
  pool,
  userVector,
  userShareId,
  presets = [],
}: CoalitionBuilderProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const selectedParties = useMemo(
    () => pool.filter((p) => selected.has(p.slug)),
    [pool, selected],
  );

  const totalSeats = useMemo(
    () => selectedParties.reduce((s, p) => s + p.seats, 0),
    [selectedParties],
  );

  const centroid = useMemo(() => centroidOf(selectedParties), [selectedParties]);
  const spread = useMemo(() => spreadOf(selectedParties), [selectedParties]);

  const userDistance = useMemo(() => {
    if (!userVector || !centroid) return null;
    return distance(userVector, centroid);
  }, [userVector, centroid]);

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function reset() {
    setSelected(new Set());
  }

  function applyPreset(preset: PresetCoalition) {
    const next = new Set(preset.parties.map((p) => p.slug));
    setSelected(next);
  }

  const majorityStatus: "majority" | "near" | "minor" =
    totalSeats >= 76 ? "majority" : totalSeats >= 60 ? "near" : "minor";

  const sortedPool = useMemo(
    () => pool.slice().sort((a, b) => b.seats - a.seats),
    [pool],
  );

  return (
    <div className="space-y-12">
      {/* Live metrics dashboard */}
      <section
        aria-labelledby="coalition-live-summary"
        className="border border-rule-strong bg-canvas-raised p-5 sm:p-6 md:p-8"
      >
        <div className="flex items-baseline justify-between mb-6">
          <p id="coalition-live-summary" className="kicker">
            Live samenvatting
          </p>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={reset}
              className="min-h-11 px-2 text-xs font-semibold text-text-muted underline decoration-rule-strong underline-offset-4 transition-colors hover:text-signal focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Begin opnieuw
            </button>
          )}
        </div>

        <div
          className="grid grid-cols-1 gap-6 min-[400px]:grid-cols-2 md:grid-cols-4 md:gap-8"
          aria-live="polite"
        >
          <Metric
            label="Zetels"
            value={String(totalSeats)}
            sub={
              majorityStatus === "majority"
                ? "Meerderheid (≥76)"
                : majorityStatus === "near"
                  ? `${76 - totalSeats} tekort voor 76`
                  : "Te weinig om door te rekenen"
            }
            tone={
              majorityStatus === "majority"
                ? "success"
                : majorityStatus === "near"
                  ? "warn"
                  : "muted"
            }
          />
          <Metric
            label="Partijen"
            value={String(selectedParties.length)}
            sub={
              selectedParties.length === 0
                ? "Niets geselecteerd"
                : selectedParties.length < 2
                  ? "Minstens 2 voor coalitie"
                  : "Coalitiepartners"
            }
          />
          <Metric
            label="Spanning"
            value={
              selectedParties.length < 2 ? "n.v.t." : String(Math.round(spread))
            }
            sub={
              selectedParties.length < 2
                ? "Selecteer minstens 2 partijen"
                : `${tensionLabel(spread)} (max-afstand)`
            }
          />
          {userVector ? (
            <Metric
              label="Afstand tot jou"
              value={
                userDistance !== null ? String(Math.round(userDistance)) : "n.v.t."
              }
              sub={
                userDistance === null
                  ? "Selecteer partijen"
                  : "Gewogen euclidisch"
              }
            />
          ) : (
            <div>
              <p className="kicker mb-2">Match met jou</p>
              <p className="text-xs text-text-muted leading-relaxed">
                Plak je share-link hieronder om de afstand tot jouw eigen
                profiel te zien.
              </p>
            </div>
          )}
        </div>

        {/* Dimensie-zwaartepunt visualisatie */}
        <AnimatePresence initial={false}>
          {centroid && (
            <motion.div
              key="centroid-visual"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-8 border-t border-rule pt-6">
                <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
                  <p className="kicker">Coalitie-positie op de vijf assen</p>
                  {userVector && (
                    <p className="text-[0.65rem] mono tracking-wider text-text-muted">
                      <span className="inline-block w-2 h-2 bg-ink rotate-45 mr-1.5 align-middle" />
                      ZWAARTEPUNT
                      <span className="mx-2 inline-block h-3 w-px bg-compare-b align-middle" />
                      JOUW POSITIE
                    </p>
                  )}
                </div>
                <MiniVector
                  vector={centroid}
                  compareVector={userVector}
                  showLabels
                  size="md"
                />
                <ul className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {DIMENSIONS.map((d) => {
                    const v = centroid[d.id];
                    return (
                      <li key={d.id} className="text-xs">
                        <p className="mono text-[0.6rem] tracking-wider text-text-muted">
                          {d.shortLabel.toUpperCase()}
                        </p>
                        <p className="mono tabular-nums text-ink mt-1">
                          {v > 0 ? "+" : ""}
                          {Math.round(v)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Presets sneltoegankelijk */}
      {presets.length > 0 && (
        <div>
          <p className="kicker mb-3">Of begin met een scenario</p>
          <ul className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <li key={preset.name}>
                <button
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-rule bg-canvas-raised px-3 py-2 text-xs text-ink-raised transition-colors hover:border-ink hover:text-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  <span>{preset.name}</span>
                  <span className="mono tabular-nums text-[0.65rem] text-text-muted">
                    {preset.parties.reduce((s, p) => s + p.seats, 0)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Partij-selector */}
      <div>
        <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
          <p className="kicker">Bouw je coalitie</p>
          <p className="text-xs text-text-muted">
            Klik om partijen toe te voegen of te verwijderen. Volgorde =
            zetelaantal.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {sortedPool.map((p) => {
            const isOn = selected.has(p.slug);
            const statusLabel = p.coalitionStatus
              ? COALITION_STATUS_LABELS[p.coalitionStatus]
              : null;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => toggle(p.slug)}
                  aria-pressed={isOn}
                  className={cx(
                    "group min-h-[88px] w-full rounded-[2px] border px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus",
                    isOn
                      ? "border-ink bg-ink text-canvas-raised"
                      : "border-rule bg-canvas-raised hover:border-ink",
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{p.abbreviation}</span>
                    <span
                      className={cx(
                        "mono tabular-nums text-[0.7rem]",
                        isOn ? "opacity-80" : "text-text-muted",
                      )}
                    >
                      {p.seats}
                    </span>
                  </div>
                  <p
                    className={cx(
                      "mt-0.5 break-words text-xs [overflow-wrap:anywhere]",
                      isOn ? "opacity-75" : "text-text-muted",
                    )}
                  >
                    {p.name}
                  </p>
                  {statusLabel && (
                    <p
                      className={cx(
                        "mono text-[0.55rem] tracking-wider mt-2 uppercase",
                        isOn ? "opacity-65" : "text-text-muted",
                      )}
                    >
                      {statusLabel}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {userShareId && (
        <p className="text-xs text-text-muted">
          Gekoppeld aan jouw profiel{" "}
          <code className="mono text-ink">{userShareId}</code>. Verwijder{" "}
          <code className="mono mx-1">?r=</code> uit de URL om los te koppelen.
        </p>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "neutral" | "success" | "warn" | "muted";
}) {
  return (
    <div>
      <p className="kicker mb-2">{label}</p>
      <p
        className={cx(
          "display tabular-nums text-4xl md:text-5xl leading-none",
          tone === "success"
            ? "text-success"
            : tone === "warn"
              ? "text-signal-pressed"
              : tone === "muted"
                ? "text-text-muted"
                : "text-ink",
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-xs text-text-muted leading-snug">{sub}</p>
    </div>
  );
}
