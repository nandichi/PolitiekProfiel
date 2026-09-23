"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, ArrowRight } from "lucide-react";

interface EvolutionPickerProps {
  initialIds: string[];
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
    // fallthrough
  }
  if (/^[A-Za-z0-9_-]{6,32}$/.test(trimmed)) return trimmed;
  return null;
}

const STORAGE_KEY = "pp.evolutie.ids";

export function EvolutionPicker({ initialIds }: EvolutionPickerProps) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(initialIds);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Sync naar localStorage zodat de gebruiker bij terugkeer zijn keten heeft.
  // Dit is bewust niet server-side: privacy-belofte.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialIds.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, ids.join(","));
      return;
    }
    // Bij verse load zonder ?ids: probeer localStorage te restoren.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = stored.split(",").filter(Boolean);
      if (parsed.length > 0) {
        const params = new URLSearchParams();
        params.set("ids", parsed.join(","));
        router.replace(`?${params.toString()}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, ids.join(","));
  }, [ids]);

  function pushNewState(next: string[]) {
    const params = new URLSearchParams();
    if (next.length > 0) params.set("ids", next.join(","));
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }

  function handleAdd() {
    const id = extractShareId(input);
    if (!id) {
      setError("Geen geldig share-id of share-link gevonden.");
      return;
    }
    if (ids.includes(id)) {
      setError("Deze ID staat al in de lijst.");
      return;
    }
    setError(null);
    const next = [...ids, id];
    setIds(next);
    setInput("");
    pushNewState(next);
  }

  function handleRemove(id: string) {
    const next = ids.filter((x) => x !== id);
    setIds(next);
    pushNewState(next);
  }

  function handleClear() {
    setIds([]);
    pushNewState([]);
  }

  return (
    <section
      aria-labelledby="evolution-picker-heading"
      className="max-w-3xl border border-rule bg-canvas-raised p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <label htmlFor="evolution-share-id" className="block">
          <span id="evolution-picker-heading" className="kicker mb-2 block">
            Voeg een share-link of -id toe
          </span>
          <div className="flex min-h-11 items-center gap-2 rounded-[2px] border border-rule-strong bg-canvas px-3 transition-colors focus-within:border-ink focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-focus">
            <Plus
              size={15}
              strokeWidth={1.8}
              className="shrink-0 text-text-muted"
              aria-hidden
            />
            <input
              id="evolution-share-id"
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError(null);
              }}
              placeholder="abc123XYZ of https://politiekprofiel.nl/r/abc123…"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink outline-none placeholder:text-text-muted focus-visible:outline-none"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "evolution-picker-error" : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-primary min-h-11 self-end focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
          Voeg toe
          <ArrowRight size={14} strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      {error && (
        <p
          id="evolution-picker-error"
          role="alert"
          className="mt-3 border-l-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {error}
        </p>
      )}

      {ids.length > 0 && (
        <div className="mt-6 border-t border-rule pt-5">
          <div className="flex items-center justify-between gap-4">
            <p className="kicker">In je tijdlijn</p>
            <button
              type="button"
              onClick={handleClear}
              className="min-h-11 px-2 text-xs font-semibold text-text-muted underline decoration-rule-strong underline-offset-4 transition-colors hover:text-danger focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Leegmaken
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2" aria-live="polite">
            {ids.map((id) => (
              <li
                key={id}
                className="inline-flex min-h-11 max-w-full items-center gap-2 border border-rule bg-canvas px-3"
              >
                <span className="mono min-w-0 break-all text-xs text-ink-raised">
                  {id}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(id)}
                  className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-text-muted transition-colors hover:text-danger focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-focus"
                  aria-label={`Verwijder ${id}`}
                >
                  <X size={14} strokeWidth={2} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 max-w-[68ch] text-xs leading-relaxed text-text-muted">
        Tip: bewaar de URL als bookmark als je vaker terug wilt komen. We slaan
        je keten alleen in jouw browser op (localStorage), nooit op de server.
      </p>
    </section>
  );
}
