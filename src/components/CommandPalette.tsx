import { useEffect, useMemo, useRef, useState } from "react";
import { SITE } from "@/config";
import { usePersonalInfo } from "@/hooks/useSupabase";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: info } = usePersonalInfo();

  const commands: Cmd[] = useMemo(() => {
    const scrollTo = (id: string) => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return [
      { id: "projects", label: "Go to Projects", hint: "P", icon: "📁", run: () => scrollTo("projects") },
      { id: "experience", label: "Go to Experience", hint: "E", icon: "🧭", run: () => scrollTo("experience") },
      { id: "skills", label: "Go to Skills", hint: "S", icon: "🧠", run: () => scrollTo("skills") },
      { id: "contact", label: "Go to Contact", hint: "C", icon: "✉️", run: () => scrollTo("contact") },
      { id: "github", label: "Open GitHub", icon: "🐙", run: () => window.open(info?.github_url || SITE.github, "_blank") },
      { id: "email", label: "Send Email", icon: "📧", run: () => (window.location.href = `mailto:${info?.email || SITE.email}`) },
      { id: "resume", label: "Download Resume", icon: "📄", run: () => window.open(info?.resume_url || SITE.resumeUrl, "_blank") },
      { id: "top", label: "Go to Top", hint: "T", icon: "⬆️", run: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    ];
  }, [info]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(t));
  }, [q, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter") {
        const c = filtered[idx];
        if (c) { c.run(); setOpen(false); setQ(""); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, idx]);

  useEffect(() => {
    if (open) {
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQ("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center px-4 pt-[18vh]"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] overflow-hidden rounded-xl border border-soft-2 bg-card shadow-2xl animate-fade-up"
        style={{ animationDuration: "200ms" }}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setIdx(0); }}
          placeholder="Type a command or search..."
          className="w-full border-b border-soft-2 bg-transparent px-5 py-4 text-[15px] text-ink outline-none placeholder:text-muted-foreground"
        />
        <ul className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-3 font-mono text-[12px] text-muted-foreground">No results</li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setIdx(i)}
                onClick={() => { c.run(); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-3 px-5 py-3 text-left text-[14px] transition-colors ${
                  i === idx ? "bg-acid/10 text-ink" : "text-ink-2"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[16px]">{c.icon}</span>
                  <span>{c.label}</span>
                </span>
                {c.hint && (
                  <kbd className="rounded border border-soft-2 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {c.hint}
                  </kbd>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-soft-2 bg-surface/50 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>↑↓ navigate · ↵ select · esc close</span>
          <span>⌘K</span>
        </div>
      </div>
    </div>
  );
}
