import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useSupabase";
import { useSiteCopy } from "@/hooks/useSiteCopy";
import type { DbProject } from "@/data/projectsFallback";
import { getProjectVisual } from "@/data/projectVisuals";
import type { Project, ProjectCategory } from "@/data/projects";

const CATEGORIES: ("All" | string)[] = ["All", "SaaS", "E-Commerce", "Dev Tools", "DevOps"];

// Adapt a DB row into the Project shape that ProjectModal expects.
function toProject(p: DbProject, idx: number): Project {
  const slug = (p.tags?.[0] ?? p.title.toLowerCase().replace(/\s+/g, "-")) as string;
  const visual = p.image_url ? (
    <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />
  ) : (
    getProjectVisual(slug)
  );
  // pills: skip the slug stored in tags[0]
  const pills = (p.tags ?? []).slice(1);
  return {
    slug,
    number: `${String(idx + 1).padStart(2, "0")}`,
    name: p.title,
    category: (p.category as ProjectCategory) ?? "SaaS",
    title: p.title,
    description: p.description ?? "",
    pills,
    metrics: p.stats ?? [],
    features: (p.long_description ?? "")
      .split(/\.\s+|\n+/)
      .map((s) => s.trim())
      .filter(Boolean),
    stack: p.tech_stack ?? [],
    liveUrl: p.live_url ?? undefined,
    githubUrl: p.github_url ?? undefined,
    visual,
  };
}

function FeaturedCard({ p }: { p: Project }) {
  return (
    <Link
      to={`/projects/${p.slug}`}
      className="reveal group relative block w-full overflow-hidden rounded-2xl border border-soft-2 bg-card text-left transition-all duration-500 hover:border-acid/40 hover:shadow-[0_30px_80px_-20px_rgba(0,255,179,0.25)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative aspect-[5/4] lg:aspect-auto">
          {p.visual}
          <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent" />
          <span className="absolute left-6 top-6 font-mono text-[11px] uppercase tracking-widest text-acid">
            {p.number}
          </span>
          <span className="absolute bottom-6 left-6 font-syne text-[44px] font-extrabold text-ink leading-none">
            {p.name}
          </span>
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-acid" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-acid">{p.category}</span>
          </div>
          <h3 className="mt-4 font-syne text-[26px] font-bold text-ink">{p.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{p.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {p.pills.map((pl) => (
              <span
                key={pl}
                className="rounded-md border border-soft-2 bg-raised px-2.5 py-1 font-mono text-[11px] text-ink-2 transition-colors group-hover:border-acid/40 group-hover:text-acid"
              >
                {pl}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-soft-2 pt-6">
            <div className="flex gap-6">
              {p.metrics.slice(0, 2).map((m) => (
                <div key={m.label}>
                  <div className="font-syne text-[20px] font-extrabold text-grad-acid">{m.value}</div>
                  <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 font-mono text-[11px] uppercase tracking-wider text-ink-2">
              <span className="hover:text-acid">Live →</span>
              <span className="hover:text-acid">GitHub ↗</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function GridCard({ p, onOpen, idx }: { p: Project; onOpen: () => void; idx: number }) {
  return (
    <button
      onClick={onOpen}
      className="reveal group relative block overflow-hidden rounded-2xl border border-soft-2 bg-card text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-acid/40 hover:shadow-[0_25px_60px_-20px_rgba(0,255,179,0.2)]"
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {p.visual}
        <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
        <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-widest text-acid">
          {p.number}
        </span>
        <span className="absolute bottom-5 left-5 font-syne text-[28px] font-extrabold text-ink leading-none">
          {p.name}
        </span>
      </div>
      <div className="p-6">
        <p className="text-[14px] leading-relaxed text-ink-2 min-h-[60px]">{p.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.pills.map((pl) => (
            <span
              key={pl}
              className="rounded-md border border-soft-2 bg-raised px-2 py-1 font-mono text-[10px] text-ink-2 transition-colors group-hover:border-acid/40 group-hover:text-acid"
            >
              {pl}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const { data: dbRows = [] } = useProjects();
  const { t } = useSiteCopy();

  const projects = useMemo(() => dbRows.map((r, i) => toProject(r, i)), [dbRows]);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects]
  );
  const [featured, ...rest] = filtered;

  return (
    <section id="projects" className="relative bg-void px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">{t("projects_eyebrow")}</span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">{t("projects_title_a")}</span>
          <span className="text-grad-fire">{t("projects_title_b")}</span>
        </h2>

        {/* Filter tabs */}
        <div className="reveal mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const isActive = c === filter;
            const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                  isActive
                    ? "border-acid bg-acid/10 text-acid"
                    : "border-soft-2 bg-surface/60 text-ink-2 hover:border-acid/40 hover:text-acid"
                }`}
              >
                {c}
                <span className={`rounded-md bg-void/60 px-1.5 py-0.5 text-[9px] ${isActive ? "text-acid" : "text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-14 rounded-2xl border border-dashed border-soft-2 bg-card p-16 text-center">
            <p className="font-mono text-[12px] uppercase tracking-widest text-muted-foreground">
              {t("projects_empty")}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-14">
              <FeaturedCard key={featured.slug} p={featured} onOpen={() => setActive(featured)} />
            </div>
            {rest.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p, i) => (
                  <GridCard key={p.slug} p={p} onOpen={() => setActive(p)} idx={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
