import { useEffect, useRef } from "react";

/**
 * Thin fixed scroll progress bar.
 * GPU-only (transform: scaleX) — never animates layout properties.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[9999] h-[2px] w-full bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-acid glow-acid-sm"
        style={{ transform: "scaleX(0)", willChange: "transform" }}
      />
    </div>
  );
}
