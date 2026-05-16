"use client";

import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";
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

  if (immediate) {
    // Voorkom witte flash bij SSR: rendert direct in de "visible" eindstaat
    // zodat de server-HTML al de juiste opacity heeft. Geen entrance-animatie
    // voor above-the-fold content; dat is een bewuste afweging.
    return (
      <MotionTag
        className={className}
        initial="visible"
        animate="visible"
        variants={variants}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={inViewSettings}
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
