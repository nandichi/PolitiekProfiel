import type { ReactNode } from "react";
import { card, cardHeader, mono, tokens } from "../styles";

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "default" | "success" | "warning" | "error";
}

const accentColors: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  default: tokens.text,
  success: tokens.success,
  warning: tokens.warning,
  error: tokens.error,
};

export function KpiCard({ label, value, sub, accent = "default" }: KpiCardProps) {
  return (
    <div style={card}>
      <div style={cardHeader}>{label}</div>
      <div
        style={{
          ...mono,
          fontSize: "2rem",
          lineHeight: 1.1,
          color: accentColors[accent],
          fontWeight: 500,
        }}
      >
        {value}
      </div>
      {sub !== undefined && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "0.8rem",
            color: tokens.textMuted,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export function KpiRow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "12px",
      }}
    >
      {children}
    </div>
  );
}
