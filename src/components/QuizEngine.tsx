"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Loader2,
  SkipForward,
} from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz-data";
import {
  type AnswerValue,
  type Tier,
  type DimensionId,
  dimensionMeta,
} from "@/lib/dimensions";
import { Container } from "@/components/Container";
import { InfoDrawer } from "@/components/quiz/InfoDrawer";
import { QuizSegmentBar } from "@/components/quiz/QuizSegmentBar";
import { QuizProgressDots } from "@/components/quiz/QuizProgressDots";
import { cx } from "@/lib/cx";

type AnswerMap = Record<number, AnswerValue | null>;

const STORAGE_KEY = (tier: Tier) => `politiekprofiel-quiz-${tier}`;

const TIER_LABELS: Record<Tier, string> = {
  quick: "Quick",
  standard: "Standaard",
  extended: "Uitgebreid",
};

interface PersistedState {
  answers: AnswerMap;
  cursor: number;
  questionIds: number[];
  savedAt: number;
}

export function QuizEngine({
  tier,
  questions,
}: {
  tier: Tier;
  questions: QuizQuestion[];
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [cursor, setCursor] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showInfo, setShowInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<PersistedState | null>(null);

  const total = questions.length;
  const current = questions[cursor];

  useEffect(() => {
    // Hydratie-flag voor write-effect gate. Niet derived state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY(tier));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PersistedState;
      const sameSet =
        Array.isArray(parsed.questionIds) &&
        parsed.questionIds.length === questions.length &&
        parsed.questionIds.every((id, i) => id === questions[i].id);
      const hasProgress =
        Object.keys(parsed.answers ?? {}).length > 0 || parsed.cursor > 0;
      if (sameSet && hasProgress) {
        setResumePrompt(parsed);
      } else if (!sameSet) {
        window.localStorage.removeItem(STORAGE_KEY(tier));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY(tier));
    }
  }, [tier, questions]);

  useEffect(() => {
    if (!hydrated || resumePrompt) return;
    if (typeof window === "undefined") return;
    const state: PersistedState = {
      answers,
      cursor,
      questionIds: questions.map((q) => q.id),
      savedAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY(tier), JSON.stringify(state));
  }, [answers, cursor, hydrated, resumePrompt, questions, tier]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== undefined).length,
    [answers],
  );

  const perDimensionTotal = useMemo(() => {
    const m: Record<DimensionId, number> = {
      economic: 0,
      social: 0,
      civil: 0,
      governance: 0,
      trust: 0,
    };
    for (const q of questions) m[q.dimension] += 1;
    return m;
  }, [questions]);

  const perDimensionAnswered = useMemo(() => {
    const m: Record<DimensionId, number> = {
      economic: 0,
      social: 0,
      civil: 0,
      governance: 0,
      trust: 0,
    };
    for (const q of questions) {
      if (answers[q.id] !== undefined) m[q.dimension] += 1;
    }
    return m;
  }, [questions, answers]);

  const progressPct = Math.round((cursor / total) * 100);

  function setAnswer(value: AnswerValue | null) {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: value }));
    setDirection(1);
    setShowInfo(false);
    setTimeout(
      () => setCursor((c) => Math.min(c + 1, total)),
      reduce ? 0 : 220,
    );
  }

  function goBack() {
    setShowInfo(false);
    setDirection(-1);
    setCursor((c) => Math.max(c - 1, 0));
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        tier,
        answers: questions.map((q) => ({
          questionId: q.id,
          value: answers[q.id] ?? null,
        })),
      };
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(
          json.error ?? `Aanmaken mislukt (status ${res.status}).`,
        );
      }
      const json = (await res.json()) as { id: string };
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY(tier));
      }
      router.push(`/r/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onbekende fout.");
      setSubmitting(false);
    }
  }

  // ─────────────────── RESUME PROMPT ───────────────────
  if (resumePrompt) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">Verder waar je was</p>
        <h1 className="display mb-5">Je hebt een quiz openstaan.</h1>
        <p className="text-ink-2 leading-relaxed mb-10 max-w-xl">
          Je was bezig met de {TIER_LABELS[tier].toLowerCase()} quiz en hebt{" "}
          <span className="mono tabular-nums">
            {Object.keys(resumePrompt.answers).length}
          </span>{" "}
          van <span className="mono tabular-nums">{total}</span> stellingen
          beantwoord. Wil je verder gaan of opnieuw beginnen?
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setAnswers(resumePrompt.answers ?? {});
              setCursor(resumePrompt.cursor ?? 0);
              setResumePrompt(null);
            }}
          >
            Verder waar ik was
            <ArrowRight size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem(STORAGE_KEY(tier));
              }
              setAnswers({});
              setCursor(0);
              setResumePrompt(null);
            }}
          >
            Opnieuw beginnen
          </button>
        </div>
      </Container>
    );
  }

  // ─────────────────── DONE ───────────────────
  if (cursor >= total) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">Alle stellingen ingevuld</p>
        <h1 className="display mb-5">Klaar voor je profiel.</h1>
        <p className="text-ink-2 leading-relaxed mb-10 max-w-xl">
          Je beantwoordde{" "}
          <span className="mono tabular-nums">{answeredCount}</span> van{" "}
          <span className="mono tabular-nums">{total}</span> stellingen
          {answeredCount < total
            ? ` (${total - answeredCount} overgeslagen)`
            : ""}
          . Klik hieronder om je profiel te berekenen.
        </p>
        {error && (
          <div
            role="alert"
            className="mb-8 border border-terra bg-terra-soft text-ink px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={1.8} />
                Berekenen…
              </>
            ) : (
              <>
                Bekijk mijn profiel
                <ArrowRight size={16} strokeWidth={1.8} />
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setCursor(total - 1)}
            disabled={submitting}
          >
            Terug naar laatste vraag
          </button>
        </div>
      </Container>
    );
  }

  const meta = dimensionMeta(current.dimension);
  const hasInfo =
    !!current.info?.context ||
    (current.info?.argumentsFor?.length ?? 0) > 0 ||
    (current.info?.argumentsAgainst?.length ?? 0) > 0 ||
    (current.info?.sources?.length ?? 0) > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Sticky quiz status bar */}
      <div className="sticky top-16 md:top-[72px] z-20 bg-paper/90 backdrop-blur-md border-b border-rule">
        <Container width="bleed" className="py-4 md:py-5">
          <div className="flex items-baseline justify-between gap-4 mb-3">
            <div className="flex items-baseline gap-3">
              <span className="kicker">{TIER_LABELS[tier]}</span>
              <span aria-hidden className="block w-4 h-px bg-rule-strong" />
              <span className="mono text-[0.7rem] tabular-nums text-ink-muted">
                Vraag {String(cursor + 1).padStart(2, "0")} / {total}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="mono text-[0.7rem] tabular-nums text-ink-muted hidden sm:inline">
                {progressPct}%
              </span>
              <Link
                href="/"
                className="text-xs text-ink-muted hover:text-ink no-underline"
              >
                Stop &amp; bewaar
              </Link>
            </div>
          </div>
          <QuizProgressDots
            perDimensionTotal={perDimensionTotal}
            perDimensionAnswered={perDimensionAnswered}
            currentDimension={current.dimension}
          />
        </Container>
      </div>

      {/* Question card */}
      <div className="flex-1 flex items-center">
        <Container width="default" className="py-12 md:py-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              key={current.id}
              custom={direction}
              initial={
                reduce ? { opacity: 0 } : { opacity: 0, x: direction * 24 }
              }
              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={
                reduce ? { opacity: 0 } : { opacity: 0, x: direction * -24 }
              }
              transition={{ duration: 0.34, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {/* Dimension tag + info */}
              <div className="flex items-center justify-between mb-7 md:mb-10">
                <div className="inline-flex items-center gap-3 border border-rule px-3 py-1.5">
                  <span
                    aria-hidden
                    className="block w-1.5 h-1.5 bg-navy rounded-full"
                  />
                  <span className="kicker">{meta.label}</span>
                </div>
                {hasInfo && (
                  <button
                    type="button"
                    onClick={() => setShowInfo(true)}
                    className="inline-flex items-center gap-2 text-xs text-ink-muted hover:text-ink border-b border-transparent hover:border-ink transition-colors pb-0.5"
                  >
                    <Info size={14} strokeWidth={1.8} />
                    Achtergrond &amp; bronnen
                  </button>
                )}
              </div>

              {/* Statement */}
              <h2
                className={cx(
                  "display text-ink leading-[1.08]",
                  "text-[clamp(1.7rem,3.4vw,2.6rem)]",
                )}
                style={{ letterSpacing: "-0.018em" }}
              >
                <span
                  aria-hidden
                  className="display-italic text-ink-subtle font-light mr-2"
                >
                  &ldquo;
                </span>
                {current.statement}
                <span
                  aria-hidden
                  className="display-italic text-ink-subtle font-light ml-1"
                >
                  &rdquo;
                </span>
              </h2>

              {/* Pole hint */}
              <p className="mt-6 mb-8 md:mb-12 text-xs text-ink-muted flex items-center flex-wrap gap-x-3 gap-y-1">
                <span className="mono tracking-wider">
                  ← {meta.poleNegative.label.toUpperCase()}
                </span>
                <span aria-hidden className="block w-6 h-px bg-rule" />
                <span className="mono tracking-wider">
                  {meta.polePositive.label.toUpperCase()} →
                </span>
              </p>

              {/* Segment bar */}
              <QuizSegmentBar
                selected={answers[current.id] as AnswerValue | undefined | null}
                onChange={(v) => setAnswer(v)}
              />

              {/* Foot controls */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={cursor === 0}
                  className="btn-ghost"
                >
                  <ArrowLeft size={14} strokeWidth={1.8} />
                  Vorige
                </button>
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline mono text-[0.7rem] tracking-wider text-ink-subtle">
                    GEEN VOORKEUR?
                  </span>
                  <button
                    type="button"
                    onClick={() => setAnswer(null)}
                    className="btn-ghost"
                  >
                    <SkipForward size={14} strokeWidth={1.8} />
                    Overslaan
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </Container>
      </div>

      {/* Info drawer */}
      {current && (
        <InfoDrawer
          open={showInfo}
          onOpenChange={setShowInfo}
          content={{
            statement: current.statement,
            dimensionLabel: meta.label,
            context: current.info?.context,
            argumentsFor: current.info?.argumentsFor,
            argumentsAgainst: current.info?.argumentsAgainst,
            sources: current.info?.sources,
          }}
        />
      )}
    </div>
  );
}
