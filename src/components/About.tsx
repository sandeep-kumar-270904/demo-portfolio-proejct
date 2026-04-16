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

export default function About() {
  const rows = [
    ["Location", "India · Remote"],
    ["Experience", "3+ Years"],
    ["Specialty", "Full Stack Systems"],
    ["Education", "B.Tech CSE · 8.4+"],
    ["Availability", "Immediate"],
  ];
  return (
    <section id="about" className="relative bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left card */}
        <div className="revl relative">
          <div className="relative overflow-hidden rounded-2xl border border-soft-2 bg-card p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-acid/10 blur-3xl" />
            <div
              className="pointer-events-none absolute -left-2 top-2 select-none font-syne text-[96px] font-extrabold leading-none text-stroke-acid opacity-50"
            >
              ESK
            </div>

            <div className="relative mt-24 divide-y divide-soft-2">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {k}
                  </span>
                  <span className="font-syne text-[15px] font-bold text-grad-acid">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-5 right-6 inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2 font-syne text-[12px] font-bold text-void shadow-[0_10px_30px_-5px_rgba(0,255,179,0.5)]">
            ↑ Open to Offers
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
