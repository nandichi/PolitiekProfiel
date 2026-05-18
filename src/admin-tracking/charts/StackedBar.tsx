import { formatNumber, mono, tokens } from "../styles";

export interface StackedSegment {
  key: string;
  label: string;
  value: number;
  color: string;
}

export interface StackedRow {
  label: string;
  segments: StackedSegment[];
  href?: string;
}

interface StackedBarProps {
  rows: StackedRow[];
}

const ANSWER_LABEL: Record<string, string> = {
  "strong-negative": "Sterk oneens",
  "mild-negative": "Oneens",
  neutral: "Neutraal",
  "mild-positive": "Eens",
  "strong-positive": "Sterk eens",
  skipped: "Overgeslagen",
};

export const ANSWER_COLORS: Record<string, string> = {
  "strong-negative": "var(--theme-error-600)",
  "mild-negative": "var(--theme-error-400)",
  neutral: "var(--theme-elevation-300)",
  "mild-positive": "var(--theme-success-400)",
  "strong-positive": "var(--theme-success-600)",
  skipped: "var(--theme-elevation-200)",
};

export function StackedBar({ rows }: StackedBarProps) {
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "12px",
          fontSize: "0.75rem",
          color: tokens.textMuted,
          ...mono,
        }}
      >
        {Object.keys(ANSWER_LABEL).map((k) => (
          <span
            key={k}
            style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: ANSWER_COLORS[k],
              }}
            />
            {ANSWER_LABEL[k]}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {rows.map((row) => {
          const total = row.segments.reduce((acc, s) => acc + s.value, 0);
          return (
            <div
              key={row.label}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 3fr",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: tokens.text,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={row.label}
              >
                {row.label}
              </div>
              <div
                style={{
                  display: "flex",
                  height: "16px",
                  background: tokens.surfaceMuted,
                  border: `1px solid ${tokens.border}`,
                  overflow: "hidden",
                }}
                title={`${formatNumber(total)} antwoorden`}
              >
                {row.segments.map((seg) => {
                  const pct = total > 0 ? (seg.value / total) * 100 : 0;
                  if (pct <= 0) return null;
                  return (
                    <div
                      key={seg.key}
                      style={{
                        flexBasis: `${pct}%`,
                        background: seg.color,
                      }}
                      title={`${ANSWER_LABEL[seg.key] ?? seg.label}: ${formatNumber(seg.value)}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
