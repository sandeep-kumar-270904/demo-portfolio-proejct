import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "link" | "button" | "project" | "text";

// Ring / dot sizing per context — kept small so the UI is never covered.
const RING: Record<CursorState, number> = {
  default: 32,
  link: 42,
  button: 50,
  project: 68,
  text: 28,
};
const DOT: Record<CursorState, number> = {
  default: 12,
  link: 14,
  button: 16,
  project: 12,
  text: 8,
};

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches || window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: target.x, y: target.y };

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='project']")) setState("project");
      else if (t.closest("button, [role='button'], [data-cursor='button']")) setState("button");
      else if (t.closest("input, textarea, [data-cursor='text']")) setState("text");
      else if (t.closest("a, [data-cursor='hover']")) setState("link");
      else setState("default");
    };

    let raf = 0;
    const tick = () => {
      // Slightly softer follow on the larger states so the ring feels weighty.
      ring.x += (target.x - ring.x) * 0.24;
      ring.y += (target.y - ring.y) * 0.24;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2147483647] rounded-full border-2 border-void bg-acid"
        style={{
          width: DOT[state],
          height: DOT[state],
          opacity: 1,
          boxShadow:
            "0 0 0 2px hsl(var(--ink) / 0.95), 0 0 12px 3px hsl(var(--acid) / 0.9), 0 0 28px 6px hsl(var(--acid) / 0.5)",
          transition: "width 220ms cubic-bezier(0.16,1,0.3,1), height 220ms cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[2147483646] rounded-full border-2 border-acid transition-[width,height,opacity,border-width,background-color] duration-[220ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: RING[state],
          height: RING[state],
          borderWidth: state === "project" ? 1 : 2,
          backgroundColor: state === "project" ? "hsl(var(--acid) / 0.07)" : "transparent",
          opacity: state === "text" ? 0.75 : 1,
          boxShadow:
            state === "project"
              ? "0 0 0 1px hsl(var(--ink) / 0.8), 0 0 22px hsl(var(--acid) / 0.65)"
              : "0 0 0 1px hsl(var(--ink) / 0.8), 0 0 14px hsl(var(--acid) / 0.9), 0 0 28px hsl(var(--acid) / 0.5)",
        }}
      />
    </>
  );
}
