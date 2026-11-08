import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CursiveWordProps {
  className?: string;
  delay?: number;
  onComplete?: () => void;
}

/**
 * Cursive handwritten word: "IMAGINATION"
 * Physically drawn stroke-by-stroke with authentic pen movements,
 * connecting ligatures, acceleration/deceleration, and an active luminous pen tip.
 */
export default function CursiveWord({
  className = "",
  delay = 0.4,
  onComplete,
}: CursiveWordProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penTipRef = useRef<SVGGElement | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Centerline strokes in physical writing sequence
  const strokeData = [
    // 1. Capital 'I' flourish and stem
    {
      id: "I",
      d: "M 28,52 C 34,34 46,20 60,20 C 72,20 76,32 72,46 C 65,70 54,84 68,84 C 78,84 88,72 98,52",
      duration: 0.65,
    },
    // 2. Letter 'm' (three connected arches)
    {
      id: "m",
      d: "M 98,52 C 102,66 104,84 112,84 C 122,84 130,66 136,52 C 140,66 142,84 150,84 C 160,84 168,66 176,52",
      duration: 0.7,
    },
    // 3. Letter 'a' (counter loop + stem)
    {
      id: "a",
      d: "M 194,52 C 182,52 172,64 172,75 C 172,85 182,86 192,86 C 202,86 210,75 214,54 C 216,68 218,84 224,84",
      duration: 0.45,
    },
    // 4. Letter 'g' (counter loop + descender plunge and upward loop)
    {
      id: "g",
      d: "M 242,52 C 230,52 220,64 220,75 C 220,85 230,86 240,86 C 248,86 256,75 258,54 L 258,98 C 258,116 246,122 234,116 C 226,112 228,102 238,102 C 248,102 258,96 268,84",
      duration: 0.75,
    },
    // 5. Letters 'i-n-a-t-i-o-n' (continuous connected ligature cascade)
    {
      id: "ination",
      d: "M 268,84 C 274,72 280,54 286,54 C 284,68 286,84 294,84 C 304,84 312,66 318,54 C 322,68 324,84 332,84 C 346,84 354,66 360,54 C 350,54 342,66 342,76 C 342,85 350,86 360,86 C 370,86 378,74 382,54 L 386,24 C 386,18 392,18 394,24 L 390,84 C 396,86 402,84 408,74 C 414,64 420,54 428,54 C 424,68 426,84 434,84 C 446,84 456,66 462,54 C 454,54 446,66 446,76 C 446,85 456,86 466,86 C 476,86 484,74 488,60 C 486,76 494,84 502,84 C 512,84 520,66 526,54 C 530,68 532,84 542,84 C 558,84 578,76 594,68",
      duration: 1.6,
    },
    // 6. Crossbar for 't'
    {
      id: "t-cross",
      d: "M 374,42 C 384,40 398,40 404,42",
      duration: 0.22,
    },
    // 7. Dot for first 'i'
    {
      id: "dot1",
      d: "M 285,38 C 286,37 287,39 286,39",
      duration: 0.12,
    },
    // 8. Dot for second 'i'
    {
      id: "dot2",
      d: "M 427,38 C 428,37 429,39 428,39",
      duration: 0.12,
    },
  ];

  useEffect(() => {
    const svg = svgRef.current;
    const penTip = penTipRef.current;
    if (!svg) return;

    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>(".handwriting-stroke"));

    if (prefersReducedMotion) {
      paths.forEach((p) => {
        p.style.strokeDashoffset = "0";
      });
      setIsCompleted(true);
      onComplete?.();
      return;
    }

    // Set initial dasharray & dashoffset
    paths.forEach((path) => {
      const length = path.getTotalLength() || 100;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
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

    paths.forEach((path, idx) => {
      const def = strokeData[idx];
      const length = path.getTotalLength() || 100;

      tl.to(
        path,
        {
          strokeDashoffset: 0,
          duration: def?.duration || 0.5,
          ease: "power2.inOut",
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
        idx === 0 ? undefined : "+=0.04"
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
        viewBox="0 0 620 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full max-w-[560px] sm:max-w-[620px] transition-all duration-1000 ${
          isCompleted
            ? "drop-shadow-[0_0_24px_rgba(242,209,138,0.45)] drop-shadow-[0_0_48px_rgba(229,183,71,0.2)]"
            : "drop-shadow-[0_0_12px_rgba(242,209,138,0.25)]"
        }`}
      >
        <defs>
          {/* Subtle ink texture gradient */}
          <linearGradient id="ink-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F2EBDD" />
            <stop offset="30%" stopColor="#F2D18A" />
            <stop offset="70%" stopColor="#E5B747" />
            <stop offset="100%" stopColor="#F5B85C" />
          </linearGradient>

          {/* Radial glow filter for active pen nib */}
          <filter id="pen-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* The Vector Handwriting Strokes */}
        <g stroke="url(#ink-gold)" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
          {strokeData.map((stroke) => (
            <path
              key={stroke.id}
              d={stroke.d}
              className="handwriting-stroke"
              style={{ willChange: "stroke-dashoffset" }}
            />
          ))}
        </g>

        {/* Luminous Active Pen Tip that moves along the strokes in real time */}
        <g ref={penTipRef} filter="url(#pen-glow)" className="pointer-events-none">
          {/* Broad outer atmospheric halo */}
          <circle r="9" fill="rgba(242, 209, 138, 0.28)" />
          {/* Concentrated amber core */}
          <circle r="4.5" fill="#E5B747" />
          {/* Brilliant white diamond center */}
          <circle r="2.2" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
