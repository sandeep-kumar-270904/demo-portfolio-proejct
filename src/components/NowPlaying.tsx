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
  const isChangingRef = useRef(false);
  const bars = [1, 2, 3, 4];

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

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

  const changeTrack = useCallback((direction: number, autoPlay = true) => {
    const list = playlistRef.current;
    if (list.length === 0) return;
    if (isChangingRef.current) return;
    isChangingRef.current = true;

    setCurrentIndex((prevIndex) => {
      // Infinite loop in both directions
      const nextIndex = (prevIndex + direction + list.length) % list.length;
      const track = list[nextIndex];
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.src = resolveAudioUrl(track.audioUrl);
        a.load();
        if (autoPlay) {
          const playPromise = a.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setPlaying(true))
              .catch(() => {
                // If a track fails, automatically skip to next song in the loop
                if (list.length > 1) {
                  setTimeout(() => {
                    isChangingRef.current = false;
                    changeTrack(1, true);
                  }, 800);
                } else {
                  setPlaying(false);
                }
              });
          }
        }
      }
      setTimeout(() => {
        isChangingRef.current = false;
      }, 300);
      return nextIndex;
    });
  }, []);

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
    
    // Auto-advance loop on track end
    const onEnded = () => {
      if (playlistRef.current.length > 1) {
        changeTrack(1, true);
      } else {
        // Continuous loop for single track
        a.currentTime = 0;
        a.play().catch(() => setPlaying(false));
      }
    };

    // If an error happens on current audio, auto-skip to keep loop going
    const onError = () => {
      if (playlistRef.current.length > 1) {
        setTimeout(() => changeTrack(1, true), 1000);
      }
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);

    return () => {
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [changeTrack]);

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
    } catch {
      setPlaying(false);
      // If play failed on current track, advance to next track in loop
      if (playlist.length > 1) {
        changeTrack(1, true);
      }
    }
  };

  const playPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playlist.length <= 1) {
      const a = audioRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
      return;
    }
    changeTrack(-1, true);
  };

  const playNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playlist.length <= 1) {
      const a = audioRef.current;
      if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
      }
      return;
    }
    changeTrack(1, true);
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
