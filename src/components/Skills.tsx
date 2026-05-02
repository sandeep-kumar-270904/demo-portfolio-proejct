import { useMemo, useState } from "react";
import { useSkills } from "@/hooks/useSupabase";
import type { DbSkill } from "@/data/skillsFallback";

type Tab = { key: string; label: string; icon: string };

const TAB_DEFS: Tab[] = [
  { key: "Frontend", label: "Frontend", icon: "⚛" },
  { key: "Backend", label: "Backend", icon: "⚙️" },
  { key: "Database", label: "Database", icon: "🗄️" },
  { key: "DevOps", label: "DevOps", icon: "🚀" },
  { key: "Tools", label: "Tools", icon: "🛠" },
];

function tagFor(level: number | null): "EXPERT" | "ADVANCED" | "INTERMEDIATE" {
  const l = level ?? 0;
  if (l >= 88) return "EXPERT";
  if (l >= 75) return "ADVANCED";
  return "INTERMEDIATE";
}

function SkillBar({ s, active }: { s: DbSkill; active: boolean }) {
  const tag = tagFor(s.level);
  const level = s.level ?? 0;
  return (
    <div className="rounded-xl border border-soft-2 bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-soft-2 bg-surface text-base">
            {s.icon ?? "•"}
          </div>
          <span className="font-syne text-[15px] font-bold text-ink truncate">{s.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`font-mono text-[9px] uppercase tracking-widest ${
              tag === "EXPERT" ? "text-acid" : tag === "ADVANCED" ? "text-cyan" : "text-muted-foreground"
            }`}
          >
            {tag}
          </span>
          <span className="font-mono text-[11px] text-ink-2">{level}%</span>
        </div>
      </div>
      <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-void">
        <div
          key={active ? "on" : "off"}
          className="relative h-full rounded-full bg-acid"
          style={{
            width: active ? `${level}%` : "0%",
            transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 0 12px hsl(var(--acid)/0.6)",
          }}
        >
          <span className="absolute inset-y-0 right-0 w-8 bg-gradient-to-r from-transparent to-white/40 blur-sm" />
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState(0);
  const { data: rows = [] } = useSkills();

  // Build per-category groups using TAB_DEFS order, only showing tabs that have data.
  const tabs = useMemo(() => {
    return TAB_DEFS.map((t) => ({
      ...t,
      skills: rows.filter((r) => r.category === t.key),
    })).filter((t) => t.skills.length > 0);
  }, [rows]);

  if (tabs.length === 0) return null;
  const safeIdx = Math.min(active, tabs.length - 1);
  const tab = tabs[safeIdx];

  return (
    <section id="skills" className="relative bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">03 — Arsenal</span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">Technical </span>
          <span className="text-grad-acid">Stack</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1 lg:sticky lg:top-24 self-start">
            {tabs.map((t, i) => {
              const a = i === safeIdx;
              return (
                <li key={t.key}>
                  <button
                    onClick={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-3 border-l-2 px-4 py-3 text-left font-syne text-[15px] font-semibold transition-all ${
                      a
                        ? "border-acid bg-acid/5 text-acid"
                        : "border-transparent text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </span>
                    <span className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {t.skills.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div>
            <h3 className="font-syne text-[24px] font-bold text-ink">{tab.label} Stack</h3>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {tab.skills.length} technologies · production-ready
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tab.skills.map((s) => (
                <SkillBar key={s.id} s={s} active={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
