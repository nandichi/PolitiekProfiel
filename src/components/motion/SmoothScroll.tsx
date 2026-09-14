"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Keeps ordinary document scroll behaviour while giving the editorial landing
 * pages a more measured feel. It intentionally disables itself for reduced
 * motion and leaves anchors, keyboard navigation and native touch scrolling intact.
 */
export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const sync = () => {
      lenis?.destroy();
      lenis = null;

      if (media.matches) return;

      lenis = new Lenis({
        autoRaf: true,
        duration: 0.9,
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        anchors: {
          offset: 16,
          duration: 0.85,
        },
      });
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      lenis?.destroy();
    };
  }, []);

  return null;
}
