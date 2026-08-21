import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";
import {
  AdminInput,
  AdminPanel,
  AdminPrimaryButton,
  AdminRowActions,
  AdminSecondaryButton,
} from "./AdminUI";


type Row = {
  id: string;
  title: string;
  issuer: string;
  issuer_logo_url: string | null;
  issue_date: string | null;
  verify_url: string | null;
  source_type: string;
  sort_order: number;
  is_published: boolean;
};

const empty: Omit<Row, "id"> = {
  title: "",
  issuer: "",
  issuer_logo_url: "",
  issue_date: "",
  verify_url: "",
  source_type: "manual",
  sort_order: 0,
  is_published: true,
};

export default function CertificatesTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [draft, setDraft] = useState<Omit<Row, "id">>(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("certificates")
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
      title: r.title,
      issuer: r.issuer,
      issuer_logo_url: r.issuer_logo_url ?? "",
      issue_date: r.issue_date ?? "",
      verify_url: r.verify_url ?? "",
      source_type: r.source_type ?? "manual",
      sort_order: r.sort_order,
      is_published: r.is_published,
    });
  }

  async function save() {
    if (!draft.title.trim() || !draft.issuer.trim()) {
      toast.error("Title and issuer required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...draft,
        issuer_logo_url: draft.issuer_logo_url || null,
        issue_date: draft.issue_date || null,
        verify_url: draft.verify_url?.trim() || null,
      };
      if (editing) {
        const { error } = await supabase.from("certificates").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Certificate updated");
      } else {
        const { error } = await supabase.from("certificates").insert(payload);
        if (error) throw error;
        toast.success("Certificate created");
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
    if (!confirm(`Delete certificate "${r.title}"?`)) return;
    const { error } = await supabase.from("certificates").delete().eq("id", r.id);
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
            {rows.length} certificate{rows.length === 1 ? "" : "s"}
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
                <div className="font-mono text-[10px] text-muted-foreground line-clamp-1">
                  {[r.issuer, r.issue_date].filter(Boolean).join(" · ")}
                  {r.verify_url ? " · verifiable" : ""}
                </div>
              </button>
              <AdminRowActions onDelete={() => remove(r)} />
            </li>
          ))}
        </ul>
      </div>

      <AdminPanel>
        <h3 className="font-syne text-[18px] font-bold text-ink">
          {editing ? "Edit certificate" : "New certificate"}
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
          <AdminInput label="Issuer" value={draft.issuer} onChange={(v) => setDraft({ ...draft, issuer: v })} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Issuer logo URL"
            value={draft.issuer_logo_url ?? ""}
            onChange={(v) => setDraft({ ...draft, issuer_logo_url: v })}
          />
          <AdminInput
            label="Date issued (e.g. Mar 2025)"
            value={draft.issue_date ?? ""}
            onChange={(v) => setDraft({ ...draft, issue_date: v })}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Verify URL (leave blank if none)"
            value={draft.verify_url ?? ""}
            onChange={(v) => setDraft({ ...draft, verify_url: v })}
            placeholder="https://www.credly.com/badges/..."
          />
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Source type
            </span>
            <select
              value={draft.source_type}
              onChange={(e) => setDraft({ ...draft, source_type: e.target.value })}
              className="w-full rounded-lg border border-soft-2 bg-surface px-3 py-2 text-[13px] text-ink focus:border-acid/50 focus:outline-none"
            >
              <option value="credly">credly</option>
              <option value="manual">manual</option>
            </select>
          </label>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminInput
            label="Sort order"
            type="number"
            value={String(draft.sort_order)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
          <label className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={draft.is_published}
              onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })}
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink-2">Published</span>
          </label>
        </div>
        <p className="mt-3 font-mono text-[10px] text-muted-foreground">
          The "Verify" button and the Verified badge only appear when a real http(s) verification link is set.
        </p>
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
