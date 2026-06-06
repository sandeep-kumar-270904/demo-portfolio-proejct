import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Cinematic portfolio entry.
 * DESIGNING → DEVELOPING → DELIVERING → SANJU SANDY → reveal site.
 * Plays on every load. Skippable on key/click.
 */
const PHASES = ["DESIGNING.", "DEVELOPING.", "DELIVERING."];
const WORD_MS = 1200;
const NAME_MS = 2200;

export default function EntryAnimation() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0); // 0..2 = words, 3 = name, 4 = exit

  useEffect(() => {
    if (!show) return;
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
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ease = [0.22, 1, 0.36, 1] as const;
  const nameWords = ["EDHUBILLI", "SANDEEP", "KUMAR"];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="entry"
          className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-void"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease } }}
        >
          {/* Center glow — subtly shifts during the name hold */}
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
                initial={{ opacity: 0, filter: "blur(18px)", y: 8 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(14px)", y: -6 }}
                transition={{ duration: 0.85, ease }}
              >
                {PHASES[phase]}
              </motion.h2>
            )}
          </AnimatePresence>

          {/* Name reveal */}
          <AnimatePresence>
            {phase >= 3 && (
              <motion.div
                key="name"
                className="relative flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6, ease } }}
              >
                <div className="flex items-baseline gap-x-[0.35em] overflow-hidden">
                  {nameWords.map((w, i) => (
                    <span key={w} className="inline-block overflow-hidden pb-[0.1em]">
                      <motion.span
                        className="inline-block font-syne font-extrabold uppercase text-ink"
                        style={{
                          fontSize: "clamp(44px, 9vw, 128px)",
                          letterSpacing: "-0.05em",
                          lineHeight: 1,
                        }}
                        initial={{ y: "110%", filter: "blur(16px)" }}
                        animate={{ y: "0%", filter: "blur(0px)" }}
                        transition={{ delay: 0.05 + i * 0.12, duration: 1.0, ease }}
                      >
                        {w}
                      </motion.span>
                    </span>
                  ))}
                </div>

                {/* Drawing underline */}
                <motion.div
                  className="mt-7 h-[2px] origin-left bg-acid glow-acid-sm"
                  initial={{ scaleX: 0, width: 280 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.55, duration: 1.0, ease }}
                  style={{ width: 280 }}
                />

                {/* Supporting text */}
                <motion.div
                  className="mt-6 font-mono text-[11px] uppercase tracking-[0.4em] text-ink-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95, duration: 0.8, ease }}
                >
                  Designer · Developer · Builder
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer hint */}
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
