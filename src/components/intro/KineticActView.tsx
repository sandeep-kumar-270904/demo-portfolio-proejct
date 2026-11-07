import { motion } from "framer-motion";
import { StatementAct } from "./introConfig";

interface KineticActViewProps {
  act: StatementAct;
  isFadingOut: boolean;
}

export default function KineticActView({ act, isFadingOut }: KineticActViewProps) {
  switch (act.theme) {
    case "attitude":
      return <ActAttitude act={act} isFadingOut={isFadingOut} />;
    case "mindset":
      return <ActMindset act={act} isFadingOut={isFadingOut} />;
    case "engineering":
      return <ActEngineering act={act} isFadingOut={isFadingOut} />;
    case "creativity":
      return <ActCreativity act={act} isFadingOut={isFadingOut} />;
    case "identity":
      return <ActIdentity act={act} isFadingOut={isFadingOut} />;
    default:
      return null;
  }
}

/** ACT 01: ATTITUDE — "NOT HERE TO FOLLOW. HERE TO BUILD." */
function ActAttitude({ act, isFadingOut }: { act: StatementAct; isFadingOut: boolean }) {
  const wordsPrimary = act.primaryText.split(" ");
  const wordsSecondary = act.secondaryText.split(" ");

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center select-none">
      {/* Top Editorial Label */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: isFadingOut ? 0 : 0.7, y: isFadingOut ? -12 : 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[#C69B45]"
      >
        <span className="h-px w-6 bg-[#C69B45]" />
        <span>MINDSET // DECLARATION</span>
        <span className="h-px w-6 bg-[#C69B45]" />
      </motion.div>

      {/* Primary Statement */}
      <div className="overflow-hidden">
        <h2 className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-['Anton'] text-[clamp(2.8rem,7vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-[#AAA69B]">
          {wordsPrimary.map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: "115%", opacity: 0 }}
              animate={{ y: isFadingOut ? "-60%" : "0%", opacity: isFadingOut ? 0 : 1 }}
              transition={{
                duration: isFadingOut ? 0.35 : 0.7,
                delay: isFadingOut ? 0 : i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h2>
      </div>

      {/* Secondary Bold Impact Statement */}
      <div className="mt-2 overflow-hidden">
        <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-['Anton'] text-[clamp(3.8rem,11vw,10.5rem)] uppercase leading-[0.88] tracking-[-0.03em] text-[#F2EBDD]">
          {wordsSecondary.map((word, i) => {
            const isEmphasis = word.toUpperCase().includes("BUILD");
            return (
              <motion.span
                key={i}
                initial={{ y: "120%", scale: isEmphasis ? 0.8 : 1, opacity: 0 }}
                animate={{
                  y: isFadingOut ? "-70%" : "0%",
                  scale: isFadingOut ? 0.95 : 1,
                  opacity: isFadingOut ? 0 : 1,
                }}
                transition={{
                  duration: isFadingOut ? 0.35 : 0.85,
                  delay: isFadingOut ? 0 : 0.28 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block ${isEmphasis ? "metallic-gold-sweep text-[#E5B747]" : ""}`}
              >
                {word}
              </motion.span>
            );
          })}
        </h1>
      </div>

      {/* Subtle gold line accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFadingOut ? 0 : 1 }}
        transition={{ duration: 0.9, delay: 0.45 }}
        className="mt-6 h-[2px] w-24 bg-gradient-to-r from-transparent via-[#E5B747] to-transparent sm:w-44"
      />
    </div>
  );
}

/** ACT 02: MINDSET — "THINK BEYOND. QUESTION EVERYTHING." */
function ActMindset({ act, isFadingOut }: { act: StatementAct; isFadingOut: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center select-none">
      {/* Editorial Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isFadingOut ? 0 : 0.8, scale: isFadingOut ? 0.9 : 1 }}
        className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#CE4245]"
      >
        [ PERSPECTIVE // SHIFT ]
      </motion.div>

      {/* Primary Statement with horizontal slice */}
      <motion.h2
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: isFadingOut ? 60 : 0, opacity: isFadingOut ? 0 : 1 }}
        transition={{ duration: isFadingOut ? 0.35 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-['Space_Grotesk'] text-[clamp(2.5rem,6.5vw,6rem)] font-bold uppercase tracking-tight text-[#E9E5DC]"
      >
        {act.primaryText}
      </motion.h2>

      {/* Crimson Glitch Accent Statement */}
      <motion.h1
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: isFadingOut ? -60 : 0, opacity: isFadingOut ? 0 : 1 }}
        transition={{ duration: isFadingOut ? 0.35 : 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="glitch-slice mt-2 font-['Anton'] text-[clamp(3.5rem,10.5vw,9.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-[#CE4245]"
        data-text={act.secondaryText}
      >
        {act.secondaryText}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadingOut ? 0 : 0.6 }}
        transition={{ delay: 0.35 }}
        className="mt-6 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-[#AAA69B]"
      >
        Unconventional Architecture // Radical Ownership
      </motion.p>
    </div>
  );
}

/** ACT 03: ENGINEERING — "NOT JUST WRITING CODE. ENGINEERING SOLUTIONS." */
function ActEngineering({ act, isFadingOut }: { act: StatementAct; isFadingOut: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center select-none">
      {/* Tech Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: isFadingOut ? 0 : 0.8, y: isFadingOut ? -8 : 0 }}
        className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#397B78]"
      >
        <span className="inline-block h-1.5 w-1.5 bg-[#397B78]" />
        <span>SYSTEM DESIGN // CORE</span>
        <span className="inline-block h-1.5 w-1.5 bg-[#397B78]" />
      </motion.div>

      {/* Supporting Text */}
      <motion.h3
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: isFadingOut ? -20 : 0, opacity: isFadingOut ? 0 : 0.8 }}
        transition={{ duration: isFadingOut ? 0.3 : 0.7 }}
        className="font-['Oswald'] text-[clamp(1.6rem,4vw,3.5rem)] font-medium uppercase tracking-[0.08em] text-[#777C80]"
      >
        {act.primaryText}
      </motion.h3>

      {/* Dominant Headline */}
      <motion.h1
        initial={{ scale: 0.9, opacity: 0, letterSpacing: "0.08em" }}
        animate={{
          scale: isFadingOut ? 1.05 : 1,
          opacity: isFadingOut ? 0 : 1,
          letterSpacing: isFadingOut ? "0.12em" : "-0.02em",
        }}
        transition={{ duration: isFadingOut ? 0.35 : 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 font-['Anton'] text-[clamp(3.4rem,9.5vw,9rem)] uppercase leading-[0.92] text-[#F2EBDD]"
      >
        <span className="text-[#397B78]">ENGINEERING</span>{" "}
        <span className="text-[#F2EBDD]">SOLUTIONS.</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isFadingOut ? 0 : 0.7, scale: isFadingOut ? 0.9 : 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-center gap-4 rounded-md border border-[#777C80]/20 bg-[#171614]/60 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#AAA69B]"
      >
        <span>DISTRIBUTED SYSTEMS</span>
        <span className="text-[#397B78]">·</span>
        <span>HIGH PERFORMANCE</span>
        <span className="text-[#397B78]">·</span>
        <span>RESILIENT CLOUD</span>
      </motion.div>
    </div>
  );
}

/** ACT 04: CREATIVITY — "LOGIC MEETS IMAGINATION. DESIGN. DEVELOP. CREATE." */
function ActCreativity({ act, isFadingOut }: { act: StatementAct; isFadingOut: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center select-none">
      {/* Editorial Playfair Italic Accent */}
      <motion.span
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: isFadingOut ? 0 : 0.85, y: isFadingOut ? -14 : 0 }}
        transition={{ duration: 0.7 }}
        className="font-['Playfair_Display'] text-[clamp(1.8rem,4vw,3.2rem)] font-normal italic tracking-wide text-[#F2D18A]"
      >
        {act.primaryText}
      </motion.span>

      {/* Triad Words: DESIGN. DEVELOP. CREATE. (Preserves original words!) */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8">
        {["DESIGN.", "DEVELOP.", "CREATE."].map((w, i) => (
          <motion.h1
            key={w}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: isFadingOut ? -30 : 0, opacity: isFadingOut ? 0 : 1 }}
            transition={{
              duration: isFadingOut ? 0.3 : 0.8,
              delay: isFadingOut ? 0 : 0.15 + i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={`font-['Anton'] text-[clamp(2.8rem,8vw,7.5rem)] uppercase leading-none tracking-tight ${
              i === 2 ? "metallic-gold-sweep text-[#E5B747]" : "text-[#F2EBDD]"
            }`}
          >
            {w}
          </motion.h1>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadingOut ? 0 : 0.6 }}
        transition={{ delay: 0.55 }}
        className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-[#AAA69B]"
      >
        {act.subText}
      </motion.p>
    </div>
  );
}

/** ACT 05: IDENTITY — "EDHUBILLI SANDEEP KUMAR // DEVELOPER. BUILDER. CREATOR." */
function ActIdentity({ act, isFadingOut }: { act: StatementAct; isFadingOut: boolean }) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center select-none">
      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: isFadingOut ? 0 : 1, scale: isFadingOut ? 0.85 : 1 }}
        transition={{ duration: 0.7 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C69B45]/40 bg-[#171614]/80 px-4 py-1 backdrop-blur-md"
      >
        <span className="h-2 w-2 rounded-full bg-[#E5B747] shadow-[0_0_8px_#E5B747]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F2EBDD]">
          FULL STACK ARCHITECT // PORTFOLIO
        </span>
      </motion.div>

      {/* The Master Name Reveal */}
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: "115%", opacity: 0 }}
          animate={{ y: isFadingOut ? "-50%" : "0%", opacity: isFadingOut ? 0 : 1 }}
          transition={{ duration: isFadingOut ? 0.4 : 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="metallic-gold-sweep font-['Anton'] text-[clamp(3.6rem,11.5vw,10.5rem)] uppercase leading-[0.88] tracking-[-0.04em] text-[#E5B747]"
          style={{
            textShadow: "0 10px 40px rgba(198, 155, 69, 0.25)",
          }}
        >
          {act.primaryText}
        </motion.h1>
      </div>

      {/* Subtitle Identity */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: isFadingOut ? 0 : 0.9, y: isFadingOut ? -16 : 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 font-['Space_Grotesk'] text-[clamp(1rem,2.8vw,1.8rem)] font-medium uppercase tracking-[0.28em] text-[#F2EBDD]"
      >
        {act.secondaryText}
      </motion.p>

      {/* Welcome Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isFadingOut ? 0 : 1, y: isFadingOut ? -20 : 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex items-center gap-3"
      >
        <span className="h-px w-10 bg-[#C69B45]/50 sm:w-20" />
        <span className="rounded bg-[#C69B45]/15 px-3 py-1 font-mono text-xs uppercase tracking-[0.25em] text-[#E5B747]">
          {act.subText}
        </span>
        <span className="h-px w-10 bg-[#C69B45]/50 sm:w-20" />
      </motion.div>
    </div>
  );
}
