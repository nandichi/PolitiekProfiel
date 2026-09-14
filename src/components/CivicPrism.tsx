"use client";

import { useState } from "react";

const LAYERS = [
  { id: "economie", number: "01", label: "Economie", left: "markt", right: "staat" },
  { id: "cultuur", number: "02", label: "Cultuur", left: "behoud", right: "verandering" },
  { id: "vrijheid", number: "03", label: "Vrijheid", left: "orde", right: "ruimte" },
  { id: "bestuur", number: "04", label: "Bestuur", left: "nationaal", right: "Europees" },
  { id: "vertrouwen", number: "05", label: "Vertrouwen", left: "kritisch", right: "vertrouwen" },
] as const;

/**
 * A first-impression object for the homepage: five physical-looking layers,
 * deliberately open until somebody answers the questionnaire.
 */
export function CivicPrism() {
  const [active, setActive] = useState(0);

  return (
    <aside
      className="civic-prism"
      aria-label="Vijf open lagen die samen een politiek profiel vormen"
    >
      <div className="civic-prism__header">
        <p className="mono">POLITIEKPROFIEL / OPEN INSTRUMENT</p>
        <span className="mono">05 LAGEN</span>
      </div>

      <div className="civic-prism__object">
        {LAYERS.map((layer, index) => (
          <button
            className="civic-prism__layer"
            data-active={active === index ? "true" : "false"}
            key={layer.id}
            onBlur={() => setActive(0)}
            onFocus={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            onMouseLeave={() => setActive(0)}
            onClick={() => setActive(index)}
            style={{ "--layer": index } as React.CSSProperties}
            type="button"
          >
            <span className="civic-prism__layer-number mono">{layer.number}</span>
            <span className="civic-prism__layer-name">{layer.label}</span>
            <span className="civic-prism__layer-track" aria-hidden="true">
              <i />
              <b />
              <i />
            </span>
            <span className="civic-prism__layer-poles mono">
              <span>{layer.left}</span>
              <span>{layer.right}</span>
            </span>
          </button>
        ))}

        <div className="civic-prism__core" aria-hidden="true">
          <span>?</span>
          <small className="mono">JOUW PROFIEL</small>
        </div>
      </div>

      <div className="civic-prism__footer">
        <p>Vijf lagen. Pas na je antwoorden vormen ze samen een profiel.</p>
        <span className="mono">KIES EEN LAAG</span>
      </div>
    </aside>
  );
}
