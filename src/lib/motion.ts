// Unified Framer Motion system — consistent easing, durations, stagger and
// reusable scroll/pointer primitives. Everything here is transform/opacity only
// so the compositor does the work, and every primitive degrades to "no motion"
// when the user prefers reduced motion.

import { useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
  type Transition,
} from "framer-motion";

// Cubic-bezier easings (Linear / Apple-style)
export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  brand: [0.16, 1, 0.3, 1] as const,
  sweep: [0.76, 0, 0.24, 1] as const,
};

// Motion budget (seconds)
export const duration = {
  micro: 0.22,
  xs: 0.25,
  ui: 0.42,
  sm: 0.4,
  md: 0.6,
  reveal: 0.78,
  lg: 0.8,
  xl: 1.1,
  cinematic: 1.3,
};

export const stagger = {
  micro: 0.035,
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
  cinematic: 0.14,
};

export const tx = {
  micro: { duration: duration.micro, ease: ease.brand } as Transition,
  page: { duration: duration.md, ease: ease.brand } as Transition,
  section: { duration: duration.lg, ease: ease.out } as Transition,
  reveal: { duration: duration.reveal, ease: ease.brand } as Transition,
  item: { duration: duration.sm, ease: ease.out } as Transition,
  sweep: { duration: duration.md, ease: ease.sweep } as Transition,
  hero: { duration: duration.xl, ease: ease.brand } as Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: tx.section },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: tx.section },
};

/** Heading clip-reveal: rises out of a masked line, settles from a hair of scale. */
export const headingReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 1.02 },
  show: { opacity: 1, y: 0, scale: 1, transition: tx.reveal },
};

/** Media reveal: unmasks downward while the image settles from 1.04 → 1. */
export const mediaReveal: Variants = {
  hidden: { opacity: 0, scale: 1.04, clipPath: "inset(0% 0% 100% 0%)" },
  show: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.95, ease: ease.brand },
  },
};

export const staggerParent = (gap: number = stagger.base, delayChildren = 0.05): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren } },
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

/** True on coarse-pointer / small screens — used to drop pointer-only effects. */
export function useIsTouchOrSmall() {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () =>
      setSmall(window.matchMedia("(hover: none)").matches || window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return small;
}

/**
 * Scroll-linked parallax for an element. Returns a ref + a spring-smoothed
 * MotionValue in px, mapped across the element's travel through the viewport.
 * `strength` is a fraction of viewport height (0.04 = ambient, 0.16 = strong).
 */
export function useParallax<T extends HTMLElement = HTMLElement>(strength = 0.08) {
  const ref = useRef<T>(null);
  const reduce = prefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const px = typeof window !== "undefined" ? window.innerHeight * strength : 0;
  const raw = useTransform(scrollYProgress, [0, 1], [px, -px]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  const still = useMotionValue(0);
  return { ref, y: (reduce ? still : y) as MotionValue<number> };
}

/**
 * Normalised scroll velocity (0 → 1-ish), smoothed and decaying back to rest.
 * Used for subtle marquee acceleration; never for layout-affecting work.
 */
export function useScrollVelocity() {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let last = window.scrollY;
    let current = 0;
    let raf = 0;
    const tick = () => {
      const now = window.scrollY;
      const delta = Math.abs(now - last);
      last = now;
      // ease toward the instantaneous velocity, then decay
      const targetV = Math.min(1, delta / 45);
      current += (targetV - current) * 0.12;
      if (Math.abs(current - v) > 0.01) setV(current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return v;
}

/**
 * Pointer-driven depth. Returns normalised -1..1 spring values for the pointer
 * position within the window. Disabled for touch / reduced-motion users.
 */
export function usePointerDepth() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const y = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 768) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return { x, y };
}
