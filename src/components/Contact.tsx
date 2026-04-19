import { useState } from "react";
import { Github, Linkedin, Twitter, Code2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import MagneticButton from "./MagneticButton";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/config";

const Schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1, "Message required").max(5000),
  budget_range: z.string().trim().max(40).optional(),
});

const BUDGET_TIERS = [
  "Not sure yet",
  "< $1k",
  "$1k – $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
];

export default function Contact() {
  const [copyToast, setCopyToast] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2200);
    } catch {}
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const budget_range = BUDGET_TIERS[budgetIdx];
    const parsed = Schema.safeParse({ ...form, budget_range });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const e: Record<string, string> = {};
      Object.keys(flat).forEach((k) => (e[k] = flat[k as keyof typeof flat]?.[0] ?? ""));
      setErrors(e);
      return;
    }
    setSending(true);
    try {
      // Persist — write both 'message' (new column) and 'body' (legacy, kept for backward compat with Resend fn).
      const { error: dbErr } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        body: parsed.data.message,
        message: parsed.data.message,
        budget_range: parsed.data.budget_range || null,
      });
      if (dbErr) throw dbErr;

      // Email — pass everything so the Resend function can include budget if it chooses to.
      const { error: fnErr } = await supabase.functions.invoke("send-contact", {
        body: parsed.data,
      });
      if (fnErr) throw fnErr;

      toast.success("Message sent — I'll reply within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setBudgetIdx(0);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Couldn't send. Try again.");
    } finally {
      setSending(false);
    }
  };

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section id="contact" className="relative overflow-hidden bg-base px-6 py-28 lg:py-40">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, hsl(var(--acid)/0.18), transparent 40%), radial-gradient(circle at 70% 80%, hsl(var(--plasma)/0.15), transparent 45%)",
          backgroundSize: "200% 200%",
          animation: "mesh-shift 16s ease-in-out infinite",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-acid/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1100px] text-center">
        <div className="reveal flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">07 — Let's Talk</span>
          <span className="h-px w-8 bg-acid" />
        </div>

        <h2
          className="reveal mt-8 font-syne font-extrabold"
          style={{ fontSize: "clamp(48px, 8.5vw, 116px)", letterSpacing: "-0.055em", lineHeight: 0.88 }}
        >
          <span className="block text-ink">Let's Build</span>
          <span className="block text-stroke">Something</span>
          <span className="block text-grad-acid">Legendary.</span>
        </h2>

        <button
          onClick={copyEmail}
          className="reveal mt-10 inline-block border-b border-soft-2 pb-1 font-syne text-[18px] font-bold text-ink transition-colors hover:text-acid hover:border-acid"
        >
          {SITE.email}
        </button>

        <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: <Github size={16} />, label: "GitHub", href: `https://github.com/${SITE.github}` },
            { icon: <Linkedin size={16} />, label: "LinkedIn", href: "#" },
            { icon: <Twitter size={16} />, label: "Twitter", href: "#" },
            { icon: <Code2 size={16} />, label: "LeetCode", href: "#" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-soft-2 bg-card px-4 py-2 font-mono text-[12px] text-ink-2 transition-all hover:border-acid/50 hover:bg-acid/10 hover:text-acid"
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="reveal mx-auto mt-14 max-w-[680px] rounded-2xl border border-soft-2 bg-card p-6 text-left lg:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={upd("name")}
                placeholder="Jane Cooper"
                maxLength={100}
                className="w-full rounded-lg border border-soft-2 bg-surface px-4 py-3 font-sans text-[14px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={upd("email")}
                placeholder="you@company.com"
                maxLength={255}
                className="w-full rounded-lg border border-soft-2 bg-surface px-4 py-3 font-sans text-[14px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Subject (optional)" error={errors.subject}>
              <input
                type="text"
                value={form.subject}
                onChange={upd("subject")}
                placeholder="New project · SaaS build"
                maxLength={150}
                className="w-full rounded-lg border border-soft-2 bg-surface px-4 py-3 font-sans text-[14px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
              />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Message" error={errors.message}>
              <textarea
                value={form.message}
                onChange={upd("message")}
                placeholder="Tell me about what you're building..."
                rows={5}
                maxLength={5000}
                className="w-full resize-y rounded-lg border border-soft-2 bg-surface px-4 py-3 font-sans text-[14px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
              />
            </Field>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Budget (optional)
              </span>
              <span className="font-mono text-[11px] text-acid">{BUDGET_TIERS[budgetIdx]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={BUDGET_TIERS.length - 1}
              step={1}
              value={budgetIdx}
              onChange={(e) => setBudgetIdx(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface accent-[hsl(var(--acid))]"
              aria-label="Project budget range"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {form.message.length}/5000
            </span>
            <MagneticButton>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center rounded-lg bg-acid px-8 py-3.5 font-syne text-[14px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message →"}
              </button>
            </MagneticButton>
          </div>
        </form>

        <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>🌏 India · Remote Worldwide</span>
          <span>🕐 Responds Within 24h</span>
          <span className="text-acid">✓ Available Now</span>
        </div>
      </div>

      {copyToast && (
        <div className="fixed bottom-8 right-8 z-[90] rounded-lg bg-acid px-5 py-3 font-syne text-[14px] font-bold text-void shadow-[0_20px_40px_-10px_rgba(0,255,179,0.5)] animate-toast-in">
          ✓ Copied to clipboard
        </div>
      )}
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block font-mono text-[11px] text-nova">{error}</span>}
    </label>
  );
}
