import { Star, GitFork, ExternalLink } from "lucide-react";
import { useGitHubStats } from "@/hooks/useGitHubStats";
import { SITE } from "@/config";

const LANG_DOT: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
};

const FALLBACK = [
  { name: "buildflow", description: "Project management SaaS with real-time collab.", language: "TypeScript", stargazers_count: 48, forks_count: 9, html_url: "#" },
  { name: "shopnest", description: "Multi-vendor e-commerce platform.", language: "TypeScript", stargazers_count: 32, forks_count: 6, html_url: "#" },
  { name: "devpulse", description: "Engineering analytics dashboard.", language: "JavaScript", stargazers_count: 24, forks_count: 4, html_url: "#" },
  { name: "cloudlink", description: "Microservices orchestrator.", language: "Go", stargazers_count: 18, forks_count: 3, html_url: "#" },
];

export default function OpenSource() {
  const { data } = useGitHubStats();
  const repos = data?.pinnedRepos?.length ? data.pinnedRepos : FALLBACK;

  return (
    <section id="opensource" className="relative bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">07 — Open Source</span>
        </div>
        <div className="reveal mt-6 flex flex-wrap items-end justify-between gap-6">
          <h2
            className="font-syne font-extrabold leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
          >
            <span className="text-ink">Pinned </span>
            <span className="text-grad-acid">Repos</span>
          </h2>
          <a
            href={`https://github.com/${SITE.github}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-ink-2 hover:text-acid"
          >
            View all on GitHub <ExternalLink size={13} />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {repos.slice(0, 4).map((r) => (
            <a
              key={r.name}
              href={r.html_url || "#"}
              target="_blank"
              rel="noreferrer"
              className="reveal group rounded-2xl border border-soft-2 bg-card p-6 transition-all hover:-translate-y-1 hover:border-acid/40 hover:shadow-[0_25px_60px_-20px_rgba(0,255,179,0.25)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">repository</div>
                  <h3 className="mt-1 font-syne text-[20px] font-bold text-ink truncate group-hover:text-acid transition-colors">
                    {r.name}
                  </h3>
                </div>
                <ExternalLink size={16} className="shrink-0 text-muted-foreground transition-colors group-hover:text-acid" />
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2 min-h-[42px]">
                {r.description || "No description provided."}
              </p>
              <div className="mt-5 flex items-center gap-5 font-mono text-[11px] text-ink-2">
                {r.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: LANG_DOT[r.language] || "#9ca3af" }}
                    />
                    {r.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Star size={12} /> {r.stargazers_count}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GitFork size={12} /> {r.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
