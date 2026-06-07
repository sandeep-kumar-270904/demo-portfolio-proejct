// Unified Framer Motion system — consistent easing, durations, and stagger.
// Use these tokens everywhere so transitions feel cohesive across the site.

import type { Variants, Transition } from "framer-motion";

// Cubic-bezier easings (Linear / Apple-style)
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  brand: [0.16, 1, 0.3, 1] as const,
  sweep: [0.76, 0, 0.24, 1] as const,
};

export const duration = {
  xs: 0.25,
  sm: 0.4,
  md: 0.6,
  lg: 0.8,
  xl: 1.1,
};

export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
};

export const tx = {
  page: { duration: duration.md, ease: ease.brand } as Transition,
  section: { duration: duration.lg, ease: ease.out } as Transition,
  item: { duration: duration.sm, ease: ease.out } as Transition,
  sweep: { duration: duration.md, ease: ease.sweep } as Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: tx.section },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: tx.section },
};

export const staggerParent = (gap: number = stagger.base): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: 0.05 } },
});

export const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: tx.item },
};

// Respect prefers-reduced-motion at the call-site when needed:
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
