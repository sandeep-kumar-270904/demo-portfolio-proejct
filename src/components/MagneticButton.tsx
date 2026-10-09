import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Spring-based magnetic pull; inert on touch devices and with reduced motion. */
export default function MagneticButton({ children, strength = 10 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
    my.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
  };
  const reset = () => { mx.set(0); my.set(0); };

  return (
    <motion.div ref={ref} onPointerMove={onMove} onPointerLeave={reset} className="inline-block will-change-transform" style={{ x, y }}>
      {children}
    </motion.div>
  );
}
