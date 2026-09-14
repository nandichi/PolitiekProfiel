"use client";

import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const lineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
      line.style.transform = `scaleX(${progress})`;
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="reading-progress" aria-hidden="true">
      <span ref={lineRef} />
    </div>
  );
}
