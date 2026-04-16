import { useMemo } from "react";
import { useCounter, useInView } from "@/hooks/useCounter";
import { useGitHubStats } from "@/hooks/useGitHubStats";

function StatCard({ value, suffix, label, gradient, start }: { value: number; suffix: string; label: string; gradient: string; start: boolean }) {
  const v = useCounter(value, 1500, start);
  return (
    <div className="flex items-end justify-between gap-4 rounded-2xl border border-soft-2 bg-card p-6">
      <div className={`font-syne text-[44px] font-extrabold leading-none ${gradient}`}>
        {v}
        {suffix}
      </div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-right max-w-[140px]">
        {label}
      </div>
    </div>
  );
}

const FALLBACK_LANGS = [
  { name: "TypeScript", pct: 40 },
  { name: "JavaScript", pct: 25 },
  { name: "Python", pct: 20 },
  { name: "Other", pct: 15 },
];

const LANG_COLORS = ["#00ffb3", "#7c6fff", "#ff6b35", "#00b8ff", "#ff3b82"];

const HEAT_COLORS = ["#0d0d18", "#0a1f0e", "#0a3016", "#0a4820", "#00ffb3"];

function makePlaceholderHeatmap(weeks = 52) {
  const cells: number[] = [];
  for (let i = 0; i < weeks * 7; i++) {
    const r = Math.random();
    if (r < 0.35) cells.push(0);
    else if (r < 0.55) cells.push(1);
    else if (r < 0.74) cells.push(2);
    else if (r < 0.84) cells.push(3);
    else cells.push(4);
  }
  return cells;
}

export default function GitHub() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const { data, loading } = useGitHubStats();

  const placeholderCells = useMemo(() => makePlaceholderHeatmap(), []);
  const cells = data?.contributionCells?.length ? data.contributionCells : placeholderCells;
  const langs = data?.languages?.length ? data.languages : FALLBACK_LANGS;
  const stats = data?.stats ?? { publicRepos: 25, stars: 120, contributionsThisYear: 500 };

  return (
    <section className="relative bg-void px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]" ref={ref}>
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">06 — Open Source</span>
          {loading && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              · syncing live data
            </span>
          )}
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">Code </span>
          <span className="text-grad-acid">Activity</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-4">
            <StatCard value={stats.contributionsThisYear} suffix="" label="Contributions This Year" gradient="text-grad-acid" start={inView} />
            <StatCard value={stats.stars} suffix="" label="Stars Earned" gradient="text-grad-fire" start={inView} />
            <StatCard value={stats.publicRepos} suffix="" label="Public Repos" gradient="text-grad-plasma" start={inView} />

            <div className="rounded-2xl border border-soft-2 bg-card p-6">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Language Distribution
              </div>
              <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-void">
                {langs.map((l, i) => (
                  <div
                    key={l.name}
                    style={{
                      width: inView ? `${l.pct}%` : 0,
                      background: LANG_COLORS[i % LANG_COLORS.length],
                      transition: "width 1.2s ease-out",
                    }}
                  />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {langs.map((l, i) => (
                  <div key={l.name} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
                    <span className="font-mono text-[11px] text-ink-2 truncate">{l.name}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Heatmap */}
          <div className="rounded-2xl border border-soft-2 bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Contribution Graph — {new Date().getFullYear()}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-muted-foreground">less</span>
                {HEAT_COLORS.map((c, i) => (
                  <span key={i} className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />
                ))}
                <span className="font-mono text-[9px] text-muted-foreground">more</span>
              </div>
            </div>

            <div
              className="mt-5 grid gap-[3px] overflow-hidden"
              style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))", gridAutoFlow: "column", gridTemplateRows: "repeat(7, 1fr)" }}
            >
              {cells.map((v, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-[2px] transition-transform duration-200 hover:scale-150"
                  style={{
                    background: HEAT_COLORS[v],
                    opacity: inView ? 1 : 0,
                    transition: `opacity 0.4s ease ${(i % 60) * 6}ms, transform 0.2s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
