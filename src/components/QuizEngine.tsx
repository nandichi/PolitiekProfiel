"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  TIER_QUESTION_COUNT,
} from "@/lib/dimensions";
import { Container } from "@/components/Container";
import { InfoDrawer } from "@/components/quiz/InfoDrawer";
import { QuizSegmentBar } from "@/components/quiz/QuizSegmentBar";
import { QuizProgressDots } from "@/components/quiz/QuizProgressDots";
import { cx } from "@/lib/cx";
import { newAttemptId, useTracking } from "@/lib/use-tracking";

type AnswerMap = Record<number, AnswerValue | null>;

const STORAGE_KEY = (tier: Tier) => `politiekprofiel-quiz-${tier}`;
const ATTEMPT_STORAGE_KEY = (tier: Tier) =>
  `politiekprofiel-attempt-${tier}`;

const TIER_LABELS: Record<Tier, string> = {
  quick: "Quick",
  standard: "Standaard",
  extended: "Uitgebreid",
};

interface PersistedState {
  answers: AnswerMap;
  cursor: number;
  questions: QuizQuestion[];
  adaptive: boolean;
  savedAt: number;
  attemptId?: string;
}

export function QuizEngine({
  tier,
  questions: initialQuestions,
  adaptive = false,
}: {
  tier: Tier;
  questions: QuizQuestion[];
  adaptive?: boolean;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [cursor, setCursor] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showInfo, setShowInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<PersistedState | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [batchDone, setBatchDone] = useState(false);
  const fetchInFlight = useRef(false);

  const initialAttemptIdRef = useRef<string>("");
  if (initialAttemptIdRef.current === "") {
    initialAttemptIdRef.current = newAttemptId();
  }
  const tracking = useTracking(initialAttemptIdRef.current);
  const questionStartedAtRef = useRef<number | null>(null);
  const lastViewedQuestionIdRef = useRef<number | null>(null);
  const quizStartedEmittedRef = useRef(false);
  const submittedRef = useRef(false);

  const adaptiveTarget = adaptive ? TIER_QUESTION_COUNT[tier] : questions.length;
  const total = adaptive ? adaptiveTarget : questions.length;
  const current = questions[cursor];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY(tier));
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as PersistedState;
      const hasQuestions =
        Array.isArray(parsed.questions) && parsed.questions.length > 0;
      const matchesMode = parsed.adaptive === adaptive;
      const hasProgress =
        Object.keys(parsed.answers ?? {}).length > 0 || parsed.cursor > 0;
      if (hasQuestions && matchesMode && hasProgress) {
        if (parsed.attemptId && /^[A-Za-z0-9_-]{6,32}$/.test(parsed.attemptId)) {
          initialAttemptIdRef.current = parsed.attemptId;
          tracking.resetAttempt(parsed.attemptId);
          quizStartedEmittedRef.current = true;
        }
        setResumePrompt(parsed);
      } else if (!matchesMode || !hasQuestions) {
        window.localStorage.removeItem(STORAGE_KEY(tier));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY(tier));
    }
  }, [tier, adaptive, tracking]);

  useEffect(() => {
    if (!hydrated || resumePrompt) return;
    if (quizStartedEmittedRef.current) return;
    quizStartedEmittedRef.current = true;
    tracking.track({
      type: "quiz-started",
      tier,
      adaptive,
    });
  }, [hydrated, resumePrompt, tracking, tier, adaptive]);

  useEffect(() => {
    if (!hydrated || resumePrompt) return;
    if (typeof window === "undefined") return;
    const state: PersistedState = {
      answers,
      cursor,
      questions,
      adaptive,
      savedAt: Date.now(),
      attemptId: initialAttemptIdRef.current,
    };
    window.localStorage.setItem(STORAGE_KEY(tier), JSON.stringify(state));
  }, [answers, cursor, hydrated, resumePrompt, questions, tier, adaptive]);

  useEffect(() => {
    if (!hydrated || resumePrompt) return;
    if (!current) return;
    if (lastViewedQuestionIdRef.current === current.id) return;
    lastViewedQuestionIdRef.current = current.id;
    questionStartedAtRef.current = Date.now();
    tracking.track({
      type: "question-viewed",
      tier,
      adaptive,
      questionId: current.id,
      cursor,
    });
  }, [current, cursor, hydrated, resumePrompt, tracking, tier, adaptive]);

  useEffect(() => {
    if (!hydrated || resumePrompt) return;
    if (typeof window === "undefined") return;

    const onPageHide = () => {
      if (submittedRef.current) return;
      tracking.track({
        type: "quiz-abandoned",
        tier,
        adaptive,
        cursor,
        meta: { reason: "pagehide" },
      });
    };

    window.addEventListener("pagehide", onPageHide);
    return () => {
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [hydrated, resumePrompt, tracking, tier, adaptive, cursor]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((v) => v !== undefined).length,
    [answers],
  );

  const decisionsMade = useMemo(
    () => Object.entries(answers).filter(([, v]) => v !== undefined).length,
    [answers],
  );

  const fetchNextBatch = useCallback(async () => {
    if (!adaptive || batchDone || fetchInFlight.current) return;
    if (questions.length >= adaptiveTarget) return;
    fetchInFlight.current = true;
    setLoadingMore(true);
    try {
      const seenIds = questions.map((q) => q.id);
      const answerList = seenIds.map((id) => ({
        questionId: id,
        value: answers[id] ?? null,
      }));
      const res = await fetch("/api/quiz/next", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, seenIds, answers: answerList }),
      });
      if (!res.ok) {
        setBatchDone(true);
        return;
      }
      const data = (await res.json()) as {
        done?: boolean;
        questions?: QuizQuestion[];
      };
      const incoming = Array.isArray(data.questions) ? data.questions : [];
      if (incoming.length === 0 || data.done) {
        setBatchDone(true);
      } else {
        setQuestions((prev) => {
          const existingIds = new Set(prev.map((q) => q.id));
          const fresh = incoming.filter((q) => !existingIds.has(q.id));
          return [...prev, ...fresh];
        });
        tracking.track({
          type: "adaptive-batch",
          tier,
          adaptive,
          meta: { received: incoming.length, totalSeen: seenIds.length },
        });
      }
    } catch {
      setBatchDone(true);
    } finally {
      fetchInFlight.current = false;
      setLoadingMore(false);
    }
  }, [adaptive, answers, adaptiveTarget, batchDone, questions, tier, tracking]);

  useEffect(() => {
    if (!adaptive || !hydrated || resumePrompt) return;
    const remainingInBuffer = questions.length - cursor;
    const reachedTier = answeredCount >= adaptiveTarget;
    if (reachedTier) return;
    if (remainingInBuffer <= 2 && questions.length < adaptiveTarget) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchNextBatch();
    }
  }, [
    adaptive,
    answeredCount,
    cursor,
    questions.length,
    fetchNextBatch,
    hydrated,
    resumePrompt,
    adaptiveTarget,
  ]);

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

  const progressPct = Math.round(
    (Math.min(cursor, total) / Math.max(1, total)) * 100,
  );

  void decisionsMade;

  function setAnswer(value: AnswerValue | null) {
    if (!current) return;
    const startedAt = questionStartedAtRef.current;
    const timeOnQuestionMs =
      startedAt !== null ? Math.max(0, Date.now() - startedAt) : undefined;
    if (value === null) {
      tracking.track({
        type: "question-skipped",
        tier,
        adaptive,
        questionId: current.id,
        cursor,
        timeOnQuestionMs,
      });
    } else {
      tracking.track({
        type: "question-answered",
        tier,
        adaptive,
        questionId: current.id,
        value,
        cursor,
        timeOnQuestionMs,
      });
    }
    setAnswers((a) => ({ ...a, [current.id]: value }));
    setDirection(1);
    setShowInfo(false);
    setTimeout(
      () => setCursor((c) => Math.min(c + 1, total)),
      reduce ? 0 : 220,
    );
  }

  function goBack() {
    if (current) {
      tracking.track({
        type: "question-back",
        tier,
        adaptive,
        questionId: current.id,
        cursor,
      });
    }
    setShowInfo(false);
    setDirection(-1);
    setCursor((c) => Math.max(c - 1, 0));
  }

  function openInfoDrawer() {
    if (current) {
      tracking.track({
        type: "info-opened",
        tier,
        adaptive,
        questionId: current.id,
        cursor,
      });
    }
    setShowInfo(true);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const answerEntries = Object.entries(answers)
        .map(([id, value]) => ({
          questionId: Number(id),
          value,
        }))
        .filter((a) => Number.isFinite(a.questionId));
      const payload = {
        tier,
        attemptId: initialAttemptIdRef.current,
        answers:
          answerEntries.length > 0
            ? answerEntries
            : questions.map((q) => ({
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
      submittedRef.current = true;
      tracking.track({
        type: "quiz-completed",
        tier,
        adaptive,
        meta: { shareId: json.id },
      });
      tracking.flushNow();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY(tier));
      }
      router.push(`/r/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onbekende fout.");
      setSubmitting(false);
    }
  }

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
          van <span className="mono tabular-nums">{adaptiveTarget}</span> stellingen
          beantwoord. Wil je verder gaan of opnieuw beginnen?
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              tracking.track({
                type: "resume-prompt",
                tier,
                adaptive,
                meta: { choice: "continue" },
              });
              if (resumePrompt.questions && resumePrompt.questions.length > 0) {
                setQuestions(resumePrompt.questions);
              }
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
              tracking.track({
                type: "resume-prompt",
                tier,
                adaptive,
                meta: { choice: "restart" },
              });
              if (typeof window !== "undefined") {
                window.localStorage.removeItem(STORAGE_KEY(tier));
              }
              const freshAttemptId = newAttemptId();
              initialAttemptIdRef.current = freshAttemptId;
              tracking.resetAttempt(freshAttemptId);
              quizStartedEmittedRef.current = false;
              lastViewedQuestionIdRef.current = null;
              questionStartedAtRef.current = null;
              setQuestions(initialQuestions);
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

  const reachedTarget = adaptive
    ? answeredCount >= adaptiveTarget ||
      (cursor >= questions.length && (batchDone || questions.length >= adaptiveTarget))
    : cursor >= questions.length;

  if (reachedTarget) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">Alle stellingen ingevuld</p>
        <h1 className="display mb-5">Klaar voor je profiel.</h1>
        <p className="text-ink-2 leading-relaxed mb-10 max-w-xl">
          Je beantwoordde{" "}
          <span className="mono tabular-nums">{answeredCount}</span> van{" "}
          <span className="mono tabular-nums">{adaptiveTarget}</span> stellingen
          {answeredCount < adaptiveTarget
            ? ` (${adaptiveTarget - answeredCount} overgeslagen)`
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
          {questions.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCursor(Math.max(0, questions.length - 1))}
              disabled={submitting}
            >
              Terug naar laatste vraag
            </button>
          )}
        </div>
      </Container>
    );
  }

  if (cursor >= questions.length && loadingMore) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">Even kalibreren</p>
        <h1 className="display mb-5">Volgende stellingen ophalen…</h1>
        <p className="text-ink-2 leading-relaxed mb-10 max-w-xl">
          Op basis van je antwoorden tot nu toe kiezen we de volgende set
          stellingen.
        </p>
        <Loader2 size={20} className="animate-spin text-ink-muted" strokeWidth={1.8} />
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
                Vraag {String(Math.min(cursor + 1, total)).padStart(2, "0")} /{" "}
                {total}
              </span>
              {adaptive && (
                <span
                  className="mono text-[0.7rem] tracking-wider text-ink-subtle hidden md:inline"
                  title="Vragen worden gekozen op basis van je eerdere antwoorden"
                >
                  ADAPTIEF
                </span>
              )}
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
                    onClick={openInfoDrawer}
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
                  "mb-8 md:mb-12",
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
