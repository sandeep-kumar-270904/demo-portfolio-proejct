import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SITE } from "@/config";

const SESSION_KEY = "entry_played_v2";

/**
 * Linear-style cinematic first-load reveal. The full name slides up in
 * masked word-blocks with a delicate accent bar, then fades into the page.
 * Plays once per browser session, skippable on click / keypress.
 */
export default function EntryAnimation() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) !== "1";
  });

  useEffect(() => {
    if (!show) return;
    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(false);
    };
    const t = setTimeout(finish, 2800);
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
      document.body.style.overflow = "";
    };
  }, [show]);

  const words = SITE.name.split(" ");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="entry"
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -40,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Subtle dot field */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--acid)/0.18) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Top-left eyebrow */}
          <motion.div
            className="absolute left-8 top-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-acid"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="h-px w-6 bg-acid" />
            Portfolio · 2026
          </motion.div>

          {/* Name reveal — Linear style */}
          <div className="relative flex flex-wrap items-baseline justify-center gap-x-[0.35em] gap-y-2 px-6 text-center">
            {words.map((word, wi) => (
              <span
                key={wi}
                className="relative inline-block overflow-hidden pb-[0.15em]"
              >
                <motion.span
                  className="inline-block font-syne font-extrabold uppercase text-ink"
                  style={{
                    fontSize: "clamp(34px, 7vw, 92px)",
                    letterSpacing: "-0.045em",
                    lineHeight: 1,
                  }}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    delay: 0.15 + wi * 0.12,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </div>

          {/* Accent line */}
          <motion.div
            className="relative mt-10 h-[2px] w-[260px] origin-left bg-acid glow-acid-sm"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: 0.15 + words.length * 0.12 + 0.2,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* Footer hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Press any key to enter
          </motion.div>

          {/* Sweep cover that wipes off on exit */}
          <motion.div
            className="pointer-events-none absolute inset-0 origin-bottom bg-acid"
            initial={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
