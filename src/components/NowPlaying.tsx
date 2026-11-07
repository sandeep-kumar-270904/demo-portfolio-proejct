import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { SITE, SongTrack } from "@/config";

/**
 * "Now Playing" music player widget.
 * Features an infinite loop playlist with previous, play/pause, and next controls.
 * Seamlessly loops and auto-advances across all songs in SITE.playlist (src/config.ts).
 */
export default function NowPlaying() {
  const playlist: SongTrack[] =
    SITE.playlist && SITE.playlist.length > 0
      ? SITE.playlist
      : [SITE.nowPlaying];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<SongTrack[]>(playlist);
  const currentIndexRef = useRef(0);
  const bars = [1, 2, 3, 4];

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const resolveAudioUrl = (url?: string) => {
    const path = (url || "/audio/tadow.mp3").trim();
    if (
      typeof window !== "undefined" &&
      path.startsWith("/__l5e/") &&
      !/lovable\.app$/i.test(window.location.hostname)
    ) {
      return `https://sandeep-kumar-edhubilli-portfolio.lovable.app${path}`;
    }
    return encodeURI(decodeURI(path));
  };

  const playTrackAtIndex = useCallback((index: number) => {
    const list = playlistRef.current;
    if (list.length === 0) return;
    const safeIndex = (index + list.length) % list.length;
    const track = list[safeIndex];
    const a = audioRef.current;

    setCurrentIndex(safeIndex);
    currentIndexRef.current = safeIndex;

    if (!a) return;

    try {
      a.pause();
      const targetSrc = resolveAudioUrl(track.audioUrl);
      a.src = targetSrc;
      a.load();
      const promise = a.play();
      if (promise !== undefined) {
        promise
          .then(() => setPlaying(true))
          .catch((err) => {
            console.warn(`Could not play "${track.title}":`, err);
          });
      }
    } catch (err) {
      console.warn("Audio playback error:", err);
    }
  }, []);

  const playNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const list = playlistRef.current;
      if (list.length <= 1) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
        return;
      }
      const next = (currentIndexRef.current + 1) % list.length;
      playTrackAtIndex(next);
    },
    [playTrackAtIndex]
  );

  const playPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      const list = playlistRef.current;
      if (list.length <= 1) {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
        return;
      }
      const prev = (currentIndexRef.current - 1 + list.length) % list.length;
      playTrackAtIndex(prev);
    },
    [playTrackAtIndex]
  );

  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    a.volume = 0.7;
    const initialTrack = playlistRef.current[0];
    if (initialTrack) {
      a.src = resolveAudioUrl(initialTrack.audioUrl);
    }
    audioRef.current = a;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    // Continuous loop on track end
    const onEnded = () => {
      const list = playlistRef.current;
      if (list.length > 1) {
        const next = (currentIndexRef.current + 1) % list.length;
        playTrackAtIndex(next);
      } else {
        a.currentTime = 0;
        a.play().catch(() => setPlaying(false));
      }
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);

    return () => {
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [playTrackAtIndex]);

  const togglePlay = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const a = audioRef.current;
    if (!a) return;
    const track = playlist[currentIndex] || playlist[0];
    try {
      if (a.paused) {
        const targetSrc = resolveAudioUrl(track.audioUrl);
        const resolvedHref = new URL(targetSrc, window.location.href).href;
        if (!a.src || a.src !== resolvedHref) {
          a.src = targetSrc;
          a.load();
        }
        await a.play();
      } else {
        a.pause();
      }
    } catch (err) {
      console.warn("Toggle play error:", err);
    }
  };

  const currentTrack = playlist[currentIndex] || playlist[0];

  return (
    <div
      className="group mt-6 inline-flex items-center gap-3 rounded-xl border border-soft-2 bg-card px-3.5 py-2.5 text-left transition-all hover:border-acid/50 hover:bg-acid/5 select-none"
    >
      {/* Controls cluster: Prev, Play/Pause, Next */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={playPrev}
          aria-label="Previous track"
          title="Previous track"
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-2 transition-all hover:bg-acid/10 hover:text-acid active:scale-95"
        >
          <SkipBack size={13} />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? `Pause ${currentTrack.title}` : `Play ${currentTrack.title}`}
          title={playing ? "Pause" : "Play"}
          className="relative grid h-8 w-8 place-items-center rounded-lg bg-acid/10 text-acid transition-all hover:bg-acid/20 hover:scale-105 active:scale-95"
        >
          {playing ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>

        <button
          type="button"
          onClick={playNext}
          aria-label="Next track"
          title="Next track"
          className="grid h-7 w-7 place-items-center rounded-lg text-ink-2 transition-all hover:bg-acid/10 hover:text-acid active:scale-95"
        >
          <SkipForward size={13} />
        </button>
      </div>

      {/* Track info (click to toggle play/pause) */}
      <div
        onClick={togglePlay}
        className="min-w-0 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            togglePlay();
          }
        }}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            {playing ? "Now Playing" : "Click to Play"}
          </span>
          {playlist.length > 1 && (
            <span className="rounded bg-acid/10 px-1.5 py-0.5 font-mono text-[9px] font-medium text-acid">
              {currentIndex + 1}/{playlist.length}
            </span>
          )}
        </div>
        <div
          className="font-syne text-[13px] font-bold text-ink truncate max-w-[170px] sm:max-w-[230px]"
          title={`${currentTrack.title} — ${currentTrack.artist}`}
        >
          {currentTrack.title}{" "}
          <span className="text-ink-2 font-medium">— {currentTrack.artist}</span>
        </div>
      </div>

      {/* Equalizer animation */}
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
    </div>
  );
}
