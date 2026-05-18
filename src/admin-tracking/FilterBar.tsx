"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { mono, tokens } from "./styles";

const RANGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "7", label: "7 dagen" },
  { value: "30", label: "30 dagen" },
  { value: "90", label: "90 dagen" },
  { value: "365", label: "1 jaar" },
  { value: "all", label: "Alles" },
];

const TIER_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Alle tiers" },
  { value: "quick", label: "Quick" },
  { value: "standard", label: "Standaard" },
  { value: "extended", label: "Uitgebreid" },
];

const ADAPTIVE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "Alle modi" },
  { value: "1", label: "Adaptief" },
  { value: "0", label: "Vast" },
];

interface FilterBarProps {
  ideologies: Array<{ slug: string; label: string }>;
}

export function FilterBar({ ideologies }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const currentRange = params.get("range") ?? "30";
  const currentTier = params.get("tier") ?? "";
  const currentAdaptive = params.get("adaptive") ?? "";
  const currentIdeology = params.get("ideology") ?? "";

  const updateParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      const query = next.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    },
    [params, pathname, router],
  );

  const selectStyle: React.CSSProperties = {
    background: tokens.surface,
    border: `1px solid ${tokens.border}`,
    color: tokens.text,
    padding: "6px 10px",
    fontSize: "0.85rem",
    ...mono,
    borderRadius: 0,
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        padding: "12px 16px",
        background: tokens.surfaceMuted,
        border: `1px solid ${tokens.border}`,
        marginBottom: "24px",
      }}
    >
      <span
        style={{
          ...mono,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: tokens.textMuted,
          marginRight: "4px",
        }}
      >
        Filters
      </span>

      <select
        aria-label="Periode"
        value={currentRange}
        onChange={(e) => updateParam("range", e.target.value)}
        style={selectStyle}
      >
        {RANGE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Tier"
        value={currentTier}
        onChange={(e) => updateParam("tier", e.target.value)}
        style={selectStyle}
      >
        {TIER_OPTIONS.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Modus"
        value={currentAdaptive}
        onChange={(e) => updateParam("adaptive", e.target.value)}
        style={selectStyle}
      >
        {ADAPTIVE_OPTIONS.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        aria-label="Ideologie"
        value={currentIdeology}
        onChange={(e) => updateParam("ideology", e.target.value)}
        style={selectStyle}
      >
        <option value="">Alle ideologieën</option>
        {ideologies.map((i) => (
          <option key={i.slug} value={i.slug}>
            {i.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => router.push(pathname)}
        style={{
          ...selectStyle,
          cursor: "pointer",
          color: tokens.textMuted,
        }}
      >
        Reset
      </button>
    </div>
  );
}
