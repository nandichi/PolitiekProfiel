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
    // Not a URL — try treating as raw id
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
    <div className="border border-rule bg-paper-50/40 p-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <label className="block">
          <span className="kicker mb-2 block">Share-link of share-id</span>
          <div className="flex items-center gap-2 border border-rule bg-paper px-3 py-2">
            <LinkIcon size={14} strokeWidth={1.8} className="text-ink-muted" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://politiekprofiel.nl/r/abc123…"
              className="flex-1 bg-transparent text-sm text-ink focus:outline-none"
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
          className="btn btn-primary self-end"
        >
          Toon mijn coalities
          <ArrowRight size={14} strokeWidth={1.8} />
        </button>
      </div>

      {error && (
        <p className="mt-3 text-xs text-terra">{error}</p>
      )}

      <p className="mt-4 text-xs text-ink-muted">
        We lezen de quiz-uitslag eenmalig server-side om jouw vector te
        combineren met de {pool.length} partijen. Geen tracking — nothing
        leaves your browser cache.
      </p>
    </div>
  );
}
