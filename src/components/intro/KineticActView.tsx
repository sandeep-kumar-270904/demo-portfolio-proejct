import { motion } from "framer-motion";
import { MovementAct } from "./introConfig";
import CalligraphyFlourish from "./handwriting/CalligraphyFlourish";

const CINEMATIC_EASE = [0.16, 1, 0.3, 1];
const SILKY_EASE = [0.22, 1, 0.36, 1];

interface KineticActViewProps {
  act: MovementAct;
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
          filter: "blur(14px)",
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
      {renderMovementContent(act)}
    </motion.div>
  );
}

function renderMovementContent(act: MovementAct) {
  switch (act.theme) {
    case "arrival":
      return <MovementArrival act={act} />;
    case "duality":
      return <MovementDuality act={act} />;
    case "discipline":
      return <MovementDiscipline act={act} />;
    case "signature":
      return <MovementSignature act={act} />;
    default:
      return null;
  }
}

/**
 * MOVEMENT 01: THE ARRIVAL — "PRECISION AT SCALE. ARCHITECTING SYSTEMS."
 * Synchronized with the opening acoustic guitar pick & phrase resolution.
 */
function MovementArrival({ act }: { act: MovementAct }) {
  const wordsPrimary = act.primaryLine.split(" ");
  const wordsSecondary = (act.secondaryLine || "").split(" ");

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Editorial Eyebrow Label */}
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
        <span>{act.eyebrow || "A STUDIO OF ONE"}</span>
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
          className="h-px w-8 bg-gradient-to-l from-transparent to-[#C69B45]"
        />
      </motion.div>

      {/* Primary Statement: "PRECISION AT SCALE." */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-4">
        {wordsPrimary.map((word, i) => (
          <MaskedWord
            key={i}
            word={word}
            delay={0.15 + i * 0.1}
            className="font-['Anton'] text-[clamp(2.5rem,7vw,6.5rem)] uppercase leading-[0.95] tracking-tight text-[#AAA69B]"
          />
        ))}
      </div>

      {/* Hero Statement: "ARCHITECTING SYSTEMS." */}
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-5">
        {wordsSecondary.map((word, i) => {
          const isEmphasis = word.toUpperCase().includes("SYSTEMS");
          return (
            <MaskedWord
              key={i}
              word={word}
              delay={0.45 + i * 0.14}
              isHero={isEmphasis}
              className={`font-['Anton'] text-[clamp(3.6rem,11.5vw,10.2rem)] uppercase leading-[0.88] tracking-[-0.03em] ${
                isEmphasis
                  ? "metallic-gold-sweep text-[#E5B747] drop-shadow-[0_10px_35px_rgba(229,183,71,0.35)]"
                  : "text-[#F5F0E6]"
              }`}
            />
          );
        })}
      </div>

      {/* Telemetry subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 0.75, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.8, duration: 0.8, ease: CINEMATIC_EASE }}
        className="mt-6 max-w-lg font-mono text-[10px] uppercase tracking-[0.24em] text-[#AAA69B] sm:text-xs"
      >
        {act.subText}
      </motion.p>
    </div>
  );
}

/**
 * MOVEMENT 02: THE DUALITY — "LOGIC meets Imagination."
 * Synchronized with the signature solo flute motif.
 * Solid Google Fonts typography paired with a physically drawn gold calligraphy flourish.
 */
function MovementDuality({ act }: { act: MovementAct }) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Category Eyebrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
        animate={{ opacity: 0.9, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: CINEMATIC_EASE }}
        className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#C69B45]"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E5B747]" />
        <span>[ {act.eyebrow || "PHILOSOPHY // 02"} ]</span>
      </motion.div>

      {/* "LOGIC meets Imagination." */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2">
        {/* LOGIC in bold, crisp Anton */}
        <MaskedWord
          word="LOGIC"
          delay={0.12}
          className="font-['Anton'] text-[clamp(2.8rem,7vw,6.5rem)] uppercase tracking-tight text-[#F5F0E6]"
        />

        {/* meets in elegant Playfair Display Italic */}
        <motion.span
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 0.9, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, delay: 0.32, ease: CINEMATIC_EASE }}
          className="font-['Playfair_Display'] text-[clamp(2rem,5vw,4rem)] font-normal italic text-[#AAA69B]"
        >
          meets
        </motion.span>

        {/* Imagination in crystal-clear Playfair Display Italic with champagne glow */}
        <span className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: "120%", opacity: 0, filter: "blur(14px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.52, ease: CINEMATIC_EASE }}
            className="inline-block font-['Playfair_Display'] text-[clamp(2.8rem,7.5vw,6.8rem)] font-normal italic tracking-wide text-[#F2D18A] drop-shadow-[0_0_35px_rgba(242,209,138,0.45)]"
          >
            Imagination.
          </motion.span>
        </span>
      </div>

      {/* Physically drawn gold calligraphy flourish directly under "Imagination." */}
      <CalligraphyFlourish delay={0.75} width={280} height={38} className="mt-3" variant="flourish" />

      {/* Manifesto subtext */}
      <motion.p
        initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        animate={{ opacity: 0.75, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 1.1, duration: 0.8, ease: CINEMATIC_EASE }}
        className="mt-6 max-w-md font-mono text-[10px] uppercase tracking-[0.24em] text-[#AAA69B] sm:text-xs"
      >
        {act.subText}
      </motion.p>
    </div>
  );
}

