"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "stagger" | "staggerSlow";
  as?: "div" | "section" | "article" | "li" | "ul" | "ol" | "header" | "footer";
  /** Trigger direct op mount in plaats van bij scroll-in. Gebruik voor above-the-fold content. */
  immediate?: boolean;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  as = "div",
  immediate = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    element.classList.add("pp-motion-ready");

    if (immediate) {
      const prepareTimer = window.setTimeout(() => {
        setVisible(false);
      }, 0);
      const revealTimer = window.setTimeout(() => setVisible(true), 80);
      return () => {
        window.clearTimeout(prepareTimer);
        window.clearTimeout(revealTimer);
      };
    }

    let observer: IntersectionObserver | null = null;
    const prepareTimer = window.setTimeout(() => {
      setVisible(false);
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setVisible(true);
            observer?.disconnect();
          }
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      observer.observe(element);
    }, 0);

    return () => {
      window.clearTimeout(prepareTimer);
      observer?.disconnect();
    };
  }, [immediate]);

  const classNames = [
    className,
    "pp-reveal",
    `pp-reveal--${variant}`,
    visible ? "is-visible" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const Tag = as;

  return (
    <Tag
      // HTML tag refs are intentionally generalized so semantic list and section wrappers share one animation primitive.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={classNames}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
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
  const Tag = as;
  return (
    <Tag className={[className, "pp-reveal-item"].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
