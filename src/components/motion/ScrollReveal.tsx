"use client";

import { motion, useInView, type Variants } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  fadeUp,
  inViewSettings,
  staggerContainer,
  staggerContainerSlow,
} from "@/lib/motion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "stagger" | "staggerSlow";
  as?: "div" | "section" | "article" | "li" | "ul" | "ol" | "header" | "footer";
  /** Trigger direct op mount in plaats van bij scroll-in. Gebruik voor above-the-fold content. */
  immediate?: boolean;
}

const variantsMap: Record<string, Variants> = {
  fadeUp,
  stagger: staggerContainer,
  staggerSlow: staggerContainerSlow,
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  as = "div",
  immediate = false,
}: ScrollRevealProps) {
  const MotionTag = motion[as];
  const variants = variantsMap[variant];
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, inViewSettings);
  const [forceVisible, setForceVisible] = useState(false);

  useEffect(() => {
    if (immediate) return;
    const timer = setTimeout(() => setForceVisible(true), 1200);
    return () => clearTimeout(timer);
  }, [immediate]);

  const shouldShow = immediate || inView || forceVisible;

  return (
    <MotionTag
      // motion[as] supports element-specific refs; we use a permissive HTMLElement
      // ref so the same component works for div/section/article/li/ul/ol/header/footer.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      initial={immediate ? "visible" : "hidden"}
      animate={shouldShow ? "visible" : "hidden"}
      variants={variants}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}

export function ScrollRevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "ul" | "ol" | "header" | "p";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}
