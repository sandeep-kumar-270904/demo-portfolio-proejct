import { useRef, useState, type ReactNode } from "react";

export default function MagneticButton({ children, strength = 10 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    setPos({ x: dx * strength, y: dy * strength });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className="inline-block transition-transform duration-300 ease-out will-change-transform"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      {children}
    </div>
  );
}
