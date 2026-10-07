import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Thin fixed scroll progress bar.
 * GPU-only (transform: scaleX) — never animates layout properties.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 180, damping: 30, mass: 0.2 });

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full bg-transparent">
      <motion.div
        className="h-full w-full origin-left bg-acid glow-acid-sm"
        style={{ scaleX: reduce ? scrollYProgress : smooth }}
      />
    </div>
  );
}
