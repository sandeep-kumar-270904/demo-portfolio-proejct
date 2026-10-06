import { useEffect, useRef } from "react";

const selector = ".reveal, .revl, .revr";
let shared: ReturnType<typeof createRevealController> | undefined;
let subscribers = 0;

/** All CMS and route reveals share one observer and one accessibility policy. */
function createRevealController() {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const observed = new WeakSet<Element>();
  const reveal = (element: Element) => {
    const parent = element.parentElement;
    const siblings = parent ? [...parent.children].filter((child) => child.matches(selector)) : [];
    const index = Math.max(0, siblings.indexOf(element));
    (element as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(index, 4) * 65}ms`);
    element.classList.add("is-visible");
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      .forEach((entry) => reveal(entry.target));
  }, { threshold: 0, rootMargin: "0px 0px -36px 0px" });
  const scan = () => {
    document.querySelectorAll(`${selector.split(", ").map((s) => `${s}:not(.is-visible)`).join(", ")}`).forEach((element) => {
      // Nested reveals must not multiply their parent's fade and movement.
      if (preference.matches || element.parentElement?.closest(selector)) {
        reveal(element);
      } else if (!observed.has(element)) {
        observed.add(element);
        observer.observe(element);
      }
    });
  };
  const mutation = new MutationObserver(scan);
  mutation.observe(document.body, { childList: true, subtree: true });
  preference.addEventListener("change", scan);
  scan();
  return {
    scan,
    destroy: () => {
      observer.disconnect();
      mutation.disconnect();
      preference.removeEventListener("change", scan);
    },
  };
}

export function initRevealAll() {
  if (typeof window === "undefined") return;
  shared ??= createRevealController();
  subscribers += 1;
  shared.scan();
  return () => {
    subscribers -= 1;
    if (subscribers === 0) { shared?.destroy(); shared = undefined; }
  };
}

export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.classList.add("reveal");
    return initRevealAll();
  }, []);
  return ref;
}
