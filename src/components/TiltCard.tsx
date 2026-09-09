import { useRef, type ReactNode } from "react";

/**
 * Subtle perspective tilt + cursor-following highlight.
 * Pointer-driven, transform-only (GPU), and fully disabled for
 * touch devices and users who prefer reduced motion.
 */
export default function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const reduced =
    typeof window !== "undefined" &&
    (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia?.("(hover: none)").matches);

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(1100px) rotateX(${(0.5 - py) * max}deg) rotateY(${
        (px - 0.5) * max
      }deg) translate3d(0,-6px,0) scale(1.008)`;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      el.style.setProperty("--glow", "1");
    });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = "";
    el.style.setProperty("--glow", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`tilt-card ${className}`}
    >
      {children}
    </div>
  );
}
