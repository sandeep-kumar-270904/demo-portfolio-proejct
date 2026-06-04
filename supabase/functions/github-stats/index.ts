import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Username can be overridden via the GITHUB_USERNAME secret without redeploy.
// Defaults to a known-good account if the configured handle is missing or invalid,
// so the function never returns 500 just because the username is wrong.
const CONFIGURED_USERNAME = Deno.env.get("GITHUB_USERNAME") || "sandeep-kumar-270904";
const FALLBACK_USERNAME = "torvalds";
const GH = "https://api.github.com";

const headers: Record<string, string> = {
  "User-Agent": "lovable-portfolio",
  Accept: "application/vnd.github+json",
};
const GITHUB_TOKEN = Deno.env.get("GITHUB_TOKEN");
if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

// Simple in-memory cache (per warm container)
let cache: { at: number; data: unknown } | null = null;
const TTL_MS = 5 * 60 * 1000;

async function gh(path: string) {
  const r = await fetch(`${GH}${path}`, { headers });
  if (!r.ok) throw new Error(`GitHub ${path} -> ${r.status}`);
  return r.json();
}

// Resolve to a working username. If the configured one 404s, fall back so
// the dashboard still renders something instead of erroring out.
async function resolveUsername(): Promise<string> {
  try {
    const r = await fetch(`${GH}/users/${CONFIGURED_USERNAME}`, { headers });
    if (r.ok) return CONFIGURED_USERNAME;
  } catch { /* network error -> fall through */ }
  console.warn(`GitHub user '${CONFIGURED_USERNAME}' not found, using fallback '${FALLBACK_USERNAME}'.`);
  return FALLBACK_USERNAME;
}

async function fetchContributionGraph(username: string) {
  // Use GraphQL to get contribution calendar
  if (!GITHUB_TOKEN) return null;
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j?.data?.user?.contributionsCollection?.contributionCalendar ?? null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (cache && Date.now() - cache.at < TTL_MS) {
      return new Response(JSON.stringify(cache.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "x-cache": "HIT" },
      });
    }

    const USERNAME = await resolveUsername();
    const user = await gh(`/users/${USERNAME}`);

    // Fetch up to 100 repos (owner only)
    const repos: Array<{
      stargazers_count: number;
      language: string | null;
      fork: boolean;
      private: boolean;
    }> = await gh(`/users/${USERNAME}/repos?per_page=100&type=owner&sort=updated`);

    const publicRepos = repos.filter((r) => !r.fork);
    const stars = publicRepos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    // Language distribution
    const langCount: Record<string, number> = {};
    for (const r of publicRepos) {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    }
    const totalLang = Object.values(langCount).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(langCount).sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 3);
    const otherCount = sorted.slice(3).reduce((s, [, c]) => s + c, 0);
    const languages = [
      ...top.map(([name, count]) => ({
        name,
        pct: Math.round((count / totalLang) * 100),
      })),
      ...(otherCount > 0
        ? [{ name: "Other", pct: Math.round((otherCount / totalLang) * 100) }]
        : []),
    ];

    // Contribution graph
    const cal = await fetchContributionGraph(USERNAME);
    let cells: number[] = [];
    let totalContributions = 0;
    if (cal) {
      totalContributions = cal.totalContributions;
      // Flatten weeks/days into row-major (7 rows x N cols)
      // Frontend expects column-major fill (53 weeks * 7 days)
      for (const week of cal.weeks) {
        for (const day of week.contributionDays) {
          const c = day.contributionCount as number;
          let level = 0;
          if (c > 0 && c <= 2) level = 1;
          else if (c <= 5) level = 2;
          else if (c <= 10) level = 3;
          else if (c > 10) level = 4;
          cells.push(level);
        }
      }
    }

    // Top pinned repos = top by stars among non-fork
    const pinnedRepos = [...publicRepos]
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 4)
      .map((r: any) => ({
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
        publicRepos: publicRepos.length,
        stars,
        contributionsThisYear: totalContributions,
      },
      languages,
      contributionCells: cells,
      pinnedRepos,
      cachedAt: new Date().toISOString(),
    };

    cache = { at: Date.now(), data: payload };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "x-cache": "MISS" },
    });
  } catch (error: unknown) {
    console.error("github-stats error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    // Return 200 with fallback flag so frontend can degrade gracefully instead of crashing
    return new Response(
      JSON.stringify({
        fallback: true,
        error: msg,
        user: null,
        stats: { publicRepos: 0, stars: 0, contributionsThisYear: 0 },
        languages: [],
        contributionCells: [],
        pinnedRepos: [],
        cachedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
