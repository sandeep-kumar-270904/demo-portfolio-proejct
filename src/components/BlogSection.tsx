import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { useBlogPosts } from "@/hooks/useSupabase";

/**
 * External-link blog highlights. Reads from blog_posts table.
 * Renders nothing if no published posts exist — safe to leave mounted.
 */
export default function BlogSection() {
  const { data: posts = [], isLoading } = useBlogPosts();

  if (!isLoading && posts.length === 0) return null;

  return (
    <section id="writing" className="relative bg-void px-6 py-28 lg:py-36">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
            06 — Writing
          </span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">Recent </span>
          <span className="text-grad-acid">Writing</span>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <a
              key={p.id}
              href={p.external_url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="reveal group flex flex-col rounded-2xl border border-soft-2 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-acid/40 hover:shadow-[0_25px_60px_-20px_rgba(0,255,179,0.18)]"
            >
              {p.tags?.[0] && (
                <span className="self-start rounded-md border border-acid/30 bg-acid/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-acid">
                  {p.tags[0]}
                </span>
              )}
              <h3 className="mt-4 font-syne text-[20px] font-bold leading-snug text-ink transition-colors group-hover:text-acid">
                {p.title}
              </h3>
              {p.excerpt && (
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2 line-clamp-3">{p.excerpt}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-3">
                  {p.published_date && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(p.published_date).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {p.read_time && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} /> {p.read_time}
                    </span>
                  )}
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-ink-2 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-acid"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
