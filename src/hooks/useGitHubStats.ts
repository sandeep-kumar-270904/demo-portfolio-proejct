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

export type ContributionDay = { date: string; count: number; level: number };

export type ActivityItem = {
  type: string;
  repo: string;
  message: string;
  url: string;
  created_at: string;
};

export type GitHubStats = {
  user: { login: string; name: string | null; avatar_url: string; html_url: string; followers: number } | null;
  stats: {
    publicRepos: number;
    stars: number;
    followers: number;
    contributionsThisYear: number;
    currentStreak: number;
    longestStreak: number;
  };
  languages: { name: string; pct: number }[];
  days: ContributionDay[];
  latest: { name: string; description: string | null; html_url: string; pushed_at: string; language: string | null } | null;
  activity: ActivityItem[];
  pinnedRepos?: PinnedRepo[];
  recentRepos?: (PinnedRepo & { pushed_at?: string })[];
  stale?: boolean;
  fallback?: boolean;
  cachedAt: string;
};

const LS_KEY = "gh-stats-cache-v3";

export function useGitHubStats() {
  const [data, setData] = useState<GitHubStats | null>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as GitHubStats) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: res, error } = await supabase.functions.invoke("github-stats", { method: "GET" });
        if (!active) return;
        if (error) throw error;
        const payload = res as GitHubStats;
        if (payload?.user || payload?.days?.length) {
          setData(payload);
          try {
            localStorage.setItem(LS_KEY, JSON.stringify(payload));
          } catch { /* quota */ }
        }
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
