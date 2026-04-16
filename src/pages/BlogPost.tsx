import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { supabase } from "@/integrations/supabase/client";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  tags: string[];
  reading_minutes: number;
  published_at: string | null;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
      } else {
        setPost(data as Post);
        document.title = `${(data as Post).title} — Sandeep Kumar`;
      }
      setLoading(false);
    })();
  }, [slug]);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-void px-6 pb-24 pt-32">
        <div className="mx-auto max-w-[760px]">
          <Link to="/blog" className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-acid">
            ← All articles
          </Link>

          {loading && <div className="mt-10 font-mono text-[12px] text-muted-foreground">Loading…</div>}

          {notFound && (
            <div className="mt-10 rounded-2xl border border-dashed border-soft-2 bg-card/40 p-10 text-center">
              <div className="font-syne text-[22px] font-bold text-ink">Article not found</div>
            </div>
          )}

          {post && (
            <article className="mt-8">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {post.published_at && (
                  <time>{new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time>
                )}
                <span>·</span>
                <span>{post.reading_minutes} min read</span>
              </div>
              <h1
                className="mt-4 font-syne font-extrabold leading-[1.05] text-ink"
                style={{ fontSize: "clamp(34px, 5vw, 56px)", letterSpacing: "-0.04em" }}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-5 text-[18px] leading-relaxed text-ink-2">{post.excerpt}</p>
              )}
              {post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="mt-8 w-full rounded-2xl border border-soft-2"
                  loading="lazy"
                />
              )}
              {post.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <span key={t} className="rounded-md border border-soft-2 bg-raised px-2.5 py-1 font-mono text-[11px] text-acid">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose-portfolio mt-10">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {post.body}
                </ReactMarkdown>
              </div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
