"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { List, X } from "lucide-react";
import { cx } from "@/lib/cx";

export interface StickyIndexItem {
  id: string;
  label: string;
  /** Geschatte leestijd in minuten voor de bijbehorende sectie. */
  readingMinutes?: number;
}

interface StickyIndexProps {
  items: StickyIndexItem[];
  className?: string;
  topOffset?: number;
}

/**
 * Sticky index voor lange leespaginas.
 *
 * - Desktop: een verticale rail in een grid-kolom (sticky binnen content).
 * - Mobile: een horizontale strip die `fixed` onder de site-header hangt.
 *   Bewust `fixed` ipv `sticky`, omdat een `sticky` element in een grid-cel
 *   de track op `auto` (intrinsic) breedte forceert; dat blies de page-breedte
 *   op tot voorbij de viewport en zorgde voor horizontale overflow op mobiel.
 *   Door `fixed` blijft de mobile nav buiten de grid-context en kan hij
 *   veilig full-bleed zijn. Er wordt een spacer ingebouwd zodat de content
 *   eronder begint.
 */
export function StickyIndex({
  items,
  className,
  topOffset = 88,
}: StickyIndexProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [sheetOpen, setSheetOpen] = useState(false);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observers: IntersectionObserver[] = [];
    const visibility = new Map<string, number>();

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibility.set(item.id, entry.intersectionRatio);
          let bestId = items[0].id;
          let bestRatio = -1;
          for (const candidate of items) {
            const ratio = visibility.get(candidate.id) ?? 0;
            if (ratio > bestRatio) {
              bestRatio = ratio;
              bestId = candidate.id;
            }
          }
          if (bestRatio > 0) setActive(bestId);
        },
        {
          rootMargin: `-${topOffset}px 0px -55% 0px`,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items, topOffset]);

  // Auto-scroll mobile strip to active item
  useEffect(() => {
    const scroller = mobileScrollRef.current;
    if (!scroller) return;
    const link = scroller.querySelector<HTMLAnchorElement>(
      `a[data-id="${active}"]`,
    );
    if (link) {
      const scrollerRect = scroller.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      const offset =
        linkRect.left -
        scrollerRect.left -
        scrollerRect.width / 2 +
        linkRect.width / 2;
      scroller.scrollBy({ left: offset, behavior: "smooth" });
    }
  }, [active]);

  return (
    <>
      {/* Desktop sticky rail */}
      <nav
        aria-label="Pagina-index"
        className={cx(
          "hidden lg:block sticky self-start",
          className,
        )}
        style={{ top: topOffset }}
      >
        <p className="kicker mb-5">Inhoud</p>
        <ol className="relative">
          <div
            aria-hidden
            className="absolute left-[14px] top-1 bottom-1 w-px bg-rule"
          />
          {items.map((item, i) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  className="relative flex items-baseline gap-4 py-2.5 pr-7 no-underline group"
                >
                  <span
                    aria-hidden
                    className={cx(
                      "relative z-10 w-7 h-7 ml-[-2px] flex items-center justify-center transition-colors shrink-0",
                      isActive ? "bg-ink text-paper" : "bg-paper text-ink-muted",
                    )}
                  >
                    <span className="mono text-[0.62rem] tracking-wider">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="flex flex-col min-w-0 flex-1">
                    <span
                      className={cx(
                        "text-sm transition-colors",
                        isActive ? "text-ink" : "text-ink-muted group-hover:text-ink",
                      )}
                    >
                      {item.label}
                    </span>
                    {item.readingMinutes ? (
                      <span className="mono text-[0.6rem] tracking-wider text-ink-subtle mt-0.5">
                        {item.readingMinutes} MIN
                      </span>
                    ) : null}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="sticky-index-active"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 border border-navy"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 34,
                      }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile horizontal strip: fixed buiten de grid */}
      <nav
        aria-label="Pagina-index"
        className="lg:hidden fixed inset-x-0 top-16 md:top-[72px] z-30 border-b border-rule bg-paper/90 backdrop-blur-md"
      >
        <div className="flex items-stretch">
          <div
            ref={mobileScrollRef}
            className="flex-1 flex gap-5 overflow-x-auto py-3 px-6 no-scrollbar"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((item, i) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  data-id={item.id}
                  className={cx(
                    "shrink-0 flex items-baseline gap-2 no-underline",
                    isActive ? "text-ink" : "text-ink-muted",
                  )}
                >
                  <span className="mono text-[0.62rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                </a>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label="Toon alle secties"
            className="shrink-0 inline-flex items-center justify-center w-12 border-l border-rule text-ink-muted hover:text-ink active:bg-ink/5 transition-colors"
          >
            <List size={16} strokeWidth={1.7} aria-hidden />
          </button>
        </div>
      </nav>
      {/* Spacer onder de fixed mobile nav zodat content niet wegvalt */}
      <div aria-hidden className="lg:hidden h-12" />

      {/* Mobile bottom-sheet met alle secties (incl. leestijden) */}
      <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <AnimatePresence>
          {sheetOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="lg:hidden fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-paper border-t border-rule-strong flex flex-col max-h-[85vh]"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                >
                  <div
                    aria-hidden
                    className="self-center mt-2 mb-1 h-1 w-10 bg-rule-strong rounded-full"
                  />
                  <div className="flex items-center justify-between px-6 pt-3 pb-4 border-b border-rule">
                    <Dialog.Title className="kicker">Inhoud</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Sluiten"
                        className="w-9 h-9 -mr-2 inline-flex items-center justify-center text-ink-muted hover:text-ink"
                      >
                        <X size={18} strokeWidth={1.7} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <nav
                    aria-label="Alle secties"
                    className="flex-1 overflow-y-auto px-6 py-2 pb-8"
                  >
                    <ol className="divide-y divide-rule">
                      {items.map((item, i) => {
                        const isActive = active === item.id;
                        return (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={() => setSheetOpen(false)}
                              className="flex items-center gap-4 py-4 no-underline"
                            >
                              <span
                                aria-hidden
                                className={cx(
                                  "w-8 h-8 inline-flex items-center justify-center shrink-0 transition-colors",
                                  isActive
                                    ? "bg-ink text-paper"
                                    : "bg-paper text-ink-muted border border-rule",
                                )}
                              >
                                <span className="mono text-[0.62rem] tracking-wider">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                              </span>
                              <span className="flex-1 flex flex-col min-w-0">
                                <span
                                  className={cx(
                                    "display text-[1.15rem] leading-none",
                                    isActive ? "text-ink" : "text-ink",
                                  )}
                                >
                                  {item.label}
                                </span>
                                {item.readingMinutes ? (
                                  <span className="mono text-[0.6rem] tracking-wider text-ink-subtle mt-1.5">
                                    {item.readingMinutes} MIN LEZEN
                                  </span>
                                ) : null}
                              </span>
                              {isActive && (
                                <span
                                  aria-hidden
                                  className="h-2 w-2 bg-navy shrink-0"
                                />
                              )}
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  </nav>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
}
