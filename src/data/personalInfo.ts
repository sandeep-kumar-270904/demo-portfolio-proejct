// Static fallback for personal_info (used if Supabase is unreachable).
// Keys must match the seeded rows in the personal_info table.
export type PersonalInfo = Record<string, string>;

export const personalInfoFallback: PersonalInfo = {
  // Identity
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
  github_username: "sandeep-kumar-270904",
  linkedin_url: "",
  twitter_url: "",

  // Hero
  hero_eyebrow: "Full Stack Engineer · India · Open to Work",
  hero_line1: "EDHUBILLI",
  hero_line2: "SANDEEP",
  hero_line3: "KUMAR",
  hero_subtitle:
    "I architect full-stack systems that scale — from PostgreSQL schemas to Kubernetes clusters. I turn complex business problems into clean, performant, production-grade products.",
  hero_cta_primary: "View Projects →",
  hero_cta_secondary: "Download Resume",
  hero_cta_tertiary: "Let's Talk",

  // About
  about_eyebrow: "01 — About",
  about_title_a: "More than ",
  about_title_b: "just code.",
  about_body_1:
    "I'm a full stack engineer who takes ownership of the entire product. Before writing a single line, I think in systems — data models, API contracts, edge cases, deployment strategies.",
  about_body_2:
    "Currently pursuing B.Tech in CSE while shipping production-grade products for clients worldwide. I don't wait to graduate to start building.",

  // Projects
  projects_eyebrow: "02 — Work",
  projects_title_a: "Selected ",
  projects_title_b: "Projects",
  projects_empty: "No projects in this category yet.",

  // Skills
  skills_eyebrow: "03 — Arsenal",
  skills_title_a: "Technical ",
  skills_title_b: "Stack",

  // Experience
  experience_eyebrow: "04 — Journey",
  experience_title_a: "Milestones ",
  experience_title_b: "&",
  experience_title_c: "Experience",

  // Testimonials
  testimonials_eyebrow: "05 — Proof",
  testimonials_title_a: "What They ",
  testimonials_title_b: "Say",

  // Blog
  blog_eyebrow: "06 — Writing",
  blog_title_a: "Recent ",
  blog_title_b: "Writing",

  // Contact
  contact_eyebrow: "07 — Let's Talk",
  contact_title_a: "Let's Build",
  contact_title_b: "Something",
  contact_title_c: "Legendary.",
};
