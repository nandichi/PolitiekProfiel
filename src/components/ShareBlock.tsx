"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Check, Copy, Link2, Share2 } from "lucide-react";

export function ShareBlock({
  shareId,
  ideologyName,
}: {
  shareId: string;
  ideologyName: string;
}) {
  const reduce = useReducedMotion();
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Hydratie-veilige URL: server rendert "", client vult in.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(`${window.location.origin}/r/${shareId}`);
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      setCanShare(true);
    }
  }, [shareId]);

  const copy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      /* negeer */
    }
  }, [url]);

  const share = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.share({
        title: "Mijn PolitiekProfiel",
        text: `Mijn politieke profiel: ${ideologyName}`,
        url,
      });
    } catch {
      /* geannuleerd */
    }
  }, [url, ideologyName]);

  return (
    <section
      aria-labelledby={`share-heading-${shareId}`}
      className="border border-rule-strong bg-canvas-raised"
    >
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_auto]">
        <div className="min-w-0 border-b border-rule px-4 py-6 sm:px-6 lg:border-r lg:border-b-0 lg:py-7">
          <p
            id={`share-heading-${shareId}`}
            className="kicker mb-3 flex items-center gap-2"
          >
            <Link2 size={12} strokeWidth={1.8} aria-hidden />
            <span>Deelbare link</span>
          </p>
          <code className="mono block break-all text-xs leading-relaxed text-ink sm:text-sm md:text-base">
            {url || "…"}
          </code>
          <p className="mono mt-3 text-[0.62rem] tracking-wider text-text-muted">
            SHARE · {shareId}
          </p>
        </div>

        <div className="flex items-stretch lg:flex-col">
          <button
            type="button"
            onClick={copy}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 border-r border-rule px-4 py-4 text-sm font-semibold transition-colors hover:bg-canvas-pressed focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-focus sm:px-6 lg:min-w-[148px] lg:flex-none lg:border-r-0 lg:border-b lg:py-6"
            disabled={!url}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                  className="inline-flex items-center gap-2 text-success"
                >
                  <Check size={16} strokeWidth={1.8} aria-hidden />
                  Gekopieerd
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: reduce ? 0 : 0.18 }}
                  className="inline-flex items-center gap-2"
                >
                  <Copy size={16} strokeWidth={1.8} aria-hidden />
                  Kopieer
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {canShare && (
            <button
              type="button"
              onClick={share}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 bg-ink px-4 py-4 text-sm font-semibold text-canvas-raised transition-colors hover:bg-ink-raised focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-focus sm:px-6 lg:min-w-[148px] lg:flex-none lg:py-6"
            >
              <Share2 size={16} strokeWidth={1.8} aria-hidden />
              Deel
            </button>
          )}
        </div>
      </div>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Deelbare link gekopieerd" : ""}
      </span>
    </section>
  );
}
