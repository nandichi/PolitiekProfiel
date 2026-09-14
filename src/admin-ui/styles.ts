import type { CSSProperties } from "react";

export const tokens = {
  bg: "var(--theme-bg)",
  surface: "var(--theme-elevation-50)",
  surfaceMuted: "var(--theme-elevation-100)",
  surfaceStrong: "var(--theme-elevation-150)",
  border: "var(--theme-border-color)",
  text: "var(--theme-elevation-1000)",
  textMuted: "var(--theme-elevation-650)",
  textSubtle: "var(--theme-elevation-450)",
  accent: "var(--theme-elevation-1000)",
  accentMuted: "var(--theme-elevation-700)",
  accentSubtle: "var(--theme-elevation-300)",
  success: "var(--theme-success-500)",
  warning: "var(--theme-warning-500)",
  error: "var(--theme-error-500)",
  mono: "var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace)",
} as const;

export const card: CSSProperties = {
  border: `1px solid ${tokens.border}`,
  background: tokens.surface,
  padding: "20px",
  borderRadius: "2px",
};

export const cardHeader: CSSProperties = {
  fontFamily: tokens.mono,
  fontSize: "11px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: tokens.textMuted,
  marginBottom: "12px",
};

export const sectionTitle: CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 500,
  color: tokens.text,
  margin: "0 0 16px 0",
};

export const sectionWrap: CSSProperties = {
  marginBottom: "32px",
};

export const muted: CSSProperties = {
  color: tokens.textMuted,
  fontSize: "0.85rem",
};

export const mono: CSSProperties = {
  fontFamily: tokens.mono,
  fontVariantNumeric: "tabular-nums",
};

export const empty: CSSProperties = {
  ...card,
  ...muted,
  textAlign: "center",
  padding: "48px 20px",
};

export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("nl-NL").format(Math.round(n));
}

export function formatPct(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "0%";
  return `${(n * 100).toFixed(digits)}%`;
}

export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0s";
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${restSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return `${hours}u ${restMinutes}m`;
}

export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("nl-NL", {
    day: "2-digit",
    month: "short",
  });
}
