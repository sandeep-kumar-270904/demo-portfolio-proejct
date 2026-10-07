import { useEffect } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

/** One scroll engine; nested tools retain native scrolling. */
export default function SmoothScroll() {
  const location = useLocation();
  const engine = useRef<Lenis>();
  useEffect(() => {
    if (!location.hash) return;
    let frame = 0;
    let attempts = 0;
    const scroll = () => {
      let id: string;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const element = document.getElementById(id);
      if (element) {
        if (engine.current) { engine.current.resize(); engine.current.scrollTo(element, { offset: 0, duration: 1.15 }); }
        else element.scrollIntoView({ behavior: "auto" });
      } else if (++attempts < 120) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.pathname, location.key]);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let raf = 0;
    const configure = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = undefined;
      engine.current = undefined;
      if (preference.matches) return;
      lenis = new Lenis({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        prevent: (node) => node.matches('[data-testid="portfolio-intro"], [role="dialog"], [data-lenis-prevent]'),
      });
      engine.current = lenis;
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const handleAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!target || target.target === "_blank" || target.hasAttribute("download")) return;
      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      let id: string;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      const element = document.getElementById(id);
      if (!element) return;
      event.preventDefault();
      window.history.pushState(null, "", url.hash);
      if (lenis) { lenis.resize(); lenis.scrollTo(element, { offset: 0, duration: 1.15 }); }
      else element.scrollIntoView({ behavior: "auto" });
    };
    configure();
    preference.addEventListener("change", configure);
    document.addEventListener("click", handleAnchor);
    return () => {
      preference.removeEventListener("change", configure);
      document.removeEventListener("click", handleAnchor);
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);
  return null;
}
