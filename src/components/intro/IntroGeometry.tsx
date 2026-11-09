import { motion } from "framer-motion";

export default function IntroGeometry({ actIndex }: { actIndex: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[11] overflow-hidden" aria-hidden="true">
      {/* Outer framing corner brackets */}
      <svg className="absolute left-6 top-6 h-8 w-8 text-[#C69B45]/40 sm:left-12 sm:top-12">
        <path d="M 0 16 L 0 0 L 16 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg className="absolute right-6 top-6 h-8 w-8 text-[#C69B45]/40 sm:right-12 sm:top-12">
        <path d="M 16 16 L 16 0 L 0 0" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg className="absolute bottom-6 left-6 h-8 w-8 text-[#C69B45]/40 sm:bottom-12 sm:left-12">
        <path d="M 0 0 L 0 16 L 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg className="absolute bottom-6 right-6 h-8 w-8 text-[#C69B45]/40 sm:bottom-12 sm:right-12">
        <path d="M 16 0 L 16 16 L 0 16" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>

      {/* Dynamic Geometric Ring / Polygon that shifts with each movement */}
      <motion.div
        key={actIndex}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 1.06, rotate: 6 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="420" height="420" viewBox="0 0 420 420" className="h-[280px] w-[280px] sm:h-[420px] sm:w-[420px]">
          {/* Subtle geometric circle */}
          <circle
            cx="210"
            cy="210"
            r="190"
            fill="none"
            stroke="#C69B45"
            strokeWidth="0.8"
            strokeDasharray="4 8"
          />
          {/* Diamond frame */}
          <polygon
            points="210,30 390,210 210,390 30,210"
            fill="none"
            stroke="#E58B32"
            strokeWidth="0.6"
            opacity="0.6"
          />
          {/* Crosshair lines */}
          <line x1="210" y1="0" x2="210" y2="420" stroke="#777C80" strokeWidth="0.5" strokeDasharray="3 6" />
          <line x1="0" y1="210" x2="420" y2="210" stroke="#777C80" strokeWidth="0.5" strokeDasharray="3 6" />
        </svg>
      </motion.div>
    </div>
  );
}
