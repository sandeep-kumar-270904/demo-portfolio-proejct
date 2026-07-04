import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { ease, duration } from "@/lib/motion";

/**
 * Route-level crossfade. Uses transform+opacity only.
 * Respects prefers-reduced-motion (renders instantly with no motion).
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration.xs, ease: ease.brand }}
    >
      {children}
    </motion.div>
  );
}

export function RouteOverlay() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9997] origin-bottom bg-acid"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 0 }}
      transition={{ duration: duration.md, ease: ease.sweep }}
    />
  );
}
