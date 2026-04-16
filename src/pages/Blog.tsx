import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  reading_minutes: number;
  published_at: string | null;
};

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog — Edhubilli Sandeep Kumar";
    (async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, slug, title, excerpt, cover_image_url, tags, reading_minutes, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-void px-6 pb-24 pt-32">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-acid" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">Field Notes</span>
          </div>
          <h1
            className="mt-6 font-syne font-extrabold leading-[1.05]"
            style={{ fontSize: "clamp(40px, 7vw, 88px)", letterSpacing: "-0.05em" }}
          >
            <span className="text-ink">Engineering </span>
            <span className="text-grad-acid">Articles</span>
          </h1>
          <p className="mt-5 max-w-[640px] text-[16px] leading-relaxed text-ink-2">
            Case studies, architecture notes, and lessons from shipping production systems.
          </p>

          <div className="mt-14">
            {loading && (
              <div className="font-mono text-[12px] text-muted-foreground">Loading…</div>
            )}

            {!loading && posts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-soft-2 bg-card/40 p-12 text-center">
                <div className="font-syne text-[22px] font-bold text-ink">No posts yet</div>
                <p className="mt-2 text-[14px] text-ink-2">First article coming soon.</p>
              </div>
            )}

            <ul className="space-y-5">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="group block rounded-2xl border border-soft-2 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-acid/40 lg:p-8"
                  >
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {p.published_at && (
                        <time>{new Date(p.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time>
                      )}
                      <span>·</span>
                      <span>{p.reading_minutes} min read</span>
                      {p.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-acid">{p.tags.slice(0, 2).join(" / ")}</span>
                        </>
                      )}
                    </div>
                    <h2 className="mt-3 font-syne text-[26px] font-bold text-ink transition-colors group-hover:text-acid lg:text-[32px]">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-3 max-w-[720px] text-[15px] leading-relaxed text-ink-2">{p.excerpt}</p>
                    )}
                    <div className="mt-5 inline-flex items-center font-mono text-[11px] uppercase tracking-widest text-acid">
                      Read article →
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
