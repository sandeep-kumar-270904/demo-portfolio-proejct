import { useTestimonials } from "@/hooks/useSupabase";
import type { DbTestimonial } from "@/data/testimonialsFallback";

const ACCENT_BG = ["bg-grad-acid", "bg-grad-fire", "bg-grad-plasma"];

function Card({ t, idx }: { t: DbTestimonial; idx: number }) {
  const initial = t.name.charAt(0).toUpperCase();
  const bg = ACCENT_BG[idx % ACCENT_BG.length];
  const meta = [t.role, t.company].filter(Boolean).join(" · ");
  return (
    <div className="group flex h-full w-[420px] shrink-0 flex-col rounded-2xl border border-soft-2 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/30">
      <div className="font-syne text-[52px] font-extrabold leading-none text-grad-acid">"</div>
      <p className="mt-2 italic text-[15px] leading-[1.75] text-ink-2 line-clamp-6">{t.quote}</p>
      <div className="mt-7 flex items-center gap-3">
        {t.avatar_url ? (
          <img
            src={t.avatar_url}
            alt={t.name}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div
            className={`grid h-11 w-11 place-items-center rounded-full ${bg} font-syne text-[16px] font-extrabold text-void`}
          >
            {initial}
          </div>
        )}
        <div>
          <div className="font-syne text-[14px] font-bold text-ink">{t.name}</div>
          {meta && (
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {meta}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-acid text-[12px]">★★★★★</div>
    </div>
  );
}

export default function Testimonials() {
  const { data: items = [] } = useTestimonials();

  if (items.length === 0) return null;

  // Duplicate the list to enable seamless marquee scrolling.
  const loop = [...items, ...items];

  return (
    <section className="relative overflow-hidden bg-base px-6 py-28 lg:py-40">
      <div className="mx-auto max-w-[1320px]">
        <div className="reveal flex items-center gap-3">
          <span className="h-px w-8 bg-acid" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-acid">
            05 — Proof
          </span>
        </div>
        <h2
          className="reveal mt-6 font-syne font-extrabold leading-[1.05]"
          style={{ fontSize: "clamp(36px, 5.5vw, 70px)", letterSpacing: "-0.04em" }}
        >
          <span className="text-ink">What They </span>
          <span className="text-grad-acid">Say</span>
        </h2>
      </div>

      {/* Marquee track — pauses on hover */}
      <div
        className="reveal mt-14 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
        aria-label="Client testimonials"
      >
        <div className="flex w-max gap-6 px-6 animate-marquee-left hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={`${t.id}-${i}`} t={t} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
