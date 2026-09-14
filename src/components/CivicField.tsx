"use client";

import { useEffect, useRef } from "react";

const AXES = [
  { id: "economie", label: "Economie", left: "vrije markt", right: "sterke staat" },
  { id: "cultuur", label: "Cultuur", left: "behoud", right: "verandering" },
  { id: "vrijheid", label: "Vrijheid", left: "orde", right: "ruimte" },
  { id: "bestuur", label: "Bestuur", left: "nationaal", right: "Europees" },
  { id: "vertrouwen", label: "Vertrouwen", left: "kritisch", right: "vertrouwen" },
] as const;

const ROWS = [108, 164, 220, 276, 332] as const;

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
      aria-label="Open meetkaart van de vijf onafhankelijke dimensies van PolitiekProfiel"
    >
      <div className="civic-field__topline">
        <p className="mono">OPEN MEETKAART</p>
        <span className="mono">NOG NIET GEMETEN</span>
      </div>

      <div className="civic-field__canvas">
        <svg
          className="civic-field__svg"
          viewBox="0 0 612 420"
          role="img"
          aria-labelledby="civic-field-title civic-field-description"
        >
          <title id="civic-field-title">Vijf open politieke meetassen</title>
          <desc id="civic-field-description">
            Vijf onafhankelijke assen zonder ingevulde uitslag. De meting start pas na het beantwoorden van de stellingen.
          </desc>
          <rect className="civic-field__frame" x="16" y="52" width="580" height="304" />
          <line className="civic-field__spine" x1="306" x2="306" y1="52" y2="356" />
          {ROWS.map((y, index) => (
            <g className="civic-field__axis" key={AXES[index].id}>
              <line className="civic-field__rail" x1="78" x2="562" y1={y} y2={y} />
              <line className="civic-field__tick" x1="78" x2="78" y1={y - 7} y2={y + 7} />
              <line className="civic-field__tick" x1="562" x2="562" y1={y - 7} y2={y + 7} />
              <rect className="civic-field__registration" x="300" y={y - 6} width="12" height="12" />
              <text className="civic-field__number" x="26" y={y + 4}>
                {String(index + 1).padStart(2, "0")}
              </text>
            </g>
          ))}
          <path className="civic-field__fold" d="M 306 52 L 320 64 L 306 76 L 292 64 Z" />
          <path className="civic-field__fold" d="M 306 332 L 320 344 L 306 356 L 292 344 Z" />
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
        <p>Vijf onafhankelijke metingen. Geen partijsom.</p>
        <span className="mono">VRAAG VOOR VRAAG</span>
      </div>
    </aside>
  );
}
