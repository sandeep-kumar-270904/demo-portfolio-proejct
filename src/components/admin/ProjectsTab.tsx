import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AdminInput,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowActions,
  AdminSecondaryButton,
  AdminTextarea,
} from "./AdminUI";
import ImageUploader from "./ImageUploader";

type Row = {
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
  category: string | null;
  sort_order: number;
  stats: { value: string; label: string; context?: string }[];
  problem: string | null;
  solution: string | null;
  key_features: string[];
  gallery: string[];
  video_url: string | null;
  readme_url: string | null;
  docs_url: string | null;
  my_role: string | null;
  duration: string | null;
  team_size: string | null;
  challenges: string | null;
  results: string | null;
  lessons: string | null;
  overview: string | null;
  case_study_url: string | null;
  status_badge: string | null;
  hero_images: string[];
  architecture: { nodes?: { label: string; sub?: string; x?: number; y?: number }[]; edges?: [number, number][] };
  features_deep: { title: string; description?: string; images?: string[]; video_url?: string | null }[];
  frontend_cards: { h: string; p: string }[];
  backend_cards: { h: string; p: string }[];
  key_decision: { chose?: string; instead_of?: string; because?: string };
  stack_groups: { name: string; items: string[]; why?: string }[];
};

const empty: Omit<Row, "id"> = {
  title: "",
  description: "",
  long_description: "",
  tags: [],
  tech_stack: [],
  live_url: "",
  github_url: "",
  image_url: "",
  featured: false,
  category: "SaaS",
  sort_order: 0,
  stats: [],
  problem: "",
  solution: "",
  key_features: [],
  gallery: [],
  video_url: "",
  readme_url: "",
  docs_url: "",
  my_role: "",
  duration: "",
  team_size: "",
  challenges: "",
  results: "",
  lessons: "",
  overview: "",
  case_study_url: "",
  status_badge: "",
  hero_images: [],
  architecture: { nodes: [], edges: [] },
  features_deep: [],
  frontend_cards: [],
  backend_cards: [],
  key_decision: {},
  stack_groups: [],
};

