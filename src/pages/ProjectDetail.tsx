import { useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Github, BookOpen, Play, Download } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useProjects } from "@/hooks/useSupabase";
import { getProjectVisual } from "@/data/projectVisuals";
import { ease, duration, stagger, fadeUp, item, staggerParent } from "@/lib/motion";

function slugOf(r: { tags?: string[]; title: string }) {
  return (r.tags?.[0] ?? r.title.toLowerCase().replace(/\s+/g, "-")) as string;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: duration.lg, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}

// Heuristic grouping of tech stack into buckets for the breakdown
function groupStack(stack: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {
    Frontend: [],
    Backend: [],
    "Data & Infra": [],
    Tooling: [],
  };
  const fe = /react|next|vue|svelte|tailwind|css|html|typescript|javascript|vite|astro|remix|three/i;
  const be = /node|express|fastapi|django|flask|rails|go\b|golang|java\b|spring|rust|php|laravel|nest|graphql|api/i;
  const data = /postgres|mysql|sql|redis|mongo|prisma|supabase|firebase|s3|aws|gcp|azure|docker|kubernetes|kafka|edge|cdn/i;
  for (const t of stack) {
    if (fe.test(t)) groups.Frontend.push(t);
    else if (be.test(t)) groups.Backend.push(t);
    else if (data.test(t)) groups["Data & Infra"].push(t);
    else groups.Tooling.push(t);
  }
  return groups;
}


