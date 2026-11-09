import { motion } from "framer-motion";
import { StatementAct } from "./introConfig";
import CalligraphyFlourish from "./handwriting/CalligraphyFlourish";

const CINEMATIC_EASE = [0.16, 1, 0.3, 1];
const SILKY_EASE = [0.22, 1, 0.36, 1];

interface KineticActViewProps {
  act: StatementAct;
  isFadingOut?: boolean;
}

/**
 * Reusable Masked Word Component
 * Clips each word inside an overflow-hidden wrapper and reveals with a fluid optical blur
 * and liquid quintic easing, inspired by high-end cinematic lyric videos.
 */
function MaskedWord({
  word,
  className = "",
  delay = 0,
  duration = 0.85,
  isHero = false,
}: {
  word: string;
  className?: string;
  delay?: number;
  duration?: number;
  isHero?: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden py-1">
      <motion.span
        className={`inline-block will-change-transform ${className}`}
        initial={{
          y: "125%",
          opacity: 0,
          filter: "blur(12px)",
          scale: isHero ? 0.94 : 1,
        }}
        animate={{
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
        }}
        transition={{
          duration,
          delay,
          ease: CINEMATIC_EASE,
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/**
 * Master Act View with AnimatePresence mode="wait" support
 */
export default function KineticActView({ act }: KineticActViewProps) {
  const containerVariants = {
    initial: {
      opacity: 0,
      y: 28,
      scale: 0.98,
      filter: "blur(14px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.85,
        ease: CINEMATIC_EASE,
      },
    },
    exit: {
      opacity: 0,
      y: -24,
      scale: 1.02,
      filter: "blur(14px)",
      transition: {
        duration: 0.5,
        ease: SILKY_EASE,
      },
    },
  };

  return (
    <motion.div
      key={act.id}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 flex w-full flex-col items-center justify-center px-4 text-center select-none"
    >
      {renderActContent(act)}
    </motion.div>
  );
}

function renderActContent(act: StatementAct) {
  switch (act.theme) {
    case "attitude":
      return <ActAttitude act={act} />;
    case "mindset":
      return <ActMindset act={act} />;
    case "engineering":
      return <ActEngineering act={act} />;
    case "creativity":
      return <ActCreativity act={act} />;
    case "identity":
      return <ActIdentity act={act} />;
    default:
      return null;
  }
}

/** ACT 01: ATTITUDE — "NOT HERE TO FOLLOW. HERE TO BUILD." */
function ActAttitude({ act }: { act: StatementAct }) {
  const wordsPrimary = act.primaryText.split(" ");
  const wordsSecondary = act.secondaryText.split(" ");

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Top Editorial Label */}
      <motion.div
        initial={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[#C69B45]"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
          className="h-px w-8 bg-gradient-to-r from-transparent to-[#C69B45]"
        />
        <span>MINDSET // DECLARATION</span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
          className="h-px w-8 bg-gradient-to-l from-transparent to-[#C69B45]"
        />
      </motion.div>

      {/* Primary Statement */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-4">
        {wordsPrimary.map((word, i) => (
          <MaskedWord
            key={i}
            word={word}
            delay={i * 0.08}
            className="font-['Anton'] text-[clamp(2.5rem,7vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-[#AAA69B]"
          />
        ))}
      </div>

      {/* Secondary Bold Impact Statement */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-5">
        {wordsSecondary.map((word, i) => {
          const isEmphasis = word.toUpperCase().includes("BUILD");
          return (
            <MaskedWord
              key={i}
              word={word}
              delay={0.25 + i * 0.12}
              isHero={isEmphasis}
              className={`font-['Anton'] text-[clamp(3.8rem,11.5vw,10.5rem)] uppercase leading-[0.88] tracking-[-0.03em] ${
                isEmphasis
                  ? "metallic-gold-sweep text-[#E5B747] drop-shadow-[0_10px_35px_rgba(229,183,71,0.3)]"
                  : "text-[#F2EBDD]"
              }`}
            />
          );
        })}
      </div>

      {/* Physically drawn calligraphy flourish */}
      <CalligraphyFlourish delay={0.65} width={260} height={36} className="mt-2" />
    </div>
  );
}

/** ACT 02: MINDSET — "THINK BEYOND. QUESTION EVERYTHING." */
function ActMindset({ act }: { act: StatementAct }) {
  const wordsPrimary = act.primaryText.split(" ");
  const wordsSecondary = act.secondaryText.split(" ");

  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Editorial Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
        animate={{ opacity: 0.9, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#CE4245]"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#CE4245]" />
        <span>[ PERSPECTIVE // SHIFT ]</span>
      </motion.div>

      {/* Primary Statement */}
      <div className="flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
        {wordsPrimary.map((word, i) => {
          const isEmphasis = word.toUpperCase().includes("BEYOND");
          return (
            <MaskedWord
              key={i}
              word={word}
              delay={i * 0.1}
              className={`font-['Space_Grotesk'] text-[clamp(2.5rem,6.8vw,6rem)] font-bold uppercase tracking-tight ${
                isEmphasis ? "text-[#F2D18A] drop-shadow-[0_0_25px_rgba(242,209,138,0.35)]" : "text-[#E9E5DC]"
              }`}
            />
          );
        })}
      </div>

      {/* Crimson Accent Statement */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 sm:gap-x-5">
        {wordsSecondary.map((word, i) => (
          <MaskedWord
            key={i}
            word={word}
            delay={0.25 + i * 0.12}
            isHero={true}
            className="glitch-slice font-['Anton'] text-[clamp(3.6rem,11vw,9.5rem)] uppercase leading-[0.9] tracking-[-0.02em] text-[#CE4245] drop-shadow-[0_8px_30px_rgba(206,66,69,0.3)]"
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 0.75, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.45, duration: 0.8, ease: CINEMATIC_EASE }}
        className="mt-6 max-w-md font-mono text-xs uppercase tracking-[0.24em] text-[#AAA69B]"
      >
        Unconventional Architecture // Radical Ownership
      </motion.p>
    </div>
  );
}

/** ACT 03: ENGINEERING — "NOT JUST WRITING CODE. ENGINEERING SOLUTIONS." */
function ActEngineering({ act }: { act: StatementAct }) {
  const wordsPrimary = act.primaryText.split(" ");
  const wordsSecondary = act.secondaryText.split(" ");

  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Tech Header */}
      <motion.div
        initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
        animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: CINEMATIC_EASE }}
        className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[#397B78]"
      >
        <span className="inline-block h-1.5 w-1.5 bg-[#397B78]" />
        <span>SYSTEM DESIGN // CORE PROTOCOL</span>
        <span className="inline-block h-1.5 w-1.5 bg-[#397B78]" />
      </motion.div>

      {/* Supporting Text */}
      <div className="flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3.5">
        {wordsPrimary.map((word, i) => (
          <MaskedWord
            key={i}
            word={word}
            delay={i * 0.07}
            className="font-['Oswald'] text-[clamp(1.6rem,4vw,3.5rem)] font-medium uppercase tracking-[0.06em] text-[#827D74]"
          />
        ))}
      </div>

      {/* Dominant Headline */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 sm:gap-x-5">
        {wordsSecondary.map((word, i) => {
          const isEngineering = word.toUpperCase().includes("ENGINEER");
          return (
            <MaskedWord
              key={i}
              word={word}
              delay={0.24 + i * 0.12}
              isHero={true}
              className={`font-['Anton'] text-[clamp(3.5rem,10vw,9.2rem)] uppercase leading-[0.92] ${
                isEngineering
                  ? "text-[#397B78] drop-shadow-[0_0_30px_rgba(57,123,120,0.4)]"
                  : "text-[#F2EBDD]"
              }`}
            />
          );
        })}
      </div>

      {/* Telemetry chips */}
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 0.8, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.45, duration: 0.75, ease: CINEMATIC_EASE }}
        className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#777C80]/30 bg-[#171614]/70 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-[#AAA69B] backdrop-blur-md"
      >
        <span>DISTRIBUTED SYSTEMS</span>
        <span className="text-[#397B78]">·</span>
        <span>HIGH PERFORMANCE</span>
        <span className="text-[#397B78]">·</span>
        <span>RESILIENT ARCHITECTURE</span>
      </motion.div>
    </div>
  );
}

/**
 * ACT 04: CREATIVITY — "LOGIC MEETS IMAGINATION. DESIGN. DEVELOP. CREATE."
 * Clean, solid, beautiful typography with ultra-smooth liquid lyric animation.
 */
function ActCreativity({ act }: { act: StatementAct }) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* 1. "LOGIC meets IMAGINATION." */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2">
        {/* LOGIC in bold, crisp Anton */}
        <MaskedWord
          word="LOGIC"
          delay={0.12}
          className="font-['Anton'] text-[clamp(2.6rem,6.2vw,5.6rem)] uppercase tracking-tight text-[#F2EBDD]"
        />

        {/* meets in elegant Playfair Display Italic */}
        <motion.span
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.3, ease: CINEMATIC_EASE }}
          className="font-['Playfair_Display'] text-[clamp(2rem,5vw,3.8rem)] font-normal italic text-[#AAA69B]"
        >
          meets
        </motion.span>

        {/* IMAGINATION in crystal-clear Playfair Display Italic with champagne glow */}
        <span className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: "120%", opacity: 0, filter: "blur(14px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.48, ease: CINEMATIC_EASE }}
            className="inline-block font-['Playfair_Display'] text-[clamp(2.6rem,6.8vw,5.8rem)] font-normal italic tracking-wide text-[#F2D18A] drop-shadow-[0_0_30px_rgba(242,209,138,0.45)]"
          >
            Imagination.
          </motion.span>
        </span>
      </div>

      {/* 2. "DESIGN. DEVELOP. CREATE." */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2">
        {/* DESIGN in bold Anton */}
        <MaskedWord
          word="DESIGN."
          delay={1.1}
          className="font-['Anton'] text-[clamp(2.6rem,8vw,7rem)] uppercase leading-none tracking-tight text-[#F2EBDD]"
        />

        {/* DEVELOP in bold Anton */}
        <MaskedWord
          word="DEVELOP."
          delay={1.35}
          className="font-['Anton'] text-[clamp(2.6rem,8vw,7rem)] uppercase leading-none tracking-tight text-[#AAA69B]"
        />

        {/* CREATE in bold Anton with solid metallic gold sweep */}
        <span className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: "120%", opacity: 0, filter: "blur(14px)", scale: 0.94 }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.9, delay: 1.6, ease: CINEMATIC_EASE }}
            className="inline-block metallic-gold-sweep font-['Anton'] text-[clamp(2.6rem,8.5vw,7.5rem)] uppercase leading-none tracking-tight text-[#E5B747] drop-shadow-[0_10px_45px_rgba(229,183,71,0.4)]"
          >
            CREATE.
          </motion.span>
        </span>
      </div>

      {/* Manifesto subtext */}
      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 0.75, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 2.2, duration: 0.8, ease: CINEMATIC_EASE }}
        className="mt-6 font-mono text-xs uppercase tracking-[0.26em] text-[#AAA69B]"
      >
        {act.subText}
      </motion.p>
    </div>
  );
}

