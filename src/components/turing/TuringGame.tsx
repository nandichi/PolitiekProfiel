"use client";

import { useMemo, useState } from "react";
import { ArrowRight, RotateCcw, Check, X, ExternalLink } from "lucide-react";
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
      <div className="border border-rule bg-paper p-8">
        <p className="kicker mb-3">Klaar</p>
        <h2 className="display text-3xl md:text-4xl text-ink">
          {score}/{total}{" "}
          <span className="text-ink-muted text-2xl">({pct}%)</span>
        </h2>
        <p className="mt-3 text-ink-2">{verdict}</p>

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
                      <Check size={16} strokeWidth={2} className="text-navy mt-0.5 shrink-0" />
                    ) : (
                      <X size={16} strokeWidth={2} className="text-terra mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        <span className="mono text-[0.6rem] tracking-wider text-ink-subtle mr-2">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {q.text}
                      </p>
                      <p className="mt-2 text-xs text-ink-muted">
                        Jouw gok:{" "}
                        <span className="text-ink-2">
                          {guess ? CAMP_LABEL[guess] : "—"}
                        </span>
                        <span className="mx-2 text-ink-subtle">·</span>
                        Juist:{" "}
                        <span className="text-ink-2">{CAMP_LABEL[q.camp]}</span>
                      </p>
                      {q.explanation && (
                        <p className="mt-1 text-xs text-ink-muted italic">
                          {q.explanation}
                        </p>
                      )}
                      <a
                        href={q.source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[0.7rem] text-ink-subtle hover:text-navy no-underline"
                      >
                        Bron: {q.source.label}
                        <ExternalLink size={10} strokeWidth={1.8} />
                      </a>
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
            className="btn btn-primary"
          >
            <RotateCcw size={14} strokeWidth={1.8} />
            Doe het nog eens
          </button>
        </div>
      </div>
    );
  }

  const answered = answers[current.id] !== undefined;

  return (
    <div className="border border-rule bg-paper p-8">
      <div className="flex items-baseline justify-between mb-6">
        <p className="kicker">
          Citaat {idx + 1} van {total}
        </p>
        <p className="mono tabular-nums text-xs text-ink-muted">
          SCORE {score}/{idx + (answered ? 1 : 0)}
        </p>
      </div>

      <blockquote
        className="display text-2xl md:text-3xl leading-snug text-ink"
        style={{ letterSpacing: "-0.015em" }}
      >
        &ldquo;{current.text}&rdquo;
      </blockquote>

      {!answered && (
        <div className="mt-10">
          <p className="kicker mb-4">Welk kamp?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["links", "midden", "rechts"] as QuoteCamp[]).map((camp) => (
              <button
                key={camp}
                type="button"
                onClick={() => handlePick(camp)}
                className="text-left border border-rule px-5 py-4 hover:bg-paper-50 hover:border-navy transition-colors"
              >
                <p className="display text-lg text-ink">{CAMP_LABEL[camp]}</p>
                <p className="mt-1 text-xs text-ink-muted leading-snug">
                  {CAMP_DESC[camp]}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {answered && (
        <div className="mt-10 border-t border-rule pt-6">
          {answers[current.id] === current.camp ? (
            <div className="flex items-start gap-2">
              <Check size={20} strokeWidth={2} className="text-navy mt-0.5 shrink-0" />
              <div>
                <p className="display text-lg text-ink">Correct.</p>
                {current.explanation && (
                  <p className="mt-1 text-sm text-ink-2 leading-relaxed">
                    {current.explanation}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <X size={20} strokeWidth={2} className="text-terra mt-0.5 shrink-0" />
              <div>
                <p className="display text-lg text-ink">
                  Juiste antwoord: {CAMP_LABEL[current.camp]}.
                </p>
                {current.explanation && (
                  <p className="mt-1 text-sm text-ink-2 leading-relaxed">
                    {current.explanation}
                  </p>
                )}
              </div>
            </div>
          )}

          <a
            href={current.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-navy no-underline"
          >
            Bron: {current.source.label}
            {current.paraphrased && (
              <span className="text-ink-subtle">(geparafraseerd)</span>
            )}
            <ExternalLink size={12} strokeWidth={1.8} />
          </a>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
            >
              {idx + 1 >= total ? "Toon de uitslag" : "Volgende citaat"}
              <ArrowRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
