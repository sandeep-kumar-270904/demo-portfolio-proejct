import { useEffect, useRef, useState } from "react";

const FULL = `interface Engineer {
  name: string;
  role: string;
  stack: string[];
  shipping: boolean;
}

const sandeep: Engineer = {
  name: "Edhubilli Sandeep Kumar",
  role: "Full Stack Engineer",
  stack: ["TypeScript", "Node.js", "PostgreSQL"],
  shipping: true,
};

async function build(idea: string) {
  const system = await architect(idea);
  return await deploy(system);
}`;

// Simple syntax token map
function highlight(text: string) {
  // We'll color line by line using regex replacements in JSX-safe way
  return text.split("\n").map((line, i) => {
    const tokens: { t: string; c: string }[] = [];
    let rest = line;
    const patterns: [RegExp, string][] = [
      [/^(\s*\/\/.*)$/, "text-[#4a4a6a]"],
      [/(\binterface\b|\bconst\b|\basync\b|\bawait\b|\breturn\b|\bfunction\b)/, "text-plasma"],
      [/(["'`][^"'`]*["'`])/, "text-[#ff9c6e]"],
      [/(\bstring\b|\bboolean\b|\bEngineer\b)/, "text-cyan"],
      [/(\btrue\b|\bfalse\b|architect|deploy|build)/, "text-acid"],
    ];
    // Naive single-pass: split into spans
    // Comment-only line shortcut
    const cm = line.match(/^(\s*)(\/\/.*)$/);
    if (cm) {
      return (
        <div key={i}>
          <span>{cm[1]}</span>
          <span className="text-[#4a4a6a]">{cm[2]}</span>
        </div>
      );
    }
    // Tokenize
    const out: React.ReactNode[] = [];
    const re = /(\binterface\b|\bconst\b|\basync\b|\bawait\b|\breturn\b|\bfunction\b)|(\bstring\b|\bboolean\b|\bEngineer\b)|(\btrue\b|\bfalse\b)|(\b(?:architect|deploy|build)\b)|("[^"]*"|'[^']*')/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) out.push(<span key={`p${i}-${last}`}>{line.slice(last, m.index)}</span>);
      let cls = "";
      if (m[1]) cls = "text-plasma";
      else if (m[2]) cls = "text-cyan";
      else if (m[3]) cls = "text-acid";
      else if (m[4]) cls = "text-acid";
      else if (m[5]) cls = "text-[#ff9c6e]";
      out.push(<span key={`m${i}-${m.index}`} className={cls}>{m[0]}</span>);
      last = m.index + m[0].length;
    }
    if (last < line.length) out.push(<span key={`e${i}`}>{line.slice(last)}</span>);
    return <div key={i}>{out.length ? out : <span>&nbsp;</span>}</div>;
  });
}

export default function Terminal() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [hover, setHover] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let i = 0;
    const total = FULL.length;
    const stepMs = 1800 / total;
    const id = setInterval(() => {
      i += Math.max(1, Math.round(2 + Math.random() * 2));
      if (i >= total) {
        setText(FULL);
        setDone(true);
        clearInterval(id);
      } else {
        setText(FULL.slice(0, i));
      }
    }, stepMs);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative rounded-2xl border border-soft-2 bg-card overflow-hidden transition-all duration-500 ease-out"
      style={{
        transform: hover ? "rotate(0deg) translateY(-8px)" : "rotate(1.2deg)",
        boxShadow: hover
          ? "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px hsl(var(--acid)/0.3), 0 0 60px hsl(var(--acid)/0.18)"
          : "0 40px 80px rgba(0,0,0,0.65)",
      }}
    >
      {/* radial glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-acid/15 blur-3xl" />

      {/* header */}
      <div className="flex items-center gap-3 border-b border-soft-2 bg-void/40 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">~/sandeep/stack.ts</span>
      </div>

      {/* code */}
      <pre className="relative overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.7] text-ink-2">
        <code>
          {highlight(text)}
          {!done && <span className="inline-block h-[14px] w-[7px] translate-y-[2px] bg-acid animate-blink" />}
        </code>
      </pre>
    </div>
  );
}