/** ACT 05: IDENTITY — "EDHUBILLI SANDEEP KUMAR // DEVELOPER. BUILDER. CREATOR." */
function ActIdentity({ act }: { act: StatementAct }) {
  const nameParts = ["EDHUBILLI", "SANDEEP", "KUMAR"];

  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.9, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.75, ease: CINEMATIC_EASE }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C69B45]/40 bg-[#171614]/85 px-4 py-1 backdrop-blur-md"
      >
        <span className="h-2 w-2 rounded-full bg-[#E5B747] shadow-[0_0_10px_#E5B747]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F2EBDD]">
          FULL STACK ARCHITECT // PORTFOLIO
        </span>
      </motion.div>

      {/* The Master Name Reveal */}
      <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-6">
        {nameParts.map((word, i) => (
          <MaskedWord
            key={i}
            word={word}
            delay={0.15 + i * 0.12}
            isHero={true}
            className="metallic-gold-sweep font-['Anton'] text-[clamp(3.5rem,11.5vw,10.5rem)] uppercase leading-[0.88] tracking-[-0.04em] text-[#E5B747] drop-shadow-[0_12px_45px_rgba(229,183,71,0.35)]"
          />
        ))}
      </div>

      {/* Physically drawn gold signature flourish under the name */}
      <CalligraphyFlourish delay={0.65} width={280} height={38} className="mt-2" />

      {/* Subtitle Identity */}
      <motion.p
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 0.95, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.85, delay: 0.45, ease: CINEMATIC_EASE }}
        className="mt-5 font-['Space_Grotesk'] text-[clamp(1rem,2.8vw,1.8rem)] font-medium uppercase tracking-[0.3em] text-[#F2EBDD]"
      >
        {act.secondaryText}
      </motion.p>

      {/* Welcome Statement */}
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.85, delay: 0.65, ease: CINEMATIC_EASE }}
        className="mt-8 flex items-center gap-3 sm:gap-4"
      >
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: CINEMATIC_EASE }}
          className="h-px w-12 bg-gradient-to-r from-transparent to-[#C69B45] sm:w-24"
        />
        <span className="rounded-md border border-[#C69B45]/30 bg-[#C69B45]/15 px-3.5 py-1 font-mono text-xs uppercase tracking-[0.26em] text-[#E5B747] backdrop-blur-md">
          {act.subText}
        </span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: CINEMATIC_EASE }}
          className="h-px w-12 bg-gradient-to-l from-transparent to-[#C69B45] sm:w-24"
        />
      </motion.div>
    </div>
  );
}
