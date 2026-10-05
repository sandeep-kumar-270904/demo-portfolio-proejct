import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

/**
 * Live online users counter using Supabase Realtime Presence.
 * Each visitor joins a shared channel; the count reflects unique connected clients.
 */
export default function LiveUsers() {
  const [online, setOnline] = useState<number>(1);

  useEffect(() => {
    const id = (crypto as Crypto).randomUUID?.() ?? Math.random().toString(36).slice(2);
    // A unique topic prevents a departing page's subscribed channel from being reused
    // while the incoming page mounts during the shared-layout route transition.
    const channel = supabase.channel(`presence:site:${id}`, {
      config: { presence: { key: id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length || 1);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: Date.now() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
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