export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { data: rows = [], isLoading } = useProjects();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  const index = useMemo(
    () => rows.findIndex((r) => slugOf(r).toLowerCase() === slug.toLowerCase()),
    [rows, slug],
  );
  const project = index >= 0 ? rows[index] : undefined;
  const prev = index > 0 ? rows[index - 1] : rows[rows.length - 1];
  const next = index >= 0 && index < rows.length - 1 ? rows[index + 1] : rows[0];

  useEffect(() => {
    if (project) document.title = `${project.title} — Project`;
    window.scrollTo(0, 0);
  }, [project]);

  // Keyboard nav between projects
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft" && prev) navigate(`/projects/${slugOf(prev)}`);
      if (e.key === "ArrowRight" && next) navigate(`/projects/${slugOf(next)}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, navigate]);

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

  const heroSlug = slugOf(project);
  const hero = project.image_url ? (
    <img src={project.image_url} alt={project.title} className="h-full w-full object-cover" />
  ) : (
    getProjectVisual(heroSlug)
  );

  const features =
    project.key_features && project.key_features.length > 0
      ? project.key_features
      : (project.long_description ?? "")
          .split(/\.\s+|\n+/)
          .map((s) => s.trim())
          .filter(Boolean);

  const gallery = project.gallery ?? [];
  const videoUrl = project.video_url ?? null;
  const isEmbed = videoUrl && /youtube\.com|youtu\.be|vimeo\.com/.test(videoUrl);
  const embedSrc = videoUrl
    ? videoUrl
        .replace("youtu.be/", "www.youtube.com/embed/")
        .replace("watch?v=", "embed/")
        .replace("vimeo.com/", "player.vimeo.com/video/")
    : "";

  return (
    <>
      <Nav />
      <main className="bg-void">
        {/* HERO with parallax */}
        <section ref={heroRef} className="relative h-[520px] w-full overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY, scale: heroScale }}>
            {hero}
          </motion.div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-transparent"
            style={{ opacity: heroOpacity }}
          />
          <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-end px-6 pb-14">
            <Reveal>
              <Link
                to="/#projects"
                className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-soft-2 bg-void/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-2 backdrop-blur hover:border-acid/40 hover:text-acid"
              >
                <ArrowLeft size={13} /> All projects
              </Link>
            </Reveal>
            <Reveal delay={0.05}>
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-acid">
                {project.category ?? "Project"} {index >= 0 && `· ${String(index + 1).padStart(2, "0")} / ${String(rows.length).padStart(2, "0")}`}
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="mt-3 font-syne font-extrabold uppercase text-ink"
                style={{ fontSize: "clamp(36px, 6vw, 84px)", letterSpacing: "-0.04em", lineHeight: 0.95 }}
              >
                {project.title}
              </h1>
            </Reveal>
            {project.description && (
              <Reveal delay={0.18}>
                <p className="mt-4 max-w-[720px] text-[16px] leading-relaxed text-ink-2">
                  {project.description}
                </p>
              </Reveal>
            )}
            <Reveal delay={0.25}>
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
                {project.readme_url && (
                  <a
                    href={project.readme_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-5 py-2.5 font-syne text-[13px] font-bold text-ink hover:border-acid/40 hover:text-acid"
                  >
                    README <FileText size={14} />
                  </a>
                )}
                {project.docs_url && (
                  <a
                    href={project.docs_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-5 py-2.5 font-syne text-[13px] font-bold text-ink hover:border-acid/40 hover:text-acid"
                  >
                    Docs <BookOpen size={14} />
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* META STRIP */}
        {(project.my_role || project.duration || project.team_size || project.category) && (
          <section className="border-y border-soft-2 bg-surface/30">
            <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-6 px-6 py-8 sm:grid-cols-4">
              {[
                { label: "Role", value: project.my_role },
                { label: "Duration", value: project.duration },
                { label: "Team", value: project.team_size },
                { label: "Category", value: project.category },
              ]
                .filter((m) => m.value)
                .map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.5, ease: ease.out }}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {m.label}
                    </div>
                    <div className="mt-1.5 font-syne text-[15px] font-bold text-ink">{m.value}</div>
                  </motion.div>
                ))}
            </div>
          </section>
        )}

        {/* OVERVIEW NARRATIVE (full-width band) */}
        {(project.overview || project.long_description) && (
          <section className="border-b border-soft-2">
            <div className="mx-auto max-w-[1320px] px-6 py-20">
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">
                  Overview
                </span>
                <p className="mt-6 max-w-[940px] whitespace-pre-line font-syne text-[24px] font-light leading-[1.5] text-ink md:text-[28px]">
                  {project.overview || project.long_description}
                </p>
              </Reveal>
            </div>
          </section>
        )}

        {/* METRICS CALLOUTS (large impact band) */}
        {project.stats?.length > 0 && (
          <section className="border-b border-soft-2 bg-surface/20">
            <div className="mx-auto max-w-[1320px] px-6 py-16">
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">
                  Impact by the numbers
                </span>
              </Reveal>
              <motion.div
                variants={staggerParent(stagger.base)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4"
              >
                {project.stats.map((s, i) => (
                  <motion.div key={i} variants={item} className="rounded-2xl border border-soft-2 bg-card p-6">
                    <div className="font-syne text-[40px] font-extrabold leading-none text-grad-acid md:text-[52px]">
                      {s.value}
                    </div>
                    <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* BODY */}
        <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-[1.7fr_1fr]">
          <div className="space-y-14">
            {/* Problem / Solution */}
            {(project.problem || project.solution) && (
              <Reveal>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {project.problem && (
                    <div className="rounded-2xl border border-soft-2 bg-card p-6">
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">Problem</h3>
                      <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.75] text-ink-2">
                        {project.problem}
                      </p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="rounded-2xl border border-soft-2 bg-card p-6">
                      <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">Solution</h3>
                      <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.75] text-ink-2">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* About */}
            <Reveal>
              <h2 className="font-syne text-[28px] font-bold text-ink">About this project</h2>
              <p className="mt-5 whitespace-pre-line text-[16px] leading-[1.85] text-ink-2">
                {project.long_description || project.description || "No description yet."}
              </p>
            </Reveal>

            {/* Key features */}
            {features.length > 0 && (
              <Reveal>
                <h2 className="font-syne text-[24px] font-bold text-ink">Key features</h2>
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {features.map((f, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease: ease.out }}
                      className="flex gap-3 rounded-xl border border-soft-2 bg-card p-4 text-[14px] leading-relaxed text-ink-2"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-acid" /> {f}
                    </motion.li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Challenges / Results / Lessons */}
            {(project.challenges || project.results || project.lessons) && (
              <Reveal>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {[
                    { label: "Challenges", value: project.challenges },
                    { label: "Results", value: project.results },
                    { label: "Lessons learned", value: project.lessons },
                  ]
                    .filter((b) => b.value)
                    .map((b, i) => (
                      <motion.div
                        key={b.label}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.6, ease: ease.out }}
                        className="rounded-2xl border border-soft-2 bg-card p-6"
                      >
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
                          {b.label}
                        </h3>
                        <p className="mt-4 whitespace-pre-line text-[14px] leading-[1.75] text-ink-2">
                          {b.value}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </Reveal>
            )}

            {/* Video */}
            {videoUrl && (
              <Reveal>
                <h2 className="font-syne text-[24px] font-bold text-ink flex items-center gap-2">
                  <Play size={18} className="text-acid" /> Demo
                </h2>
                <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-soft-2 bg-black">
                  {isEmbed ? (
                    <iframe
                      src={embedSrc}
                      title={`${project.title} demo`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="h-full w-full" />
                  )}
                </div>
              </Reveal>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <Reveal>
                <h2 className="font-syne text-[24px] font-bold text-ink">Gallery</h2>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {gallery.map((src, i) => (
                    <motion.a
                      key={src + i}
                      href={src}
                      target="_blank"
                      rel="noreferrer"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.7, ease: ease.out }}
                      className="group block overflow-hidden rounded-2xl border border-soft-2 bg-card"
                    >
                      <img
                        src={src}
                        alt={`${project.title} screenshot ${i + 1}`}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </motion.a>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
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
            <div className="rounded-2xl border border-soft-2 bg-card p-6">
              <h3 className="font-syne text-[14px] font-bold uppercase tracking-widest text-acid">
                Browse
              </h3>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Use ← → keys to move between projects
              </p>
            </div>
          </aside>
        </section>

        {/* TECHNICAL STACK BREAKDOWN */}
        {project.tech_stack?.length > 0 && (
          <section className="border-y border-soft-2 bg-surface/20">
            <div className="mx-auto max-w-[1320px] px-6 py-16">
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">
                  Technical stack
                </span>
                <h2 className="mt-3 font-syne text-[28px] font-bold text-ink">
                  How it's built
                </h2>
              </Reveal>
              <motion.div
                variants={staggerParent(stagger.base)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {Object.entries(groupStack(project.tech_stack))
                  .filter(([, v]) => v.length > 0)
                  .map(([group, items]) => (
                    <motion.div
                      key={group}
                      variants={item}
                      className="rounded-2xl border border-soft-2 bg-card p-5"
                    >
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-syne text-[14px] font-bold uppercase tracking-widest text-ink">
                          {group}
                        </h3>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {items.length}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {items.map((t) => (
                          <li
                            key={t}
                            className="font-mono text-[12px] text-ink-2 before:mr-2 before:text-acid before:content-['›']"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* CASE STUDY CTA */}
        {project.case_study_url && (
          <section className="mx-auto max-w-[1320px] px-6 py-20">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-acid/30 bg-gradient-to-br from-card via-card to-acid/5 p-10 md:p-14">
                <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">
                      Deep dive
                    </span>
                    <h2 className="mt-3 font-syne text-[32px] font-extrabold leading-tight text-ink md:text-[42px]">
                      Read the full case study
                    </h2>
                    <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-ink-2">
                      Process, architecture, decisions, and the metrics that mattered — packaged
                      as a downloadable PDF.
                    </p>
                  </div>
                  <a
                    href={project.case_study_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 self-start rounded-xl bg-acid px-6 py-3.5 font-syne text-[14px] font-bold text-void transition-transform hover:-translate-y-0.5 hover:glow-acid md:self-center"
                  >
                    <Download size={16} /> Download case study
                  </a>
                </div>
              </div>
            </Reveal>
          </section>
        )}


        {/* PREV / NEXT — gallery navigation */}
        {(prev || next) && (
          <section className="mx-auto max-w-[1320px] px-6 pb-20">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {prev && (
                <Link
                  to={`/projects/${slugOf(prev)}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-soft-2 bg-card p-6 transition-all hover:-translate-y-1 hover:border-acid/40"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      ← Previous
                    </span>
                    <div className="mt-2 font-syne text-[22px] font-extrabold text-ink transition-colors group-hover:text-acid">
                      {prev.title}
                    </div>
                  </div>
                  <ArrowLeft className="text-ink-2 transition-transform group-hover:-translate-x-1" />
                </Link>
              )}
              {next && (
                <Link
                  to={`/projects/${slugOf(next)}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-soft-2 bg-card p-6 text-right transition-all hover:-translate-y-1 hover:border-acid/40 md:col-start-2"
                >
                  <ArrowRight className="text-ink-2 transition-transform group-hover:translate-x-1" />
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Next →
                    </span>
                    <div className="mt-2 font-syne text-[22px] font-extrabold text-ink transition-colors group-hover:text-acid">
                      {next.title}
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
