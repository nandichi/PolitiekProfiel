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
      className="grid gap-8 md:gap-12 md:grid-cols-[1fr_1fr_auto] md:items-end"
    >
      <label className="block">
        <span className="kicker">
          <span className="display text-base text-ink mr-2 align-baseline">
            A
          </span>
          Profiel A
        </span>
        <input
          type="text"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Plak link of share-id"
          className="field-editorial mt-3"
          autoComplete="off"
        />
      </label>
      <label className="block">
        <span className="kicker">
          <span className="display text-base text-terra mr-2 align-baseline">
            B
          </span>
          Profiel B
        </span>
        <input
          type="text"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Plak link of share-id"
          className="field-editorial mt-3"
          autoComplete="off"
        />
      </label>
      <button type="submit" className="btn btn-primary md:self-end">
        Vergelijk
        <ArrowRight size={16} strokeWidth={1.8} />
      </button>
    </form>
  );
}
