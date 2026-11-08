import { useEffect, useState, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { CINEMATIC_ACTS } from "./introConfig";
import IntroBackground from "./IntroBackground";
import IntroControls from "./IntroControls";
import KineticActView from "./KineticActView";
import { introSound } from "./IntroSoundEngine";

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
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isCurtainExit, setIsCurtainExit] = useState(false);
  const timerRef = useRef<number>(0);

  const finish = () => {
    window.clearTimeout(timerRef.current);
    try {
      localStorage.removeItem(ENTRY_SESSION_KEY);
    } catch {}
    setIsCurtainExit(true);
    setTimeout(() => {
      setIsPlaying(false);
      document.body.style.overflow = "";
    }, 700);
  };

  useEffect(() => {
    const handleReplay = () => {
      window.clearTimeout(timerRef.current);
      setCurrentActIndex(0);
      setIsFadingOut(false);
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

    setIsFadingOut(false);

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

    const holdDuration = act.durationMs;
    const fadeOutLeadTime = 380; // Lead time for kinetic exit animation

    // Schedule fade-out
    timerRef.current = window.setTimeout(() => {
      setIsFadingOut(true);

      // Advance to next act
      timerRef.current = window.setTimeout(() => {
        if (currentActIndex < CINEMATIC_ACTS.length - 1) {
          setCurrentActIndex((prev) => prev + 1);
        } else {
          // Final act complete -> transition to homepage
          finish();
        }
      }, fadeOutLeadTime);
    }, holdDuration - fadeOutLeadTime);

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
            data-phase={isFadingOut ? "fade" : "hold"}
            data-step={currentActIndex}
            className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-[#10100F]"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.04,
              filter: "blur(6px)",
              transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            {/* 6-Layer Background Engine */}
            <IntroBackground
              actIndex={currentActIndex}
              ghostWord={currentAct.ghostWord}
            />

            {/* Kinetic Typography Stage */}
            <KineticActView act={currentAct} isFadingOut={isFadingOut} />

            {/* Interactive HUD / Controls */}
            <IntroControls
              currentAct={currentActIndex}
              totalActs={CINEMATIC_ACTS.length}
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
