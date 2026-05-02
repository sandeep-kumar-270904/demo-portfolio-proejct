import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Row = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string | null;
  message: string | null;
  budget_range: string | null;
  created_at: string;
};

export default function MessagesTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState<Row | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as unknown as Row[]) ?? []);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border border-soft-2 bg-card p-4">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {rows.length} message{rows.length === 1 ? "" : "s"}
        </div>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
          {rows.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => setOpen(r)}
                className={`w-full rounded-lg border px-3 py-2 text-left ${
                  open?.id === r.id
                    ? "border-acid/50 bg-acid/5"
                    : "border-soft-2 bg-surface hover:border-acid/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-syne text-[13px] font-bold text-ink line-clamp-1">{r.name}</span>
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground line-clamp-1">{r.email}</div>
                {r.subject && (
                  <div className="mt-1 text-[12px] text-ink-2 line-clamp-1">{r.subject}</div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-soft-2 bg-card p-6 lg:p-8">
        {open ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-syne text-[20px] font-bold text-ink">{open.name}</h3>
                <a
                  href={`mailto:${open.email}`}
                  className="mt-1 inline-block font-mono text-[12px] text-acid hover:underline"
                >
                  {open.email}
                </a>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {new Date(open.created_at).toLocaleString()}
              </span>
            </div>
            {open.budget_range && (
              <div className="mt-3 inline-block rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-2">
                Budget: {open.budget_range}
              </div>
            )}
            {open.subject && (
              <div className="mt-4 font-syne text-[15px] font-semibold text-ink">{open.subject}</div>
            )}
            <div className="mt-4 whitespace-pre-wrap rounded-lg border border-soft-2 bg-surface p-4 text-[14px] leading-relaxed text-ink-2">
              {open.message ?? open.body}
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
