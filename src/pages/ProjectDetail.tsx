import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  Github,
  BookOpen,
  Play,
  Download,
  Compass,
  PenTool,
  Hammer,
  Rocket,
  RefreshCw,
  Lightbulb,
  ImageIcon,
} from "lucide-react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useProjects } from "@/hooks/useSupabase";
import { getProjectVisual } from "@/data/projectVisuals";
import { ease, duration, stagger, item, staggerParent } from "@/lib/motion";

/* ---------- helpers ---------- */
function slugOf(r: { tags?: string[]; title: string }) {
  return (r.tags?.[0] ?? r.title.toLowerCase().replace(/\s+/g, "-")) as string;
}

/* ---------- local (page-scoped) components ---------- */

/**
 * MediaSlot — neutral framed placeholder for future image / carousel / video.
 * Priority: video_url (autoplay muted loop) → images[] (single or carousel) → placeholder.
 * Placeholder is a subtle gradient + soft icon (never a broken-image glyph).
 */
function MediaSlot({
  ratio = "aspect-[16/8]",
  images,
  videoUrl,
  alt,
  rounded = "rounded-3xl",
  label = "Media coming soon",
}: {
  ratio?: string;
  images?: string[];
  videoUrl?: string | null;
  alt?: string;
  rounded?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const imgs = (images ?? []).filter(Boolean);
  const hasCarousel = imgs.length > 1;

  useEffect(() => {
    if (!hasCarousel || reduce) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % imgs.length), 4200);
    return () => clearInterval(t);
  }, [imgs.length, reduce, hasCarousel]);

  const isEmbed = !!videoUrl && /youtube\.com|youtu\.be|vimeo\.com/.test(videoUrl);
  const embedSrc = videoUrl
    ? videoUrl
        .replace("youtu.be/", "www.youtube.com/embed/")
        .replace("watch?v=", "embed/")
        .replace("vimeo.com/", "player.vimeo.com/video/")
    : "";

  // Simple swipe/drag support for carousel
  const dragRef = useRef<{ startX: number; active: boolean }>({ startX: 0, active: false });
  const onPointerDown = (e: React.PointerEvent) => {
    if (!hasCarousel) return;
    dragRef.current = { startX: e.clientX, active: true };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!hasCarousel || !dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    if (Math.abs(dx) > 40) {
      setIdx((i) => (i + (dx < 0 ? 1 : -1) + imgs.length) % imgs.length);
    }
    dragRef.current.active = false;
  };

  return (
    <div
      className={`relative w-full overflow-hidden border border-soft-2 bg-card ${ratio} ${rounded} ${hasCarousel ? "cursor-grab active:cursor-grabbing touch-pan-y" : ""}`}
      aria-label={alt ?? label}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragRef.current.active = false)}
    >
      {videoUrl ? (
        isEmbed ? (
          <iframe
            src={embedSrc}
            title={alt ?? "Project video"}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={videoUrl}
            autoPlay={!reduce}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      ) : imgs.length > 0 ? (
        <>
          {imgs.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              draggable={false}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {hasCarousel && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-void/60 px-2.5 py-1.5 backdrop-blur">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show image ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-5 bg-acid" : "w-1.5 bg-ink-2/50 hover:bg-ink-2"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Neutral placeholder — subtle gradient + soft icon */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,hsl(var(--raised))_0%,hsl(var(--card))_45%,hsl(var(--surface))_100%)]" />
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(hsl(var(--acid))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--acid))_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3 text-ink-2/60">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-soft-2 bg-void/40 backdrop-blur">
                <ImageIcon size={22} className="text-acid/60" aria-hidden />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em]">{label}</span>
            </div>
          </div>
        </>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/40 via-transparent to-transparent" />
    </div>
  );
}


