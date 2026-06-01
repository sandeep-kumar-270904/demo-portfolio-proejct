import { SITE } from "@/config";

/**
 * Real "Now Playing" widget — embeds the actual Spotify track via the
 * official iframe player. Replaces the previous fake visualizer.
 */
export default function NowPlaying() {
  const src = `https://open.spotify.com/embed/track/${SITE.spotifyTrackId}?utm_source=generator&theme=0`;
  return (
    <div className="mt-6 w-full max-w-[420px] overflow-hidden rounded-xl border border-soft-2 bg-card">
      <div className="flex items-center justify-between border-b border-soft-2 px-4 py-2">
        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Now Playing · Spotify
        </div>
        <div className="flex h-3 items-end gap-[2px]">
          {[1, 2, 3, 4].map((b) => (
            <span
              key={b}
              className="w-[2px] rounded-sm bg-acid"
              style={{
                animation: `pulse-dot 0.9s ease-in-out ${b * 0.12}s infinite`,
                height: `${30 + b * 18}%`,
              }}
            />
          ))}
        </div>
      </div>
      <iframe
        title="Spotify Now Playing — Tadow"
        src={src}
        width="100%"
        height="80"
        frameBorder={0}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ display: "block", border: 0 }}
      />
    </div>
  );
}
