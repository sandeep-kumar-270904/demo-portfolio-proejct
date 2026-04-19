import { useEffect, useState } from "react";

const SESSION_KEY = "entry_played";
const FULL_TEXT = "Welcome to my portfolio";

/**
 * Cinematic first-load entry. Plays once per browser session.
 * Skippable on any keypress or click. After playback, sets a sessionStorage
 * flag so subsequent route changes / reloads in the same tab session don't
 * replay it.
 */
export default function EntryAnimation() {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem(SESSION_KEY) === "1";
  });
  const [fading, setFading] = useState(false);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (hidden) return;

    let i = 0;
    const typer = setInterval(() => {
      i++;
      setTyped(FULL_TEXT.slice(0, i));
      if (i >= FULL_TEXT.length) clearInterval(typer);
    }, 55);

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setFading(true);
      setTimeout(() => setHidden(true), 400);
    };

    const skip = () => {
      setTyped(FULL_TEXT);
      finish();
    };

    const t1 = setTimeout(finish, 2400);

    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);

    return () => {
      clearInterval(typer);
      clearTimeout(t1);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void transition-all duration-500 ${
        fading ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
      }`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--acid)/0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative flex items-baseline">
        <span className="font-syne text-[clamp(28px,5vw,56px)] font-extrabold tracking-tight text-ink">
          {typed.split("").map((ch, i) => (
            <span
              key={i}
              className="inline-block animate-fade-up"
              style={{ animationDelay: `${i * 30}ms`, animationDuration: "400ms" }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
        <span className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-1 bg-acid animate-blink glow-acid-sm" />
      </div>

      <div className="relative mt-10 h-[2px] w-[220px] overflow-hidden bg-ink/5">
        <div className="h-full origin-left bg-acid animate-line-grow glow-acid-sm" />
      </div>

      <div className="relative mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Press any key to skip
      </div>
    </div>
  );
}
