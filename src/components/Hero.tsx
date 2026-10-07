import { useRef } from "react";
import { Download } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Terminal from "./Terminal";
import ParticleNetwork from "./ParticleNetwork";
import { useCounter, useInView } from "@/hooks/useCounter";
import MagneticButton from "./MagneticButton";
import { SITE } from "@/config";
import { usePersonalInfo } from "@/hooks/useSupabase";
import { useSiteCopy } from "@/hooks/useSiteCopy";
import { ease, usePointerDepth } from "@/lib/motion";

// Linear-style word-by-word reveal for hero name lines.
function WordReveal({
  text,
  className,
  wordClassName,
  baseDelay = 0,
  wordDelay = 0.09,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  baseDelay?: number;
  wordDelay?: number;
}) {
  const reduce = useReducedMotion();
  const words = (text ?? "").split(/\s+/).filter(Boolean);
  if (reduce)
    return (
      <span className={className}>
        {words.map((w, i) => (
          <span key={i} className={wordClassName}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    );
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pr-[0.22em]">
          <motion.span
            className={`inline-block will-change-transform ${wordClassName ?? ""}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.9, ease: ease.brand, delay: baseDelay + i * wordDelay }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Stat({ value, suffix = "", label, start }: { value: number; suffix?: string; label: string; start: boolean }) {
  const v = useCounter(value, 1400, start);
  return (
    <div className="flex flex-col">
      <span className="font-syne text-[34px] font-extrabold leading-none text-grad-acid">
        {v}{suffix}
      </span>
      <span className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export default function Hero() {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const k = reduce ? 0 : 1;

  // Scroll-linked exit — the hero leaves the viewport in layers instead of
  // simply scrolling away as one flat block.
  const headY = useTransform(scrollYProgress, [0, 1], [0, -80 * k]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -46 * k]);
  const termY = useTransform(scrollYProgress, [0, 1], [0, -45 * k]);
  const termScale = useTransform(scrollYProgress, [0, 1], [1, 1 - 0.04 * k]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -25 * k]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.18]);

  // Pointer depth — ambient in the back, strongest on the terminal.
  const { x: pxv, y: pyv } = usePointerDepth();
  const meshX = useTransform(pxv, [-1, 1], [-10 * k, 10 * k]);
  const meshY = useTransform(pyv, [-1, 1], [-10 * k, 10 * k]);
  const gridX = useTransform(pxv, [-1, 1], [-16 * k, 16 * k]);
  const gridY = useTransform(pyv, [-1, 1], [-16 * k, 16 * k]);
  const termX = useTransform(pxv, [-1, 1], [-18 * k, 18 * k]);
  const termTiltY = useTransform(pyv, [-1, 1], [-14 * k, 14 * k]);
  const headX = useTransform(pxv, [-1, 1], [-6 * k, 6 * k]);
  const { data: info } = usePersonalInfo();
  const { t } = useSiteCopy();
  const resumeUrl = info?.resume_url || SITE.resumeUrl;

  return (
    <section ref={sectionRef} id="top" className="relative min-h-screen overflow-hidden bg-void">
      {/* Animated mesh gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          x: meshX,
          y: bgY,
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #00ffb3 0%, transparent 40%), radial-gradient(circle at 80% 70%, #7c6fff 0%, transparent 45%), radial-gradient(circle at 50% 50%, #00b8ff 0%, transparent 50%)",
          backgroundSize: "200% 200%",
          animation: "mesh-shift 8s ease-in-out infinite",
        }}
      />
      {/* Dot grid */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          x: gridX,
          y: gridY,
          backgroundImage:
            "linear-gradient(hsl(var(--acid)/0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--acid)/0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <ParticleNetwork />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-28">
        {/* Left */}
        <motion.div ref={ref} style={{ y: headY, x: headX }}>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-acid/25 bg-acid/10 px-3.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-sonar rounded-full bg-acid" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid animate-pulse-dot" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">
              {t("hero_eyebrow")}
            </span>
          </div>

          <h1
            className="mt-7 font-syne font-extrabold uppercase"
            style={{
              fontSize: "clamp(52px, 7.5vw, 114px)",
              letterSpacing: "-0.055em",
              lineHeight: 0.9,
            }}
          >
            <span className="block overflow-hidden">
              <WordReveal text={t("hero_line1")} className="block text-ink" baseDelay={0.05} />
            </span>
            <span className="block overflow-hidden">
              <WordReveal text={t("hero_line2")} className="block text-stroke" baseDelay={0.35} />
            </span>
            <span className="block overflow-hidden">
              <WordReveal text={t("hero_line3")} className="block" wordClassName="text-grad-acid" baseDelay={0.7} />
            </span>
          </h1>

          <motion.p style={{ y: copyY }} className="reveal mt-8 max-w-[540px] text-[17px] leading-[1.8] text-ink-2">
            {t("hero_subtitle")}
          </motion.p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <a
                href="#projects"
                className="inline-flex items-center rounded-lg bg-acid px-6 py-3.5 font-syne text-[14px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid"
              >
                {t("hero_cta_primary")}
              </a>
            </MagneticButton>
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-6 py-3.5 font-syne text-[14px] font-bold text-ink transition-all hover:border-acid/50 hover:bg-acid/10"
            >
              <Download size={15} /> {t("hero_cta_secondary")}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-lg border border-soft-2 bg-surface/60 px-6 py-3.5 font-syne text-[14px] font-bold text-ink transition-all hover:border-acid/50 hover:bg-acid/10"
            >
              {t("hero_cta_tertiary")}
            </a>
          </div>

          <div className="reveal mt-12 grid grid-cols-3 divide-x divide-soft-2 border-y border-soft-2 py-6">
            <div className="pr-6"><Stat value={12} suffix="+" label="Projects Shipped" start={inView} /></div>
            <div className="px-6"><Stat value={3} suffix="+" label="Years Building" start={inView} /></div>
            <div className="pl-6"><Stat value={42} suffix="%" label="Perf Improvement" start={inView} /></div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          className="lg:pl-6 will-change-transform"
          style={{ y: termY, x: termX, scale: termScale, translateZ: 0 }}
        >
          <motion.div style={{ y: termTiltY }}>
            <div className="reveal"><Terminal /></div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <div className="flex h-9 w-5 justify-center rounded-full border border-soft-2 pt-1.5">
          <span className="h-1.5 w-1 rounded-full bg-acid animate-scroll-wheel" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Scroll</span>
      </div>
    </section>
  );
}