function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: ease.brand, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/** Count-up that preserves prefix/suffix (e.g. "Sub 200ms", "99.9%", "200+"). */
function CountUpValue({ value }: { value: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  const [display, setDisplay] = useState(reduce || !match ? value : `${match[1]}0${match[3]}`);

  useEffect(() => {
    if (reduce || !match) return;
    const [, prefix, num, suffix] = match;
    const target = parseFloat(num);
    const decimals = (num.split(".")[1] || "").length;
    let started = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        const t0 = performance.now();
        const dur = 1400;
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const cur = (target * eased).toFixed(decimals);
          setDisplay(`${prefix}${cur}${suffix}`);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [match, reduce]);

  return <span ref={ref}>{display}</span>;
}

/** Sticky process stepper with anchor scroll. */
const STEPS = [
  { id: "problem", label: "Plan", icon: Compass },
  { id: "architecture", label: "Design", icon: PenTool },
  { id: "features", label: "Build", icon: Hammer },
  { id: "impact", label: "Ship", icon: Rocket },
  { id: "next", label: "Iterate", icon: RefreshCw },
];

function ProcessStepper() {
  const [active, setActive] = useState<string>(STEPS[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    STEPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <div className="sticky top-16 z-30 border-y border-soft-2 bg-void/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-[1320px] items-center gap-1 overflow-x-auto px-6 py-3 sm:gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <div key={s.id} className="flex items-center gap-1 sm:gap-2">
              <a
                href={`#${s.id}`}
                className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all ${
                  isActive
                    ? "border-acid/60 bg-acid/10 text-acid glow-acid-sm"
                    : "border-soft-2 text-ink-2 hover:border-acid/40 hover:text-acid"
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{`0${i + 1} · ${s.label}`}</span>
                <span className="sm:hidden">{s.label}</span>
              </a>
              {i < STEPS.length - 1 && <span className="text-muted-foreground">·</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

/** Architecture SVG with draw-in animation on viewport enter. */
function ArchitectureDiagram({
  nodes: cmsNodes,
  edges: cmsEdges,
}: {
  nodes?: { x?: number; y?: number; label: string; sub?: string }[];
  edges?: [number, number][];
} = {}) {
  const reduce = useReducedMotion();
  const defaultNodes = [
    { x: 60, y: 130, label: "Client", sub: "React SPA" },
    { x: 240, y: 130, label: "API", sub: "Node / REST" },
    { x: 420, y: 60, label: "Cache", sub: "Redis" },
    { x: 420, y: 200, label: "Database", sub: "Postgres" },
    { x: 620, y: 130, label: "Services", sub: "Email · Stripe · S3" },
  ];
  const defaultEdges: [number, number][] = [
    [0, 1],
    [1, 2],
    [1, 3],
    [1, 4],
    [3, 4],
  ];

  // If CMS provides nodes without x/y, auto-layout in a row.
  const nodes = (cmsNodes && cmsNodes.length > 0
    ? cmsNodes.map((n, i, arr) => ({
        x: n.x ?? 60 + (600 * i) / Math.max(1, arr.length - 1),
        y: n.y ?? 140,
        label: n.label,
        sub: n.sub ?? "",
      }))
    : defaultNodes);
  const edges =
    cmsEdges && cmsEdges.length > 0
      ? cmsEdges.filter(([a, b]) => a < nodes.length && b < nodes.length)
      : cmsNodes && cmsNodes.length > 0
        ? (nodes.slice(0, -1).map((_, i) => [i, i + 1]) as [number, number][])
        : defaultEdges;

  return (
    <div className="rounded-3xl border border-soft-2 bg-card p-6 md:p-10">
      <svg viewBox="0 0 720 280" className="h-auto w-full" role="img" aria-label="System architecture diagram">
        <defs>
          <linearGradient id="edgeGrad" x1="0" x2="1">
            <stop offset="0" stopColor="hsl(var(--acid))" stopOpacity="0.9" />
            <stop offset="1" stopColor="hsl(var(--acid))" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {edges.map(([a, b], i) => {
          const A = nodes[a];
          const B = nodes[b];
          const d = `M ${A.x + 60} ${A.y} C ${(A.x + B.x) / 2} ${A.y}, ${(A.x + B.x) / 2} ${B.y}, ${B.x - 60} ${B.y}`;
          return (
            <motion.path
              key={i}
              d={d}
              stroke="url(#edgeGrad)"
              strokeWidth="1.5"
              fill="none"
              initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: ease.brand }}
            />
          );
        })}

        {nodes.map((n, i) => (
          <motion.g
            key={n.label + i}
            initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: ease.brand }}
          >
            <rect
              x={n.x - 60}
              y={n.y - 26}
              width={120}
              height={52}
              rx={12}
              fill="hsl(var(--raised))"
              stroke="hsl(var(--acid) / 0.5)"
              strokeWidth="1"
            />
            <text
              x={n.x}
              y={n.y - 4}
              textAnchor="middle"
              fill="hsl(var(--ink))"
              fontSize="13"
              fontWeight="700"
              fontFamily="Syne, sans-serif"
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y + 14}
              textAnchor="middle"
              fill="hsl(var(--ink-2))"
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
            >
              {n.sub}
            </text>
          </motion.g>
        ))}
      </svg>
      <p className="mt-6 font-mono text-[11px] text-muted-foreground">
        Request path: {nodes.map((n) => n.label).join(" → ")}.
      </p>
    </div>
  );
}

/** Named architecture images uploaded from the CMS, shown as switchable tabs. */
function ArchitectureGallery({
  images,
}: {
  images: { name?: string; url: string; caption?: string }[];
}) {
  const [active, setActive] = useState(0);
  const current = images[Math.min(active, images.length - 1)];
  return (
    <div className="rounded-3xl border border-soft-2 bg-card p-4 md:p-6">
      {images.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {images.map((im, i) => (
            <button
              key={im.url + i}
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all ${
                i === active
                  ? "border-acid/60 bg-acid/10 text-acid"
                  : "border-soft-2 text-ink-2 hover:border-acid/40 hover:text-acid"
              }`}
            >
              {im.name || `Diagram ${i + 1}`}
            </button>
          ))}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-soft-2 bg-void/40">
        <img
          key={current.url}
          src={current.url}
          alt={current.name || "Architecture diagram"}
          loading="lazy"
          className="w-full object-contain"
        />
      </div>
      {(current.caption || current.name) && (
        <p className="mt-4 font-mono text-[11px] text-muted-foreground">
          {current.caption || current.name}
        </p>
      )}
    </div>
  );
}

/** Horizontal snap carousel for feature deep-dives. */
function DeepDiveCarousel({
  items,
  reduce,
}: {
  items: { title: string; description?: string; images?: string[]; video_url?: string | null }[];
  reduce: boolean | null;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.8), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((f, i) => (
          <motion.article
            key={i}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: Math.min(i, 3) * 0.08, ease: ease.brand }}
            whileHover={reduce ? undefined : { y: -6 }}
            className="group flex w-[88%] flex-none snap-start flex-col overflow-hidden rounded-2xl border border-soft-2 bg-card transition-colors hover:border-acid/50 sm:w-[60%] lg:w-[calc(33.333%-1rem)]"
          >
            <MediaSlot
              ratio="aspect-[16/10]"
              rounded="rounded-none"
              images={f.images}
              videoUrl={f.video_url ?? null}
              alt={`${f.title} preview`}
              label={`Feature 0${i + 1} · media slot`}
            />
            <div className="flex-1 p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
                Feature {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-2 font-syne text-[18px] font-bold text-ink">{f.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                {f.description ||
                  "Designed end-to-end — from the interaction model to the data path — and shipped behind a feature flag for safe rollout."}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
      {items.length > 1 && (
        <div className="mt-2 flex justify-end gap-2">
          <button
            aria-label="Previous feature"
            onClick={() => scrollBy(-1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-soft-2 bg-surface text-ink-2 transition-colors hover:border-acid/50 hover:text-acid"
          >
            <ArrowLeft size={15} />
          </button>
          <button
            aria-label="Next feature"
            onClick={() => scrollBy(1)}
            className="grid h-9 w-9 place-items-center rounded-full border border-soft-2 bg-surface text-ink-2 transition-colors hover:border-acid/50 hover:text-acid"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}


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

const GROUP_WHY: Record<string, string> = {
  Frontend: "Chosen for velocity, DX, and a small runtime.",
  Backend: "Typed contracts and a boring, reliable request path.",
  "Data & Infra": "Managed services so I ship features, not pagers.",
  Tooling: "Automation for tests, deploys, and observability.",
};

/* ---------- page ---------- */

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { data: rows = [], isLoading } = useProjects();
  const heroRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [videoMode, setVideoMode] = useState(false);


  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

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
          <Link to={{ pathname: "/", hash: "#projects" }} className="mt-6 inline-flex items-center gap-2 text-acid">
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

  // CMS-editable structured deep-dive features (title + description + own media).
  // Fallback: derive up-to-3 title-only cards from key_features string list.
  const deepDives: {
    title: string;
    description?: string;
    images?: string[];
    video_url?: string | null;
  }[] =
    project.features_deep && project.features_deep.length > 0
      ? project.features_deep
      : features.slice(0, 3).map((f) => ({ title: f }));

  const videoUrl = project.video_url ?? null;
  const isEmbed = videoUrl && /youtube\.com|youtu\.be|vimeo\.com/.test(videoUrl);
  const embedSrc = videoUrl
    ? videoUrl
        .replace("youtu.be/", "www.youtube.com/embed/")
        .replace("watch?v=", "embed/")
        .replace("vimeo.com/", "player.vimeo.com/video/")
    : "";

  const overviewText = project.overview || project.long_description || project.description || "";

  // Stack groups: prefer CMS-provided groups; fall back to auto-grouping tech_stack.
  const cmsStackGroups = project.stack_groups && project.stack_groups.length > 0 ? project.stack_groups : null;
  const autoGroups = groupStack(project.tech_stack ?? []);
  const stackGroupsToRender: { name: string; items: string[]; why?: string }[] = cmsStackGroups
    ? cmsStackGroups
    : Object.entries(autoGroups)
        .filter(([, v]) => v.length > 0)
        .map(([name, items]) => ({ name, items, why: GROUP_WHY[name] }));

  const status = project.status_badge || (project.live_url ? "Live" : "In progress");

  // Hero media: prefer explicit hero_images array (multi = carousel), else fall back to image_url.
  const heroImages =
    project.hero_images && project.hero_images.length > 0
      ? project.hero_images
      : project.image_url
        ? [project.image_url]
        : [];

  // Frontend / backend cards: use CMS-provided arrays when present.
  const frontendCards =
    project.frontend_cards && project.frontend_cards.length > 0
      ? project.frontend_cards
      : [
          { h: "UI / UX", p: "Content-first hierarchy, restrained motion, and a single accent to guide the eye." },
          { h: "State", p: "Server state via React Query; UI state stays local — no global store for local concerns." },
          { h: "Responsive", p: "Fluid type with clamp(), 12-col at ≥lg, single-column below md, tested on real devices." },
        ];
  const backendCards =
    project.backend_cards && project.backend_cards.length > 0
      ? project.backend_cards
      : [
          { h: "API", p: "Typed REST endpoints, versioned routes, and consistent error envelopes." },
          { h: "Schema", p: "Normalised core tables, denormalised read models for hot paths, migrations in code." },
          { h: "Caching & scale", p: "Redis read-through cache, background jobs for fan-out, horizontal scale by default." },
        ];

  const decision = project.key_decision ?? null;
  const decisionChose = decision?.chose || "Server-driven UI for the editor";
  const decisionInstead = decision?.instead_of || "A bespoke client-side state machine";
  const decisionBecause =
    decision?.because ||
    "Iteration speed was the bottleneck — shipping schema tweaks server-side removed a full release cycle per change and let non-engineers propose flows.";

  return (
    <>
      <Nav />
      <main className="bg-void">
        {/* 1. HERO */}
        <section ref={heroRef} className="relative h-[520px] w-full overflow-hidden">
          <motion.div className="absolute inset-0 will-change-transform" style={{ y: heroY, scale: heroScale }}>
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
                {project.category ?? "Project"}
                {index >= 0 && ` · ${String(index + 1).padStart(2, "0")} / ${String(rows.length).padStart(2, "0")}`}
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
                <p className="mt-4 max-w-[720px] text-[16px] leading-relaxed text-ink-2">{project.description}</p>
              </Reveal>
            )}
            <Reveal delay={0.25}>
              <div className="mt-7 flex flex-wrap gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-acid px-5 py-2.5 font-syne text-[13px] font-bold text-void transition-transform hover:-translate-y-0.5 hover:glow-acid"
                  >
                    Live demo <ExternalLink size={14} />
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-5 py-2.5 font-syne text-[13px] font-bold text-ink transition-colors hover:border-acid/40 hover:text-acid"
                  >
                    GitHub <Github size={14} />
                  </a>
                )}
                {project.readme_url && (
                  <a
                    href={project.readme_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-5 py-2.5 font-syne text-[13px] font-bold text-ink transition-colors hover:border-acid/40 hover:text-acid"
                  >
                    README <FileText size={14} />
                  </a>
                )}
                {project.docs_url && (
                  <a
                    href={project.docs_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-5 py-2.5 font-syne text-[13px] font-bold text-ink transition-colors hover:border-acid/40 hover:text-acid"
                  >
                    Docs <BookOpen size={14} />
                  </a>
                )}
                {videoUrl && (
                  <button
                    onClick={() => {
                      setVideoMode(true);
                      document.getElementById("hero-media")?.scrollIntoView({
                        behavior: reduce ? "auto" : "smooth",
                        block: "center",
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-acid/40 bg-acid/10 px-5 py-2.5 font-syne text-[13px] font-bold text-acid transition-transform hover:-translate-y-0.5 hover:glow-acid"
                  >
                    Video <Play size={14} />
                  </button>
                )}


              </div>
            </Reveal>
          </div>
        </section>

        {/* 2. HERO MEDIA — full-width visual slot (switches to the demo video on demand) */}
        <section id="hero-media" className="scroll-mt-28 border-b border-soft-2 bg-surface/10">
          <div className="mx-auto max-w-[1320px] px-6 py-12">
            <Reveal>
              {videoMode && videoUrl ? (
                <div className="relative overflow-hidden rounded-3xl border border-acid/30 bg-black">
                  <div className="aspect-video w-full">
                    {isEmbed ? (
                      <iframe
                        src={`${embedSrc}${embedSrc.includes("?") ? "&" : "?"}autoplay=1`}
                        title={`${project.title} demo`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={videoUrl} controls autoPlay playsInline className="h-full w-full" />
                    )}
                  </div>
                  <button
                    onClick={() => setVideoMode(false)}
                    className="absolute right-4 top-4 rounded-full border border-soft-2 bg-void/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2 backdrop-blur hover:border-acid/50 hover:text-acid"
                  >
                    Close video
                  </button>
                </div>
              ) : (
                <MediaSlot
                  ratio="aspect-[16/8]"
                  rounded="rounded-3xl"
                  images={heroImages}
                  alt={`${project.title} hero media`}
                  label="Hero visual · image / carousel / video"
                />
              )}
            </Reveal>
          </div>
        </section>

        {/* 2b. AT A GLANCE — compact skim summary */}
        <section className="border-b border-soft-2">
          <div className="mx-auto max-w-[1320px] px-6 py-10">
            <Reveal>
              <div className="rounded-2xl border border-soft-2 bg-card/70 p-6 backdrop-blur md:p-8">
                <div className="flex items-center gap-2">
                  <Lightbulb size={14} className="text-acid" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-acid">At a glance</span>
                </div>
                <div className="mt-5 grid gap-6 md:grid-cols-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Problem</div>
                    {glanceMedia.problem.length > 0 && (
                      <div className="mt-3">
                        <MediaSlot ratio="aspect-[16/9]" rounded="rounded-xl" images={glanceMedia.problem} alt="Problem visual" />
                      </div>
                    )}
                    <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink">
                      {(project.problem || overviewText || "A workflow gap with no clean off-the-shelf fix.").split(/\.\s|\n/)[0] + "."}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Solution</div>
                    {glanceMedia.solution.length > 0 && (
                      <div className="mt-3">
                        <MediaSlot ratio="aspect-[16/9]" rounded="rounded-xl" images={glanceMedia.solution} alt="Solution visual" />
                      </div>
                    )}
                    <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink">
                      {(project.solution || project.description || "A focused product that removes the friction end-to-end.").split(/\.\s|\n/)[0] + "."}
                    </p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Key features</div>
                    {glanceMedia.features.length > 0 && (
                      <div className="mt-3">
                        <MediaSlot ratio="aspect-[16/9]" rounded="rounded-xl" images={glanceMedia.features} alt="Key features visual" />
                      </div>
                    )}
                    <ul className="mt-3 space-y-1.5">
                      {(features.length ? features : ["End-to-end flow", "Considered UX", "Production-grade"])
                        .slice(0, 4)
                        .map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-ink-2">
                            <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-acid" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. QUICK-FACTS strip */}
        <section className="border-b border-soft-2 bg-surface/30">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-6 px-6 py-8 sm:grid-cols-4">
            {[
              { label: "Role", value: project.my_role || "Designer · Engineer" },
              { label: "Duration", value: project.duration || "—" },
              { label: "Status", value: status },
              { label: "Category", value: project.category || "Project" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: ease.brand }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {m.label}
                </div>
                <div className="mt-1.5 font-syne text-[15px] font-bold text-ink">{m.value}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. STICKY PROCESS STEPPER */}
        <ProcessStepper />

        {/* 5. THE PROBLEM */}
        <section id="problem" className="scroll-mt-32 border-b border-soft-2">
          <div className="mx-auto max-w-[1320px] px-6 py-20">
            <Reveal>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">01 · The problem</span>
              <h2 className="mt-3 font-syne text-[32px] font-extrabold text-ink md:text-[42px]">
                What needed to exist.
              </h2>
              <p className="mt-6 max-w-[900px] whitespace-pre-line text-[17px] leading-[1.8] text-ink-2">
                {project.problem ||
                  overviewText ||
                  "A gap in the workflow that cost time, focus, or money — and no off-the-shelf tool fit the shape of the team."}
              </p>
            </Reveal>
          </div>
        </section>

        {/* 6. ARCHITECTURE */}
        <section id="architecture" className="scroll-mt-32 border-b border-soft-2 bg-surface/20">
          <div className="mx-auto max-w-[1320px] px-6 py-20">
            <Reveal>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">02 · Architecture</span>
              <h2 className="mt-3 font-syne text-[32px] font-extrabold text-ink md:text-[42px]">
                How the pieces fit.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8">
                <ArchitectureDiagram nodes={project.architecture?.nodes} edges={project.architecture?.edges} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* 7. FEATURE DEEP-DIVES */}
        {deepDives.length > 0 && (
          <section id="features" className="scroll-mt-32 border-b border-soft-2">
            <div className="mx-auto max-w-[1320px] px-6 py-20">
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">03 · Build</span>
                <h2 className="mt-3 font-syne text-[32px] font-extrabold text-ink md:text-[42px]">
                  Feature deep-dives.
                </h2>
              </Reveal>
              <motion.div
                variants={staggerParent(0.09)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={`mt-10 grid grid-cols-1 gap-6 ${
                  deepDives.length === 1
                    ? "md:grid-cols-1"
                    : deepDives.length === 2
                      ? "md:grid-cols-2"
                      : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {deepDives.map((f, i) => (
                  <motion.article
                    key={i}
                    variants={item}
                    whileHover={reduce ? undefined : { y: -6 }}
                    transition={{ duration: 0.35, ease: ease.out }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-soft-2 bg-card transition-colors hover:border-acid/50"
                  >
                    <MediaSlot
                      ratio="aspect-[16/10]"
                      rounded="rounded-none"
                      images={f.images}
                      videoUrl={f.video_url ?? null}
                      alt={`${f.title} preview`}
                      label={`Feature 0${i + 1} · media slot`}
                    />
                    <div className="flex-1 p-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
                        Feature {String(i + 1).padStart(2, "0")}
                      </div>
                      <h3 className="mt-2 font-syne text-[18px] font-bold text-ink">{f.title}</h3>
                      <p className="mt-3 text-[14px] leading-relaxed text-ink-2">
                        {f.description ||
                          "Designed end-to-end — from the interaction model to the data path — and shipped behind a feature flag for safe rollout."}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* 8. FRONTEND DESIGN */}
        <section className="border-b border-soft-2 bg-surface/20">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-20 md:grid-cols-[280px_1fr]">
            <Reveal>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">04 · Frontend</span>
              <h2 className="mt-3 font-syne text-[28px] font-extrabold text-ink">Frontend design</h2>
            </Reveal>
            <motion.div
              variants={staggerParent(0.09)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-5 sm:grid-cols-3"
            >
              {frontendCards.map((c) => (
                <motion.div
                  key={c.h}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="rounded-2xl border border-soft-2 bg-card p-6 transition-colors hover:border-acid/40"
                >
                  <h3 className="font-syne text-[15px] font-bold text-ink">{c.h}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{c.p}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 9. BACKEND DESIGN */}
        <section className="border-b border-soft-2">
          <div className="mx-auto grid max-w-[1320px] gap-10 px-6 py-20 md:grid-cols-[280px_1fr]">
            <Reveal>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">05 · Backend</span>
              <h2 className="mt-3 font-syne text-[28px] font-extrabold text-ink">Backend design</h2>
            </Reveal>
            <motion.div
              variants={staggerParent(0.09)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="grid gap-5 sm:grid-cols-3"
            >
              {backendCards.map((c) => (
                <motion.div
                  key={c.h}
                  variants={item}
                  whileHover={reduce ? undefined : { y: -4 }}
                  className="rounded-2xl border border-soft-2 bg-card p-6 transition-colors hover:border-acid/40"
                >
                  <h3 className="font-syne text-[15px] font-bold text-ink">{c.h}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{c.p}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 10. KEY DECISION */}
        <section className="border-b border-soft-2 bg-surface/20">
          <div className="mx-auto max-w-[1320px] px-6 py-20">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-acid/30 bg-gradient-to-br from-card via-card to-acid/5 p-10 md:p-14">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-acid/40 bg-acid/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
                  <Lightbulb size={12} /> Key decision
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Chose</div>
                    <p className="mt-3 font-syne text-[20px] font-bold text-ink">{decisionChose}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Instead of</div>
                    <p className="mt-3 font-syne text-[20px] font-bold text-ink-2">{decisionInstead}</p>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Because</div>
                    <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink-2">{decisionBecause}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 11. IMPACT */}
        {project.stats?.length > 0 && (
          <section id="impact" className="scroll-mt-32 border-b border-soft-2">
            <div className="mx-auto max-w-[1320px] px-6 py-20">
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">06 · Ship</span>
                <h2 className="mt-3 font-syne text-[32px] font-extrabold text-ink md:text-[42px]">
                  Impact.
                </h2>
              </Reveal>
              <motion.div
                variants={staggerParent(0.09)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className={`mt-10 grid grid-cols-1 gap-6 ${
                  project.stats.length === 1
                    ? "sm:grid-cols-1"
                    : project.stats.length === 2
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {project.stats.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={item}
                    whileHover={reduce ? undefined : { y: -4 }}
                    className="rounded-2xl border border-soft-2 bg-card p-8 transition-colors hover:border-acid/50"
                  >
                    <div className="font-syne text-[48px] font-extrabold leading-none text-grad-acid md:text-[64px]">
                      <CountUpValue value={s.value} />
                    </div>
                    <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {s.label}
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
                      {s.context || "Measured in production over a 90-day window after launch."}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* 12. STACK (grouped, single grid) */}
        {stackGroupsToRender.length > 0 && (
          <section className="border-b border-soft-2 bg-surface/20">
            <div className="mx-auto max-w-[1320px] px-6 py-20">
              <Reveal>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">07 · Stack</span>
                <h2 className="mt-3 font-syne text-[32px] font-extrabold text-ink md:text-[42px]">
                  What it's built with.
                </h2>
              </Reveal>
              <motion.div
                variants={staggerParent(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
              >
                {stackGroupsToRender.map((g) => (
                  <motion.div
                    key={g.name}
                    variants={item}
                    whileHover={reduce ? undefined : { y: -4 }}
                    className="flex flex-col rounded-2xl border border-soft-2 bg-card p-5 transition-colors hover:border-acid/50"
                  >
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-syne text-[14px] font-bold uppercase tracking-widest text-ink">
                        {g.name}
                      </h3>
                      <span className="font-mono text-[10px] text-muted-foreground">{g.items.length}</span>
                    </div>
                    <ul className="mt-4 flex-1 space-y-1.5">
                      {g.items.map((t) => (
                        <li
                          key={t}
                          className="font-mono text-[12px] text-ink-2 before:mr-2 before:text-acid before:content-['›']"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 border-t border-soft-2 pt-4 text-[12px] leading-relaxed text-muted-foreground">
                      {g.why || GROUP_WHY[g.name] || ""}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* Optional demo/gallery */}
        {(videoUrl || (project.gallery?.length ?? 0) > 0) && (
          <section className="border-b border-soft-2">
            <div className="mx-auto max-w-[1320px] space-y-14 px-6 py-20">
              {videoUrl && (
                <Reveal>
                  <h2 className="flex items-center gap-2 font-syne text-[24px] font-bold text-ink">
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
              {(project.gallery?.length ?? 0) > 0 && (
                <Reveal>
                  <h2 className="font-syne text-[24px] font-bold text-ink">Gallery</h2>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {project.gallery!.map((src, i) => (
                      <motion.a
                        key={src + i}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.07, duration: 0.6, ease: ease.brand }}
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
          </section>
        )}

        {/* Case study CTA */}
        {project.case_study_url && (
          <section className="border-b border-soft-2">
            <div className="mx-auto max-w-[1320px] px-6 py-20">
              <Reveal>
                <div className="relative overflow-hidden rounded-3xl border border-acid/30 bg-gradient-to-br from-card via-card to-acid/5 p-10 md:p-14">
                  <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">Deep dive</span>
                      <h2 className="mt-3 font-syne text-[32px] font-extrabold leading-tight text-ink md:text-[42px]">
                        Read the full case study
                      </h2>
                      <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-ink-2">
                        Process, architecture, decisions, and the metrics that mattered — packaged as a downloadable PDF.
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
            </div>
          </section>
        )}

        {/* 13. WHAT'S NEXT */}
        <section id="next" className="scroll-mt-32 border-b border-soft-2">
          <div className="mx-auto max-w-[1320px] px-6 py-20">
            <Reveal>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-acid">08 · Iterate</span>
              <h2 className="mt-3 font-syne text-[32px] font-extrabold text-ink md:text-[42px]">
                What's next.
              </h2>
              <p className="mt-6 max-w-[900px] whitespace-pre-line text-[16px] leading-[1.85] text-ink-2">
                {project.lessons ||
                  "Next up: sharper onboarding, deeper integrations, and pushing more of the runtime to the edge. Feedback from the first cohort is the roadmap."}
              </p>
            </Reveal>
          </div>
        </section>

        {/* 14. PREV / NEXT */}
        {(prev || next) && (
          <section className="mx-auto max-w-[1320px] px-6 py-20">
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
