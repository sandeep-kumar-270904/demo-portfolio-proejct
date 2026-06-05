// DB-shape fallback for the projects table.
// The richer JSX-visual Project list stays in src/data/projects.tsx and
// is what the existing Projects component still renders.
export type DbProject = {
  id: string;
  title: string;
  description: string | null;
  long_description: string | null;
  tags: string[];
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  featured: boolean;
  category: "SaaS" | "Ecommerce" | "DevTools" | "AI" | "Other" | null;
  sort_order: number;
  stats: { value: string; label: string }[];
  problem?: string | null;
  solution?: string | null;
  key_features?: string[];
  gallery?: string[];
  video_url?: string | null;
  readme_url?: string | null;
  docs_url?: string | null;
};

export const projectsFallback: DbProject[] = [];
