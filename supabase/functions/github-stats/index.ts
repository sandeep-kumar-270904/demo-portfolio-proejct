import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const USERNAME = Deno.env.get("GITHUB_USERNAME") || "sandeep-kumar-270904";
const GH = "https://api.github.com";
const TTL_MS = 60 * 60 * 1000; // 1 hour
const CACHE_ID = `github-stats:${USERNAME}`;

const headers: Record<string, string> = {
  "User-Agent": "lovable-portfolio",
  Accept: "application/vnd.github+json",
};
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

let memCache: { at: number; data: unknown } | null = null;

async function gh<T>(path: string): Promise<T> {
  const r = await fetch(`${GH}${path}`, { headers });
  if (!r.ok) throw new Error(`GitHub ${path} -> ${r.status}`);
  return r.json() as Promise<T>;
}

type Day = { date: string; count: number; level: number };

/** Contribution calendar. Prefer GraphQL (needs token), else a public proxy. */
async function fetchCalendar(): Promise<Day[]> {
  if (GITHUB_TOKEN) {
    try {
      const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}`;
      const r = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { login: USERNAME } }),
      });
      if (r.ok) {
        const j = await r.json();
        const weeks = j?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
        if (Array.isArray(weeks)) {
          return weeks.flatMap((w: { contributionDays: { date: string; contributionCount: number }[] }) =>
            w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: toLevel(d.contributionCount) })),
          );
        }
      }
    } catch (_) { /* fall through to proxy */ }
  }
  // Public proxy over GitHub's own contribution calendar
  const r = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`);
  if (!r.ok) throw new Error(`contributions proxy -> ${r.status}`);
  const j = await r.json();
  const days: { date: string; count: number; level: number }[] = j?.contributions ?? [];
  return days.map((d) => ({ date: d.date, count: d.count, level: toLevel(d.count) }));
}

function toLevel(c: number) {
  if (c <= 0) return 0;
  if (c <= 2) return 1;
  if (c <= 5) return 2;
  if (c <= 10) return 3;
  return 4;
}

