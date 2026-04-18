import { useMemo, useState } from "react";
import { PROJECTS, PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/data/projects";
import ProjectModal from "./ProjectModal";

function FeaturedCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
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
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");

  const filtered = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );
  const [featured, ...rest] = filtered;

  return (
    <section id="projects" className="relative bg-void px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">02 — Work</span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">Selected </span>
          <span className="text-grad-fire">Projects</span>
        </h2>

        {/* Filter tabs */}
        <div className="reveal mt-10 flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((c) => {
            const isActive = c === filter;
            const count = c === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c).length;
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
              No projects in this category yet.
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
