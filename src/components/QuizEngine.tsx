"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
  dimensionMeta,
  TIER_QUESTION_COUNT,
} from "@/lib/dimensions";
import { Container } from "@/components/Container";
import { InfoDrawer } from "@/components/quiz/InfoDrawer";
import { QuizSegmentBar } from "@/components/quiz/QuizSegmentBar";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { EmailResultLinkBlock } from "@/components/EmailResultLinkBlock";
import { cx } from "@/lib/cx";
import { MINIMUM_RESULT_ANSWERS, canCreateResult } from "@/lib/quiz-completion";

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
  questions: QuizQuestion[];
  adaptive: boolean;
  savedAt: number;
}

export function QuizEngine({
  tier,
  questions: initialQuestions,
  adaptive = false,
  entitlementToken,
}: {
  tier: Tier;
  questions: QuizQuestion[];
  adaptive?: boolean;
  entitlementToken?: string;
}) {
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
  const [completedShareId, setCompletedShareId] = useState<string | null>(null);
  const fetchInFlight = useRef(false);
  const submissionIdRef = useRef<string | null>(null);

  const adaptiveTarget = adaptive ? TIER_QUESTION_COUNT[tier] : questions.length;
  const total = adaptive ? Math.max(adaptiveTarget, questions.length) : questions.length;
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
        setResumePrompt(parsed);
      } else if (!matchesMode || !hasQuestions) {
        window.localStorage.removeItem(STORAGE_KEY(tier));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY(tier));
    }
  }, [tier, adaptive]);

  useEffect(() => {
    if (!hydrated || resumePrompt) return;
    if (typeof window === "undefined") return;
    const state: PersistedState = {
      answers,
      cursor,
      questions,
      adaptive,
      savedAt: Date.now(),
    };
    window.localStorage.setItem(STORAGE_KEY(tier), JSON.stringify(state));
  }, [answers, cursor, hydrated, resumePrompt, questions, tier, adaptive]);

  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter(
        (value) => value !== undefined && value !== null,
      ).length,
    [answers],
  );

  const fetchNextBatch = useCallback(async () => {
    if (!adaptive || batchDone || fetchInFlight.current) return;
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
        body: JSON.stringify({
          tier,
          seenIds,
          answers: answerList,
          entitlementToken,
        }),
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
      }
    } catch {
      setBatchDone(true);
    } finally {
      fetchInFlight.current = false;
      setLoadingMore(false);
    }
  }, [
    adaptive,
    answers,
    batchDone,
    questions,
    tier,
    entitlementToken,
  ]);

  useEffect(() => {
    if (!adaptive || !hydrated || resumePrompt) return;
    const remainingInBuffer = questions.length - cursor;
    const reachedTier = answeredCount >= adaptiveTarget;
    if (reachedTier) return;
    if (remainingInBuffer <= 2) {
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

  function openInfoDrawer() {
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
      const submissionId =
        submissionIdRef.current ??
        (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `submission_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`);
      submissionIdRef.current = submissionId;
      const payload = {
        tier,
        entitlementToken,
        submissionId,
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
        throw new Error("RESULT_CREATION_FAILED");
      }
      const json = (await res.json()) as { id: string };
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY(tier));
      }
      // Toon een tussenscherm met optionele e-mail-opt-in voordat we naar
      // de resultaatpagina redirecten. De gebruiker kan ook direct doorklikken.
      setCompletedShareId(json.id);
      setSubmitting(false);
    } catch {
      setError("Je profiel kon niet worden aangemaakt. Probeer het opnieuw.");
      setSubmitting(false);
    }
  }

  if (resumePrompt) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">Verder waar je was</p>
        <h1 className="display mb-5">Je hebt een quiz openstaan.</h1>
        <p className="text-ink-raised leading-relaxed mb-10 max-w-xl">
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
            className="btn btn-primary min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
            onClick={() => {
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
            className="btn btn-secondary min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem(STORAGE_KEY(tier));
              }
              setQuestions(initialQuestions);
              setAnswers({});
              setCursor(0);
              submissionIdRef.current = null;
              setResumePrompt(null);
            }}
          >
            Opnieuw beginnen
          </button>
        </div>
      </Container>
    );
  }

  if (completedShareId) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">Resultaat klaar</p>
        <h1 className="display mb-5">Je politieke profiel staat klaar.</h1>
        <p className="text-ink-raised leading-relaxed mb-10 max-w-xl">
          We hebben je antwoorden anoniem opgeslagen onder een deel-ID. Hieronder
          kun je optioneel de link naar je inbox sturen, zodat je je profiel
          later makkelijk terugvindt.
        </p>
        <EmailResultLinkBlock shareId={completedShareId} />
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/r/${completedShareId}`}
            className="btn btn-primary min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
            prefetch={false}
          >
            Bekijk mijn resultaat
            <ArrowRight size={16} strokeWidth={1.8} />
          </Link>
          <p className="text-xs text-text-muted">
            Je kunt de link ook later mailen vanaf de resultaatpagina.
          </p>
        </div>
      </Container>
    );
  }

  const reachedTarget = adaptive
    ? answeredCount >= adaptiveTarget || (cursor >= questions.length && batchDone)
    : cursor >= questions.length;
  const canSubmitResult = canCreateResult(answeredCount);

  if (reachedTarget) {
    return (
      <Container width="narrow" className="py-20 md:py-28">
        <p className="kicker mb-4">
          {canSubmitResult ? "Alle stellingen ingevuld" : "Nog niet genoeg antwoorden"}
        </p>
        <h1 className="display mb-5">
          {canSubmitResult
            ? "Klaar voor je profiel."
            : `Beantwoord nog ${MINIMUM_RESULT_ANSWERS - answeredCount} stellingen.`}
        </h1>
        <p className="text-ink-raised leading-relaxed mb-10 max-w-xl">
          Je beantwoordde{" "}
          <span className="mono tabular-nums">{answeredCount}</span> van{" "}
          <span className="mono tabular-nums">{adaptiveTarget}</span> stellingen
          {answeredCount < adaptiveTarget
            ? ` (${adaptiveTarget - answeredCount} overgeslagen)`
            : ""}
          .{" "}
          {canSubmitResult
            ? "Klik hieronder om je profiel te berekenen."
            : "Een overgeslagen stelling telt niet mee. Ga terug naar de laatste vraag en pas je antwoorden aan."}
        </p>
        {error && (
          <div
            role="alert"
            className="mb-8 border border-danger bg-canvas-pressed text-ink px-4 py-3 text-sm"
          >
            {error}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {canSubmitResult && (
            <button
              type="button"
              className="btn btn-primary min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
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
          )}
          {questions.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary min-h-11 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
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
        <p className="text-ink-raised leading-relaxed mb-10 max-w-xl">
          Op basis van je antwoorden tot nu toe kiezen we de volgende set
          stellingen.
        </p>
        <Loader2 size={20} className="animate-spin text-text-muted" strokeWidth={1.8} />
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
    <div
      data-active-quiz
      className="min-h-[calc(100svh-4rem)] bg-canvas text-ink"
    >
      <style>{`
        body:has([data-active-quiz]) > footer {
          display: none !important;
        }
      `}</style>

      <Container width="bleed" className="py-5 sm:py-7 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(8.5rem,2fr)_minmax(0,8fr)_minmax(13rem,3fr)] lg:gap-0">
          <aside className="border-b border-rule-strong pb-5 lg:sticky lg:top-28 lg:self-start lg:border-b-0 lg:border-r lg:pb-8 lg:pr-6 xl:pr-8">
            <div className="mb-5 flex min-h-11 items-center justify-between gap-3 lg:mb-8 lg:block">
              <p className="mono text-[0.68rem] font-medium uppercase tracking-[0.16em] text-text-muted">
                {TIER_LABELS[tier]} quiz
              </p>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-ink underline decoration-rule-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 lg:mt-7 lg:w-full"
              >
                Stoppen en bewaren
              </Link>
            </div>
            <QuizProgress current={Math.min(cursor + 1, total)} total={total} />
            <p className="mt-4 hidden text-xs leading-relaxed text-text-muted lg:block">
              Je voortgang wordt alleen in deze browser bewaard.
            </p>
          </aside>

          <section
            aria-labelledby={`quiz-question-${current.id}`}
            className="min-w-0 lg:px-8 xl:px-12"
          >
            <AnimatePresence
              mode={reduce ? "sync" : "wait"}
              custom={direction}
              initial={!reduce}
            >
              <motion.article
                key={current.id}
                custom={direction}
                initial={reduce ? false : { opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: direction * -24 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }
                }
              >
                <div className="mb-6 flex min-h-11 items-center justify-between gap-3 sm:mb-8">
                  <div className="inline-flex min-h-8 items-center gap-3 border border-rule-strong px-3 py-1.5">
                    <span
                      aria-hidden
                      className="block h-2 w-2 rotate-45 bg-signal"
                    />
                    <span className="mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                      {meta.label}
                    </span>
                  </div>
                  {hasInfo && (
                    <button
                      type="button"
                      onClick={openInfoDrawer}
                      className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-semibold text-ink underline decoration-rule-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2 lg:hidden"
                    >
                      <Info aria-hidden size={17} strokeWidth={1.8} />
                      Uitleg
                    </button>
                  )}
                </div>

                <h1
                  id={`quiz-question-${current.id}`}
                  className={cx(
                    "max-w-[22ch] text-balance text-[clamp(1.8rem,4.2vw,3.75rem)] font-black leading-[0.98] tracking-[-0.045em] text-ink",
                    "mb-8 sm:mb-10 lg:mb-12",
                  )}
                >
                  {current.statement}
                </h1>

                <QuizSegmentBar
                  selected={answers[current.id] as AnswerValue | undefined | null}
                  onChange={(value) => setAnswer(value)}
                />

                <div className="mt-6 flex items-center justify-between gap-2 border-t border-rule pt-4 sm:mt-8">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={cursor === 0}
                    className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
                  >
                    <ArrowLeft aria-hidden size={16} strokeWidth={1.8} />
                    Vorige
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswer(null)}
                    className="inline-flex min-h-11 items-center gap-2 px-2 text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
                  >
                    Overslaan
                    <SkipForward aria-hidden size={16} strokeWidth={1.8} />
                  </button>
                </div>
              </motion.article>
            </AnimatePresence>
          </section>

          <aside
            aria-label="Hulp en privacy"
            className="hidden border-l border-rule-strong pl-6 lg:block xl:pl-8"
          >
            <div className="sticky top-28 space-y-8">
              <section>
                <p className="mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                  Hulp bij deze vraag
                </p>
                {hasInfo ? (
                  <>
                    <p className="mt-4 text-sm leading-relaxed text-text-muted">
                      Lees context, argumenten en bronnen zonder je antwoord te verlaten.
                    </p>
                    <button
                      type="button"
                      onClick={openInfoDrawer}
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-between gap-3 border-y border-rule py-2 text-left text-sm font-semibold text-ink focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
                    >
                      Achtergrond en bronnen
                      <Info aria-hidden size={17} strokeWidth={1.8} />
                    </button>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-relaxed text-text-muted">
                    Voor deze stelling is geen extra achtergrond beschikbaar.
                  </p>
                )}
              </section>

              <section className="border-t border-rule pt-6">
                <p className="mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-text-muted">
                  Privacy
                </p>
                <p className="mt-4 text-sm leading-relaxed text-text-muted">
                  Je antwoorden blijven tijdens de quiz in deze browser. We sturen ze
                  pas op wanneer je je profiel berekent.
                </p>
                <Link
                  href="/privacy"
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-ink underline decoration-rule-strong underline-offset-4 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus focus-visible:ring-offset-2"
                >
                  Lees het privacybeleid
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </Container>

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
    </div>
  );
}
