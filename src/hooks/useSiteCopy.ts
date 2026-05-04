// Helper around usePersonalInfo: returns a `t(key, fallback)` accessor for CMS strings.
import { usePersonalInfo } from "./useSupabase";
import { personalInfoFallback } from "@/data/personalInfo";

export function useSiteCopy() {
  const { data: info } = usePersonalInfo();
  const t = (key: string, fallback?: string): string => {
    const v = info?.[key];
    if (v !== undefined && v !== null && v !== "") return v;
    return fallback ?? personalInfoFallback[key] ?? "";
  };
  return { t, info: info ?? personalInfoFallback };
}
