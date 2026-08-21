import { Eye, Github, Linkedin, Twitter, Instagram, Youtube, Code2, Mail } from "lucide-react";
import { useVisitorCount } from "@/hooks/useVisitorCount";
import { SITE } from "@/config";
import LiveUsers from "./LiveUsers";

const QUICK_LINKS: [string, string][] = [
  ["About", "#about"],
  ["Work", "#projects"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Blog", "/blog"],
  ["Contact", "#contact"],
];

const SOCIALS = [
  { icon: Github, label: "GitHub", href: `https://github.com/${SITE.github}` },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "X", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Code2, label: "LeetCode", href: "#" },
];

export default function Footer() {
  const visits = useVisitorCount();
  return (
    <footer className="border-t border-soft-2 bg-void px-6 pb-10 pt-16 lg:pt-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="font-syne text-[22px] font-extrabold">
            SANDEEP<span className="text-acid text-glow-acid">.</span>
          </div>
          <p className="mt-3 max-w-[260px] text-[13px] leading-relaxed text-ink-2">
            Full-stack engineer building fast, considered products end to end.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-soft-2 bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2">
              <Eye size={12} className="text-acid" />
              <span>Visitors:</span>
              <span className="text-acid">{visits ?? "—"}</span>
            </div>
            <LiveUsers />
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">Quick Links</h3>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map(([l, h]) => (
              <li key={l}>
                <a
                  href={h}
                  className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-acid"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">Socials</h3>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-acid"
                >
                  <s.icon size={13} className="text-acid" />
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">Contact</h3>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-5 inline-flex items-start gap-2 break-all text-[13px] text-ink transition-colors hover:text-acid"
          >
            <Mail size={14} className="mt-0.5 shrink-0 text-acid" />
            {SITE.email}
          </a>
          <div className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-muted-foreground">
            <div>India · Remote worldwide</div>
            <div className="mt-1.5 text-acid">Available for new work</div>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>Press</span>
            <kbd className="rounded border border-soft-2 bg-card px-1.5 py-0.5 text-ink-2">⌘</kbd>
            <kbd className="rounded border border-soft-2 bg-card px-1.5 py-0.5 text-ink-2">K</kbd>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1320px] flex-col items-center gap-3 border-t border-soft-2 pt-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2025 Edhubilli Sandeep Kumar
        </div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Designed &amp; engineered with obsession · Made in India 🇮🇳
        </div>
      </div>
    </footer>
  );
}
