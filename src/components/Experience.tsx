import { useEffect, useMemo, useRef, useState } from "react";
import { useExperience } from "@/hooks/useSupabase";
import { useSiteCopy } from "@/hooks/useSiteCopy";
import BrandLogo from "@/components/BrandLogo";
import type { DbExperience } from "@/data/experienceFallback";
import { motion, useReducedMotion } from "framer-motion";

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

const COLOR_CYCLE = ["acid", "plasma", "ember", "cyan"];

function badgeFor(item: DbExperience): string {
  if (item.type === "education") return "EDUCATION";
  const r = item.role.toLowerCase();
  if (r.includes("freelance")) return "FREELANCE";
  if (r.includes("intern")) return "INTERNSHIP";
  if (r.includes("award") || r.includes("place") || r.includes("hackathon")) return "AWARD";
  return "WORK";
}

export default function Experience() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const { data: rows = [] } = useExperience();
  const { t } = useSiteCopy();
  const reduce = useReducedMotion();

  const items = useMemo(() => {
    const list = filter === "all" ? rows : rows.filter((i) => i.type === filter);
    return list.map((i, idx) => ({
      ...i,
      color: i.type === "education" ? "cyan" : COLOR_CYCLE[idx % COLOR_CYCLE.length],
      badge: badgeFor(i),
    }));
  }, [filter, rows]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      setProgress(p);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <section id="experience" className="relative bg-void px-6 py-14 lg:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">{t("experience_eyebrow")}</span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">{t("experience_title_a")}</span>
          <span className="text-stroke">{t("experience_title_b")}</span>{" "}
          <span className="text-grad-acid">{t("experience_title_c")}</span>
        </h2>

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

        {/* Scrollable timeline block — page length stays fixed regardless of milestone count */}
        <div className="relative mt-10 rounded-2xl border border-soft-2 bg-card/30 p-4 md:p-6">
          <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-soft-2 bg-void/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            {items.length} {items.length === 1 ? "entry" : "entries"} · scroll ↓
          </div>
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="relative max-h-[640px] space-y-10 overflow-y-auto pr-2 [scrollbar-color:hsl(var(--acid))_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-acid/40 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <div className="pointer-events-none absolute left-[124px] top-0 hidden h-full w-px bg-soft-2 md:block" style={{ left: "220px" }}>
               <motion.div
                className="h-full w-full origin-top bg-gradient-to-b from-acid via-acid/70 to-acid/0"
                 animate={{ scaleY: progress }}
                 transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="pointer-events-none absolute left-[124px] top-0 h-full w-px bg-soft-2 md:hidden">
               <motion.div
                className="h-full w-full origin-top bg-gradient-to-b from-acid via-acid/70 to-acid/0"
                 animate={{ scaleY: progress }}
                 transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

          {items.map((it, i) => {
            const c = colorMap[it.color] ?? colorMap.acid;
            return (
              <div key={`${filter}-${it.id}-${i}`} className="reveal grid grid-cols-[110px_28px_1fr] gap-4 md:grid-cols-[200px_40px_1fr] md:gap-8">
                <div className="pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {it.period}
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
                <div className="group rounded-xl border border-soft-2 bg-card p-6 lg:p-7 transition-all hover:border-acid/30 hover:-translate-y-0.5">
                  <div className="flex items-start gap-4">
                    <BrandLogo src={it.company_logo_url} name={it.company} />
                    <div className="min-w-0">
                      <h3 className="font-syne text-[20px] font-bold text-ink">{it.role}</h3>
                      <div className={`mt-1 font-syne text-[14px] font-semibold ${c.text}`}>{it.company}</div>
                    </div>
                  </div>
                  {it.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {it.bullets.map((h) => (
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
      </div>
    </section>
  );
}
