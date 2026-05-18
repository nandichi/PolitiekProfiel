import { formatNumber, formatPct, mono, tokens } from "../styles";

export interface FunnelStep {
  label: string;
  value: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
}

export function FunnelChart({ steps }: FunnelChartProps) {
  if (steps.length === 0) {
    return (
      <div
        style={{
          color: tokens.textMuted,
          padding: "32px 0",
          fontSize: "0.85rem",
        }}
      >
        Geen funnel-data beschikbaar.
      </div>
    );
  }

  const max = Math.max(1, ...steps.map((s) => s.value));
  const start = steps[0]?.value ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {steps.map((step, i) => {
        const widthPct = (step.value / max) * 100;
        const sharePct = start > 0 ? step.value / start : 0;
        const dropFromPrev =
          i > 0 && steps[i - 1].value > 0
            ? 1 - step.value / steps[i - 1].value
            : 0;
        return (
          <div key={step.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "4px",
                fontSize: "0.85rem",
              }}
            >
              <span style={{ color: tokens.text }}>
                <span
                  style={{
                    ...mono,
                    fontSize: "0.7rem",
                    color: tokens.textSubtle,
                    marginRight: "8px",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step.label}
              </span>
              <span style={{ ...mono, color: tokens.textMuted }}>
                {formatNumber(step.value)}{" "}
                <span style={{ color: tokens.textSubtle }}>
                  · {formatPct(sharePct, 1)}
                </span>
                {i > 0 && dropFromPrev > 0 && (
                  <span
                    style={{
                      color: tokens.error,
                      marginLeft: "10px",
                      fontSize: "0.7rem",
                    }}
                  >
                    −{formatPct(dropFromPrev, 1)}
                  </span>
                )}
              </span>
            </div>
            <div
              style={{
                height: "22px",
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
                  background: tokens.accent,
                  transition: "width 0.2s",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
