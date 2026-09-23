"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

function extractId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http")) {
    try {
      const u = new URL(trimmed);
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.indexOf("r");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    } catch {
      /* negeer */
    }
  }
  return trimmed;
}

const fieldClass =
  "mt-3 min-h-11 w-full rounded-[2px] border border-rule-strong bg-canvas-raised px-3 py-2.5 text-base text-ink outline-none transition-colors placeholder:text-text-muted hover:border-ink focus-visible:border-ink focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus";

export function CompareLookup({
  aPrefill,
  bPrefill,
}: {
  aPrefill: string;
  bPrefill: string;
}) {
  const [a, setA] = useState(aPrefill);
  const [b, setB] = useState(bPrefill);
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const aId = extractId(a);
    const bId = extractId(b);
    const params = new URLSearchParams();
    if (aId) params.set("a", aId);
    if (bId) params.set("b", bId);
    router.push(`/vergelijk?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-6 border-y border-rule py-6 md:grid-cols-[1fr_1fr_auto] md:items-end md:gap-8"
    >
      <label htmlFor="compare-profile-a" className="block">
        <span className="kicker">
          <span className="display mr-2 align-baseline text-base text-compare-a">
            A
          </span>
          Profiel A
        </span>
        <input
          id="compare-profile-a"
          type="text"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Plak link of share-id"
          className={fieldClass}
          autoComplete="off"
        />
      </label>
      <label htmlFor="compare-profile-b" className="block">
        <span className="kicker">
          <span className="display mr-2 align-baseline text-base text-compare-b">
            B
          </span>
          Profiel B
        </span>
        <input
          id="compare-profile-b"
          type="text"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Plak link of share-id"
          className={fieldClass}
          autoComplete="off"
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary min-h-11 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-focus md:self-end"
      >
        Vergelijk
        <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
      </button>
    </form>
  );
}
