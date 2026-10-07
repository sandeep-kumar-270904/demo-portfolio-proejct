import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ease } from "@/lib/motion";
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
  const reduce = useReducedMotion();
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
        data-scrolled={scrolled}
        className="nav-capsule fixed left-1/2 top-4 z-50 h-[46px] -translate-x-1/2 rounded-full border border-border bg-void/70 backdrop-blur-2xl backdrop-saturate-150"
      >
        <nav className="flex h-full items-center gap-1 px-2.5">
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <li key={l.href}>
                  <Link
                    to={l.href}
                    className={`group relative inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                      isActive ? "text-acid" : "text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {l.label}
                    {isActive && <motion.span
                      layoutId={reduce ? undefined : "nav-active-dot"}
                      className="absolute bottom-0 left-[calc(50%-2px)] h-1 w-1 rounded-full bg-acid glow-acid-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 lg:ml-2 lg:border-l lg:border-border lg:pl-2">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center rounded-full bg-acid px-3.5 py-1.5 font-syne text-[12px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid"
            >
              Hire Me →
            </a>

            <Button
              variant="ghost" size="icon"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="portfolio-mobile-menu"
              onClick={() => setOpen(true)}
              className="lg:hidden px-2 text-ink"
            >
              <Menu size={20} />
            </Button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
      {open && <motion.div
        id="portfolio-mobile-menu"
        role="dialog" aria-modal="true" aria-label="Navigation"
        data-lenis-prevent
        initial={reduce ? false : { opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: ease.brand }}
        className="fixed inset-0 z-[60] overflow-y-auto bg-void lg:hidden"
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
      >
        <div className="flex h-[66px] items-center justify-between px-6">
          <span className="font-syne text-[18px] font-extrabold">SANDEEP<span className="text-acid">.</span></span>
          <Button variant="ghost" size="icon" autoFocus aria-label="Close menu" onClick={() => setOpen(false)}><X size={22} /></Button>
        </div>
        <ul className="flex flex-col gap-6 px-8 pt-12">
          {links.map((l, index) => (
            <motion.li key={l.href}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : index * 0.045, ease: ease.brand }}
            >
              <Link to={l.href} onClick={() => setOpen(false)} className="font-syne text-[36px] font-extrabold leading-none text-ink transition-colors hover:text-acid">{l.label}</Link>
            </motion.li>
          ))}
          <li className="pt-6"><Button asChild><Link to="/#contact" onClick={() => setOpen(false)}>Hire Me →</Link></Button></li>
        </ul>
      </motion.div>}
      </AnimatePresence>
    </>
  );
}
