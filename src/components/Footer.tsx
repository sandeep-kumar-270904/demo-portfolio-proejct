export default function Footer() {
  return (
    <footer className="border-t border-soft-2 bg-void px-6 py-10">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 text-center md:grid-cols-3 md:text-left">
        <div>
          <div className="font-syne text-[18px] font-extrabold">
            SANDEEP<span className="text-acid text-glow-acid">.</span>
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2025 Edhubilli Sandeep Kumar
          </div>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {[
            ["About", "#about"],
            ["Work", "#projects"],
            ["Skills", "#skills"],
            ["Contact", "#contact"],
          ].map(([l, h]) => (
            <li key={l}>
              <a href={h} className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-acid">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="md:text-right">
          <div className="italic text-[14px] text-ink-2">Designed &amp; Engineered with obsession.</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Made in India 🇮🇳
          </div>
        </div>
      </div>
    </footer>
  );
}
