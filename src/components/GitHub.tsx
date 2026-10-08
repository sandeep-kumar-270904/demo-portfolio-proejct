import { useMemo } from "react";
import { useCounter, useInView } from "@/hooks/useCounter";
import { useGitHubStats } from "@/hooks/useGitHubStats";

function StatCard({ value, suffix, label, hint, gradient, start }: { value: number; suffix: string; label: string; hint?: string; gradient: string; start: boolean }) {
  const v = useCounter(value, 1500, start);
  return (
    <div className="rounded-2xl border border-soft-2 bg-card p-6 transition-colors hover:border-acid/30">
      <div className={`font-syne text-[40px] font-extrabold leading-none ${gradient}`}>
        {v}
        {suffix}
      </div>
      <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-ink-2">{label}</div>
      {hint && (
        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{hint}</div>
      )}
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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${Math.max(m, 1)}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function GitHub() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const { data, loading } = useGitHubStats();

  const days = data?.days ?? [];
  const langs = data?.languages?.length ? data.languages : FALLBACK_LANGS;
  const stats = data?.stats;

  // Pad the calendar to a full 53-week grid, most recent last.
  const cells = useMemo(() => {
    const levels = days.map((d) => d.level);
    const target = 53 * 7;
    if (levels.length >= target) return levels.slice(levels.length - target);
    return [...Array(target - levels.length).fill(0), ...levels];
  }, [days]);

  const activity = data?.activity ?? [];
  const latest = data?.latest ?? null;
  const repos = (data?.recentRepos?.length ? data.recentRepos : data?.pinnedRepos ?? []).slice(0, 6);

  return (
    <section id="github" className="relative bg-void px-6 py-14 lg:py-24">
      <div className="mx-auto max-w-[1320px]" ref={ref}>
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">06 — Open Source</span>
          {loading && !data && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              · syncing live data
            </span>
          )}
          {data?.stale && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              · cached
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

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left */}
          <div className="reveal space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard value={stats?.contributionsThisYear ?? 0} suffix="" label="Contributions" hint="Last 12 months · live" gradient="text-grad-acid" start={inView} />
              <StatCard value={stats?.currentStreak ?? 0} suffix="" label="Day Streak" hint={`Longest ${stats?.longestStreak ?? 0}`} gradient="text-grad-acid" start={inView} />
              <StatCard value={stats?.stars ?? 0} suffix="" label="Stars Earned" hint="Across repos" gradient="text-grad-fire" start={inView} />
              <StatCard value={stats?.publicRepos ?? 0} suffix="" label="Repositories" hint="Public, non-fork" gradient="text-grad-plasma" start={inView} />
            </div>

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

            {latest && (
              <a
                href={latest.html_url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-soft-2 bg-card p-6 transition-colors hover:border-acid/30"
              >
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Currently building
                </div>
                <div className="mt-2 font-syne text-lg font-bold text-ink">{latest.name}</div>
                {latest.description && (
                  <div className="mt-1 text-sm text-ink-2 line-clamp-2">{latest.description}</div>
                )}
                <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-acid">
                  {latest.language ? `${latest.language} · ` : ""}updated {timeAgo(latest.pushed_at)}
                </div>
              </a>
            )}
          </div>

          {/* Right — Heatmap in terminal IDE frame */}
          <div className="reveal space-y-4">
            <div className="overflow-hidden rounded-2xl border border-soft-2 bg-card">
              <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
                  <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">~/sandeep/github-activity</span>
                <span className="w-12" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    Contribution Graph — Last 12 months
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
                        background: HEAT_COLORS[v] ?? HEAT_COLORS[0],
                        opacity: inView ? 1 : 0,
                        transition: `opacity 0.4s ease ${(i % 60) * 6}ms, transform 0.2s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {activity.length > 0 && (
              <div className="rounded-2xl border border-soft-2 bg-card p-6">
                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Recent Activity
                </div>
                <ul className="mt-4 space-y-3">
                  {activity.map((a, i) => (
                    <li key={i}>
                      <a href={a.url} target="_blank" rel="noreferrer" className="group flex items-start gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-acid" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-ink-2 group-hover:text-ink">{a.message}</span>
                          <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            {a.repo} · {timeAgo(a.created_at)}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {repos.length > 0 && (
          <div className="mt-10">
            <div className="reveal flex items-end justify-between gap-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Repositories</div>
              {data?.user?.html_url && (
                <a href={`${data.user.html_url}?tab=repositories`} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-widest text-acid hover:underline">
                  View all on GitHub →
                </a>
              )}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {repos.map((r, i) => (
                <a
                  key={r.name}
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="reveal float-hover flex flex-col rounded-2xl border border-soft-2 bg-card p-5 transition-colors hover:border-acid/30"
                >
                  <div className="truncate font-syne text-base font-bold text-ink">{r.name}</div>
                  <div className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-ink-2">{r.description || "No description yet."}</div>
                  <div className="mt-4 flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {r.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
                        {r.language}
                      </span>
                    )}
                    <span>★ {r.stargazers_count}</span>
                    <span>⑂ {r.forks_count}</span>
                    {"pushed_at" in r && r.pushed_at && <span className="ml-auto">{timeAgo(r.pushed_at)}</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
