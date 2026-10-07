import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usePersonalInfo } from "@/hooks/useSupabase";
import { SITE } from "@/config";

const KEY = "banner_dismissed";

export default function AvailabilityBanner() {
  const [dismissed, setDismissed] = useState(true);
  const { data: info } = usePersonalInfo();

  useEffect(() => {
    setDismissed(localStorage.getItem(KEY) === "1");
  }, []);

  if (dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setDismissed(true);
  };

  // DB-driven with config fallback
  const available = info?.is_available ? info.is_available === "true" : SITE.isAvailable;
  const availableUntil = info?.available_until || SITE.availableUntil;

  const dot = available ? "bg-acid" : "bg-ember";
  const text = available ? "text-acid" : "text-ember";
  const ring = available ? "border-acid/25 bg-acid/5" : "border-ember/25 bg-ember/5";
  const message = available
    ? `Currently available for freelance & full-time — ${availableUntil}`
    : `Currently booked — next availability ${availableUntil}`;

  return (
    <div data-availability-banner className={`relative z-[55] w-full border-b ${ring}`}>
      <div className="mx-auto flex max-w-[1320px] items-center justify-center gap-3 px-6 py-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className={`absolute inline-flex h-full w-full animate-sonar rounded-full ${dot}`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dot} animate-pulse-dot`} />
        </span>
        <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${text}`}>{message}</span>
        <button
          aria-label="Dismiss"
          onClick={dismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-ink"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
