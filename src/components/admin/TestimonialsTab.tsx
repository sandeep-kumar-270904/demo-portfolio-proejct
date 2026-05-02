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
  quote: string;
  name: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  sort_order: number;
};

const empty: Omit<Row, "id"> = {
  quote: "",
  name: "",
  role: "",
  company: "",
  avatar_url: "",
  linkedin_url: "",
  sort_order: 0,
};

export default function TestimonialsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Omit<Row, "id">>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("testimonials")
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
  }
  function startEdit(r: Row) {
    setEditing(r);
    setDraft({
      quote: r.quote,
      name: r.name,
      role: r.role ?? "",
      company: r.company ?? "",
      avatar_url: r.avatar_url ?? "",
      linkedin_url: r.linkedin_url ?? "",
      sort_order: r.sort_order,
    });
  }

  async function save() {
    if (!draft.quote.trim() || !draft.name.trim()) {
      toast.error("Quote and name required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        role: draft.role || null,
        company: draft.company || null,
        avatar_url: draft.avatar_url || null,
        linkedin_url: draft.linkedin_url || null,
      };
      if (editing) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Testimonial updated");
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
        toast.success("Testimonial created");
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
    if (!confirm(`Delete testimonial from "${r.name}"?`)) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", r.id);
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
            {rows.length} testimonial{rows.length === 1 ? "" : "s"}
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
                <div className="font-syne text-[13px] font-bold text-ink line-clamp-1">{r.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground line-clamp-1">
                  {[r.role, r.company].filter(Boolean).join(" · ")}
                </div>
              </button>
              <AdminRowActions onDelete={() => remove(r)} />
            </li>
          ))}
        </ul>
      </div>

      <AdminPanel>
        <h3 className="font-syne text-[18px] font-bold text-ink">
          {editing ? "Edit testimonial" : "New testimonial"}
        </h3>
        <div className="mt-4">
          <AdminTextarea label="Quote" value={draft.quote} onChange={(v) => setDraft({ ...draft, quote: v })} rows={5} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <AdminInput
            label="Role"
            value={draft.role ?? ""}
            onChange={(v) => setDraft({ ...draft, role: v })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Company"
            value={draft.company ?? ""}
            onChange={(v) => setDraft({ ...draft, company: v })}
          />
          <AdminInput
            label="Sort order"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Avatar URL"
            value={draft.avatar_url ?? ""}
            onChange={(v) => setDraft({ ...draft, avatar_url: v })}
          />
          <AdminInput
            label="LinkedIn URL"
            value={draft.linkedin_url ?? ""}
            onChange={(v) => setDraft({ ...draft, linkedin_url: v })}
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
