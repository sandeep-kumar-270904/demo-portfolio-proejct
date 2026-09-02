import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic portfolio entry.
 * DESIGNING → DEVELOPING → DELIVERING → EDHUBILLI SANDEEP KUMAR → reveal site.
 * Plays once per load. Skippable on key/click. Never loops.
 */
const PHASES = ["DESIGNING.", "DEVELOPING.", "DELIVERING."];
const WORD_MS = 1100;
const NAME_MS = 1800;

const FULL_NAME = "EDHUBILLI SANDEEP KUMAR";
const FALLBACK = "WELCOME";

// Module-level flag: plays once per full page load (survives route changes,
// replays on refresh so the intro is never "lost" to a stale session flag).
let hasPlayed = false;

export default function EntryAnimation() {
  const [show, setShow] = useState(() => !hasPlayed);

  const [phase, setPhase] = useState(0); // 0..2 = words, 3 = name
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

    const timers: number[] = [];
    PHASES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setPhase(i), i * WORD_MS));
    });
    timers.push(window.setTimeout(() => setPhase(3), PHASES.length * WORD_MS));
    timers.push(
      window.setTimeout(() => {
        document.body.style.overflow = "";
        setShow(false);
      }, PHASES.length * WORD_MS + NAME_MS)
    );

    const skip = () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
      setShow(false);
    };
    // Attach skip listeners slightly later so a stray click that triggered the
    // page load doesn't instantly dismiss the intro.
    const attach = window.setTimeout(() => {
      window.addEventListener("keydown", skip);
      window.addEventListener("click", skip);
    }, 600);
    timers.push(attach);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ease = [0.22, 1, 0.36, 1] as const;

  // Pick a display that always fits cleanly.
  // - Wide screens: full name on one line.
  // - Mid screens: full name stacked (EDHUBILLI / SANDEEP KUMAR).
  // - Narrow screens: safe fallback ("WELCOME") so nothing clips.
  // Conservative breakpoints so the full name never clips within the padded container.
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
      ? "clamp(40px, 5.6vw, 92px)"
      : layout === "stacked"
      ? "clamp(36px, 9vw, 78px)"
      : "clamp(48px, 15vw, 104px)";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="entry"
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-void px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease } }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(var(--acid)/0.18) 0%, transparent 55%)",
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ scale: 1, opacity: 0 }}
            animate={phase >= 3 ? { scale: 1.15, opacity: 0.7 } : { opacity: 0.4 }}
            transition={{ duration: 2.4, ease }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(var(--acid)/0.10) 0%, transparent 60%)",
            }}
          />

          {/* Word sequence */}
          <AnimatePresence mode="wait">
            {phase < 3 && (
              <motion.h2
                key={PHASES[phase]}
                className="relative font-syne font-extrabold uppercase text-ink"
                style={{
                  fontSize: "clamp(40px, 7vw, 96px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
                initial={{ opacity: 0, filter: "blur(16px)", y: 10 }}
                animate={{
                  opacity: 1,
                  filter: "blur(0px)",
                  y: 0,
                  transition: { duration: 0.38, ease },
                }}
                exit={{
                  opacity: 0,
                  filter: "blur(12px)",
                  y: -8,
                  transition: { duration: 0.28, ease },
                }}
              >
                {PHASES[phase]}
              </motion.h2>
            )}
          </AnimatePresence>

          {/* Final name (or safe fallback) — settles and stays until dismiss */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                key="name"
                className="relative flex w-full max-w-[1400px] flex-col items-center text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
              >
                {displayLines.map((line, i) => (
                  <span
                    key={line}
                    className="block overflow-hidden pb-[0.12em]"
                    style={{ lineHeight: 1 }}
                  >
                    <motion.span
                      className="inline-block font-syne font-extrabold uppercase text-ink whitespace-nowrap"
                      style={{
                        fontSize: nameFontSize,
                        letterSpacing: "-0.045em",
                        lineHeight: 1,
                      }}
                      initial={{ y: "110%", filter: "blur(16px)" }}
                      animate={{ y: "0%", filter: "blur(0px)" }}
                      transition={{ delay: 0.05 + i * 0.14, duration: 1.0, ease }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}

                <motion.div
                  className="mt-7 h-[2px] origin-left bg-acid glow-acid-sm"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.55, duration: 1.0, ease }}
                  style={{ width: 280 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

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
