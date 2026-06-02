import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export function initRevealAll() {
  if (typeof window === "undefined") return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
  );

  const observeAll = () => {
    document
      .querySelectorAll(".reveal:not(.is-visible), .revl:not(.is-visible), .revr:not(.is-visible)")
      .forEach((el) => io.observe(el));
  };
  observeAll();

  // Catch dynamically-rendered items (projects, milestones loaded from Supabase)
  const mo = new MutationObserver(() => observeAll());
  mo.observe(document.body, { childList: true, subtree: true });

  // Safety net: any in-viewport element still hidden after 1.5s gets shown
  const timer = window.setTimeout(() => {
    document
      .querySelectorAll(".reveal:not(.is-visible), .revl:not(.is-visible), .revr:not(.is-visible)")
      .forEach((el) => {
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
