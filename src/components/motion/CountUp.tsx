"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { easeEditorial } from "@/lib/motion";

interface CountUpProps {
  value: number;
  duration?: number;
  signed?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function CountUp({
  value,
  duration = 1.1,
  signed = true,
  className,
  ariaLabel,
}: CountUpProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const prefix = signed && value > 0 ? "+" : "";
    return (
      <span
        className={className}
        aria-label={ariaLabel ?? `${value}`}
        suppressHydrationWarning
      >
        {prefix}
        {value}
      </span>
    );
  }

  return (
    <AnimatedCount
      value={value}
      duration={duration}
      signed={signed}
      className={className}
      ariaLabel={ariaLabel}
    />
  );
}

function AnimatedCount({
  value,
  duration,
  signed,
  className,
  ariaLabel,
}: Required<Omit<CountUpProps, "className" | "ariaLabel">> & {
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    mv.set(0);
    setDisplay(0);
    const controls = animate(mv, value, {
      duration,
      ease: easeEditorial,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, duration, mv]);

  const prefix = signed && display > 0 ? "+" : "";

  return (
    <span
      ref={ref}
      className={className}
      aria-label={ariaLabel ?? `${value}`}
      suppressHydrationWarning
    >
      {prefix}
      {display}
    </span>
  );
}
