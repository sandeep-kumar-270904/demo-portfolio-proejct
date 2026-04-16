const T = [
  {
    quote:
      "Sandeep doesn't just deliver features — he delivers systems. The architecture he designed handled 10x expected traffic on launch day without a single incident.",
    name: "Rahul M.",
    role: "CTO · TechVenture India",
    initial: "R",
    bg: "bg-grad-acid",
  },
  {
    quote:
      "Best freelance developer I've worked with. He asked the right questions before writing a line of code. Shipped ahead of schedule with zero production bugs.",
    name: "Priya S.",
    role: "Founder · E-Commerce Startup",
    initial: "P",
    bg: "bg-grad-fire",
  },
  {
    quote:
      "Sandeep's code is as clean as his communication. He understood our business logic better than we did. Will hire again without question.",
    name: "Alex K.",
    role: "PM · SaaS Company",
    initial: "A",
    bg: "bg-grad-plasma",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">05 — Proof</span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">What They </span>
          <span className="text-grad-acid">Say</span>
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {T.map((t, i) => (
            <div
              key={i}
              className="reveal group rounded-2xl border border-soft-2 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/30"
            >
              <div className="font-syne text-[52px] font-extrabold leading-none text-grad-acid">"</div>
              <p className="mt-2 italic text-[15px] leading-[1.75] text-ink-2">{t.quote}</p>
              <div className="mt-7 flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${t.bg} font-syne text-[16px] font-extrabold text-void`}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-syne text-[14px] font-bold text-ink">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <div className="mt-4 text-acid text-[12px]">★★★★★</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
