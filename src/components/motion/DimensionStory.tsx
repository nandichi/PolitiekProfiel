"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Dimension = {
  id: string;
  shortLabel: string;
  negative: string;
  positive: string;
  description: string;
};

export function DimensionStory({ dimensions }: { dimensions: Dimension[] }) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (reducedMotion.matches || !desktop.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const stage = root.querySelector<HTMLElement>(".dimension-story__stage");
      const marker = root.querySelector<HTMLElement>(".dimension-story__marker");
      const rows = gsap.utils.toArray<HTMLElement>(".dimension-story__row");
      const entries = gsap.utils.toArray<HTMLElement>(".dimension-story__entry");
      if (!stage || !marker || !rows.length || !entries.length) return;

      const activate = (index: number) => {
        stage.dataset.active = String(index);
        rows.forEach((row, rowIndex) => row.classList.toggle("is-active", rowIndex === index));
        entries.forEach((entry, entryIndex) => entry.classList.toggle("is-active", entryIndex === index));

        gsap.to(marker, {
          yPercent: index * 100,
          duration: 0.52,
          ease: "power3.out",
          overwrite: true,
        });
      };

      activate(0);

      entries.forEach((entry, index) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => activate(index),
          onEnterBack: () => activate(index),
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} className="dimension-story" aria-label="De vijf politieke dimensies">
      <div className="dimension-story__stage" aria-hidden="true">
        <div className="dimension-story__stage-head mono">
          <span>DIMENSIEREGISTER</span>
          <span>5 LOSSE METINGEN</span>
        </div>

        <div className="dimension-story__meter">
          <span className="dimension-story__marker" />
          {dimensions.map((dimension, index) => (
            <div className="dimension-story__row" key={dimension.id}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <i />
              <b>{dimension.shortLabel}</b>
            </div>
          ))}
        </div>

        <p className="dimension-story__stage-note">
          Geen enkel antwoord bepaalt je profiel. De lagen krijgen pas betekenis samen.
        </p>
      </div>

      <ol className="dimension-story__entries">
        {dimensions.map((dimension, index) => (
          <li className="dimension-story__entry" key={dimension.id}>
            <p className="mono dimension-story__number">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <p className="kicker mb-3">{dimension.shortLabel}</p>
              <h3 className="display dimension-story__title">
                {dimension.negative}
                <span>/</span>
                {dimension.positive}
              </h3>
              <p className="dimension-story__body">{dimension.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
