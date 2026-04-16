type Item = {
  date: string;
  badge: string;
  color: string;
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

export default function Experience() {
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

        <div className="mt-16 space-y-10">
          {ITEMS.map((it, i) => {
            const c = colorMap[it.color];
            return (
              <div key={i} className="reveal grid grid-cols-[110px_28px_1fr] gap-4 md:grid-cols-[200px_40px_1fr] md:gap-8">
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
                  <div className={`mt-3 h-3 w-3 rounded-full ${c.dot} ${c.bg}`} />
                  {i !== ITEMS.length - 1 && (
                    <span className="absolute top-7 bottom-[-40px] w-px bg-soft-2" style={{ background: "hsl(var(--ink)/0.1)" }} />
                  )}
                </div>
                <div className="rounded-xl border border-soft-2 bg-card p-6 lg:p-7">
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
