// Flexible CMS: edit any key/value in personal_info.
// Add new keys on the fly — they become editable fields immediately.
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AdminInput,
  AdminPanel,
  AdminPrimaryButton,
  AdminSecondaryButton,
  AdminTextarea,
} from "./AdminUI";

type Row = { id: string; key: string; value: string };

// Keys grouped for nicer UX. Anything else lands in "Other".
const GROUPS: Record<string, string[]> = {
  Identity: ["name", "tagline", "email", "location", "timezone", "profile_photo_url", "resume_url"],
  Bio: ["bio_1", "bio_2", "bio_3"],
  Availability: ["is_available", "available_until"],
  Socials: [
    "social_github",
    "social_linkedin",
    "social_twitter",
    "social_youtube",
    "social_instagram",
    "github_username",
    "linkedin_url",
    "twitter_url",
  ],
};

const LONG_KEYS = new Set(["bio_1", "bio_2", "bio_3", "tagline"]);

export default function SiteContentTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("personal_info")
      .select("id, key, value")
      .order("key");
    if (error) toast.error(error.message);
    setRows((data as Row[]) ?? []);
    setEdits({});
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Row[]> = { Identity: [], Bio: [], Availability: [], Socials: [], Other: [] };
    rows.forEach((r) => {
      const g =
        Object.keys(GROUPS).find((k) => GROUPS[k].includes(r.key)) ?? "Other";
      map[g].push(r);
    });
    return map;
  }, [rows]);

  async function saveAll() {
    const dirty = rows.filter((r) => edits[r.id] !== undefined && edits[r.id] !== r.value);
    if (!dirty.length) {
      toast.message("Nothing changed");
      return;
    }
    setSaving(true);
    const updates = await Promise.all(
      dirty.map((r) =>
        supabase.from("personal_info").update({ value: edits[r.id] }).eq("id", r.id),
      ),
    );
    const failed = updates.find((u) => u.error);
    setSaving(false);
    if (failed?.error) toast.error(failed.error.message);
    else {
      toast.success(`Saved ${dirty.length} field(s)`);
      load();
    }
  }

  async function addField() {
    const k = newKey.trim();
    if (!k) return;
    const { error } = await supabase.from("personal_info").insert({ key: k, value: newValue });
    if (error) return toast.error(error.message);
    setNewKey("");
    setNewValue("");
    toast.success("Added field");
    load();
  }

  async function removeField(id: string) {
    if (!confirm("Delete this field?")) return;
    const { error } = await supabase.from("personal_info").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  if (loading) return <p className="font-mono text-[12px] text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <AdminPanel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-syne text-[18px] font-bold text-ink">Site Content (CMS)</h2>
            <p className="mt-1 text-[13px] text-ink-2">
              Edit any text on the site. Add custom fields to drive new sections.
            </p>
          </div>
          <AdminPrimaryButton onClick={saveAll} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </AdminPrimaryButton>
        </div>
      </AdminPanel>

      {(["Identity", "Bio", "Availability", "Socials", "Other"] as const).map((group) => {
        const list = grouped[group];
        if (!list?.length) return null;
        return (
          <AdminPanel key={group}>
            <h3 className="font-syne text-[15px] font-bold text-acid">{group}</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {list.map((r) => {
                const current = edits[r.id] ?? r.value;
                const Field = LONG_KEYS.has(r.key) ? AdminTextarea : AdminInput;
                return (
                  <div key={r.id} className="relative">
                    <Field
                      label={r.key}
                      value={current}
                      onChange={(v) => setEdits((e) => ({ ...e, [r.id]: v }))}
                    />
                    <button
                      onClick={() => removeField(r.id)}
                      title="Delete field"
                      className="absolute right-2 top-0 rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-nova hover:bg-nova/10"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </AdminPanel>
        );
      })}

      <AdminPanel>
        <h3 className="font-syne text-[15px] font-bold text-ink">Add new field</h3>
        <p className="mt-1 text-[13px] text-ink-2">
          Use snake_case keys (e.g. <code>hero_subtitle</code>). They become available across the site.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr_auto]">
          <AdminInput label="key" value={newKey} onChange={setNewKey} placeholder="custom_key" />
          <AdminInput label="value" value={newValue} onChange={setNewValue} placeholder="value" />
          <div className="flex items-end">
            <AdminSecondaryButton onClick={addField}>+ Add</AdminSecondaryButton>
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}
