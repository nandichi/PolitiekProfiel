"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const STORAGE_KEY = "politiekprofiel-consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Subtiele delay zodat banner niet meteen invliegt
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function close() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "ack");
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Privacymelding"
          className="fixed inset-x-0 bottom-0 z-30 pointer-events-none"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 280, damping: 32 }}
        >
          <div className="mx-auto max-w-[1500px] px-6 lg:px-10 pb-4">
            <div className="pointer-events-auto bg-ink text-paper border border-ink shadow-[0_24px_60px_-30px_rgba(14,16,20,0.5)]">
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="flex-1 px-5 py-4 sm:py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="mono text-[0.62rem] tracking-widest text-paper/70 shrink-0">
                    GEEN TRACKING
                  </span>
                  <span aria-hidden className="hidden sm:block w-px h-5 bg-paper/25" />
                  <p className="text-sm text-paper/90 leading-snug">
                    Wij gebruiken geen tracking-cookies. Quiz-voortgang blijft
                    lokaal in je browser.{" "}
                    <Link
                      href="/privacy"
                      className="underline underline-offset-[3px] decoration-paper/40 hover:decoration-paper text-paper"
                    >
                      Privacyverklaring
                    </Link>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Sluiten"
                  className="border-t sm:border-t-0 sm:border-l border-paper/15 px-5 py-3 sm:py-0 sm:w-14 flex items-center justify-center text-paper/70 hover:text-paper hover:bg-navy transition-colors"
                >
                  <X size={18} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
