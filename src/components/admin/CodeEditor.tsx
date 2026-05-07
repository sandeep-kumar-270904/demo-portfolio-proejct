import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";

type Lang = "markdown" | "tsx" | "ts" | "jsx" | "js" | "css" | "json" | "bash";

interface Props {
  value: string;
  onChange: (v: string) => void;
  language?: Lang;
  placeholder?: string;
  rows?: number;
}

export default function CodeEditor({
  value,
  onChange,
  language = "markdown",
  placeholder,
  rows = 18,
}: Props) {
  const grammar = Prism.languages[language] ?? Prism.languages.markup;
  return (
    <div className="overflow-hidden rounded-lg border border-soft-2 bg-surface focus-within:border-acid/50">
      <div className="flex items-center justify-between border-b border-soft-2/60 bg-void/40 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {language}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {value.length} chars
        </span>
      </div>
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => Prism.highlight(code, grammar, language)}
        padding={14}
        placeholder={placeholder}
        textareaClassName="!outline-none"
        style={{
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 13,
          minHeight: rows * 22,
          color: "hsl(var(--ink))",
          caretColor: "hsl(var(--acid))",
        }}
      />
    </div>
  );
}
