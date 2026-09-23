"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Link as LinkIcon } from "lucide-react";

interface CoalitionResultExplorerProps {
  pool: { slug: string; abbreviation: string }[];
}

function extractShareId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split("/").filter(Boolean);
    const rIdx = segments.indexOf("r");
    if (rIdx !== -1 && segments[rIdx + 1]) return segments[rIdx + 1];
    const qa = url.searchParams.get("a") ?? url.searchParams.get("r");
    if (qa) return qa;
  } catch {
    // Not a URL; try treating as raw id
  }
  if (/^[A-Za-z0-9_-]{6,32}$/.test(trimmed)) return trimmed;
  return null;
}

export function CoalitionResultExplorer({ pool }: CoalitionResultExplorerProps) {
  const router = useRouter();
  const params = useSearchParams();
  const initialFromUrl = params.get("r") ?? "";
  const [input, setInput] = useState(initialFromUrl);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleApply() {
    const id = extractShareId(input);
    if (!id) {
      setError("Geen geldig share-id of share-link gevonden.");
      return;
    }
    setError(null);
    const next = new URLSearchParams(params.toString());
    next.set("r", id);
    startTransition(() => {
      router.push(`?${next.toString()}`, { scroll: false });
    });
  }

  return (
    <section
      aria-labelledby="coalition-result-link-heading"
      className="max-w-3xl border border-rule bg-canvas-raised p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <label htmlFor="coalition-result-link" className="block">
          <span
            id="coalition-result-link-heading"
            className="kicker mb-2 block"
          >
            Share-link of share-id
          </span>
          <div className="flex min-h-11 items-center gap-2 rounded-[2px] border border-rule-strong bg-canvas px-3 transition-colors focus-within:border-ink focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-focus">
            <LinkIcon
              size={15}
              strokeWidth={1.8}
              className="shrink-0 text-text-muted"
              aria-hidden
            />
            <input
              id="coalition-result-link"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://politiekprofiel.nl/r/abc123…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink outline-none placeholder:text-text-muted focus-visible:outline-none"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "coalition-result-error" : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApply();
                }
              }}
            />
          </div>
        </label>
        <button
          type="button"
          onClick={handleApply}
          className="btn btn-primary min-h-11 self-end focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Toon mijn coalities
          <ArrowRight size={14} strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      {error && (
        <p
          id="coalition-result-error"
          role="alert"
          className="mt-3 border-l-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <p className="mt-4 max-w-[68ch] text-xs leading-relaxed text-text-muted">
        We gebruiken je quizuitslag eenmalig om jouw vector te combineren met de{" "}
        {pool.length} partijen. Geen analytics of advertentietracking.
      </p>
    </section>
  );
}
