import { useEffect, useRef, useState } from "react";
import { Music2, Play, Pause } from "lucide-react";
import { SITE } from "@/config";
import { toast } from "sonner";

/**
 * "Now Playing" widget — original compact UI, but clicking it actually
 * plays the song from a local file (place an mp3 at /public/audio/tadow.mp3).
 * Falls back to a toast if the file isn't available.
 */
export default function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const bars = [1, 2, 3, 4];

  useEffect(() => {
    const a = new Audio("/audio/tadow.mp3");
    a.preload = "none";
    a.loop = true;
    a.volume = 0.7;
    a.addEventListener("play", () => setPlaying(true));
    a.addEventListener("pause", () => setPlaying(false));
    a.addEventListener("ended", () => setPlaying(false));
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) {
        await a.play();
      } else {
        a.pause();
      }
    } catch {
      toast.error("Drop tadow.mp3 in /public/audio/ to enable playback.");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause Tadow" : "Play Tadow"}
      className="group mt-6 inline-flex items-center gap-3 rounded-xl border border-soft-2 bg-card px-4 py-3 text-left transition-all hover:border-acid/50 hover:bg-acid/5"
    >
      <div className="relative grid h-9 w-9 place-items-center rounded-lg bg-acid/10 text-acid">
        {playing ? <Pause size={16} /> : <Music2 size={16} />}
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </span>
      </div>
      <div className="min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {playing ? "Now Playing" : "Click to Play"}
        </div>
        <div className="font-syne text-[13px] font-bold text-ink truncate">
          {SITE.nowPlaying.title}{" "}
          <span className="text-ink-2 font-medium">— {SITE.nowPlaying.artist}</span>
        </div>
      </div>
      <div className="ml-2 flex h-5 items-end gap-[2px]">
        {bars.map((b) => (
          <span
            key={b}
            className="w-[3px] rounded-sm bg-acid"
            style={{
              animation: playing
                ? `pulse-dot 0.9s ease-in-out ${b * 0.12}s infinite`
                : "none",
              height: playing ? `${30 + b * 15}%` : "30%",
              opacity: playing ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </button>
  );
}
