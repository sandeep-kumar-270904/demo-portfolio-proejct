import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

type PresenceChannel = ReturnType<typeof supabase.channel>;

const presenceKey =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
const listeners = new Set<(count: number) => void>();
let presenceChannel: PresenceChannel | null = null;
let currentOnline = 1;

function getPresenceChannel() {
  if (presenceChannel) return presenceChannel;

  const channel = supabase.channel("presence:site", {
    config: { presence: { key: presenceKey } },
  });

  channel
    .on("presence", { event: "sync" }, () => {
      currentOnline = Object.keys(channel.presenceState()).length || 1;
      listeners.forEach((listener) => listener(currentOnline));
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ at: Date.now() });
      }
    });

  presenceChannel = channel;
  return channel;
}

/**
 * Live online users counter using Supabase Realtime Presence.
 * Each visitor joins a shared channel; the count reflects unique connected clients.
 */
export default function LiveUsers() {
  const [online, setOnline] = useState<number>(1);

  useEffect(() => {
    setOnline(currentOnline);
    listeners.add(setOnline);
    getPresenceChannel();

    return () => {
      listeners.delete(setOnline);
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-soft-2 bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-2"
      title={`${online} ${online === 1 ? "person" : "people"} viewing now`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid" />
      </span>
      <Users size={11} className="text-acid" />
      <span>Online:</span>
      <span className="text-acid">{online}</span>
    </div>
  );
}
