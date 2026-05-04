import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AdminInput,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowActions,
  AdminSecondaryButton,
} from "./AdminUI";

type Row = {
  id: string;
  name: string;
  category: string | null;
  level: number | null;
  icon: string | null;
  sort_order: number;
};

const empty: Omit<Row, "id"> = {
  name: "",
  category: "Frontend",
  level: 80,
  icon: "",
  sort_order: 0,
};

type SortKey = "sort_order" | "name" | "category" | "level";

export default function SkillsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Omit<Row, "id">>(empty);
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
    return r.name.toLowerCase().includes(search.toLowerCase());
  });
  const sorted = [...filtered].sort((a, b) => {
    const av = (a[sortKey] ?? "") as string | number;
    const bv = (b[sortKey] ?? "") as string | number;
    const cmp =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, sortKey, sortDir, pageSize]);

  async function load() {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    setRows((data as unknown as Row[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  function startNew() {
    setEditing(null);
    setDraft(empty);
  }
  function startEdit(r: Row) {
    setEditing(r);
    setDraft({
      name: r.name,
      category: r.category ?? "Frontend",
      level: r.level ?? 80,
      icon: r.icon ?? "",
      sort_order: r.sort_order,
    });
  }

  async function save() {
    if (!draft.name.trim()) {
      toast.error("Name required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...draft, icon: draft.icon || null };
      if (editing) {
        const { error } = await supabase.from("skills").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Skill updated");
      } else {
        const { error } = await supabase.from("skills").insert(payload);
        if (error) throw error;
        toast.success("Skill created");
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
    if (!confirm(`Delete skill "${r.name}"?`)) return;
    const { error } = await supabase.from("skills").delete().eq("id", r.id);
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
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {visible.length} / {rows.length}
          </span>
          <button
            onClick={startNew}
            className="rounded-md bg-acid px-3 py-1 font-syne text-[11px] font-bold text-void hover:glow-acid"
          >
            + New
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skill…"
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
                <div className="font-syne text-[13px] font-bold text-ink line-clamp-1">
                  {r.icon ?? ""} {r.name}
                </div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {r.category} · {r.level}%
                </div>
              </button>
              <AdminRowActions onDelete={() => remove(r)} />
            </li>
          ))}
        </ul>
      </div>

      <AdminPanel>
        <h3 className="font-syne text-[18px] font-bold text-ink">
          {editing ? "Edit skill" : "New skill"}
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <AdminInput
            label="Category"
            value={draft.category ?? ""}
            onChange={(v) => setDraft({ ...draft, category: v })}
            placeholder="Frontend / Backend / Database / DevOps / Tools"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminInput
            label="Level (0–100)"
            type="number"
            value={String(draft.level ?? 0)}
            onChange={(v) => setDraft({ ...draft, level: Number(v) || 0 })}
          />
          <AdminInput
            label="Icon (emoji)"
            value={draft.icon ?? ""}
            onChange={(v) => setDraft({ ...draft, icon: v })}
          />
          <AdminInput
            label="Sort order"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <AdminPrimaryButton onClick={save} disabled={saving}>
            {editing ? "Update" : "Create"}
          </AdminPrimaryButton>
          {editing && <AdminSecondaryButton onClick={startNew}>Cancel</AdminSecondaryButton>}
        </div>
      </AdminPanel>
    </div>
  );
}
