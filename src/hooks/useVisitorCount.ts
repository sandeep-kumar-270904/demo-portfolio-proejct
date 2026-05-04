import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const FLAG = "site_visit_logged_v1";

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Log this visit once per browser session
      try {
        if (typeof window !== "undefined" && !sessionStorage.getItem(FLAG)) {
          await supabase.from("site_visits").insert({
            path: window.location.pathname,
            user_agent: navigator.userAgent.slice(0, 300),
            referrer: document.referrer || null,
          });
          sessionStorage.setItem(FLAG, "1");
        }
      } catch {
        /* ignore */
      }
      const { data } = await supabase.rpc("get_visit_count");
      if (!cancelled && typeof data === "number") setCount(data);
      else if (!cancelled && data != null) setCount(Number(data));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}
