import Link from "next/link";
import { formatNumber, formatPct, mono, tokens } from "../styles";

export interface BarChartRow {
  label: string;
  value: number;
  href?: string;
}

interface BarChartProps {
  rows: BarChartRow[];
  showPercent?: boolean;
  maxRows?: number;
}

export function BarChart({ rows, showPercent = true, maxRows }: BarChartProps) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          color: tokens.textMuted,
          padding: "16px 0",
          fontSize: "0.85rem",
        }}
      >
        Geen data.
      </div>
    );
  }
  const list = typeof maxRows === "number" ? rows.slice(0, maxRows) : rows;
  const total = rows.reduce((acc, r) => acc + r.value, 0);
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {list.map((row) => {
        const widthPct = (row.value / max) * 100;
        const sharePct = total > 0 ? row.value / total : 0;
        const labelNode = (
          <span
            style={{
              fontSize: "0.85rem",
              color: tokens.text,
              textDecoration: "none",
            }}
          >
            {row.label}
          </span>
        );
        return (
          <div key={row.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "3px",
              }}
            >
              {row.href ? (
                <Link
                  href={row.href}
                  style={{
                    textDecoration: "none",
                    color: tokens.text,
                  }}
                >
                  {labelNode}
                </Link>
              ) : (
                labelNode
              )}
              <span
                style={{
                  ...mono,
                  color: tokens.textMuted,
                  fontSize: "0.8rem",
                }}
              >
                {formatNumber(row.value)}
                {showPercent && total > 0 && (
                  <span
                    style={{ marginLeft: "10px", color: tokens.textSubtle }}
                  >
                    {formatPct(sharePct, 1)}
                  </span>
                )}
              </span>
            </div>
            <div
              style={{
                height: "10px",
                background: tokens.surfaceMuted,
                position: "relative",
                border: `1px solid ${tokens.border}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${widthPct}%`,
                  background: tokens.accentMuted,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
