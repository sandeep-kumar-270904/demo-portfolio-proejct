// Lightweight admin form primitives shared by all admin tabs.
import { ReactNode } from "react";

export function AdminInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-soft-2 bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-lg border border-soft-2 bg-surface px-3 py-2 text-[13px] text-ink placeholder:text-muted-foreground focus:border-acid/50 focus:outline-none"
      />
    </label>
  );
}

export function AdminPanel({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-soft-2 bg-card p-6 lg:p-8">{children}</div>;
}

export function AdminRowActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex shrink-0 gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="rounded-md border border-soft-2 bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-2 hover:border-acid/40 hover:text-acid"
        >
          Edit
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="rounded-md border border-nova/30 bg-nova/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-nova hover:bg-nova/10"
        >
          Del
        </button>
      )}
    </div>
  );
}

export function AdminPrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-acid px-5 py-2.5 font-syne text-[13px] font-bold text-void hover:glow-acid disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function AdminSecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-soft-2 bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-2 hover:border-acid/50 disabled:opacity-60"
    >
      {children}
    </button>
  );
}
