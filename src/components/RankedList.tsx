"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cx } from "@/lib/cx";
import { type RankedMatch, type VectorTarget } from "@/lib/scoring";

interface ItemWithMeta extends VectorTarget {
  id: string;
  primary: string;
  secondary?: string;
}

export function RankedList<T extends ItemWithMeta>({
  matches,
  limit,
  highlightFirst = false,
}: {
  matches: RankedMatch<T>[];
  limit?: number;
  highlightFirst?: boolean;
}) {
  const shown = limit ? matches.slice(0, limit) : matches;
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  return (
    <ol ref={ref} className="relative">
      {shown.map((m, idx) => {
        const isTop3 = highlightFirst && idx < 3;
        return (
          <li
            key={m.item.id}
            className={cx(
              "relative flex items-center gap-4 py-3.5 border-b border-rule last:border-b-0 transition-colors",
              isTop3 ? "pl-4" : "pl-0",
            )}
          >
            {/* Top-3 accent */}
            {isTop3 && (
              <span
                aria-hidden
                className="absolute left-0 top-2 bottom-2 w-[2px] bg-terra"
              />
            )}

            {/* Index */}
            <span
              className={cx(
                "mono text-xs w-7 shrink-0 tabular-nums",
                isTop3 ? "text-ink" : "text-ink-subtle",
              )}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Name */}
            <div className="min-w-0 flex-1">
              <p
                className={cx(
                  // Sta tot twee regels toe voor lange namen
                  // ("Dilan Yesilgöz-Zegerius", "Alexandria Ocasio-Cortez")
                  // zodat ze niet afgekapt worden met "...". Single-line bij
                  // korte namen blijft, dankzij `line-clamp-2`.
                  "display leading-tight text-[1.02rem] md:text-[1.08rem] line-clamp-2 wrap-break-word",
                  isTop3 ? "text-ink" : "text-ink",
                )}
              >
                {m.item.primary}
              </p>
              {m.item.secondary && (
                <p className="text-xs text-ink-muted line-clamp-2 mt-0.5">
                  {m.item.secondary}
                </p>
              )}
            </div>

            {/*
              Similariteits-balk + percentage.
              Verbergen onder `xl`: vanaf `lg` (1024px) wordt de pagina-grid
              `1.5fr / 1fr`, waardoor de RankedList in een smalle kolom van
              ~280-360px terechtkomt. Met de balk erbij houdt de naam slechts
              ~70px over en wordt hij agressief afgekapt. Onder `xl` tonen we
              daarom alleen het percentage inline; vanaf `xl` is er weer
              voldoende ruimte voor de volledige horizontale layout.
            */}
            <div className="hidden xl:flex items-center gap-3 shrink-0">
              <div className="relative w-20 xl:w-28 h-[3px] bg-paper-100">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-navy"
                  initial={{ width: 0 }}
                  animate={
                    inView
                      ? { width: `${m.similarity}%` }
                      : { width: 0 }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          duration: 0.9,
                          ease: [0.22, 0.61, 0.36, 1],
                          delay: 0.05 * Math.min(idx, 8),
                        }
                  }
                />
              </div>
              <span className="mono tabular-nums text-xs text-ink-muted w-10 text-right">
                {m.similarity}%
              </span>
            </div>

            <span className="xl:hidden mono tabular-nums text-xs text-ink-muted shrink-0">
              {m.similarity}%
            </span>
          </li>
        );
      })}
    </ol>
  );
}
