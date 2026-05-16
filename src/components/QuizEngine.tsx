"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import type { QuizQuestion } from "@/lib/quiz-data";
import type { AnswerValue, Tier } from "@/lib/dimensions";
import { Container } from "@/components/Container";

type AnswerMap = Record<number, AnswerValue | null>;

const STORAGE_KEY = (tier: Tier) => `politiekprofiel-quiz-${tier}`;

const ANSWER_OPTIONS: { value: AnswerValue; label: string }[] = [
  { value: 2, label: "Volledig mee eens" },
  { value: 1, label: "Mee eens" },
  { value: 0, label: "Neutraal" },
  { value: -1, label: "Mee oneens" },
  { value: -2, label: "Volledig mee oneens" },
];

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
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [cursor, setCursor] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<PersistedState | null>(null);

  const total = questions.length;
  const current = questions[cursor];

  useEffect(() => {
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
  const progressPct = Math.round((cursor / total) * 100);

  function setAnswer(value: AnswerValue | null) {
    if (!current) return;
    setAnswers((a) => ({ ...a, [current.id]: value }));
    setShowInfo(false);
    setTimeout(() => {
      setCursor((c) => Math.min(c + 1, total));
    }, 80);
  }

  function goBack() {
    setShowInfo(false);
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
        throw new Error(json.error ?? `Aanmaken mislukt (status ${res.status}).`);
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

  if (resumePrompt) {
    return (
      <Container width="narrow" className="py-20">
        <p className="kicker mb-3">Verder waar je was?</p>
        <h1 className="serif mb-4">Je hebt een quiz openstaan</h1>
        <p className="text-ink-soft mb-8">
          Je was bezig met de {TIER_LABELS[tier].toLowerCase()} quiz en hebt{" "}
          {Object.keys(resumePrompt.answers).length} vragen beantwoord. Wil je
          verder gaan waar je bleef of opnieuw beginnen?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setAnswers(resumePrompt.answers ?? {});
              setCursor(resumePrompt.cursor ?? 0);
              setResumePrompt(null);
            }}
          >
            Verder waar ik was
            <ArrowRight size={16} strokeWidth={1.7} />
          </button>
          <button
            type="button"
            className="btn-secondary"
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

  if (cursor >= total) {
    return (
      <Container width="narrow" className="py-20">
        <p className="kicker mb-3">Alle stellingen ingevuld</p>
        <h1 className="serif mb-4">Klaar voor je profiel</h1>
        <p className="text-ink-soft mb-8">
          Je beantwoordde {answeredCount} van {total} stellingen
          {answeredCount < total
            ? ` (${total - answeredCount} overgeslagen)`
            : ""}
          . Klik hieronder om je profiel te berekenen.
        </p>
        {error && (
          <div className="mb-6 border border-warm/60 bg-warm-soft text-ink px-4 py-3 text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Berekenen…
              </>
            ) : (
              <>
                Bekijk mijn profiel
                <ArrowRight size={16} strokeWidth={1.7} />
              </>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setCursor(total - 1)}
            disabled={submitting}
          >
            Terug naar laatste vraag
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container width="narrow" className="py-12 md:py-16">
      {/* progress */}
      <div className="flex items-center justify-between text-sm text-ink-muted mb-4">
        <span className="kicker">
          {TIER_LABELS[tier]} · vraag {cursor + 1} van {total}
        </span>
        <Link href="/" className="hover:text-ink underline-offset-4">
          Stop &amp; bewaar
        </Link>
      </div>
      <div className="h-px bg-rule mb-12 relative">
        <div
          className="absolute top-0 left-0 h-px bg-ink transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <article>
        <h2 className="serif text-2xl md:text-3xl leading-snug mb-4">
          {current.statement}
        </h2>
        <div className="flex items-center gap-3 text-xs text-ink-muted mb-10">
          <span className="border border-rule px-2 py-0.5">
            {dimensionLabel(current.dimension)}
          </span>
          {current.info?.context || current.info?.sources.length ? (
            <button
              type="button"
              onClick={() => setShowInfo(true)}
              className="inline-flex items-center gap-1.5 hover:text-ink"
            >
              <Info size={14} strokeWidth={1.7} />
              Achtergrond
            </button>
          ) : null}
        </div>

        <ul className="space-y-2 mb-8">
          {ANSWER_OPTIONS.map((opt) => {
            const selected = answers[current.id] === opt.value;
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => setAnswer(opt.value)}
                  className={`group w-full flex items-center justify-between border px-5 py-4 text-left transition-colors ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : "border-rule bg-paper hover:border-ink"
                  }`}
                >
                  <span className="text-base">{opt.label}</span>
                  <span
                    className={`text-xs ${
                      selected ? "text-paper/80" : "text-ink-muted"
                    }`}
                  >
                    {opt.value > 0 ? `+${opt.value}` : opt.value}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={goBack}
            disabled={cursor === 0}
            className="btn-ghost disabled:opacity-30"
          >
            <ArrowLeft size={16} strokeWidth={1.7} />
            Vorige
          </button>
          <button
            type="button"
            onClick={() => setAnswer(null)}
            className="btn-ghost"
          >
            Overslaan
            <ArrowRight size={16} strokeWidth={1.7} />
          </button>
        </div>
      </article>

      {showInfo && current && (
        <InfoModal question={current} onClose={() => setShowInfo(false)} />
      )}
    </Container>
  );
}

function dimensionLabel(id: string): string {
  switch (id) {
    case "economic":
      return "Economisch";
    case "social":
      return "Sociaal-cultureel";
    case "civil":
      return "Burgerrechten";
    case "governance":
      return "Bestuur";
    case "trust":
      return "Systeemvertrouwen";
    default:
      return id;
  }
}

function InfoModal({
  question,
  onClose,
}: {
  question: QuizQuestion;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end md:items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-paper border border-rule-strong p-8 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-ink-muted hover:text-ink"
          aria-label="Sluiten"
        >
          <X size={20} strokeWidth={1.6} />
        </button>
        <p className="kicker mb-3">Achtergrond bij de stelling</p>
        <h3 className="serif text-xl mb-6">{question.statement}</h3>
        {question.info?.context && (
          <div className="mb-6">
            <p className="kicker mb-2">Context</p>
            <p className="text-ink-soft text-sm leading-relaxed">
              {question.info.context}
            </p>
          </div>
        )}
        {(question.info?.argumentsFor?.length ?? 0) > 0 && (
          <div className="mb-6">
            <p className="kicker mb-2">Argumenten vóór</p>
            <ul className="space-y-1.5 text-sm text-ink-soft list-disc pl-5">
              {question.info!.argumentsFor.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
        {(question.info?.argumentsAgainst?.length ?? 0) > 0 && (
          <div className="mb-6">
            <p className="kicker mb-2">Argumenten tegen</p>
            <ul className="space-y-1.5 text-sm text-ink-soft list-disc pl-5">
              {question.info!.argumentsAgainst.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </div>
        )}
        {(question.info?.sources?.length ?? 0) > 0 && (
          <div>
            <p className="kicker mb-2">Bronnen</p>
            <ul className="space-y-1.5 text-sm">
              {question.info!.sources.map((s, i) => (
                <li key={i}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5"
                  >
                    {s.label}
                    <ExternalLink size={12} strokeWidth={1.6} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
