import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic portfolio entry.
 *
 * Sequence (strictly one after another, never overlapping):
 *   DESIGNING. → DEVELOPING. → DELIVERING. → WELCOME TO MY PORTFOLIO
 *   → EDHUBILLI SANDEEP KUMAR → curtain lifts, site revealed.
 *
 * Each step animates in letter-by-letter, holds long enough to read,
 * then animates out before the next step mounts. Plays once per page load.
 */

const WORDS = ["DESIGNING.", "DEVELOPING.", "DELIVERING."];
const WELCOME = "WELCOME TO MY PORTFOLIO";
const FULL_NAME = "EDHUBILLI SANDEEP KUMAR";
const FALLBACK = "SANDEEP";

// How long each step stays on screen (in + hold + out), in ms.
const WORD_STEP_MS = 1500;
const WELCOME_STEP_MS = 1900;
const NAME_STEP_MS = 2600;

const EASE = [0.22, 1, 0.36, 1] as const;

// Module-level flag: plays once per full page load (survives route changes,
// replays on refresh so the intro is never "lost" to a stale session flag).
let hasPlayed = false;

/** Letter-by-letter reveal with a matching staggered exit. */
function StaggerText({
  text,
  className,
  style,
  charDelay = 0.035,
  baseDelay = 0,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  charDelay?: number;
  baseDelay?: number;
}) {
  const chars = Array.from(text);
  return (
    <span className={className} style={style} aria-label={text}>
      {chars.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ lineHeight: 1 }}
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "115%", opacity: 0 }}
            animate={{
              y: "0%",
              opacity: 1,
              transition: { duration: 0.55, ease: EASE, delay: baseDelay + i * charDelay },
            }}
            exit={{
              y: "-115%",
              opacity: 0,
              transition: { duration: 0.34, ease: EASE, delay: i * (charDelay * 0.55) },
            }}
          >
            {c === " " ? "\u00A0" : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function EntryAnimation() {
  const [show, setShow] = useState(() => !hasPlayed);
  // 0,1,2 = words · 3 = welcome line · 4 = name
  const [step, setStep] = useState(0);
  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!show) return;
    // Mark as played immediately so route changes within this load skip it.
    hasPlayed = true;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShow(false);
      return;
    }
    document.body.style.overflow = "hidden";

    // Cumulative schedule so every step gets its full, uninterrupted slot.
    const slots = [
      WORD_STEP_MS,
      WORD_STEP_MS,
      WORD_STEP_MS,
      WELCOME_STEP_MS,
      NAME_STEP_MS,
    ];
    const timers: number[] = [];
    let t = 0;
    slots.forEach((ms, i) => {
      if (i > 0) timers.push(window.setTimeout(() => setStep(i), t));
      t += ms;
    });
    timers.push(
      window.setTimeout(() => {
        document.body.style.overflow = "";
        setShow(false);
      }, t)
    );

    const skip = () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
      setShow(false);
    };
    // Keyboard-only skip prevents the page-opening click/tap from silently
    // dismissing the sequence before it becomes readable.
    window.addEventListener("keydown", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pick a name layout that always fits cleanly.
  const layout: "single" | "stacked" | "fallback" =
    vw >= 1120 ? "single" : vw >= 520 ? "stacked" : "fallback";

  const displayLines: string[] =
    layout === "single"
      ? [FULL_NAME]
      : layout === "stacked"
      ? ["EDHUBILLI", "SANDEEP KUMAR"]
      : [FALLBACK];

  const nameFontSize =
    layout === "single"
      ? "clamp(40px, 5.2vw, 88px)"
      : layout === "stacked"
      ? "clamp(34px, 8.4vw, 74px)"
      : "clamp(44px, 14vw, 96px)";

  const totalMs = WORD_STEP_MS * 3 + WELCOME_STEP_MS + NAME_STEP_MS;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="entry"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-void px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.85, ease: EASE } }}
        >
          {/* Ambient glow */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(var(--acid)/0.16) 0%, transparent 55%)",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ scale: 1, opacity: 0.3 }}
            animate={step >= 4 ? { scale: 1.15, opacity: 0.75 } : { scale: 1, opacity: 0.35 }}
            transition={{ duration: 2.2, ease: EASE }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(var(--acid)/0.10) 0%, transparent 60%)",
            }}
          />

          {/* Step content — mode="wait" guarantees no two steps overlap */}
          <div className="relative flex min-h-[1.2em] w-full max-w-[1400px] items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {step < 3 && (
                <motion.h2
                  key={`w-${step}`}
                  className="font-syne font-extrabold uppercase text-ink"
                  style={{ fontSize: "clamp(28px, 8.2vw, 96px)", lineHeight: 1 }}
                >
                  <StaggerText text={WORDS[step]} charDelay={0.038} />
                </motion.h2>
              )}

              {step === 3 && (
                <motion.h2
                  key="welcome"
                  className="font-syne font-extrabold uppercase text-grad-acid"
                  style={{
                    fontSize: "clamp(22px, 5.2vw, 62px)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  <StaggerText text={WELCOME} charDelay={0.022} />
                </motion.h2>
              )}

              {step === 4 && (
                <motion.div
                  key="name"
                  className="flex w-full flex-col items-center"
                  exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
                >
                  {displayLines.map((line, i) => (
                    <span
                      key={line}
                      className="block overflow-hidden pb-[0.12em]"
                      style={{ lineHeight: 1 }}
                    >
                      <motion.span
                        className="inline-block whitespace-nowrap font-syne font-extrabold uppercase text-ink"
                        style={{
                          fontSize: nameFontSize,
                          letterSpacing: "-0.04em",
                          lineHeight: 1,
                        }}
                        initial={{ y: "112%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        transition={{ delay: 0.06 + i * 0.14, duration: 0.95, ease: EASE }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}

                  <motion.div
                    className="mt-7 h-[2px] origin-left bg-acid glow-acid-sm"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 1.0, ease: EASE }}
                    style={{ width: 280 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress bar for the whole sequence */}
          <motion.div
            className="absolute bottom-[74px] left-1/2 h-[2px] w-[180px] -translate-x-1/2 overflow-hidden rounded-full bg-ink/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="h-full w-full origin-left bg-acid"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: totalMs / 1000, ease: "linear" }}
            />
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Press any key to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
