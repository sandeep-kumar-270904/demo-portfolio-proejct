import { useState } from "react";

type Skill = { name: string; level: number; tag: "EXPERT" | "ADVANCED" | "INTERMEDIATE"; icon: string };

const TABS: { key: string; label: string; icon: string; skills: Skill[] }[] = [
  {
    key: "frontend",
    label: "Frontend",
    icon: "⚛",
    skills: [
      { name: "React / Next.js", level: 95, tag: "EXPERT", icon: "⚛" },
      { name: "TypeScript", level: 88, tag: "EXPERT", icon: "🟦" },
      { name: "CSS / Tailwind", level: 92, tag: "EXPERT", icon: "🎨" },
      { name: "Zustand / Redux", level: 85, tag: "ADVANCED", icon: "🗂" },
      { name: "Framer Motion", level: 76, tag: "ADVANCED", icon: "🌀" },
      { name: "Jest / Testing", level: 72, tag: "ADVANCED", icon: "🧪" },
      { name: "Vite / Webpack", level: 80, tag: "ADVANCED", icon: "⚡" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    icon: "⚙️",
    skills: [
      { name: "Node.js", level: 93, tag: "EXPERT", icon: "🟢" },
      { name: "Express / Fastify", level: 90, tag: "EXPERT", icon: "🚂" },
      { name: "REST API", level: 95, tag: "EXPERT", icon: "🔗" },
      { name: "GraphQL", level: 80, tag: "ADVANCED", icon: "◆" },
      { name: "WebSockets", level: 82, tag: "ADVANCED", icon: "📡" },
      { name: "Auth / JWT / OAuth", level: 88, tag: "EXPERT", icon: "🔐" },
    ],
  },
  {
    key: "database",
    label: "Database",
    icon: "🗄️",
    skills: [
      { name: "PostgreSQL", level: 87, tag: "EXPERT", icon: "🐘" },
      { name: "MongoDB", level: 84, tag: "ADVANCED", icon: "🍃" },
      { name: "Redis", level: 82, tag: "ADVANCED", icon: "🔴" },
      { name: "Prisma ORM", level: 91, tag: "EXPERT", icon: "▲" },
      { name: "SQL Optimization", level: 78, tag: "ADVANCED", icon: "📊" },
    ],
  },
  {
    key: "devops",
    label: "DevOps",
    icon: "🚀",
    skills: [
      { name: "Docker", level: 84, tag: "ADVANCED", icon: "🐳" },
      { name: "AWS", level: 74, tag: "ADVANCED", icon: "☁️" },
      { name: "GitHub Actions", level: 86, tag: "EXPERT", icon: "🛠" },
      { name: "Nginx", level: 72, tag: "INTERMEDIATE", icon: "🟩" },
      { name: "Vercel / Railway", level: 95, tag: "EXPERT", icon: "▲" },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    icon: "🛠",
    skills: [
      { name: "Git / GitHub", level: 96, tag: "EXPERT", icon: "🌿" },
      { name: "Figma", level: 70, tag: "INTERMEDIATE", icon: "🎯" },
      { name: "Linear / Jira", level: 80, tag: "ADVANCED", icon: "📋" },
      { name: "Postman", level: 93, tag: "EXPERT", icon: "📮" },
    ],
  },
];

function SkillBar({ s, active }: { s: Skill; active: boolean }) {
  return (
    <div className="rounded-xl border border-soft-2 bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-soft-2 bg-surface text-base">
            {s.icon}
          </div>
          <span className="font-syne text-[15px] font-bold text-ink truncate">{s.name}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`font-mono text-[9px] uppercase tracking-widest ${
              s.tag === "EXPERT" ? "text-acid" : s.tag === "ADVANCED" ? "text-cyan" : "text-muted-foreground"
            }`}
          >
            {s.tag}
          </span>
          <span className="font-mono text-[11px] text-ink-2">{s.level}%</span>
        </div>
      </div>
      <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-void">
        <div
          key={active ? "on" : "off"}
          className="relative h-full rounded-full bg-acid"
          style={{
            width: active ? `${s.level}%` : "0%",
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
  const tab = TABS[active];

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
          {/* Tabs */}
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1 lg:sticky lg:top-24 self-start">
            {TABS.map((t, i) => {
              const a = i === active;
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

          {/* Panel */}
          <div>
            <h3 className="font-syne text-[24px] font-bold text-ink">{tab.label} Stack</h3>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {tab.skills.length} technologies · production-ready
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tab.skills.map((s) => (
                <SkillBar key={s.name} s={s} active={true} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
