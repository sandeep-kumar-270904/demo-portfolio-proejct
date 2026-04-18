import { useState } from "react";
import { Music2, MapPin, Globe2, Languages } from "lucide-react";
import { SITE } from "@/config";

function Trait({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="reveal group flex items-start gap-4 rounded-xl border border-soft-2 bg-card p-5 transition-all duration-300 hover:border-acid/40 hover:bg-acid/5">
      <div className="grid h-10 w-10 place-items-center rounded-lg border border-soft-2 bg-surface text-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-syne text-[16px] font-bold text-ink">{title}</h4>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{desc}</p>
      </div>
    </div>
  );
}

function NowPlaying() {
  const [bars] = useState([1, 2, 3, 4]);
  return (
    <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-soft-2 bg-card px-4 py-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-acid/10 text-acid">
        <Music2 size={16} />
      </div>
      <div className="min-w-0">
        <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
          Now Playing
        </div>
        <div className="font-syne text-[13px] font-bold text-ink truncate">
          {SITE.nowPlaying.title} <span className="text-ink-2 font-medium">— {SITE.nowPlaying.artist}</span>
        </div>
      </div>
      <div className="ml-2 flex h-5 items-end gap-[2px]">
        {bars.map((b) => (
          <span
            key={b}
            className="w-[3px] rounded-sm bg-acid"
            style={{
              animation: `pulse-dot 0.9s ease-in-out ${b * 0.12}s infinite`,
              height: `${30 + b * 15}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left — profile photo with glowing ring */}
        <div className="revl relative flex justify-center lg:justify-start">
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-acid/40 via-cyan/20 to-plasma/30 blur-2xl opacity-60 animate-pulse-dot" />
            {/* Rotating ring */}
            <div
              className="absolute -inset-2 rounded-full border-2 border-acid/40"
              style={{ animation: "spin 12s linear infinite" }}
            />
            <div className="relative h-[300px] w-[300px] overflow-hidden rounded-full border-4 border-acid/60 bg-surface shadow-[0_0_60px_-10px_hsl(var(--acid)/0.5)] lg:h-[360px] lg:w-[360px]">
              {/* Initials placeholder — swap for real <img> later */}
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-void via-surface to-base">
                <span className="font-syne text-[120px] font-extrabold text-grad-acid">
                  ES
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-void/40 to-transparent" />
            </div>

            {/* Available badge */}
            <div className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-acid/40 bg-void px-4 py-2 shadow-[0_10px_30px_-5px_rgba(0,255,179,0.4)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-sonar rounded-full bg-acid" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid animate-pulse-dot" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-acid">
                {SITE.isAvailable ? "Available" : "Booked"}
              </span>
            </div>
          </div>
        </div>

        {/* Right text */}
        <div className="revr">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-acid" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">01 — About</span>
          </div>
          <h2
            className="mt-6 font-syne font-extrabold leading-[1.05]"
            style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
          >
            <span className="text-ink">More than </span>
            <span className="text-grad-acid">just code.</span>
          </h2>
          <p className="mt-7 text-[16px] leading-[1.85] text-ink-2">
            I'm a full stack engineer who takes ownership of the entire product. Before writing a single line,
            I think in systems — data models, API contracts, edge cases, deployment strategies.
          </p>
          <p className="mt-4 text-[16px] leading-[1.85] text-ink-2">
            Currently pursuing B.Tech in CSE while shipping production-grade products for clients worldwide.
            I don't wait to graduate to start building.
          </p>

          {/* Quick facts */}
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-2">
              <MapPin size={14} className="text-acid" /> {SITE.location}
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-2">
              <Globe2 size={14} className="text-acid" /> {SITE.timezone}
            </div>
            <div className="inline-flex items-center gap-2 font-mono text-[12px] text-ink-2">
              <Languages size={14} className="text-acid" /> {SITE.languages.join(" · ")}
            </div>
          </div>

          <NowPlaying />

          <div className="mt-10 space-y-3">
            <Trait icon="⚡" title="Systems First" desc="Architecture before implementation. I design for 10x scale from day one." />
            <Trait icon="🎯" title="Full Ownership" desc="DB schema to CI/CD pipeline — I own every layer, no handoffs needed." />
            <Trait icon="🚀" title="Ship-Obsessed" desc="Success = deployed features + zero-bug production. Nothing else counts." />
          </div>
        </div>
      </div>
    </section>
  );
}
