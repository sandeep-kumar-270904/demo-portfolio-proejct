import { useEffect, useState } from "react";

const SECTIONS = ["top", "about", "projects", "skills", "experience", "contact"];

export default function SectionCounter() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let idx = 0;
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) idx = i;
      });
      setActive(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden md:flex items-center gap-3">
      <span className="font-mono text-[11px] tracking-widest text-acid">
        {String(active + 1).padStart(2, "0")}
      </span>
      <span className="font-mono text-[11px] text-muted-foreground">
        / {String(SECTIONS.length).padStart(2, "0")}
      </span>
      <div className="ml-2 flex gap-1.5">
        {SECTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all ${
              i === active ? "w-5 bg-acid" : "w-1 bg-dim"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
