import { Download } from "lucide-react";
import Terminal from "./Terminal";
import ParticleNetwork from "./ParticleNetwork";
import { useCounter, useInView } from "@/hooks/useCounter";
import MagneticButton from "./MagneticButton";
import { SITE } from "@/config";
import { usePersonalInfo } from "@/hooks/useSupabase";

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
  const { data: info } = usePersonalInfo();
  const resumeUrl = info?.resume_url || SITE.resumeUrl;

  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-void">
      {/* Animated mesh gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #00ffb3 0%, transparent 40%), radial-gradient(circle at 80% 70%, #7c6fff 0%, transparent 45%), radial-gradient(circle at 50% 50%, #00b8ff 0%, transparent 50%)",
          backgroundSize: "200% 200%",
          animation: "mesh-shift 8s ease-in-out infinite",
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--acid)/0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--acid)/0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <ParticleNetwork />

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-28">
        {/* Left */}
        <div ref={ref}>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-acid/25 bg-acid/10 px-3.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-sonar rounded-full bg-acid" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid animate-pulse-dot" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-acid">
              Full Stack Engineer · India · Open to Work
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
              <span className="block animate-slide-up text-ink hover:text-glow-acid transition-all duration-700">EDHUBILLI</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block animate-slide-up text-stroke" style={{ animationDelay: "0.1s" }}>SANDEEP</span>
            </span>
            <span className="block overflow-hidden">
              <span className="block animate-slide-up text-grad-acid" style={{ animationDelay: "0.2s" }}>KUMAR</span>
            </span>
          </h1>

          <p className="mt-8 max-w-[540px] text-[17px] leading-[1.8] text-ink-2">
            I architect full-stack systems that scale — from PostgreSQL schemas to Kubernetes clusters.
            I turn complex business problems into clean, performant, production-grade products.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <a
                href="#projects"
                className="inline-flex items-center rounded-lg bg-acid px-6 py-3.5 font-syne text-[14px] font-bold text-void transition-all hover:-translate-y-0.5 hover:glow-acid"
              >
                View Projects →
              </a>
            </MagneticButton>
            <a
              href={resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-lg border border-soft-2 bg-surface/60 px-6 py-3.5 font-syne text-[14px] font-bold text-ink transition-all hover:border-acid/50 hover:bg-acid/10"
            >
              <Download size={15} /> Download Resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-lg border border-soft-2 bg-surface/60 px-6 py-3.5 font-syne text-[14px] font-bold text-ink transition-all hover:border-acid/50 hover:bg-acid/10"
            >
              Let's Talk
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 divide-x divide-soft-2 border-y border-soft-2 py-6">
            <div className="pr-6"><Stat value={12} suffix="+" label="Projects Shipped" start={inView} /></div>
            <div className="px-6"><Stat value={3} suffix="+" label="Years Building" start={inView} /></div>
            <div className="pl-6"><Stat value={42} suffix="%" label="Perf Improvement" start={inView} /></div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:pl-6">
          <Terminal />
        </div>
      </div>

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
