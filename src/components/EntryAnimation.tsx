import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ease } from "@/lib/motion";

export const ENTRY_SESSION_KEY = "portfolio-entry-sequential-v3";
export const ENTRY_PHRASES = ["DESIGNING", "DEVELOPING", "EDHUBILLI SANDEEP KUMAR"];
export const ENTRY_HOLD_MS = [2400, 2400, 2800];
type Phase = "reveal" | "hold" | "fade" | "gap" | "curtain";

function shouldPlay(pathname: string) {
  if (pathname !== "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try { return sessionStorage.getItem(ENTRY_SESSION_KEY) !== "1"; }
  catch { return true; }
}

/** The page is mounted only after all three phrases and the final fade finish. */
export default function EntryAnimation({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [playing, setPlaying] = useState(() => shouldPlay(pathname));
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("reveal");

  const finish = () => {
    try { sessionStorage.setItem(ENTRY_SESSION_KEY, "1"); } catch { /* Storage is optional. */ }
    setPlaying(false);
  };

  useEffect(() => {
    if (!playing) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const skip = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    const reduce = () => { if (preference.matches) finish(); };
    window.addEventListener("keydown", skip);
    preference.addEventListener("change", reduce);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", skip);
      preference.removeEventListener("change", reduce);
    };
  }, [playing]);

  // Hold begins AFTER the reveal actually completes, not at page-load time.
  // Returning from a background tab gets a fresh readable hold, never a flash.
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
      }, phase === "hold" ? ENTRY_HOLD_MS[step] : 180);
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
  return (
    <motion.div
      data-testid="portfolio-intro"
      data-phase={phase}
      data-step={step}
      className="entry-screen fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-void px-6"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "curtain" ? 0 : 1 }}
      transition={{ duration: 0.75, ease: ease.brand }}
      onAnimationComplete={() => { if (phase === "curtain") finish(); }}
    >
      <div className="entry-stage text-center">
        <motion.h2
          key={step}
          aria-label={ENTRY_PHRASES[step]}
          className={`entry-phrase font-syne font-extrabold uppercase ${step === 2 ? "entry-name text-acid" : "text-ink"}`}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: fading ? 0 : 1, y: fading ? -24 : 0 }}
          transition={{ duration: fading ? 0.65 : 0.95, ease: ease.brand }}
          onAnimationComplete={() => {
            if (phase === "reveal") setPhase("hold");
            if (phase === "fade") setPhase("gap");
          }}
        >
          {step === 2 ? <><span>EDHUBILLI</span>{" "}<span>SANDEEP</span>{" "}<span>KUMAR</span></> : ENTRY_PHRASES[step]}
        </motion.h2>
      </div>
      <div aria-hidden="true" className="absolute bottom-16 flex items-center gap-3">
        {ENTRY_PHRASES.map((phrase, index) => (
          <span key={phrase} className={`entry-step h-px w-10 ${index <= step ? "bg-acid" : "bg-border"}`} />
        ))}
      </div>
    </motion.div>
  );
}
