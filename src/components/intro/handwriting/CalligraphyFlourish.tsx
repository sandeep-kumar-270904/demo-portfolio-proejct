import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface CalligraphyFlourishProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
}

/**
 * Expressive calligraphy underline / flourish.
 * Physically drawn with variable curvature and an active luminous pen tip.
 */
export default function CalligraphyFlourish({
  className = "",
  delay = 0.5,
  width = 240,
  height = 36,
}: CalligraphyFlourishProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const penTipRef = useRef<SVGGElement | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Flowing ornamental calligraphy curve with a loop and taper
  const flourishPath =
    "M 10,18 C 50,6 100,28 150,14 C 190,4 210,24 195,30 C 180,34 170,18 190,14 C 210,10 230,22 238,20";

  useEffect(() => {
    const svg = svgRef.current;
    const penTip = penTipRef.current;
    if (!svg) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const path = svg.querySelector<SVGPathElement>(".flourish-path");
    if (!path) return;

    const length = path.getTotalLength() || 250;

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
          gsap.to(penTip, { opacity: 0, duration: 0.3 });
        }
      },
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1.1,
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
  }, [delay]);

  return (
    <div className={`relative inline-block ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 250 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px`, height: `${height}px` }}
        className={`transition-all duration-700 ${
          isCompleted ? "drop-shadow-[0_0_12px_rgba(229,183,71,0.35)]" : ""
        }`}
      >
        <defs>
          <linearGradient id="flourish-gold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C69B45" stopOpacity="0.2" />
            <stop offset="30%" stopColor="#E5B747" />
            <stop offset="70%" stopColor="#F2D18A" />
            <stop offset="100%" stopColor="#E58B32" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <path
          d={flourishPath}
          className="flourish-path"
          stroke="url(#flourish-gold)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <g ref={penTipRef} className="pointer-events-none">
          <circle r="7" fill="rgba(242, 209, 138, 0.3)" />
          <circle r="3" fill="#E5B747" />
          <circle r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
}