/**
 * MOVEMENT 03: THE DISCIPLINE — "DESIGN. ARCHITECT. SHIP."
 * Synchronized with the entrance of the bass and percussion groove.
 */
function MovementDiscipline({ act }: { act: MovementAct }) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      {/* Category Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
        animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.65, ease: CINEMATIC_EASE }}
        className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[#397B78]"
      >
        <span className="inline-block h-1.5 w-1.5 bg-[#397B78]" />
        <span>{act.eyebrow || "SYSTEM EXECUTION // 03"}</span>
        <span className="inline-block h-1.5 w-1.5 bg-[#397B78]" />
      </motion.div>

      {/* The Cadence Triad: "DESIGN. ARCHITECT. SHIP." */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-2">
        {/* DESIGN in bold Anton */}
        <MaskedWord
          word="DESIGN."
          delay={0.15}
          className="font-['Anton'] text-[clamp(2.8rem,8.5vw,7.5rem)] uppercase leading-none tracking-tight text-[#F5F0E6]"
        />

        {/* ARCHITECT in bold Anton */}
        <MaskedWord
          word="ARCHITECT."
          delay={0.4}
          className="font-['Anton'] text-[clamp(2.8rem,8.5vw,7.5rem)] uppercase leading-none tracking-tight text-[#AAA69B]"
        />

        {/* SHIP in bold Anton with solid metallic gold sweep */}
        <span className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: "120%", opacity: 0, filter: "blur(14px)", scale: 0.94 }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 0.9, delay: 0.68, ease: CINEMATIC_EASE }}
            className="inline-block metallic-gold-sweep font-['Anton'] text-[clamp(2.8rem,9vw,8rem)] uppercase leading-none tracking-tight text-[#E5B747] drop-shadow-[0_10px_45px_rgba(229,183,71,0.4)]"
          >
            SHIP.
          </motion.span>
        </span>
      </div>

      {/* Telemetry pill */}
      <motion.div
        initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.95, duration: 0.75, ease: CINEMATIC_EASE }}
        className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#777C80]/30 bg-[#171614]/75 px-5 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[#AAA69B] backdrop-blur-md sm:text-[10px]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#397B78]" />
        <span>FULL-STACK ARCHITECTURE</span>
        <span className="text-[#397B78]">·</span>
        <span>CREATIVE TECHNOLOGY</span>
      </motion.div>
    </div>
  );
}

/**
 * MOVEMENT 04: THE SIGNATURE — "EDHUBILLI SANDEEP KUMAR"
 * The definitive personal identity reveal and transition into the live portfolio.
 * Synchronized with the harmonic crescendo and major beat drop at 17s.
 */
function MovementSignature({ act }: { act: MovementAct }) {
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
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F5F0E6]">
          {act.eyebrow || "FULL STACK ARCHITECT & ENGINEER"}
        </span>
      </motion.div>

      {/* The Master Name Reveal */}
      <div className="flex flex-wrap justify-center gap-x-3.5 sm:gap-x-6">
        {nameParts.map((word, i) => (
          <MaskedWord
            key={i}
            word={word}
            delay={0.15 + i * 0.14}
            isHero={true}
            className="metallic-gold-sweep font-['Anton'] text-[clamp(3.5rem,11.5vw,10.5rem)] uppercase leading-[0.88] tracking-[-0.04em] text-[#E5B747] drop-shadow-[0_12px_45px_rgba(229,183,71,0.35)]"
          />
        ))}
      </div>

      {/* Physically drawn gold signature flourish under the name */}
      <CalligraphyFlourish delay={0.65} width={320} height={42} className="mt-2" variant="signature" />

      {/* Subtitle Identity */}
      <motion.p
        initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 0.95, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.85, delay: 0.45, ease: CINEMATIC_EASE }}
        className="mt-5 font-['Space_Grotesk'] text-[clamp(0.95rem,2.6vw,1.6rem)] font-medium uppercase tracking-[0.3em] text-[#F5F0E6]"
      >
        {act.secondaryLine}
      </motion.p>

      {/* Enter Cue */}
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
