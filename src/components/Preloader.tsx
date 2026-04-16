import { useEffect, useState } from "react";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1900);
    const t2 = setTimeout(() => setHidden(true), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void transition-all duration-500 ${
        fading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
      }`}
    >
      <div className="overflow-hidden">
        <div className="flex font-syne font-extrabold text-[80px] leading-none tracking-tighter">
          {["E", ".", "S"].map((ch, i) => (
            <span
              key={i}
              className={`inline-block animate-slide-up ${ch === "." ? "text-acid text-glow-acid" : "text-ink"}`}
              style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-8 h-[2px] w-[200px] overflow-hidden bg-ink/5">
        <div className="h-full origin-left bg-acid animate-line-grow glow-acid-sm" />
      </div>
      <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Initializing
      </div>
    </div>
  );
}
