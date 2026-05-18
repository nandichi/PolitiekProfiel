"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AiContentRevealProps {
  children: ReactNode;
  /**
   * Maximum height (in px) of the collapsed preview. The user sees this much
   * before deciding whether to expand. Defaults to ~6-7 regels prose.
   */
  previewHeight?: number;
  expandLabel?: string;
  collapseLabel?: string;
  /**
   * Minimaal verschil in pixels tussen content en preview voordat we
   * de toggle laten zien. Voorkomt dat korte teksten onnodig een knop krijgen.
   */
  minOverflow?: number;
}

export function AiContentReveal({
  children,
  previewHeight = 280,
  expandLabel = "Lees verder",
  collapseLabel = "Inklappen",
  minOverflow = 80,
}: AiContentRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  // Na de expand-transitie zetten we de maxHeight op "none" zodat layout-
  // shifts in geneste content (image-load, lazy-rendering, etc.) niet meer
  // door een vaste pixelwaarde worden afgekapt. Bij inklappen schakelen we
  // eerst terug naar de gemeten scrollHeight zodat CSS daadwerkelijk kan
  // transitionen.
  const [allowOverflow, setAllowOverflow] = useState(false);

  useEffect(() => {
    // Mount-flag + initiële meting. Externe sync (DOM-grootte → React-state),
    // bewust eenmalig in effect-body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!ref.current) return;
    const el = ref.current;
    const measure = () => {
      const full = el.scrollHeight;
      setContentHeight(full);
      setOverflows(full - previewHeight > minOverflow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewHeight, minOverflow]);

  // Bij wissel naar collapsed direct allowOverflow uit; bij expanded pas na
  // het einde van de transitie. Zo blijft de animatie soepel én is de
  // ingeklapte staat hard-cut.
  useEffect(() => {
    if (!expanded) {
      // Externe sync (collapse-event → reset overflow-allow).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAllowOverflow(false);
    }
  }, [expanded]);

  const shouldClip = mounted && overflows && !expanded;

  // Effectieve maxHeight:
  // - Niet gemount of geen overflow → "none" (full layout).
  // - Ingeklapt → previewHeight.
  // - Uitgeklapt mid-transition → gemeten contentHeight (zodat CSS kan
  //   animeren van previewHeight → contentHeight in px).
  // - Uitgeklapt na transitie → "none".
  const maxHeight = !mounted || !overflows
    ? "none"
    : shouldClip
      ? previewHeight
      : allowOverflow
        ? "none"
        : contentHeight || "none";

  return (
    <div>
      <div
        ref={ref}
        className="relative overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{ maxHeight }}
        aria-expanded={expanded}
        onTransitionEnd={(e) => {
          if (e.propertyName !== "max-height") return;
          if (expanded) setAllowOverflow(true);
        }}
      >
        {children}
        {shouldClip && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-paper"
          />
        )}
      </div>
      {mounted && overflows && (
        <div className="mt-5 flex">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="group inline-flex items-center gap-2 mono text-[0.72rem] tracking-[0.18em] uppercase text-ink hover:text-navy transition-colors border-b border-ink hover:border-navy pb-1"
          >
            <span>{expanded ? collapseLabel : expandLabel}</span>
            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      )}
    </div>
  );
}
