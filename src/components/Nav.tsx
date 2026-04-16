import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[66px] transition-all duration-300 ${
          scrolled ? "bg-void/90 backdrop-blur-xl border-b border-soft-2" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-6">
          <a href="#top" className="font-syne text-[18px] font-extrabold tracking-tight">
            SANDEEP<span className="text-acid text-glow-acid">.</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative text-[14px] font-medium text-muted-foreground transition-colors hover:text-ink"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-acid transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-acid/30 bg-acid/10 px-3 py-1.5 lg:flex relative">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-sonar rounded-full bg-acid" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid animate-pulse-dot" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-acid">
                Available for Work
              </span>
            </div>

            <a
              href="#contact"
              className="hidden md:inline-flex items-center rounded-lg bg-acid px-4 py-2 font-syne text-[13px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid"
            >
              Hire Me →
            </a>

            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="lg:hidden text-ink"
            >
              <Menu size={22} />
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
