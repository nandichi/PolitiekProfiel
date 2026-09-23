"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Check, X } from "lucide-react";
import type { TuringQuote, QuoteCamp } from "@/data/turing-quotes";

interface TuringGameProps {
  quotes: TuringQuote[];
}

const CAMP_LABEL: Record<QuoteCamp, string> = {
  links: "Links",
  midden: "Midden",
  rechts: "Rechts",
};

const CAMP_DESC: Record<QuoteCamp, string> = {
  links: "Sociaal-democratisch, groen, ecologisch, herverdelend.",
  midden: "Christen-democratisch, sociaal-liberaal, federalist.",
  rechts: "Conservatief, liberaal-rechts, nationalistisch, populistisch-rechts.",
};

export function TuringGame({ quotes }: TuringGameProps) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuoteCamp | null>>({});
  const [done, setDone] = useState(false);

  const current = quotes[idx];
  const total = quotes.length;
  const score = useMemo(() => {
    return quotes.reduce((acc, q) => acc + (answers[q.id] === q.camp ? 1 : 0), 0);
  }, [answers, quotes]);

  function handlePick(camp: QuoteCamp) {
    if (answers[current.id] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [current.id]: camp }));
  }

  function handleNext() {
    if (idx + 1 >= total) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
  }

  function handleReset() {
    setIdx(0);
    setAnswers({});
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / total) * 100);
    const verdict =
      pct >= 80
        ? "Indrukwekkend. Je voelt het politieke landschap als geen ander."
        : pct >= 60
          ? "Solide. Je herkent stijlen, maar er zijn nog blinde vlekken."
          : pct >= 40
            ? "Gemiddeld. Politieke retoriek is vaak gladder dan we denken."
            : "Doe het nog een keer. Niemand wordt geboren met een politiek oor.";

    return (
      <div
        role="region"
        aria-labelledby="turing-result-title"
        className="border border-rule-strong bg-canvas-raised p-5 sm:p-8"
      >
        <p className="kicker mb-3">Klaar</p>
        <h2
          id="turing-result-title"
          className="display text-3xl text-ink md:text-4xl"
        >
          {score}/{total}{" "}
          <span className="text-text-muted text-2xl">({pct}%)</span>
        </h2>
        <p className="mt-3 text-ink-raised">{verdict}</p>

        <div className="mt-8 border-t border-rule pt-6">
          <p className="kicker mb-4">Jouw antwoorden</p>
          <ul className="space-y-4">
            {quotes.map((q, i) => {
              const guess = answers[q.id];
              const correct = guess === q.camp;
              return (
                <li key={q.id} className="border-l-2 pl-4 border-rule">
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <Check
                        size={16}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-success"
                        aria-hidden
                      />
                    ) : (
                      <X
                        size={16}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-danger"
                        aria-hidden
                      />
                    )}
                    <div>
                      <p className="text-sm text-ink-raised leading-relaxed">
                        <span className="mono text-[0.6rem] tracking-wider text-text-muted mr-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {q.text}
                      </p>
                      <p className="mt-2 text-xs text-text-muted">
                        Jouw gok:{" "}
                        <span className="text-ink-raised">
                          {guess ? CAMP_LABEL[guess] : "n.v.t."}
                        </span>
                        <span className="mx-2 text-text-muted">·</span>
                        Juist:{" "}
                        <span className="text-ink-raised">{CAMP_LABEL[q.camp]}</span>
                      </p>
                      {q.explanation && (
                        <p className="mt-1 text-xs text-text-muted italic">
                          {q.explanation}
                        </p>
                      )}

                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-primary min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <RotateCcw size={14} strokeWidth={1.8} aria-hidden />
            Doe het nog eens
          </button>
        </div>
      </div>
    );
  }

  const answered = answers[current.id] !== undefined;

  return (
    <div
      role="region"
      aria-labelledby="turing-fragment-title"
      className="border border-rule-strong bg-canvas-raised p-5 sm:p-8"
    >
      <div className="flex items-baseline justify-between mb-6">
        <p className="kicker">
          Fragment {idx + 1} van {total}
        </p>
        <p className="mono tabular-nums text-xs text-text-muted">
          SCORE {score}/{idx + (answered ? 1 : 0)}
        </p>
      </div>

      <p
        id="turing-fragment-title"
        className="display text-2xl leading-snug text-ink md:text-3xl"
        style={{ letterSpacing: "-0.015em" }}
      >
        {current.text}
      </p>

      {!answered && (
        <div className="mt-10">
          <p className="kicker mb-4">Welk kamp?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["links", "midden", "rechts"] as QuoteCamp[]).map((camp) => (
              <button
                key={camp}
                type="button"
                onClick={() => handlePick(camp)}
                className="min-h-11 rounded-[2px] border border-rule bg-canvas px-5 py-4 text-left transition-colors hover:border-signal hover:bg-canvas-pressed focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <p className="display text-lg text-ink">{CAMP_LABEL[camp]}</p>
                <p className="mt-1 text-xs text-text-muted leading-snug">
                  {CAMP_DESC[camp]}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {answered && (
        <div
          className="mt-10 border-t border-rule pt-6"
          role="status"
          aria-live="polite"
        >
          {answers[current.id] === current.camp ? (
            <div className="flex items-start gap-2">
              <Check
                size={20}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-success"
                aria-hidden
              />
              <div>
                <p className="display text-lg text-ink">Correct.</p>
                {current.explanation && (
                  <p className="mt-1 text-sm text-ink-raised leading-relaxed">
                    {current.explanation}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <X
                size={20}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-danger"
                aria-hidden
              />
              <div>
                <p className="display text-lg text-ink">
                  Juiste antwoord: {CAMP_LABEL[current.camp]}.
                </p>
                {current.explanation && (
                  <p className="mt-1 text-sm text-ink-raised leading-relaxed">
                    {current.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              {idx + 1 >= total ? "Toon de uitslag" : "Volgend fragment"}
              <ArrowRight size={14} strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
