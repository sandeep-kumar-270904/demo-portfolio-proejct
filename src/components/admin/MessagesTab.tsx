import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Mail, Copy, Archive, ArchiveRestore, Check, ChevronLeft, ChevronRight, Bell } from "lucide-react";

type Row = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string | null;
  message: string | null;
  budget_range: string | null;
  created_at: string;
  read_at: string | null;
  archived_at: string | null;
};

const PAGE_SIZE = 20;

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
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const firstLoadRef = useRef(true);

  async function loadUnreadCount() {
    const { count } = await supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .is("read_at", null)
      .is("archived_at", null);
    setUnreadTotal(count ?? 0);
  }

  async function load(opts?: { silent?: boolean }) {
    if (!opts?.silent) setLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let q = supabase
      .from("contact_messages")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (view === "archived") q = q.not("archived_at", "is", null);
    else q = q.is("archived_at", null);
    if (view === "unread") q = q.is("read_at", null);

    if (query.trim()) {
      const like = `%${query.trim()}%`;
      q = q.or(`name.ilike.${like},email.ilike.${like},subject.ilike.${like},message.ilike.${like},body.ilike.${like}`);
    }

    const { data, error, count } = await q;
    if (error) toast.error(error.message);
    else {
      setRows((data as unknown as Row[]) ?? []);
      setTotal(count ?? 0);
    }
    setLoading(false);
    loadUnreadCount();
  }

  useEffect(() => {
    setPage(0);
  }, [view, query]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, query, page]);

  // Realtime subscription
  useEffect(() => {
    const ch = supabase
      .channel("contact_messages_inbox")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contact_messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            if (!firstLoadRef.current) {
              setNewCount((n) => n + 1);
              const row = payload.new as Row;
              toast.message("New message", { description: `${row.name} — ${row.subject ?? row.email}` });
            }
            loadUnreadCount();
          } else {
            // UPDATE / DELETE — refresh quietly
            load({ silent: true });
          }
        },
      )
      .subscribe();
    firstLoadRef.current = false;
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markRead(row: Row) {
    if (row.read_at) return;
    const { error } = await supabase
      .from("contact_messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) return toast.error(error.message);
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, read_at: new Date().toISOString() } : r)));
    if (open?.id === row.id) setOpen({ ...row, read_at: new Date().toISOString() });
    loadUnreadCount();
  }

  async function toggleArchive(row: Row) {
    const next = row.archived_at ? null : new Date().toISOString();
    const { error } = await supabase.from("contact_messages").update({ archived_at: next }).eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Archived" : "Unarchived");
    if (open?.id === row.id) setOpen({ ...row, archived_at: next });
    load({ silent: true });
  }

  async function markAllRead() {
    const { error } = await supabase
      .from("contact_messages")
      .update({ read_at: new Date().toISOString() })
      .is("read_at", null)
      .is("archived_at", null);
    if (error) return toast.error(error.message);
    toast.success("All marked read");
    load({ silent: true });
  }

  async function showNew() {
    setNewCount(0);
    setPage(0);
    await load();
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email);
    toast.success("Email copied");
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = rows;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-2xl border border-soft-2 bg-card p-4">
        {newCount > 0 && (
          <button
            onClick={showNew}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-acid/50 bg-acid/10 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-acid hover:bg-acid/20"
          >
            <Bell className="h-3.5 w-3.5" />
            {newCount} new message{newCount > 1 ? "s" : ""} — click to refresh
          </button>
        )}

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
            disabled={unreadTotal === 0}
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
              {v === "unread" && unreadTotal > 0 && ` · ${unreadTotal}`}
            </button>
          ))}
        </div>
        <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
          {loading && (
            <li className="px-2 py-8 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Loading…
            </li>
          )}
          {!loading && filtered.length === 0 && (
            <li className="px-2 py-8 text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              No messages
            </li>
          )}
          {filtered.map((r) => {
            const unread = !r.read_at;
            const archived = !!r.archived_at;
            return (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setOpen(r);
                    markRead(r);
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

        {/* Pagination */}
        {total > PAGE_SIZE && (
          <div className="mt-3 flex items-center justify-between border-t border-soft-2 pt-3">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="inline-flex items-center gap-1 rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-acid/40 disabled:opacity-40"
            >
              <ChevronLeft className="h-3 w-3" /> Prev
            </button>
            <span className="font-mono text-[10px] text-muted-foreground">
              {page + 1} / {totalPages} · {total}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="inline-flex items-center gap-1 rounded-md border border-soft-2 bg-surface px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-acid/40 disabled:opacity-40"
            >
              Next <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}
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
                onClick={() => toggleArchive(open)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/50"
              >
                {open.archived_at ? (
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
