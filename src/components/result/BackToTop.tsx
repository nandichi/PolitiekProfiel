"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  /**
   * Drempelwaarde als fractie (0..1) van de totale paginahoogte. Pas zichtbaar
   * vanaf dit punt om de knop niet vroeg al in de weg te zetten.
   */
  threshold?: number;
}

export function BackToTop({ threshold = 0.5 }: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const compute = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setVisible(false);
        return;
      }
      const progress = window.scrollY / scrollable;
      setVisible(progress >= threshold);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Terug naar boven"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-2 bg-ink text-paper px-4 py-3 mono text-[0.7rem] tracking-[0.18em] uppercase shadow-[0_10px_30px_-12px_rgba(14,16,20,0.45)] hover:bg-navy transition-colors"
        >
          <ArrowUp size={14} strokeWidth={1.8} aria-hidden />
          <span className="hidden sm:inline">Naar boven</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
