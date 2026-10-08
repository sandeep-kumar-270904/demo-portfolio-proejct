import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ease } from "@/lib/motion";

/** Stored in localStorage: the intro plays on a visitor's first open only, never on refresh. */
export const ENTRY_SESSION_KEY = "portfolio-entry-first-visit-v4";
export const ENTRY_PHRASES = ["DESIGNING", "DEVELOPING", "WELCOME"];
export const ENTRY_HOLD_MS = [2200, 2200, 2600];
/** Short blank pause between phrases — just enough to separate them without feeling stuck. */
export const ENTRY_GAP_MS = 220;
type Phase = "reveal" | "hold" | "fade" | "gap" | "curtain";

function shouldPlay(pathname: string) {
  if (pathname !== "/") return false;
  try { return localStorage.getItem(ENTRY_SESSION_KEY) !== "1"; }
  catch { return true; }
}

/** The portfolio is mounted only after all three phrases and the final fade finish. */
export default function EntryAnimation({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [playing, setPlaying] = useState(() => shouldPlay(pathname));
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("reveal");

  const finish = () => {
    try { localStorage.setItem(ENTRY_SESSION_KEY, "1"); } catch { /* Storage is optional. */ }
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    // Mark as seen as soon as it starts, so refreshing never replays it.
    try { localStorage.setItem(ENTRY_SESSION_KEY, "1"); } catch { /* Storage is optional. */ }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const skip = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    window.addEventListener("keydown", skip);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", skip);
    };
  }, [playing]);

  // Hold begins only after the reveal completes; a background tab pauses the clock.
  useEffect(() => {
    if (!playing || (phase !== "hold" && phase !== "gap")) return;
    let timer = 0;
    const schedule = () => {
      window.clearTimeout(timer);
      if (document.hidden) return;
      timer = window.setTimeout(() => {
        if (phase === "hold") setPhase("fade");
        else if (step < ENTRY_PHRASES.length - 1) {
          setStep(step + 1);
          setPhase("reveal");
        } else setPhase("curtain");
      }, phase === "hold" ? ENTRY_HOLD_MS[step] : ENTRY_GAP_MS);
    };
    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [playing, phase, step]);

  if (!playing) return <>{children}</>;
  const fading = phase === "fade" || phase === "gap" || phase === "curtain";
  const isWelcome = step === ENTRY_PHRASES.length - 1;
  return (
    <motion.div
      data-testid="portfolio-intro"
      data-phase={phase}
      data-step={step}
      className="entry-screen fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-void px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "curtain" ? 0 : 1 }}
      transition={{ duration: 0.8, ease: ease.brand }}
      onAnimationComplete={() => { if (phase === "curtain") finish(); }}
    >
      <div className="entry-stage text-center">
        <motion.h2
          key={step}
          aria-label={ENTRY_PHRASES[step]}
          className={`entry-phrase font-syne font-extrabold uppercase ${isWelcome ? "text-acid" : "text-ink"}`}
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: fading ? 0 : 1, y: fading ? -20 : 0, filter: fading ? "blur(6px)" : "blur(0px)" }}
          transition={{ duration: fading ? 0.4 : 0.85, ease: ease.brand }}
          onAnimationComplete={() => {
            if (phase === "reveal") setPhase("hold");
            if (phase === "fade") setPhase("gap");
          }}
        >
          {ENTRY_PHRASES[step]}
        </motion.h2>
        {isWelcome && (
          <motion.p
            aria-hidden="true"
            className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-ink-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: 0.7, delay: fading ? 0 : 0.35, ease: ease.brand }}
          >
            to the portfolio of Edhubilli Sandeep Kumar
          </motion.p>
        )}
      </div>
      <div aria-hidden="true" className="absolute bottom-16 flex items-center gap-3">
        {ENTRY_PHRASES.map((phrase, index) => (
          <span key={phrase} className={`entry-step h-px w-10 ${index <= step ? "bg-acid" : "bg-border"}`} />
        ))}
      </div>
    </motion.div>
  );
}
