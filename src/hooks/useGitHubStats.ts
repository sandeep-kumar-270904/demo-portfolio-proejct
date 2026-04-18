import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PinnedRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
};

export type GitHubStats = {
  user: { login: string; name: string | null; avatar_url: string; html_url: string; followers: number };
  stats: { publicRepos: number; stars: number; contributionsThisYear: number };
  languages: { name: string; pct: number }[];
  contributionCells: number[];
  pinnedRepos?: PinnedRepo[];
  cachedAt: string;
};

export function useGitHubStats() {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("github-stats", { method: "GET" });
        if (!active) return;
        if (error) throw error;
        setData(data as GitHubStats);
      } catch (e: unknown) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
