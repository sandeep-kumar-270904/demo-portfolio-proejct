import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Nav from "@/components/Nav";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = mode === "signin" ? "Sign in" : "Sign up";
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin");
    });
  }, [mode, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/admin`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/admin");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-void px-6 pb-24 pt-32">
        <div className="mx-auto max-w-[420px] rounded-2xl border border-soft-2 bg-card p-8">
          <h1 className="font-syne text-[28px] font-extrabold text-ink">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Admin · Manage blog posts
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-soft-2 bg-surface px-4 py-3 text-[14px] text-ink focus:border-acid/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-soft-2 bg-surface px-4 py-3 text-[14px] text-ink focus:border-acid/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-acid px-5 py-3 font-syne text-[14px] font-bold text-void hover:glow-acid disabled:opacity-60"
            >
              {loading ? "Working…" : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-acid"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </main>
    </>
  );
}
