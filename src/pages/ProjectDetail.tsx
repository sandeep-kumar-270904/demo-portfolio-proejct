import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useProjects } from "@/hooks/useSupabase";
import { getProjectVisual } from "@/data/projectVisuals";

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const { data: rows = [], isLoading } = useProjects();

  const project = useMemo(
    () =>
      rows.find((r) => {
        const s = (r.tags?.[0] ?? r.title.toLowerCase().replace(/\s+/g, "-")) as string;
        return s.toLowerCase() === slug.toLowerCase();
      }),
    [rows, slug],
  );

  useEffect(() => {
    if (project) document.title = `${project.title} — Project`;
    window.scrollTo(0, 0);
  }, [project]);

  const related = useMemo(() => {
    if (!project) return [];
    return rows
      .filter((r) => r.id !== project.id)
      .sort((a, b) => (a.category === project.category ? -1 : 1))
      .slice(0, 3);
  }, [rows, project]);

  if (isLoading) {
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-[1320px] px-6 py-32">
          <p className="font-mono text-[12px] text-muted-foreground">Loading…</p>
        </main>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Nav />
        <main className="mx-auto max-w-[1320px] px-6 py-32">
          <h1 className="font-syne text-[40px] font-extrabold text-ink">Project not found</h1>
          <Link to="/#projects" className="mt-6 inline-flex items-center gap-2 text-acid">
            <ArrowLeft size={16} /> All projects
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const heroSlug = (project.tags?.[0] ?? project.title.toLowerCase().replace(/\s+/g, "-")) as string;
  const hero = project.image_url ? (
    <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
  ) : (
    getProjectVisual(heroSlug)
  );
  const features = (project.long_description ?? "")
    .split(/\.\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <Nav />
      <main className="bg-void">
        {/* Banner */}
        <section className="relative h-[420px] w-full overflow-hidden">
          <div className="absolute inset-0">{hero}</div>
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-end px-6 pb-12">
            <Link
              to="/#projects"
              className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-soft-2 bg-void/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-2 backdrop-blur hover:border-acid/40 hover:text-acid"
            >
              <ArrowLeft size={13} /> All projects
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-acid">
              {project.category ?? "Project"}
            </span>
            <h1
              className="mt-3 font-syne font-extrabold uppercase text-ink"
              style={{ fontSize: "clamp(36px, 6vw, 80px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
            >
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-4 max-w-[700px] text-[16px] leading-relaxed text-ink-2">
                {project.description}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-acid px-5 py-2.5 font-syne text-[13px] font-bold text-void hover:glow-acid"
                >
                  Live demo <ExternalLink size={14} />
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-5 py-2.5 font-syne text-[13px] font-bold text-ink hover:border-acid/40 hover:text-acid"
                >
                  GitHub <Github size={14} />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.7fr_1fr]">
          <div>
            <h2 className="font-syne text-[28px] font-bold text-ink">About this project</h2>
            <p className="mt-5 whitespace-pre-line text-[16px] leading-[1.85] text-ink-2">
              {project.long_description || project.description || "No description yet."}
            </p>
            {features.length > 1 && (
              <ul className="mt-8 space-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex gap-3 text-[15px] text-ink-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acid" /> {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            {project.stats?.length > 0 && (
              <div className="rounded-2xl border border-soft-2 bg-card p-6">
                <h3 className="font-syne text-[14px] font-bold uppercase tracking-widest text-acid">
                  Impact
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {project.stats.map((s, i) => (
                    <div key={i}>
                      <div className="font-syne text-[24px] font-extrabold text-grad-acid">{s.value}</div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {project.tech_stack?.length > 0 && (
              <div className="rounded-2xl border border-soft-2 bg-card p-6">
                <h3 className="font-syne text-[14px] font-bold uppercase tracking-widest text-acid">
                  Stack
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-soft-2 bg-raised px-2.5 py-1 font-mono text-[11px] text-ink-2"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mx-auto max-w-[1320px] px-6 pb-28">
            <h2 className="font-syne text-[24px] font-bold text-ink">More projects</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const rs = (r.tags?.[0] ?? r.title.toLowerCase().replace(/\s+/g, "-")) as string;
                const visual = r.image_url ? (
                  <img src={r.image_url} alt={r.title} className="h-full w-full object-cover" />
                ) : (
                  getProjectVisual(rs)
                );
                return (
                  <Link
                    key={r.id}
                    to={`/projects/${rs}`}
                    className="group relative block overflow-hidden rounded-2xl border border-soft-2 bg-card transition-all hover:-translate-y-1 hover:border-acid/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {visual}
                      <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                      <span className="absolute bottom-4 left-5 font-syne text-[20px] font-extrabold text-ink">
                        {r.title}
                      </span>
                    </div>
                    <p className="p-5 text-[13px] text-ink-2 line-clamp-2">{r.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
