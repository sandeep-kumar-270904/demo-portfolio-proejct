import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";

const links = [
  { label: "About", href: "/#about", id: "about" },
  { label: "Projects", href: "/#projects", id: "projects" },
  { label: "Skills", href: "/#skills", id: "skills" },
  { label: "Open Source", href: "/#opensource", id: "opensource" },
  { label: "Blog", href: "/blog", id: "blog" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

const titleMap: Record<string, string> = {
  about: "About",
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  opensource: "Open Source",
  contact: "Contact",
};

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(
    ["top", "about", "projects", "skills", "experience", "opensource", "contact"],
    titleMap
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* spacer so the fixed capsule never sits on top of content */}
      <div aria-hidden className="h-[80px] w-full" />
      <header
        className={`fixed left-1/2 top-4 z-50 h-[46px] -translate-x-1/2 rounded-full border border-white/10 bg-void/70 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_hsl(var(--acid)/0.08)]"
            : "shadow-[0_4px_18px_rgba(0,0,0,0.25)]"
        }`}
      >
        <nav className="flex h-full items-center gap-1 px-2.5">
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`group relative inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                      isActive ? "text-acid" : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-acid glow-acid-sm transition-opacity duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 lg:ml-2 lg:border-l lg:border-white/10 lg:pl-2">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center rounded-full bg-acid px-3.5 py-1.5 font-syne text-[12px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid"
            >
              Hire Me →
            </a>

            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="lg:hidden px-2 text-ink"
            >
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[60] bg-void transition-transform duration-500 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[66px] items-center justify-between px-6">
          <span className="font-syne text-[18px] font-extrabold">
            SANDEEP<span className="text-acid">.</span>
          </span>
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-ink">
            <X size={22} />
          </button>
        </div>
        <ul className="flex flex-col gap-6 px-8 pt-12">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-syne text-[40px] font-extrabold leading-none tracking-tight text-ink hover:text-acid transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pt-6">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center rounded-lg bg-acid px-5 py-3 font-syne text-[14px] font-bold text-void"
            >
              Hire Me →
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
