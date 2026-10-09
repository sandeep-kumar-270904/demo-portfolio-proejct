import { useRef } from "react";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

// Scroll-linked parallax for media inside cards: the image drifts gently
// against the scroll direction as the card crosses the viewport.
// Reduced motion pins the offset to 0.
export function useScrollParallax<T extends HTMLElement>(amount = 26): {
  ref: React.RefObject<T>;
  y: MotionValue<number>;
} {
  const ref = useRef<T>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : amount, reduce ? 0 : -amount]);
  return { ref, y };
}
