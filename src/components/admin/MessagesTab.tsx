import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Mail, Copy, Archive, ArchiveRestore, Check } from "lucide-react";

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

const READ_KEY = "admin.messages.read";
const ARCHIVED_KEY = "admin.messages.archived";

function loadSet(key: string): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? "[]"));
  } catch {
    return new Set();
  }
}
function saveSet(key: string, s: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...s]));
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function MessagesTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState<Row | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"inbox" | "unread" | "archived">("inbox");
  const [readSet, setReadSet] = useState<Set<string>>(() => loadSet(READ_KEY));
  const [archivedSet, setArchivedSet] = useState<Set<string>>(() => loadSet(ARCHIVED_KEY));

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

  function markRead(id: string) {
    if (readSet.has(id)) return;
    const next = new Set(readSet).add(id);
    setReadSet(next);
    saveSet(READ_KEY, next);
  }
  function toggleArchive(id: string) {
    const next = new Set(archivedSet);
    next.has(id) ? next.delete(id) : next.add(id);
    setArchivedSet(next);
    saveSet(ARCHIVED_KEY, next);
  }
  function markAllRead() {
    const next = new Set([...readSet, ...rows.map((r) => r.id)]);
    setReadSet(next);
    saveSet(READ_KEY, next);
    toast.success("All marked read");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const archived = archivedSet.has(r.id);
      const unread = !readSet.has(r.id);
      if (view === "archived" && !archived) return false;
      if (view !== "archived" && archived) return false;
      if (view === "unread" && !unread) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.subject ?? "").toLowerCase().includes(q) ||
        (r.message ?? r.body ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, view, readSet, archivedSet]);

  const unreadCount = rows.filter((r) => !readSet.has(r.id) && !archivedSet.has(r.id)).length;

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email);
    toast.success("Email copied");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border border-soft-2 bg-card p-4">
        {/* Toolbar */}
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-md border border-soft-2 bg-surface py-1.5 pl-8 pr-2 text-[12px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
            />
          </div>
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            title="Mark all read"
            className="rounded-md border border-soft-2 bg-surface p-1.5 text-ink-2 hover:border-acid/40 hover:text-acid disabled:opacity-40"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="mb-3 flex gap-1">
          {(["inbox", "unread", "archived"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest ${
                view === v
                  ? "bg-acid text-void"
                  : "border border-soft-2 bg-surface text-ink-2 hover:border-acid/40"
              }`}
            >
              {v}
              {v === "unread" && unreadCount > 0 && ` · ${unreadCount}`}
            </button>
          ))}
        </div>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
          {filtered.length === 0 && (
            <li className="px-2 py-8 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              No messages
            </li>
          )}
          {filtered.map((r) => {
            const unread = !readSet.has(r.id);
            const archived = archivedSet.has(r.id);
            return (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setOpen(r);
                    markRead(r.id);
                  }}
                  className={`group relative w-full rounded-lg border px-3 py-2 text-left transition ${
                    open?.id === r.id
                      ? "border-acid/50 bg-acid/5"
                      : "border-soft-2 bg-surface hover:border-acid/30"
                  }`}
                >
                  {unread && !archived && (
                    <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-acid shadow-[0_0_8px_hsl(var(--acid))]" />
                  )}
                  <div className="flex items-center justify-between gap-2 pl-2">
                    <span className={`font-syne text-[13px] line-clamp-1 ${unread ? "font-bold text-ink" : "font-medium text-ink-2"}`}>
                      {r.name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground whitespace-nowrap">
                      {timeAgo(r.created_at)}
                    </span>
                  </div>
                  <div className="pl-2 font-mono text-[10px] text-muted-foreground line-clamp-1">{r.email}</div>
                  {r.subject && (
                    <div className="mt-1 pl-2 text-[12px] text-ink-2 line-clamp-1">{r.subject}</div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-soft-2 bg-card p-6 lg:p-8">
        {open ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-syne text-[20px] font-bold text-ink">{open.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={`mailto:${open.email}`}
                    className="font-mono text-[12px] text-acid hover:underline"
                  >
                    {open.email}
                  </a>
                  <button
                    onClick={() => copyEmail(open.email)}
                    className="rounded p-1 text-muted-foreground hover:text-acid"
                    title="Copy email"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
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

            {/* Action bar */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent(
                  "Re: " + (open.subject || "your message"),
                )}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-acid px-4 py-2 font-syne text-[12px] font-bold text-void hover:glow-acid"
              >
                <Mail className="h-3.5 w-3.5" /> Reply
              </a>
              <button
                onClick={() => toggleArchive(open.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/50"
              >
                {archivedSet.has(open.id) ? (
                  <>
                    <ArchiveRestore className="h-3.5 w-3.5" /> Unarchive
                  </>
                ) : (
                  <>
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </>
                )}
              </button>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                ✓ Auto-reply sent to sender
              </span>
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
