"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, Link2, Share2 } from "lucide-react";

export function ShareBlock({
  shareId,
  ideologyName,
}: {
  shareId: string;
  ideologyName: string;
}) {
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
    <div className="border border-rule-strong bg-paper">
      <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
        {/* URL display */}
        <div className="px-6 py-6 lg:py-7 border-b lg:border-b-0 lg:border-r border-rule">
          <p className="kicker mb-3 flex items-center gap-2">
            <Link2 size={12} strokeWidth={1.8} />
            <span>Deelbare link</span>
          </p>
          <code className="block mono text-sm md:text-base text-ink break-all leading-relaxed">
            {url || "…"}
          </code>
          <p className="mt-3 mono text-[0.62rem] tracking-wider text-ink-subtle">
            SHARE · {shareId}
          </p>
        </div>

        {/* Actions */}
        <div className="flex lg:flex-col items-stretch">
          <button
            type="button"
            onClick={copy}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 lg:py-6 text-sm font-medium border-r lg:border-r-0 lg:border-b border-rule hover:bg-paper-50 transition-colors min-w-[140px]"
            disabled={!url}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-2 text-success"
                >
                  <Check size={16} strokeWidth={1.8} />
                  Gekopieerd
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="inline-flex items-center gap-2"
                >
                  <Copy size={16} strokeWidth={1.8} />
                  Kopieer
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          {canShare && (
            <button
              type="button"
              onClick={share}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-4 lg:py-6 text-sm font-medium bg-ink text-paper hover:bg-navy transition-colors min-w-[140px]"
            >
              <Share2 size={16} strokeWidth={1.8} />
              Deel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
