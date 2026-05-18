import { tokens, formatDateShort, formatNumber, mono } from "../styles";

export interface LineChartPoint {
  date: string;
  starts: number;
  completes: number;
}

interface LineChartProps {
  data: LineChartPoint[];
  height?: number;
}

export function LineChart({ data, height = 220 }: LineChartProps) {
  if (data.length === 0) {
    return (
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: tokens.textMuted,
          border: `1px dashed ${tokens.border}`,
          fontSize: "0.85rem",
        }}
      >
        Geen data in deze periode.
      </div>
    );
  }

  const width = 800;
  const padding = { top: 12, right: 16, bottom: 36, left: 44 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(1, ...data.map((d) => Math.max(d.starts, d.completes)));
  const step = innerWidth / Math.max(1, data.length - 1);

  const xFor = (i: number) => padding.left + i * step;
  const yFor = (v: number) =>
    padding.top + innerHeight - (v / maxValue) * innerHeight;

  const pathFor = (key: "starts" | "completes"): string => {
    return data
      .map((d, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(2)},${yFor(d[key]).toFixed(2)}`)
      .join(" ");
  };

  const gridSteps = 4;
  const gridLines: number[] = [];
  for (let i = 0; i <= gridSteps; i++) {
    gridLines.push((maxValue * i) / gridSteps);
  }

  const labelEvery = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: `${height}px`, display: "block" }}
        role="img"
        aria-label="Quiz starts en completes per dag"
      >
        {gridLines.map((v) => {
          const y = yFor(v);
          return (
            <g key={v}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke={tokens.border}
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                fontSize={10}
                textAnchor="end"
                fill={tokens.textMuted}
                style={{ ...mono }}
              >
                {formatNumber(v)}
              </text>
            </g>
          );
        })}

        <path
          d={pathFor("starts")}
          fill="none"
          stroke={tokens.accent}
          strokeWidth={1.5}
        />
        <path
          d={pathFor("completes")}
          fill="none"
          stroke={tokens.accentMuted}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {data.map((d, i) => (
          <g key={d.date}>
            <circle
              cx={xFor(i)}
              cy={yFor(d.starts)}
              r={2.5}
              fill={tokens.accent}
            />
            <circle
              cx={xFor(i)}
              cy={yFor(d.completes)}
              r={2.5}
              fill={tokens.accentMuted}
            />
            {i % labelEvery === 0 && (
              <text
                x={xFor(i)}
                y={height - 12}
                fontSize={10}
                textAnchor="middle"
                fill={tokens.textMuted}
                style={{ ...mono }}
              >
                {formatDateShort(d.date)}
              </text>
            )}
          </g>
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "8px",
          fontSize: "0.75rem",
          color: tokens.textMuted,
          ...mono,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="2" aria-hidden>
            <line x1="0" y1="1" x2="14" y2="1" stroke={tokens.accent} strokeWidth="1.5" />
          </svg>
          Starts
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <svg width="14" height="2" aria-hidden>
            <line
              x1="0"
              y1="1"
              x2="14"
              y2="1"
              stroke={tokens.accentMuted}
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
          </svg>
          Completes
        </span>
      </div>
    </div>
  );
}
