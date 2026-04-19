export type DbSkill = {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "DevOps" | "Tools" | "Database" | null;
  level: number | null;
  icon: string | null;
  sort_order: number;
};

// Mirrors the hardcoded skills currently shown in Skills.tsx.
export const skillsFallback: DbSkill[] = [
  { id: "f1", name: "React / Next.js", category: "Frontend", level: 95, icon: "⚛", sort_order: 0 },
  { id: "f2", name: "TypeScript", category: "Frontend", level: 88, icon: "🟦", sort_order: 1 },
  { id: "f3", name: "CSS / Tailwind", category: "Frontend", level: 92, icon: "🎨", sort_order: 2 },
  { id: "b1", name: "Node.js", category: "Backend", level: 93, icon: "🟢", sort_order: 0 },
  { id: "b2", name: "REST API", category: "Backend", level: 95, icon: "🔗", sort_order: 1 },
  { id: "b3", name: "GraphQL", category: "Backend", level: 80, icon: "◆", sort_order: 2 },
  { id: "d1", name: "PostgreSQL", category: "Database", level: 87, icon: "🐘", sort_order: 0 },
  { id: "d2", name: "Redis", category: "Database", level: 82, icon: "🔴", sort_order: 1 },
  { id: "o1", name: "Docker", category: "DevOps", level: 84, icon: "🐳", sort_order: 0 },
  { id: "o2", name: "AWS", category: "DevOps", level: 74, icon: "☁️", sort_order: 1 },
  { id: "t1", name: "Git / GitHub", category: "Tools", level: 96, icon: "🌿", sort_order: 0 },
  { id: "t2", name: "Postman", category: "Tools", level: 93, icon: "📮", sort_order: 1 },
];
