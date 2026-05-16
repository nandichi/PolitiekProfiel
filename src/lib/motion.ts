import type { Transition, Variants } from "motion/react";

export const easeEditorial: Transition["ease"] = [0.22, 0.61, 0.36, 1];
export const easeStandard: Transition["ease"] = [0.4, 0, 0.2, 1];

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
  mass: 0.7,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 1,
};

export const pageEnter: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.34, ease: easeEditorial },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.22, ease: easeStandard },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeEditorial },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeEditorial },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const inViewSettings = {
  once: true,
  margin: "-12% 0px -8% 0px" as const,
};
