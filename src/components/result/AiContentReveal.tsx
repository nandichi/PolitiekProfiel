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

  useEffect(() => {
    setMounted(true);
    if (!ref.current) return;
    const el = ref.current;
    const measure = () => {
      const full = el.scrollHeight;
      setOverflows(full - previewHeight > minOverflow);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewHeight, minOverflow]);

  const shouldClip = mounted && overflows && !expanded;

  return (
    <div>
      <div
        ref={ref}
        className="relative overflow-hidden transition-[max-height] duration-500 ease-out"
        style={{
          maxHeight: shouldClip ? previewHeight : "none",
        }}
        aria-expanded={expanded}
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
            aria-controls={undefined}
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
