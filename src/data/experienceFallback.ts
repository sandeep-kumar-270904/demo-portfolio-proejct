export type DbExperience = {
  id: string;
  role: string;
  company: string;
  period: string | null;
  type: "work" | "education" | null;
  bullets: string[];
  sort_order: number;
  company_logo_url?: string | null;
};

// Mirrors the hardcoded ITEMS in Experience.tsx.
export const experienceFallback: DbExperience[] = [
  {
    id: "e1",
    role: "Freelance Full Stack Developer",
    company: "Self-Employed · Remote Worldwide",
    period: "2022 — Present",
    type: "work",
    bullets: [
      "Built SaaS platforms, e-commerce, analytics dashboards",
      "100% client retention",
      "Earning while pursuing B.Tech",
    ],
    sort_order: 0,
  },
  {
    id: "e2",
    role: "Full Stack Developer Intern",
    company: "TechStartup · Full-time Position",
    period: "Summer 2024",
    type: "work",
    bullets: [
      "Architected REST APIs handling 10,000+ daily requests under 200ms P99",
      "Cut page load by 42% via query optimization and Redis caching",
      "Introduced code review standards adopted by full team",
    ],
    sort_order: 1,
  },
  {
    id: "e3",
    role: "1st Place — Smart India Hackathon",
    company: "National · ₹1,00,000 Prize",
    period: "2024",
    type: "work",
    bullets: [
      "Led team of 4, architected full stack solo",
      'Jury awarded "Most Technically Sound Solution"',
    ],
    sort_order: 2,
  },
  {
    id: "e4",
    role: "B.Tech — Computer Science & Engineering",
    company: "JNTU University · CGPA 8.4+",
    period: "2022 — 2026",
    type: "education",
    bullets: ["More production deployments than classmates have side projects."],
    sort_order: 3,
  },
];
