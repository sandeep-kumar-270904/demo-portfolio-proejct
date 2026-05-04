import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import Nav from "@/components/Nav";
import ProjectsTab from "@/components/admin/ProjectsTab";
import SkillsTab from "@/components/admin/SkillsTab";
import ExperienceTab from "@/components/admin/ExperienceTab";
import TestimonialsTab from "@/components/admin/TestimonialsTab";
import BlogPostsTab from "@/components/admin/BlogPostsTab";
import MessagesTab from "@/components/admin/MessagesTab";
import PostsTab from "@/components/admin/PostsTab";
import SiteContentTab from "@/components/admin/SiteContentTab";
import { reseedAll } from "@/lib/reseed";

const TABS = [
  { key: "site", label: "Site Content" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "testimonials", label: "Testimonials" },
  { key: "blog_posts", label: "Blog Links" },
  { key: "messages", label: "Messages" },
  { key: "posts", label: "Long-form Posts" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function Admin() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabKey>("projects");
  const [reseeding, setReseeding] = useState(false);

  async function handleReseed() {
    if (
      !confirm(
        "Re-seed projects, skills, experience, and testimonials with demo data? This will REPLACE existing rows in those four tables.",
      )
    )
      return;
    setReseeding(true);
    try {
      const results = await reseedAll();
      const failed = results.filter((r) => r.error);
      if (failed.length) {
        toast.error(`Reseed failed for: ${failed.map((f) => f.table).join(", ")}`);
      } else {
        const total = results.reduce((s, r) => s + r.inserted, 0);
        toast.success(`Reseeded ${total} rows across ${results.length} tables`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reseed failed");
    } finally {
      setReseeding(false);
    }
  }

  useEffect(() => {
    document.title = "Admin Dashboard";
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
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
      setIsAdmin(!error && Boolean(data));
    })();
  }, [session]);

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
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-syne text-[28px] font-extrabold text-ink">Admin Dashboard</h1>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {session.user.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleReseed}
                disabled={reseeding}
                className="rounded-lg border border-acid/40 bg-acid/10 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-acid hover:bg-acid/20 disabled:opacity-60"
                title="Replace projects/skills/experience/testimonials with demo data"
              >
                {reseeding ? "Reseeding…" : "↻ Reseed demo data"}
              </button>
              <button
                onClick={signOut}
                className="rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/50"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Tab nav */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-soft-2 pb-3">
            {TABS.map((t) => {
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                    active
                      ? "bg-acid text-void"
                      : "border border-soft-2 bg-surface text-ink-2 hover:border-acid/40 hover:text-acid"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            {tab === "projects" && <ProjectsTab />}
            {tab === "skills" && <SkillsTab />}
            {tab === "experience" && <ExperienceTab />}
            {tab === "testimonials" && <TestimonialsTab />}
            {tab === "blog_posts" && <BlogPostsTab />}
            {tab === "messages" && <MessagesTab />}
            {tab === "posts" && <PostsTab session={session} />}
          </div>
        </div>
      </main>
    </>
  );
}
