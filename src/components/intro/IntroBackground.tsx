import { motion } from "framer-motion";
import IntroCanvasParticles from "./IntroCanvasParticles";
import IntroGeometry from "./IntroGeometry";

interface IntroBackgroundProps {
  actIndex: number;
}

const MOVEMENT_THEMES = [
  {
    // MOVEMENT 01: THE ARRIVAL — Warm amber & bronze
    glowA: "rgba(229, 139, 50, 0.14)", // Burnished amber
    glowB: "rgba(118, 80, 45, 0.12)",  // Bronze
    posA: "85% 15%",
    posB: "20% 75%",
  },
  {
    // MOVEMENT 02: THE DUALITY — Antique gold & champagne
    glowA: "rgba(198, 155, 69, 0.16)", // Antique gold
    glowB: "rgba(242, 209, 138, 0.14)",// Champagne gold
    posA: "75% 25%",
    posB: "25% 75%",
  },
  {
    // MOVEMENT 03: THE DISCIPLINE — Deep atmospheric teal & industrial steel
    glowA: "rgba(22, 77, 80, 0.18)",   // Deep teal
    glowB: "rgba(57, 123, 120, 0.13)", // Muted teal
    posA: "50% 20%",
    posB: "80% 85%",
  },
  {
    // MOVEMENT 04: THE SIGNATURE — Imperial gold & dark bronze
    glowA: "rgba(229, 183, 71, 0.20)", // Bright gold
    glowB: "rgba(128, 96, 44, 0.16)",  // Dark bronze gold
    posA: "50% 50%",
    posB: "50% 85%",
  },
];

export default function IntroBackground({ actIndex }: IntroBackgroundProps) {
  const currentTheme = MOVEMENT_THEMES[actIndex % MOVEMENT_THEMES.length];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#10100F]" aria-hidden="true">
      {/* LAYER 01: Atmospheric Layered Gradient Base */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at ${currentTheme.posA}, ${currentTheme.glowA} 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at ${currentTheme.posB}, ${currentTheme.glowB} 0%, transparent 70%),
            linear-gradient(135deg, #10100F 0%, #181614 45%, #10100F 100%)
          `,
        }}
      />

      {/* LAYER 02: Monochromatic Film Grain Texture */}
      <div className="intro-film-grain absolute inset-0 opacity-40 mix-blend-overlay" />

      {/* LAYER 03: Moving Ambient Light Sweep */}
      <motion.div
        className="absolute -inset-1/2 opacity-35"
        animate={{
          x: ["-8%", "8%", "-8%"],
          y: ["-6%", "6%", "-6%"],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle 600px at center, rgba(198, 155, 69, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* LAYER 04: Canvas Particle Field */}
      <IntroCanvasParticles burstTrigger={actIndex} />

      {/* LAYER 05: Geometric Graphic Environment */}
      <IntroGeometry actIndex={actIndex} />
    </div>
  );
}
