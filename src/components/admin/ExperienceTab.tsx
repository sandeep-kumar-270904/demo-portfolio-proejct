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
  role: string;
  company: string;
  period: string | null;
  type: string | null;
  bullets: string[];
  sort_order: number;
};

const empty: Omit<Row, "id"> = {
  role: "",
  company: "",
  period: "",
  type: "work",
  bullets: [],
  sort_order: 0,
};

export default function ExperienceTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Omit<Row, "id">>(empty);
  const [bulletsText, setBulletsText] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("experience")
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
    setBulletsText("");
  }
  function startEdit(r: Row) {
    setEditing(r);
    setDraft({
      role: r.role,
      company: r.company,
      period: r.period ?? "",
      type: r.type ?? "work",
      bullets: r.bullets,
      sort_order: r.sort_order,
    });
    setBulletsText(r.bullets.join("\n"));
  }

  async function save() {
    if (!draft.role.trim() || !draft.company.trim()) {
      toast.error("Role and company required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        bullets: bulletsText.split("\n").map((s) => s.trim()).filter(Boolean),
        period: draft.period || null,
      };
      if (editing) {
        const { error } = await supabase.from("experience").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Experience updated");
      } else {
        const { error } = await supabase.from("experience").insert(payload);
        if (error) throw error;
        toast.success("Experience created");
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
    if (!confirm(`Delete "${r.role}"?`)) return;
    const { error } = await supabase.from("experience").delete().eq("id", r.id);
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
            {rows.length} item{rows.length === 1 ? "" : "s"}
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
                <div className="font-syne text-[13px] font-bold text-ink line-clamp-1">{r.role}</div>
                <div className="font-mono text-[10px] text-muted-foreground line-clamp-1">
                  {r.company} · {r.period}
                </div>
              </button>
              <AdminRowActions onDelete={() => remove(r)} />
            </li>
          ))}
        </ul>
      </div>

      <AdminPanel>
        <h3 className="font-syne text-[18px] font-bold text-ink">
          {editing ? "Edit experience" : "New experience"}
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
          <AdminInput
            label="Company"
            value={draft.company}
            onChange={(v) => setDraft({ ...draft, company: v })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AdminInput
            label="Period"
            value={draft.period ?? ""}
            onChange={(v) => setDraft({ ...draft, period: v })}
            placeholder="2023 — Present"
          />
          <AdminInput
            label="Type (work/education)"
            value={draft.type ?? ""}
            onChange={(v) => setDraft({ ...draft, type: v })}
          />
          <AdminInput
            label="Sort order"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
        </div>
        <div className="mt-4">
          <AdminTextarea
            label="Bullets (one per line)"
            value={bulletsText}
            onChange={setBulletsText}
            rows={6}
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