function computeStreaks(days: Day[]) {
  const today = new Date().toISOString().slice(0, 10);
  const past = days.filter((d) => d.date <= today);
  let longest = 0, run = 0;
  for (const d of past) {
    run = d.count > 0 ? run + 1 : 0;
    if (run > longest) longest = run;
  }
  let current = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    if (past[i].count > 0) current++;
    else if (i === past.length - 1) continue; // today may not have commits yet
    else break;
  }
  return { current, longest };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, extra: Record<string, string> = {}) =>
    new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json", ...extra },
    });

  if (memCache && Date.now() - memCache.at < TTL_MS) {
    return json(memCache.data, { "x-cache": "MEM" });
  }

  // Persisted cache (survives cold starts, used as fallback too)
  let stored: { payload: Record<string, unknown>; updated_at: string } | null = null;
  try {
    const { data } = await supabase.from("github_cache").select("payload, updated_at").eq("id", CACHE_ID).maybeSingle();
    stored = data as typeof stored;
  } catch (_) { /* ignore */ }

  if (stored && Date.now() - new Date(stored.updated_at).getTime() < TTL_MS) {
    memCache = { at: Date.now(), data: stored.payload };
    return json(stored.payload, { "x-cache": "DB" });
  }

  try {
    const user = await gh<Record<string, any>>(`/users/${USERNAME}`);
    const repos = await gh<any[]>(`/users/${USERNAME}/repos?per_page=100&type=owner&sort=pushed`);

    const own = repos.filter((r) => !r.fork);
    const stars = own.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    // Real language bytes across the 15 most recently pushed repos
    const langBytes: Record<string, number> = {};
    const targets = own.slice(0, 15);
    const results = await Promise.allSettled(
      targets.map((r) => gh<Record<string, number>>(`/repos/${USERNAME}/${r.name}/languages`)),
    );
    for (const res of results) {
      if (res.status !== "fulfilled") continue;
      for (const [name, bytes] of Object.entries(res.value)) {
        langBytes[name] = (langBytes[name] || 0) + bytes;
      }
    }
    if (Object.keys(langBytes).length === 0) {
      for (const r of own) if (r.language) langBytes[r.language] = (langBytes[r.language] || 0) + 1;
    }
    const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
    const sortedLangs = Object.entries(langBytes).sort((a, b) => b[1] - a[1]);
    const topLangs = sortedLangs.slice(0, 4);
    const otherBytes = sortedLangs.slice(4).reduce((s, [, b]) => s + b, 0);
    const languages = [
      ...topLangs.map(([name, b]) => ({ name, pct: Math.round((b / totalBytes) * 100) })),
      ...(otherBytes > 0 ? [{ name: "Other", pct: Math.round((otherBytes / totalBytes) * 100) }] : []),
    ].filter((l) => l.pct > 0);

    const days = await fetchCalendar().catch(() => [] as Day[]);
    const streaks = computeStreaks(days);
    const contributionsThisYear = days.reduce((s, d) => s + d.count, 0);

    const latest = own[0]
      ? {
          name: own[0].name,
          description: own[0].description,
          html_url: own[0].html_url,
          pushed_at: own[0].pushed_at,
          language: own[0].language,
        }
      : null;

    // Recent public activity
    let activity: {
      type: string; repo: string; message: string; url: string; created_at: string;
    }[] = [];
    try {
      const events = await gh<any[]>(`/users/${USERNAME}/events/public?per_page=30`);
      for (const e of events) {
        if (activity.length >= 5) break;
        if (e.type === "PushEvent") {
          const c = e.payload?.commits?.[e.payload.commits.length - 1];
          if (!c) continue;
          activity.push({
            type: "commit",
            repo: e.repo?.name?.split("/").pop() ?? e.repo?.name,
            message: String(c.message || "").split("\n")[0].slice(0, 90),
            url: `https://github.com/${e.repo?.name}/commit/${c.sha}`,
            created_at: e.created_at,
          });
        } else if (e.type === "PullRequestEvent" && e.payload?.action === "opened") {
          activity.push({
            type: "pr",
            repo: e.repo?.name?.split("/").pop() ?? e.repo?.name,
            message: e.payload.pull_request?.title?.slice(0, 90) ?? "Opened pull request",
            url: e.payload.pull_request?.html_url,
            created_at: e.created_at,
          });
        } else if (e.type === "CreateEvent" && e.payload?.ref_type === "repository") {
          activity.push({
            type: "repo",
            repo: e.repo?.name?.split("/").pop() ?? e.repo?.name,
            message: "Created repository",
            url: `https://github.com/${e.repo?.name}`,
            created_at: e.created_at,
          });
        }
      }
    } catch (_) { /* activity is optional */ }

    const pinnedRepos = [...own]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 4)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stargazers_count: r.stargazers_count || 0,
        forks_count: r.forks_count || 0,
        html_url: r.html_url,
      }));

    const payload = {
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        followers: user.followers,
      },
      stats: {
        publicRepos: own.length,
        stars,
        followers: user.followers ?? 0,
        contributionsThisYear,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
      },
      languages,
      days,
      latest,
      activity,
      pinnedRepos,
      cachedAt: new Date().toISOString(),
    };

    memCache = { at: Date.now(), data: payload };
    try {
      await supabase.from("github_cache").upsert({ id: CACHE_ID, payload, updated_at: new Date().toISOString() });
    } catch (_) { /* ignore */ }

    return json(payload, { "x-cache": "MISS" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("github-stats error:", msg);
    if (stored?.payload) {
      // Graceful degradation: serve last known good data
      return json({ ...stored.payload, stale: true, error: msg }, { "x-cache": "STALE" });
    }
    return json({
      fallback: true,
      error: msg,
      user: null,
      stats: { publicRepos: 0, stars: 0, followers: 0, contributionsThisYear: 0, currentStreak: 0, longestStreak: 0 },
      languages: [],
      days: [],
      latest: null,
      activity: [],
      pinnedRepos: [],
      cachedAt: new Date().toISOString(),
    });
  }
});
