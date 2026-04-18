import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  date: string;
  badge: string;
  color: string;
  type: "work" | "education";
  role: string;
  company: string;
  desc: string;
  highlights: string[];
};

const ITEMS: Item[] = [
  {
    date: "2022 — PRESENT",
    badge: "FREELANCE",
    color: "acid",
    type: "work",
    role: "Freelance Full Stack Developer",
    company: "Self-Employed · Remote Worldwide",
    desc: "Shipped 12+ production systems for clients across India and internationally.",
    highlights: [
      "Built SaaS platforms, e-commerce, analytics dashboards",
      "100% client retention",
      "Earning while pursuing B.Tech",
    ],
  },
  {
    date: "SUMMER 2024",
    badge: "INTERNSHIP",
    color: "plasma",
    type: "work",
    role: "Full Stack Developer Intern",
    company: "TechStartup · Full-time Position",
    desc: "Joined as sole intern. Shipped features to production in week one.",
    highlights: [
      "Architected REST APIs handling 10,000+ daily requests under 200ms P99",
      "Cut page load by 42% via query optimization and Redis caching",
      "Introduced code review standards adopted by full team",
    ],
  },
  {
    date: "2024",
    badge: "AWARD",
    color: "ember",
    type: "work",
    role: "1st Place — Smart India Hackathon",
    company: "National · ₹1,00,000 Prize",
    desc: "Competed against 500+ teams. Built a complete full-stack product in 24 hours.",
    highlights: [
      "Led team of 4, architected full stack solo",
      'Jury awarded "Most Technically Sound Solution"',
    ],
  },
  {
    date: "2022 — 2026",
    badge: "EDUCATION",
    color: "cyan",
    type: "education",
    role: "B.Tech — Computer Science & Engineering",
    company: "JNTU University · CGPA 8.4+",
    desc: "More production deployments than classmates have side projects.",
    highlights: [],
  },
];

const colorMap: Record<string, { dot: string; text: string; pill: string; bg: string }> = {
  acid: { dot: "bg-acid", text: "text-acid", pill: "border-acid/30 text-acid bg-acid/10", bg: "shadow-[0_0_20px_hsl(var(--acid)/0.6)]" },
  plasma: { dot: "bg-plasma", text: "text-plasma", pill: "border-plasma/30 text-plasma bg-plasma/10", bg: "" },
  ember: { dot: "bg-ember", text: "text-ember", pill: "border-ember/30 text-ember bg-ember/10", bg: "" },
  cyan: { dot: "bg-cyan", text: "text-cyan", pill: "border-cyan/30 text-cyan bg-cyan/10", bg: "" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "work", label: "Work Only" },
  { key: "education", label: "Education Only" },
] as const;

export default function Experience() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const items = useMemo(
    () => (filter === "all" ? ITEMS : ITEMS.filter((i) => i.type === filter)),
    [filter]
  );

  // Drawing line — track scroll progress over the timeline container
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = -rect.height + window.innerHeight * 0.4;
      const p = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <section id="experience" className="relative bg-void px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">04 — Journey</span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">Milestones </span>
          <span className="text-stroke">&amp;</span>{" "}
          <span className="text-grad-acid">Experience</span>
        </h2>

        {/* Filter */}
        <div className="reveal mt-10 inline-flex rounded-full border border-soft-2 bg-card p-1">
          {FILTERS.map((f) => {
            const isActive = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                  isActive ? "bg-acid text-void" : "text-ink-2 hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div ref={wrapRef} className="relative mt-16 space-y-10">
          {/* Drawing background line */}
          <div className="pointer-events-none absolute left-[124px] top-2 hidden h-full w-px bg-soft-2 md:block" style={{ left: "220px" }}>
            <div
              className="h-full w-full origin-top bg-gradient-to-b from-acid via-acid/70 to-acid/0"
              style={{ transform: `scaleY(${progress})`, transition: "transform 0.2s linear" }}
            />
          </div>
          <div className="pointer-events-none absolute left-[124px] top-2 h-full w-px bg-soft-2 md:hidden">
            <div
              className="h-full w-full origin-top bg-gradient-to-b from-acid via-acid/70 to-acid/0"
              style={{ transform: `scaleY(${progress})`, transition: "transform 0.2s linear" }}
            />
          </div>

          {items.map((it, i) => {
            const c = colorMap[it.color];
            return (
              <div key={`${filter}-${i}`} className="reveal grid grid-cols-[110px_28px_1fr] gap-4 md:grid-cols-[200px_40px_1fr] md:gap-8">
                <div className="pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {it.date}
                  </div>
                  <div
                    className={`mt-2 inline-block rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${c.pill}`}
                  >
                    {it.badge}
                  </div>
                </div>
                <div className="relative flex justify-center">
                  <div className={`relative z-10 mt-3 h-3 w-3 rounded-full ${c.dot} ${c.bg}`} />
                </div>
                <div className="rounded-xl border border-soft-2 bg-card p-6 lg:p-7 transition-all hover:border-acid/30 hover:-translate-y-0.5">
                  <h3 className="font-syne text-[20px] font-bold text-ink">{it.role}</h3>
                  <div className={`mt-1 font-syne text-[14px] font-semibold ${c.text}`}>{it.company}</div>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{it.desc}</p>
                  {it.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {it.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-[14px] text-ink-2">
                          <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${c.dot}`} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
