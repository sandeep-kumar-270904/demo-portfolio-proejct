// Static fallback for personal_info (used if Supabase is unreachable).
// Keys must match the seeded rows in the personal_info table.
export type PersonalInfo = Record<string, string>;

export const personalInfoFallback: PersonalInfo = {
  name: "Edhubilli Sandeep Kumar",
  tagline: "Full Stack Engineer · Architecting systems that scale",
  bio_1:
    "I architect full-stack systems that scale — from PostgreSQL schemas to Kubernetes clusters. I turn complex business problems into clean, performant, production-grade products.",
  bio_2:
    "Based in India, I work async-first with teams across timezones. My focus: shipping fast without sacrificing engineering quality.",
  bio_3:
    "When I'm not coding, I'm probably reading distributed-systems papers or tinkering with side projects.",
  location: "India",
  timezone: "IST (UTC+5:30)",
  email: "sandeepkumar.dev@gmail.com",
  resume_url: "/resume.pdf",
  is_available: "true",
  available_until: "April 2026",
  github_username: "edhubilli-sandeep",
  linkedin_url: "",
  twitter_url: "",
};
