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
    <div className="border border-rule bg-paper-50/40 p-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
        <label className="block">
          <span className="kicker mb-2 block">Voeg een share-link of -id toe</span>
          <div className="flex items-center gap-2 border border-rule bg-paper px-3 py-2">
            <Plus size={14} strokeWidth={1.8} className="text-ink-muted" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="abc123XYZ of https://politiekprofiel.nl/r/abc123…"
              className="flex-1 bg-transparent text-sm text-ink focus:outline-none"
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
          className="btn btn-primary self-end"
        >
          Voeg toe
          <ArrowRight size={14} strokeWidth={1.8} />
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-terra">{error}</p>}

      {ids.length > 0 && (
        <div className="mt-6">
          <div className="flex items-baseline justify-between">
            <p className="kicker">In je tijdlijn</p>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-ink-muted hover:text-terra"
            >
              Leegmaken
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ids.map((id) => (
              <li
                key={id}
                className="inline-flex items-center gap-2 border border-rule bg-paper px-3 py-1.5"
              >
                <span className="mono text-xs text-ink-2">{id}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(id)}
                  className="text-ink-muted hover:text-terra"
                  aria-label={`Verwijder ${id}`}
                >
                  <X size={12} strokeWidth={2} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-xs text-ink-muted">
        Tip: bewaar de URL als bookmark als je vaker terug wilt komen. We slaan
        je keten alleen in jouw browser op (localStorage), nooit op de server.
      </p>
    </div>
  );
}
