// Admin-only re-seed helper. Wipes and repopulates demo data for the
// projects, skills, experience, and testimonials tables.
// Relies on RLS — only callers with the `admin` role can succeed.
import { supabase } from "@/integrations/supabase/client";
import {
  SEED_PROJECTS,
  SEED_SKILLS,
  SEED_EXPERIENCE,
  SEED_TESTIMONIALS,
} from "@/data/seedData";

type SeedResult = {
  table: string;
  inserted: number;
  error?: string;
};

async function reseedTable(
  table: "projects" | "skills" | "experience" | "testimonials",
  rows: Record<string, unknown>[],
): Promise<SeedResult> {
  // Delete all then insert fresh. RLS gates this to admins only.
  const del = await supabase
    .from(table)
    .delete()
    .gte("sort_order", -2147483648); // catch-all WHERE
  if (del.error) return { table, inserted: 0, error: del.error.message };

  const ins = await supabase.from(table).insert(rows as never);
  if (ins.error) return { table, inserted: 0, error: ins.error.message };
  return { table, inserted: rows.length };
}

export async function reseedAll(): Promise<SeedResult[]> {
  return Promise.all([
    reseedTable("projects", SEED_PROJECTS),
    reseedTable("skills", SEED_SKILLS),
    reseedTable("experience", SEED_EXPERIENCE),
    reseedTable("testimonials", SEED_TESTIMONIALS),
  ]);
}
