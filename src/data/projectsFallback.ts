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
  stats: { value: string; label: string; context?: string }[];
  problem?: string | null;
  solution?: string | null;
  key_features?: string[];
  gallery?: string[];
  video_url?: string | null;
  readme_url?: string | null;
  docs_url?: string | null;
  my_role?: string | null;
  duration?: string | null;
  team_size?: string | null;
  challenges?: string | null;
  results?: string | null;
  lessons?: string | null;
  overview?: string | null;
  case_study_url?: string | null;
  // CMS extras (all optional; page falls back to defaults when empty)
  status_badge?: string | null;
  hero_images?: string[];
  architecture?: {
    nodes?: { x?: number; y?: number; label: string; sub?: string }[];
    edges?: [number, number][];
  } | null;
  architecture_images?: { name?: string; url: string; caption?: string }[];
  glance_media?: {
    problem?: string[];
    solution?: string[];
    features?: string[];
  } | null;

  features_deep?: {
    title: string;
    description?: string;
    images?: string[];
    video_url?: string | null;
  }[];
  frontend_cards?: { h: string; p: string }[];
  backend_cards?: { h: string; p: string }[];
  key_decision?: { chose?: string; instead_of?: string; because?: string } | null;
  stack_groups?: { name: string; items: string[]; why?: string }[];
};

export const projectsFallback: DbProject[] = [];
