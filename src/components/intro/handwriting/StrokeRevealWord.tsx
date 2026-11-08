import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface StrokeRevealWordProps {
  className?: string;
  delay?: number;
  onComplete?: () => void;
}

/**
 * Bold cinematic stroke-reveal word: "CREATE."
 * Uses a directional stroke mask that gradually physically uncovers
 * each letter along its authentic writing path, accompanied by an active luminous pen tip.
 */
export default function StrokeRevealWord({
  className = "",
  delay = 0.5,
  onComplete,
}: StrokeRevealWordProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penTipRef = useRef<SVGGElement | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Directional centerline writing strokes for C-R-E-A-T-E-.
  const strokeDefs = [
    // --- LETTER 'C' (sweeping arc from top-right to bottom-right) ---
    { id: "c-arc", d: "M 66,24 C 36,12 18,34 18,55 C 18,76 36,96 66,86", duration: 0.45 },

    // --- LETTER 'R' ---
    // 1. Vertical stem downwards
    { id: "r-stem", d: "M 88,18 L 88,90", duration: 0.28 },
    // 2. Upper loop
    { id: "r-loop", d: "M 88,22 C 122,18 136,32 136,46 C 136,60 120,64 88,64", duration: 0.38 },
    // 3. Diagonal right leg
    { id: "r-leg", d: "M 108,62 L 138,90", duration: 0.25 },

    // --- LETTER 'E' ---
    // 1. Vertical stem downwards
    { id: "e1-stem", d: "M 158,18 L 158,90", duration: 0.28 },
    // 2. Top bar (left to right)
    { id: "e1-top", d: "M 158,22 L 198,22", duration: 0.2 },
    // 3. Middle bar
    { id: "e1-mid", d: "M 158,54 L 190,54", duration: 0.18 },
    // 4. Bottom bar
    { id: "e1-bot", d: "M 158,86 L 198,86", duration: 0.2 },

    // --- LETTER 'A' ---
    // 1. Apex down to bottom-left
    { id: "a-left", d: "M 238,18 L 216,90", duration: 0.3 },
    // 2. Apex down to bottom-right
    { id: "a-right", d: "M 238,18 L 260,90", duration: 0.3 },
    // 3. Crossbar
    { id: "a-bar", d: "M 224,62 L 252,62", duration: 0.18 },

    // --- LETTER 'T' ---
    // 1. Top horizontal bar
    { id: "t-bar", d: "M 276,22 L 328,22", duration: 0.24 },
    // 2. Center vertical stem downwards
    { id: "t-stem", d: "M 302,22 L 302,90", duration: 0.28 },

    // --- LETTER 'E' ---
    // 1. Vertical stem downwards
    { id: "e2-stem", d: "M 346,18 L 346,90", duration: 0.28 },
    // 2. Top bar
    { id: "e2-top", d: "M 346,22 L 386,22", duration: 0.2 },
    // 3. Middle bar
    { id: "e2-mid", d: "M 346,54 L 378,54", duration: 0.18 },
    // 4. Bottom bar
    { id: "e2-bot", d: "M 346,86 L 386,86", duration: 0.2 },

    // --- PERIOD '.' ---
    { id: "dot", d: "M 404,82 L 406,86", duration: 0.15 },
  ];

  useEffect(() => {
    const svg = svgRef.current;
    const penTip = penTipRef.current;
    if (!svg) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const maskPaths = Array.from(svg.querySelectorAll<SVGPathElement>(".mask-stroke-path"));

    if (prefersReducedMotion) {
      maskPaths.forEach((p) => {
        p.style.strokeDashoffset = "0";
      });
      setIsCompleted(true);
      onComplete?.();
      return;
    }

    // Set initial dasharray & dashoffset for mask reveal
    maskPaths.forEach((path) => {
      const len = path.getTotalLength() || 100;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    if (penTip) {
      penTip.style.opacity = "0";
    }

    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        setIsCompleted(true);
        if (penTip) {
          gsap.to(penTip, { opacity: 0, duration: 0.35 });
        }
        onComplete?.();
      },
    });

    maskPaths.forEach((path, idx) => {
      const def = strokeDefs[idx];
      const length = path.getTotalLength() || 100;

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: def?.duration || 0.3,
          ease: "power1.inOut",
          onStart: () => {
            if (penTip) {
              penTip.style.opacity = "1";
            }
          },
          onUpdate: function () {
            if (!penTip) return;
            const progress = this.progress();
            const currentDist = progress * length;
            try {
              const pt = path.getPointAtLength(currentDist);
              penTip.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
            } catch {}
          },
        },
        idx === 0 ? undefined : "+=0.03"
      );
    });

    return () => {
      tl.kill();
    };
  }, [delay, onComplete]);

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 430 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-[340px] sm:max-w-[430px] transition-all duration-700 ${
          isCompleted
            ? "drop-shadow-[0_10px_35px_rgba(229,183,71,0.4)]"
            : "drop-shadow-[0_4px_20px_rgba(229,183,71,0.2)]"
        }`}
      >
        <defs>
          {/* Metallic gold gradient fill */}
          <linearGradient id="gold-metal-create" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F2D18A" />
            <stop offset="25%" stopColor="#E5B747" />
            <stop offset="65%" stopColor="#C69B45" />
            <stop offset="100%" stopColor="#E58B32" />
          </linearGradient>

          {/* Stroke-reveal mask containing directional strokes */}
          <mask id="create-stroke-reveal-mask">
            <rect width="100%" height="100%" fill="black" />
            <g
              stroke="white"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              {strokeDefs.map((stroke) => (
                <path
                  key={stroke.id}
                  d={stroke.d}
                  className="mask-stroke-path"
                  style={{ willChange: "stroke-dashoffset" }}
                />
              ))}
            </g>
          </mask>

          {/* Active pen tip glow filter */}
          <filter id="pen-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Masked Bold Typography (Anton) revealed progressively along the stroke paths */}
        <g mask="url(#create-stroke-reveal-mask)">
          <text
            x="215"
            y="85"
            textAnchor="middle"
            fill="url(#gold-metal-create)"
            className="font-['Anton'] text-[82px] uppercase tracking-[-0.01em]"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            CREATE.
          </text>
        </g>

        {/* Luminous Active Pen Tip that travels along the active writing stroke in real time */}
        <g ref={penTipRef} filter="url(#pen-tip-glow)" className="pointer-events-none">
          <circle r="11" fill="rgba(242, 209, 138, 0.3)" />
          <circle r="5" fill="#E5B747" />
          <circle r="2.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
