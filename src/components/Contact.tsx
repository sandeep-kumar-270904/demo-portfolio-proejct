import { useState } from "react";
import { Github, Linkedin, Twitter, Code2 } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function Contact() {
  const [toast, setToast] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("sandeepkumar.dev@gmail.com");
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    } catch {}
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-base px-6 py-28 lg:py-40">
      {/* animated mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, hsl(var(--acid)/0.18), transparent 40%), radial-gradient(circle at 70% 80%, hsl(var(--plasma)/0.15), transparent 45%)",
          backgroundSize: "200% 200%",
          animation: "mesh-shift 16s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-acid/10 blur-3xl"
      />

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
          sandeepkumar.dev@gmail.com
        </button>

        <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: <Github size={16} />, label: "GitHub", href: "#" },
            { icon: <Linkedin size={16} />, label: "LinkedIn", href: "#" },
            { icon: <Twitter size={16} />, label: "Twitter", href: "#" },
            { icon: <Code2 size={16} />, label: "LeetCode", href: "#" },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="inline-flex items-center gap-2 rounded-full border border-soft-2 bg-card px-4 py-2 font-mono text-[12px] text-ink-2 transition-all hover:border-acid/50 hover:bg-acid/10 hover:text-acid"
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>

        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <a
              href="mailto:sandeepkumar.dev@gmail.com"
              className="inline-flex items-center rounded-lg bg-acid px-10 py-4 font-syne text-[16px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid"
            >
              Start a Project →
            </a>
          </MagneticButton>
          <a
            href="#"
            className="inline-flex items-center rounded-lg border border-soft-2 bg-card px-8 py-4 font-syne text-[16px] font-bold text-ink hover:border-acid/50 hover:text-acid"
          >
            Download CV
          </a>
        </div>

        <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>🌏 India · Remote Worldwide</span>
          <span>🕐 Responds Within 24h</span>
          <span className="text-acid">✓ Available Now</span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[90] rounded-lg bg-acid px-5 py-3 font-syne text-[14px] font-bold text-void shadow-[0_20px_40px_-10px_rgba(0,255,179,0.5)] animate-toast-in">
          ✓ Copied to clipboard
        </div>
      )}
    </section>
  );
}
