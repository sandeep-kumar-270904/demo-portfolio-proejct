import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Session } from "@supabase/supabase-js";
import Nav from "@/components/Nav";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  reading_minutes: number;
  published_at: string | null;
};

const empty: Omit<Post, "id"> = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_image_url: "",
  tags: [],
  status: "draft",
  reading_minutes: 1,
  published_at: null,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function estimateReading(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export default function Admin() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [draft, setDraft] = useState<Omit<Post, "id">>(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Admin — Posts";
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) navigate("/auth");
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      if (error) {
        setIsAdmin(false);
      } else {
        setIsAdmin(Boolean(data));
      }
    })();
  }, [session]);

  useEffect(() => {
    if (isAdmin) loadPosts();
  }, [isAdmin]);

  async function loadPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data as Post[]) ?? []);
  }

  function startNew() {
    setEditing(null);
    setDraft(empty);
    setTagsInput("");
  }

  function startEdit(p: Post) {
    setEditing(p);
    setDraft({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body,
      cover_image_url: p.cover_image_url,
      tags: p.tags,
      status: p.status,
      reading_minutes: p.reading_minutes,
      published_at: p.published_at,
    });
    setTagsInput(p.tags.join(", "));
  }

  async function save(publish: boolean) {
    if (!draft.title.trim()) {
      toast.error("Title required");
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const slug = (draft.slug || slugify(draft.title)) || slugify(draft.title);
      const status = publish ? "published" : draft.status;
      const published_at =
        publish && !editing?.published_at ? new Date().toISOString() : draft.published_at;

      const payload = {
        slug,
        title: draft.title,
        excerpt: draft.excerpt || null,
        body: draft.body,
        cover_image_url: draft.cover_image_url || null,
        tags,
        status,
        reading_minutes: estimateReading(draft.body),
        published_at,
        author_id: session?.user.id ?? null,
      };

      if (editing) {
        const { error } = await supabase.from("posts").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Post updated");
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
        toast.success("Post created");
      }
      startNew();
      loadPosts();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: Post) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const { error } = await supabase.from("posts").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted");
      loadPosts();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  if (!session) return null;

  if (isAdmin === false) {
    return (
      <>
        <Nav />
        <main className="min-h-screen bg-void px-6 pt-32">
          <div className="mx-auto max-w-[600px] rounded-2xl border border-soft-2 bg-card p-8 text-center">
            <h1 className="font-syne text-[24px] font-bold text-ink">Not an admin</h1>
            <p className="mt-3 text-[14px] text-ink-2">
              You're signed in as <strong>{session.user.email}</strong> but don't have admin access.
            </p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              Ask the project owner to grant you the <code>admin</code> role in <code>user_roles</code>.
            </p>
            <button
              onClick={signOut}
              className="mt-6 rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/50"
            >
              Sign out
            </button>
          </div>
        </main>
      </>
    );
  }

  if (isAdmin === null) return null;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-void px-6 pb-24 pt-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-syne text-[28px] font-extrabold text-ink">Admin</h1>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNew}
                className="rounded-lg bg-acid px-4 py-2 font-syne text-[13px] font-bold text-void hover:glow-acid"
              >
                + New post
              </button>
              <button
                onClick={signOut}
                className="rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/50"
              >
                Sign out
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
            {/* Left: list */}
            <div className="rounded-2xl border border-soft-2 bg-card p-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {posts.length} post{posts.length === 1 ? "" : "s"}
              </div>
              <ul className="mt-3 space-y-2">
                {posts.map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => startEdit(p)}
                      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                        editing?.id === p.id ? "border-acid/50 bg-acid/5" : "border-soft-2 bg-surface hover:border-acid/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-syne text-[14px] font-bold text-ink line-clamp-1">{p.title || "(untitled)"}</span>
                        <span
                          className={`font-mono text-[9px] uppercase tracking-widest ${
                            p.status === "published" ? "text-acid" : "text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] text-muted-foreground line-clamp-1">/{p.slug}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: editor */}
            <div className="rounded-2xl border border-soft-2 bg-card p-6 lg:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Title" value={draft.title} onChange={(v) => setDraft((d) => ({ ...d, title: v, slug: editing ? d.slug : slugify(v) }))} />
                <Input label="Slug" value={draft.slug} onChange={(v) => setDraft((d) => ({ ...d, slug: slugify(v) }))} />
              </div>
              <Input label="Excerpt" value={draft.excerpt ?? ""} onChange={(v) => setDraft((d) => ({ ...d, excerpt: v }))} />
              <Input label="Cover image URL" value={draft.cover_image_url ?? ""} onChange={(v) => setDraft((d) => ({ ...d, cover_image_url: v }))} />
              <Input label="Tags (comma-separated)" value={tagsInput} onChange={setTagsInput} />

              <div className="mt-4">
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Body (Markdown supported)
                </label>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                  rows={18}
                  className="w-full resize-y rounded-lg border border-soft-2 bg-surface px-4 py-3 font-mono text-[13px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
                  placeholder={`# Heading\n\nWrite your article in **Markdown**. Code fences and tables are supported.\n\n\`\`\`ts\nconst x = 1;\n\`\`\``}
                />
                <div className="mt-1 font-mono text-[10px] text-muted-foreground">
                  ~{estimateReading(draft.body)} min read
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => save(false)}
                  disabled={saving}
                  className="rounded-lg border border-soft-2 bg-surface px-5 py-2.5 font-syne text-[13px] font-bold text-ink hover:border-acid/50 disabled:opacity-60"
                >
                  Save draft
                </button>
                <button
                  onClick={() => save(true)}
                  disabled={saving}
                  className="rounded-lg bg-acid px-5 py-2.5 font-syne text-[13px] font-bold text-void hover:glow-acid disabled:opacity-60"
                >
                  {editing?.status === "published" ? "Update published" : "Publish"}
                </button>
                {editing && (
                  <button
                    onClick={() => remove(editing)}
                    className="ml-auto rounded-lg border border-nova/40 bg-nova/5 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-nova hover:bg-nova/10"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-4">
      <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-soft-2 bg-surface px-4 py-2.5 text-[14px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
      />
    </div>
  );
}
