import { useEffect } from "react";
import { X } from "lucide-react";
import { type Project } from "@/data/projects";

export default function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-void/92 p-4 backdrop-blur-xl animate-fade-up"
      style={{ animationDuration: "0.3s" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-[960px] overflow-y-auto rounded-2xl border border-soft-2 bg-card"
        style={{
          animation: "fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="relative h-[260px] overflow-hidden rounded-t-2xl">
          {project.visual}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-soft-2 bg-void/70 text-ink backdrop-blur hover:border-acid/50 hover:text-acid"
          >
            <X size={18} />
          </button>
          <h3 className="absolute bottom-6 left-8 font-syne text-[44px] font-extrabold leading-none text-ink">
            {project.name}
          </h3>
        </div>

        <div className="p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-acid" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-acid">{project.category}</span>
          </div>
          <h4 className="mt-4 font-syne text-[34px] font-extrabold leading-tight text-ink">
            {project.title}
          </h4>
          <p className="mt-4 text-[16px] leading-[1.8] text-ink-2">{project.description}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-soft-2 bg-surface p-5">
                <div className="font-syne text-[28px] font-extrabold text-grad-acid leading-none">
                  {m.value}
                </div>
                <div className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <h5 className="mt-10 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Key Features
          </h5>
          <ul className="mt-4 space-y-3">
            {project.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] text-ink-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acid glow-acid-sm" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <h5 className="mt-10 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Tech Stack
          </h5>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-acid/30 bg-raised px-3 py-1.5 font-mono text-[11px] text-acid"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={project.liveUrl}
              className="inline-flex items-center rounded-lg bg-acid px-5 py-3 font-syne text-[13px] font-bold text-void hover:glow-acid"
            >
              Live Demo →
            </a>
            <a
              href={project.githubUrl}
              className="inline-flex items-center rounded-lg border border-soft-2 bg-surface/60 px-5 py-3 font-syne text-[13px] font-bold text-ink hover:border-acid/50 hover:text-acid"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
