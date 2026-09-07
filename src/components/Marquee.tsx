import { useScrollVelocity } from "@/lib/motion";

const ROW1 = [
  "Edhubilli Sandeep Kumar",
  "Full Stack Engineer",
  "React",
  "Node.js",
  "Next.js",
  "TypeScript",
  "PostgreSQL",
  "Redis",
  "Docker",
  "AWS",
  "Available for Hire",
];

const ROW2 = [...ROW1].reverse();

function Row({ items, dir, speed }: { items: string[]; dir: "left" | "right"; speed: number }) {
  const dup = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden pause-on-hover">
      <div
        className={`flex w-max ${dir === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {dup.map((it, i) => {
          const accent = it === ROW1[0] || it === "Available for Hire";
          return (
            <span key={i} className="flex items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.15em] whitespace-nowrap">
              <span className={accent ? "text-acid" : "text-muted-foreground"}>{it}</span>
              <span className="text-dim">◆</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Marquee() {
  // Scroll velocity subtly accelerates the marquee (shorter duration = faster).
  const v = useScrollVelocity();
  const speed = 40 - Math.min(1, v) * 18;

  return (
    <section className="border-y border-soft-2 bg-surface py-5">
      <Row items={ROW1} dir="left" speed={speed} />
      <div className="h-2" />
      <Row items={ROW2} dir="right" speed={speed} />
    </section>
  );
}
