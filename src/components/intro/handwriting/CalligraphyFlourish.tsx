import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CalligraphyFlourishProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  variant?: "flourish" | "signature";
}

/**
 * Expressive calligraphy underline & signature flourish.
 * Physically drawn with authentic pen curvature and an active luminous pen tip
 * that tracks the vector coordinates in real-time.
 */
export default function CalligraphyFlourish({
  className = "",
  delay = 0.5,
  width = 260,
  height = 38,
  variant = "flourish",
}: CalligraphyFlourishProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penTipRef = useRef<SVGGElement | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Variant paths:
  // 1. "flourish": Graceful decorative underline with a double loop and gentle taper
  // 2. "signature": Extended calligraphic flourish that flows across and curls underneath
  const flourishPath =
    variant === "signature"
      ? "M 12,20 C 55,8 95,30 145,16 C 185,6 208,26 194,32 C 180,36 168,20 188,14 C 212,8 245,24 270,18 C 290,14 310,24 328,18"
      : "M 10,18 C 50,6 100,28 150,14 C 190,4 210,24 195,30 C 180,34 170,18 190,14 C 210,10 230,22 248,18";

  const viewBox = variant === "signature" ? "0 0 340 40" : "0 0 260 38";

  useEffect(() => {
    const svg = svgRef.current;
    const penTip = penTipRef.current;
    if (!svg) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const path = svg.querySelector<SVGPathElement>(".flourish-path");
    if (!path) return;

    const length = path.getTotalLength() || 280;

    if (prefersReducedMotion) {
      path.style.strokeDashoffset = "0";
      setIsCompleted(true);
      return;
    }

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    if (penTip) {
      penTip.style.opacity = "0";
    }

    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        setIsCompleted(true);
        if (penTip) {
          gsap.to(penTip, { opacity: 0, duration: 0.35, ease: "power2.out" });
        }
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1.15,
      ease: "power2.inOut",
      onStart: () => {
        if (penTip) penTip.style.opacity = "1";
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
    });

    return () => {
      tl.kill();
    };
  }, [delay, variant]);

  return (
    <div className={`relative inline-block ${className}`} aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px`, height: `${height}px` }}
        className={`transition-all duration-700 ${
          isCompleted ? "drop-shadow-[0_0_16px_rgba(229,183,71,0.45)]" : ""
        }`}
      >
        <defs>
          <linearGradient id={`flourish-gold-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C69B45" stopOpacity="0.2" />
            <stop offset="25%" stopColor="#E5B747" />
            <stop offset="65%" stopColor="#F2D18A" />
            <stop offset="100%" stopColor="#E58B32" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <path
          d={flourishPath}
          className="flourish-path"
          stroke={`url(#flourish-gold-${variant})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Luminous Pen Tip that tracks the active drawing stroke */}
        <g ref={penTipRef} className="pointer-events-none">
          <circle r="8" fill="rgba(242, 209, 138, 0.35)" />
          <circle r="3.5" fill="#E5B747" />
          <circle r="1.8" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
