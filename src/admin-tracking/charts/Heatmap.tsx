import Link from "next/link";
import { formatNumber, formatPct, mono, tokens } from "../styles";

export interface HeatmapRow {
  questionId: number;
  label: string;
  views: number;
  dropoffPct: number;
  href?: string;
}

interface HeatmapProps {
  rows: HeatmapRow[];
  maxRows?: number;
}

export function Heatmap({ rows, maxRows = 20 }: HeatmapProps) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          color: tokens.textMuted,
          padding: "16px 0",
          fontSize: "0.85rem",
        }}
      >
        Geen vragen met dropoff-data.
      </div>
    );
  }
  const list = rows.slice(0, maxRows);
  const maxDrop = Math.max(0.01, ...list.map((r) => r.dropoffPct));

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 90px 70px",
          gap: "8px",
          padding: "4px 0 8px 0",
          borderBottom: `1px solid ${tokens.border}`,
          fontSize: "0.7rem",
          ...mono,
          color: tokens.textSubtle,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <span>Vraag</span>
        <span>Stelling</span>
        <span style={{ textAlign: "right" }}>Views</span>
        <span style={{ textAlign: "right" }}>Drop-off</span>
      </div>
      {list.map((row) => {
        const intensity = Math.min(1, row.dropoffPct / maxDrop);
        const bg = `color-mix(in srgb, ${tokens.error} ${Math.round(intensity * 60)}%, transparent)`;
        const content = (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 90px 70px",
              gap: "8px",
              padding: "10px 8px",
              borderBottom: `1px solid ${tokens.border}`,
              background: bg,
              alignItems: "center",
              textDecoration: "none",
              color: tokens.text,
            }}
          >
            <span
              style={{ ...mono, color: tokens.textMuted, fontSize: "0.8rem" }}
            >
              #{row.questionId}
            </span>
            <span
              style={{
                fontSize: "0.85rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={row.label}
            >
              {row.label}
            </span>
            <span
              style={{
                ...mono,
                textAlign: "right",
                fontSize: "0.8rem",
                color: tokens.textMuted,
              }}
            >
              {formatNumber(row.views)}
            </span>
            <span
              style={{
                ...mono,
                textAlign: "right",
                fontSize: "0.85rem",
                color: tokens.text,
              }}
            >
              {formatPct(row.dropoffPct, 1)}
            </span>
          </div>
        );
        if (row.href) {
          return (
            <Link
              key={row.questionId}
              href={row.href}
              style={{ display: "block", color: "inherit" }}
            >
              {content}
            </Link>
          );
        }
        return <div key={row.questionId}>{content}</div>;
      })}
    </div>
  );
}
