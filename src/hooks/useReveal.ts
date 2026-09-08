import { useEffect, useRef } from "react";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCED) {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function initRevealAll() {
  if (typeof window === "undefined") return;

  const selector =
    ".reveal:not(.is-visible), .revl:not(.is-visible), .revr:not(.is-visible)";

  if (REDUCED) {
    const revealAll = () =>
      document.querySelectorAll(selector).forEach((el) => el.classList.add("is-visible"));
    revealAll();
    const mo = new MutationObserver(revealAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }

  // Stagger siblings that enter together so groups cascade instead of popping.
  const groupIndex = new WeakMap<Element, number>();

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      const perParent = new Map<Element | null, number>();
      visible
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((e) => {
          const parent = e.target.parentElement;
          const n = perParent.get(parent) ?? groupIndex.get(parent as Element) ?? 0;
          perParent.set(parent, n + 1);
          if (parent) groupIndex.set(parent, n + 1);
          (e.target as HTMLElement).style.transitionDelay = `${Math.min(n, 8) * 90}ms`;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        });
    },
    { threshold: 0.05, rootMargin: "0px 0px -4% 0px" }
  );

  const observeAll = () => {
    document.querySelectorAll(selector).forEach((el) => io.observe(el));
  };
  observeAll();


  // Catch dynamically-rendered items
  const mo = new MutationObserver(() => observeAll());
  mo.observe(document.body, { childList: true, subtree: true });

  // Safety net: any in-viewport element still hidden after 1.5s gets shown
  const timer = window.setTimeout(() => {
    document.querySelectorAll(selector).forEach((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (r.top < window.innerHeight * 1.2) el.classList.add("is-visible");
    });
  }, 1500);

  return () => {
    io.disconnect();
    mo.disconnect();
    window.clearTimeout(timer);
  };
}