function csv(arr: string[]) {
  return arr.join(", ");
}
function fromCsv(s: string) {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

type SortKey = "sort_order" | "title" | "category";

export default function ProjectsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Omit<Row, "id">>(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [statsJson, setStatsJson] = useState("[]");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("sort_order");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const categories = Array.from(
    new Set(rows.map((r) => r.category).filter((c): c is string => Boolean(c))),
  );
  const filtered = rows.filter((r) => {
    if (categoryFilter !== "All" && r.category !== categoryFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      (r.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
      (r.tech_stack ?? []).some((t) => t.toLowerCase().includes(q))
    );
  });
  const sorted = [...filtered].sort((a, b) => {
    const av = (a[sortKey] ?? "") as string | number;
    const bv = (b[sortKey] ?? "") as string | number;
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, sortKey, sortDir, pageSize]);

  async function load() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    setRows((data as unknown as Row[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing(null);
    setDraft(empty);
    setTagsInput("");
    setTechInput("");
    setFeaturesInput("");
    setGalleryInput("");
    setStatsJson("[]");
  }
  function startEdit(r: Row) {
    setEditing(r);
    setDraft({
      title: r.title,
      description: r.description ?? "",
      long_description: r.long_description ?? "",
      tags: r.tags,
      tech_stack: r.tech_stack,
      live_url: r.live_url ?? "",
      github_url: r.github_url ?? "",
      image_url: r.image_url ?? "",
      featured: r.featured,
      category: r.category ?? "SaaS",
      sort_order: r.sort_order,
      stats: r.stats ?? [],
      problem: r.problem ?? "",
      solution: r.solution ?? "",
      key_features: r.key_features ?? [],
      gallery: r.gallery ?? [],
      video_url: r.video_url ?? "",
      readme_url: r.readme_url ?? "",
      docs_url: r.docs_url ?? "",
      my_role: r.my_role ?? "",
      duration: r.duration ?? "",
      team_size: r.team_size ?? "",
      challenges: r.challenges ?? "",
      results: r.results ?? "",
      lessons: r.lessons ?? "",
      overview: r.overview ?? "",
      case_study_url: r.case_study_url ?? "",
    });
    setTagsInput(csv(r.tags));
    setTechInput(csv(r.tech_stack));
    setFeaturesInput((r.key_features ?? []).join("\n"));
    setGalleryInput((r.gallery ?? []).join("\n"));
    setStatsJson(JSON.stringify(r.stats ?? [], null, 2));
  }

  async function save() {
    if (!draft.title.trim()) {
      toast.error("Title required");
      return;
    }
    let stats: { value: string; label: string }[] = [];
    try {
      stats = JSON.parse(statsJson || "[]");
      if (!Array.isArray(stats)) throw new Error();
    } catch {
      toast.error("Stats must be valid JSON array");
      return;
    }
    setSaving(true);
    const splitLines = (s: string) =>
      s.split("\n").map((x) => x.trim()).filter(Boolean);
    const payload = {
      ...draft,
      tags: fromCsv(tagsInput),
      tech_stack: fromCsv(techInput),
      key_features: splitLines(featuresInput),
      gallery: splitLines(galleryInput),
      stats,
      live_url: draft.live_url || null,
      github_url: draft.github_url || null,
      image_url: draft.image_url || null,
      description: draft.description || null,
      long_description: draft.long_description || null,
      problem: draft.problem || null,
      solution: draft.solution || null,
      video_url: draft.video_url || null,
      readme_url: draft.readme_url || null,
      docs_url: draft.docs_url || null,
      my_role: draft.my_role || null,
      duration: draft.duration || null,
      team_size: draft.team_size || null,
      challenges: draft.challenges || null,
      results: draft.results || null,
      lessons: draft.lessons || null,
      overview: draft.overview || null,
      case_study_url: draft.case_study_url || null,
    };
    try {
      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Project updated");
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
        toast.success("Project created");
      }
      startNew();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(r: Row) {
    if (!confirm(`Delete project "${r.title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", r.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      load();
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-2xl border border-soft-2 bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <span
            data-testid="projects-counter"
            className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
          >
            {sorted.length} / {rows.length}
          </span>
          <button
            onClick={startNew}
            className="rounded-md bg-acid px-3 py-1 font-syne text-[11px] font-bold text-void hover:glow-acid"
          >
            + New
          </button>
        </div>
        <input
          aria-label="Search projects"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, tag, tech…"
          className="mb-2 w-full rounded-lg border border-soft-2 bg-surface px-3 py-2 text-[12px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
        />
        <div className="mb-3 flex flex-wrap gap-1.5">
          {["All", ...categories].map((c) => {
            const active = c === categoryFilter;
            return (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
                  active
                    ? "bg-acid text-void"
                    : "border border-soft-2 bg-surface text-ink-2 hover:border-acid/40"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="mb-3 grid grid-cols-3 gap-1.5">
          <select
            aria-label="Sort projects by"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2"
          >
            <option value="sort_order">Order</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
          <select
            aria-label="Sort direction"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
            className="rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
          <select
            aria-label="Rows per page"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        </div>
        <ul className="space-y-2">
          {visible.map((r) => (
            <li key={r.id} className="flex items-start gap-2">
              <button
                onClick={() => startEdit(r)}
                className={`flex-1 rounded-lg border px-3 py-2 text-left ${
                  editing?.id === r.id
                    ? "border-acid/50 bg-acid/5"
                    : "border-soft-2 bg-surface hover:border-acid/30"
                }`}
              >
                <div className="font-syne text-[13px] font-bold text-ink line-clamp-1">{r.title}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {r.category} · #{r.sort_order}
                </div>
              </button>
              <AdminRowActions onDelete={() => remove(r)} />
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            aria-label="Previous page"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Page {safePage} / {totalPages}
          </span>
          <button
            aria-label="Next page"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      <AdminPanel>
        <h3 className="font-syne text-[18px] font-bold text-ink">
          {editing ? "Edit project" : "New project"}
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
          <AdminInput
            label="Category"
            value={draft.category ?? ""}
            onChange={(v) => setDraft({ ...draft, category: v })}
            placeholder="SaaS / E-Commerce / Dev Tools / DevOps"
          />
        </div>
        <div className="mt-4">
          <AdminTextarea
            label="Description (short)"
            value={draft.description ?? ""}
            onChange={(v) => setDraft({ ...draft, description: v })}
            rows={3}
          />
        </div>
        <div className="mt-4">
          <AdminTextarea
            label="Long description"
            value={draft.long_description ?? ""}
            onChange={(v) => setDraft({ ...draft, long_description: v })}
            rows={4}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Tags (comma) — first tag is the slug for visual mapping"
            value={tagsInput}
            onChange={setTagsInput}
            placeholder="buildflow, Next.js, Stripe"
          />
          <AdminInput
            label="Tech stack (comma)"
            value={techInput}
            onChange={setTechInput}
            placeholder="Node, Postgres, Redis"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Live URL"
            value={draft.live_url ?? ""}
            onChange={(v) => setDraft({ ...draft, live_url: v })}
          />
          <AdminInput
            label="GitHub URL"
            value={draft.github_url ?? ""}
            onChange={(v) => setDraft({ ...draft, github_url: v })}
          />
        </div>
        <div className="mt-4">
          <ImageUploader
            bucket="project-images"
            label="Project image (overrides built-in art)"
            value={draft.image_url ?? ""}
            prefix={(draft.title || "project").toLowerCase().replace(/\s+/g, "-")}
            onChange={(url) => setDraft({ ...draft, image_url: url })}
          />
          <AdminInput
            label="…or paste an image URL"
            value={draft.image_url ?? ""}
            onChange={(v) => setDraft({ ...draft, image_url: v })}
          />
        </div>

        {/* Detail-page fields */}
        <div className="mt-6 rounded-xl border border-soft-2 bg-surface/40 p-4">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
            Detail page content
          </h4>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminTextarea
              label="Problem"
              value={draft.problem ?? ""}
              onChange={(v) => setDraft({ ...draft, problem: v })}
              rows={3}
            />
            <AdminTextarea
              label="Solution"
              value={draft.solution ?? ""}
              onChange={(v) => setDraft({ ...draft, solution: v })}
              rows={3}
            />
          </div>
          <div className="mt-4">
            <AdminTextarea
              label="Key features (one per line)"
              value={featuresInput}
              onChange={setFeaturesInput}
              rows={4}
            />
          </div>
          <div className="mt-4">
            <AdminTextarea
              label="Gallery image URLs (one per line)"
              value={galleryInput}
              onChange={setGalleryInput}
              rows={3}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AdminInput
              label="My role"
              value={draft.my_role ?? ""}
              onChange={(v) => setDraft({ ...draft, my_role: v })}
              placeholder="Lead Engineer"
            />
            <AdminInput
              label="Duration"
              value={draft.duration ?? ""}
              onChange={(v) => setDraft({ ...draft, duration: v })}
              placeholder="3 months"
            />
            <AdminInput
              label="Team size"
              value={draft.team_size ?? ""}
              onChange={(v) => setDraft({ ...draft, team_size: v })}
              placeholder="Solo / 4 engineers"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <AdminTextarea
              label="Challenges"
              value={draft.challenges ?? ""}
              onChange={(v) => setDraft({ ...draft, challenges: v })}
              rows={3}
            />
            <AdminTextarea
              label="Results / Outcome"
              value={draft.results ?? ""}
              onChange={(v) => setDraft({ ...draft, results: v })}
              rows={3}
            />
            <AdminTextarea
              label="Lessons learned"
              value={draft.lessons ?? ""}
              onChange={(v) => setDraft({ ...draft, lessons: v })}
              rows={3}
            />
          </div>
          <div className="mt-4">
            <AdminTextarea
              label="Overview narrative (shown at top of detail page, supports line breaks)"
              value={draft.overview ?? ""}
              onChange={(v) => setDraft({ ...draft, overview: v })}
              rows={4}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminInput
              label="Case study URL (PDF / doc download)"
              value={draft.case_study_url ?? ""}
              onChange={(v) => setDraft({ ...draft, case_study_url: v })}
              placeholder="https://…/case-study.pdf"
            />
            <AdminInput
              label="Video URL (YouTube / Vimeo / .mp4)"
              value={draft.video_url ?? ""}
              onChange={(v) => setDraft({ ...draft, video_url: v })}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AdminInput
              label="README URL"
              value={draft.readme_url ?? ""}
              onChange={(v) => setDraft({ ...draft, readme_url: v })}
            />
            <AdminInput
              label="Docs URL"
              value={draft.docs_url ?? ""}
              onChange={(v) => setDraft({ ...draft, docs_url: v })}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Sort order"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
          <label className="flex items-end gap-2 pb-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-2">Featured</span>
          </label>
        </div>
        <div className="mt-4">
          <AdminTextarea
            label='Stats (JSON: [{"value":"99%","label":"Uptime"}])'
            value={statsJson}
            onChange={setStatsJson}
            rows={4}
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AdminPrimaryButton onClick={save} disabled={saving}>
            {editing ? "Update" : "Create"}
          </AdminPrimaryButton>
          {editing && <AdminSecondaryButton onClick={startNew}>Cancel</AdminSecondaryButton>}
        </div>
      </AdminPanel>
    </div>
  );
}
