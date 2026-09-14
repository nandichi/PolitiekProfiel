"use client";

import { useEffect, useRef } from "react";

const AXES = [
  { id: "economie", label: "Economie", left: "markt", right: "staat", x: 406, y: 108 },
  { id: "cultuur", label: "Cultuur", left: "behoud", right: "verandering", x: 476, y: 164 },
  { id: "vrijheid", label: "Vrijheid", left: "orde", right: "ruimte", x: 338, y: 224 },
  { id: "bestuur", label: "Bestuur", left: "nationaal", right: "Europees", x: 448, y: 284 },
  { id: "vertrouwen", label: "Vertrouwen", left: "kritisch", right: "vertrouwen", x: 376, y: 344 },
] as const;

const TRACE_PATHS = [
  "M 16 108 C 132 108, 160 52, 274 92 S 428 136, 596 108",
  "M 16 164 C 126 164, 188 208, 278 160 S 446 116, 596 164",
  "M 16 224 C 126 224, 170 170, 284 238 S 434 274, 596 224",
  "M 16 284 C 124 284, 176 342, 276 288 S 446 240, 596 284",
  "M 16 344 C 128 344, 172 292, 286 338 S 438 392, 596 344",
] as const;

export function CivicField() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      element.classList.toggle("is-reduced", media.matches);
      element.classList.toggle("is-active", !media.matches);
    };

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);

    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  return (
    <aside
      ref={ref}
      className="civic-field"
      aria-label="Illustratie van de vijf onafhankelijke dimensies van PolitiekProfiel"
    >
      <div className="civic-field__topline">
        <p className="mono">VIJF ASSEN. GEEN ETIKET.</p>
        <span className="mono">01 / 05</span>
      </div>

      <div className="civic-field__canvas">
        <svg
          className="civic-field__svg"
          viewBox="0 0 612 452"
          role="img"
          aria-labelledby="civic-field-title civic-field-description"
        >
          <title id="civic-field-title">Vijf politieke assen in beweging</title>
          <desc id="civic-field-description">
            Vijf afzonderlijke lijnen kruisen elkaar zonder samen te vallen.
          </desc>
          <rect className="civic-field__frame" x="16" y="52" width="580" height="328" />
          <line className="civic-field__spine" x1="306" x2="306" y1="52" y2="380" />
          {TRACE_PATHS.map((path, index) => (
            <g className="civic-field__trace-group" key={AXES[index].id}>
              <path className="civic-field__trace-ghost" d={path} />
              <path
                className="civic-field__trace"
                d={path}
                style={{ animationDelay: `${220 + index * 150}ms` }}
              />
              <circle
                className="civic-field__signal-ring"
                cx={AXES[index].x}
                cy={AXES[index].y}
                r="10"
                style={{ animationDelay: `${850 + index * 155}ms` }}
              />
              <rect
                className="civic-field__signal"
                x={AXES[index].x - 4}
                y={AXES[index].y - 4}
                width="8"
                height="8"
                style={{ animationDelay: `${760 + index * 155}ms` }}
              />
              <text className="civic-field__number" x="26" y={AXES[index].y + 4}>
                {String(index + 1).padStart(2, "0")}
              </text>
            </g>
          ))}
          <path className="civic-field__fold" d="M 306 52 L 320 64 L 306 76 L 292 64 Z" />
          <path className="civic-field__fold" d="M 306 356 L 320 368 L 306 380 L 292 368 Z" />
        </svg>
      </div>

      <ol className="civic-field__index">
        {AXES.map((axis, index) => (
          <li key={axis.id}>
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <strong>{axis.label}</strong>
            <span className="civic-field__poles">
              {axis.left} <i /> {axis.right}
            </span>
          </li>
        ))}
      </ol>

      <div className="civic-field__note">
        <p>Geen as dicteert de rest. Samen vormen ze een profiel.</p>
        <span className="mono">VRAAG VOOR VRAAG</span>
      </div>
    </aside>
  );
}
