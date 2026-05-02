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

type Row = {
  id: string;
  title: string;
  excerpt: string | null;
  read_time: string | null;
  published_date: string | null;
  external_url: string | null;
  tags: string[];
  is_published: boolean;
  sort_order: number;
};

const empty: Omit<Row, "id"> = {
  title: "",
  excerpt: "",
  read_time: "",
  published_date: "",
  external_url: "",
  tags: [],
  is_published: true,
  sort_order: 0,
};

export default function BlogPostsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Omit<Row, "id">>(empty);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("blog_posts")
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
  }
  function startEdit(r: Row) {
    setEditing(r);
    setDraft({
      title: r.title,
      excerpt: r.excerpt ?? "",
      read_time: r.read_time ?? "",
      published_date: r.published_date ?? "",
      external_url: r.external_url ?? "",
      tags: r.tags,
      is_published: r.is_published,
      sort_order: r.sort_order,
    });
    setTagsInput(r.tags.join(", "));
  }

  async function save() {
    if (!draft.title.trim()) {
      toast.error("Title required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        tags: tagsInput.split(",").map((s) => s.trim()).filter(Boolean),
        excerpt: draft.excerpt || null,
        read_time: draft.read_time || null,
        external_url: draft.external_url || null,
        published_date: draft.published_date || null,
      };
      if (editing) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Post updated");
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast.success("Post created");
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
    if (!confirm(`Delete "${r.title}"?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", r.id);
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
            {rows.length} link{rows.length === 1 ? "" : "s"}
          </span>
          <button
            onClick={startNew}
            className="rounded-md bg-acid px-3 py-1 font-syne text-[11px] font-bold text-void hover:glow-acid"
          >
            + New
          </button>
        </div>
        <ul className="space-y-2">
          {rows.map((r) => (
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
                  {r.is_published ? "published" : "draft"} · {r.published_date ?? "—"}
                </div>
              </button>
              <AdminRowActions onDelete={() => remove(r)} />
            </li>
          ))}
        </ul>
      </div>

      <AdminPanel>
        <h3 className="font-syne text-[18px] font-bold text-ink">
          {editing ? "Edit external post" : "New external post"}
        </h3>
        <div className="mt-4">
          <AdminInput label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        </div>
        <div className="mt-4">
          <AdminTextarea
            label="Excerpt"
            value={draft.excerpt ?? ""}
            onChange={(v) => setDraft({ ...draft, excerpt: v })}
            rows={3}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="External URL"
            value={draft.external_url ?? ""}
            onChange={(v) => setDraft({ ...draft, external_url: v })}
            placeholder="https://medium.com/..."
          />
          <AdminInput
            label="Read time"
            value={draft.read_time ?? ""}
            onChange={(v) => setDraft({ ...draft, read_time: v })}
            placeholder="5 min"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminInput
            label="Published date (YYYY-MM-DD)"
            value={draft.published_date ?? ""}
            onChange={(v) => setDraft({ ...draft, published_date: v })}
          />
          <AdminInput label="Tags (comma)" value={tagsInput} onChange={setTagsInput} />
          <AdminInput
            label="Sort order"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
        </div>
        <label className="mt-4 inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.is_published}
            onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
          />
          <span className="font-mono text-[11px] uppercase tracking-widest text-ink-2">Published</span>
        </label>

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
