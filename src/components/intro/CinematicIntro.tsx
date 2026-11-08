import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { CINEMATIC_ACTS } from "./introConfig";
import IntroBackground from "./IntroBackground";
import IntroControls from "./IntroControls";
import KineticActView from "./KineticActView";
import { introSound } from "./IntroSoundEngine";
import { INTRO_TRACK } from "@/config";

export const ENTRY_SESSION_KEY = "portfolio-entry-first-visit-v4";

function shouldPlay(pathname: string): boolean {
  if (pathname !== "/" && pathname !== "") return false;
  // `?skip` explicitly bypasses the intro
  if (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("skip")
  ) {
    return false;
  }
  // By default, visiting the homepage always presents the cinematic introduction first
  return true;
}

export default function CinematicIntro({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [isPlaying, setIsPlaying] = useState(() => shouldPlay(pathname));
  const [currentActIndex, setCurrentActIndex] = useState(0);
  const [isCurtainExit, setIsCurtainExit] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMutedRef = useRef(false);
  const timerRef = useRef<number>(0);

  const finish = () => {
    window.clearTimeout(timerRef.current);
    try {
      localStorage.removeItem(ENTRY_SESSION_KEY);
    } catch {}

    // Cinematic audio fade out
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      const step = audio.volume / 16;
      const fadeTimer = window.setInterval(() => {
        if (audio.volume > step) {
          audio.volume -= step;
        } else {
          audio.volume = 0;
          audio.pause();
          window.clearInterval(fadeTimer);
        }
      }, 50);
    }

    setIsCurtainExit(true);
    setTimeout(() => {
      setIsPlaying(false);
      document.body.style.overflow = "";
    }, 700);
  };

  // Intro music player lifecycle
  useEffect(() => {
    if (!isPlaying || !INTRO_TRACK?.audioUrl) return;

    const audio = new Audio();
    audio.src = encodeURI(decodeURI(INTRO_TRACK.audioUrl));
    audio.preload = "auto";
    audio.volume = 0.85;
    audio.loop = true;
    audioRef.current = audio;

    const tryStartAudio = () => {
      if (userMutedRef.current) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
            introSound.setMuted(false);
          })
          .catch(() => {
            // Autoplay waiting for user gesture
          });
      }
    };

    // Attempt instant autoplay
    tryStartAudio();

    // User gesture handler to unlock audio on first interaction
    const onUserGesture = () => {
      if (audio.paused && !userMutedRef.current) {
        tryStartAudio();
      }
    };

    window.addEventListener("pointerdown", onUserGesture);
    window.addEventListener("keydown", onUserGesture);
    window.addEventListener("touchstart", onUserGesture);
    window.addEventListener("click", onUserGesture);

    return () => {
      window.removeEventListener("pointerdown", onUserGesture);
      window.removeEventListener("keydown", onUserGesture);
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, [isPlaying]);

  const handleToggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused || !isAudioPlaying) {
      userMutedRef.current = false;
      audio.play().then(() => {
        setIsAudioPlaying(true);
        introSound.setMuted(false);
      }).catch(() => {});
    } else {
      userMutedRef.current = true;
      audio.pause();
      setIsAudioPlaying(false);
      introSound.setMuted(true);
    }
  };

  useEffect(() => {
    const handleReplay = () => {
      window.clearTimeout(timerRef.current);
      setCurrentActIndex(0);
      setIsCurtainExit(false);
      setIsPlaying(true);
    };
    window.addEventListener("replay-intro", handleReplay);
    return () => window.removeEventListener("replay-intro", handleReplay);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escape key skips intro
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finish();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timerRef.current);
    };
  }, [isPlaying]);

  // Act timeline sequencer
  useEffect(() => {
    if (!isPlaying || isCurtainExit) return;

    const act = CINEMATIC_ACTS[currentActIndex];
    if (!act) {
      finish();
      return;
    }

    // Trigger act-specific sound
    switch (act.theme) {
      case "attitude":
        introSound.playBassImpact();
        break;
      case "mindset":
        introSound.playGlitch();
        break;
      case "engineering":
        introSound.playRiser();
        break;
      case "creativity":
        introSound.playMetallicImpact();
        break;
      case "identity":
        introSound.playBassImpact();
        setTimeout(() => introSound.playMetallicImpact(), 400);
        break;
    }

    timerRef.current = window.setTimeout(() => {
      if (currentActIndex < CINEMATIC_ACTS.length - 1) {
        setCurrentActIndex((prev) => prev + 1);
      } else {
        finish();
      }
    }, act.durationMs);

    return () => {
      window.clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentActIndex, isCurtainExit]);

  if (!isPlaying) {
    return <>{children}</>;
  }

  const currentAct = CINEMATIC_ACTS[currentActIndex] || CINEMATIC_ACTS[0];

  return (
    <>
      <AnimatePresence>
        {!isCurtainExit && (
          <motion.div
            data-testid="portfolio-intro"
            data-phase="hold"
            data-step={currentActIndex}
            onClick={() => {
              if (audioRef.current?.paused && !userMutedRef.current) {
                audioRef.current.play().then(() => {
                  setIsAudioPlaying(true);
                  introSound.setMuted(false);
                }).catch(() => {});
              }
            }}
            className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#10100F] cursor-pointer"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              filter: "blur(8px)",
              transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            {/* 6-Layer Background Engine */}
            <IntroBackground
              actIndex={currentActIndex}
              ghostWord={currentAct.ghostWord}
            />

            {/* Kinetic Typography Stage with smooth AnimatePresence transitions */}
            <div className="relative z-10 flex min-h-[50vh] w-full max-w-6xl items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <KineticActView key={currentAct.id} act={currentAct} />
              </AnimatePresence>
            </div>

            {/* Interactive HUD / Controls */}
            <IntroControls
              currentAct={currentActIndex}
              totalActs={CINEMATIC_ACTS.length}
              isAudioPlaying={isAudioPlaying}
              trackTitle={INTRO_TRACK ? `${INTRO_TRACK.title} - ${INTRO_TRACK.artist}` : undefined}
              onToggleSound={handleToggleSound}
              onSkip={finish}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Behind the intro, keep children ready so transition is instantaneous */}
      <div
        className={`transition-opacity duration-700 ${
          isCurtainExit ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
