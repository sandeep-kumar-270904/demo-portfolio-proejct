import { useEffect, useState } from "react";

export function useActiveSection(ids: string[], titleMap?: Record<string, string>) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const handler = () => {
      const offset = 140;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - offset <= 0) current = id;
      }
      setActive(current);
      if (titleMap && titleMap[current]) {
        const base = "Edhubilli Sandeep Kumar";
        document.title = `${titleMap[current]} · ${base}`;
      }
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids, titleMap]);

  return active;
}
