import type { ReactNode } from "react";
import CopyButton from "./CopyButton";

const TOKEN =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(const|let|var|function|return|import|from|export|async|await|if|else|new|type|interface|for|of|in|while|throw|yield|true|false|null|undefined)\b|\b(\d+(?:\.\d+)?)\b/gm;

/** Tiny dependency-free tinting for TS/JS snippets: comments, strings, keywords, numbers. */
const highlight = (code: string): ReactNode[] => {
  const out: ReactNode[] = [];
  let last = 0;

  for (const m of code.matchAll(TOKEN)) {
    const index = m.index ?? 0;
    if (index > last) out.push(code.slice(last, index));

    const cls = m[1]
      ? "text-slate-500 italic"
      : m[2]
        ? "text-emerald-300"
        : m[3]
          ? "text-violet-300"
          : "text-amber-300";
    out.push(
      <span key={index} className={cls}>
        {m[0]}
      </span>,
    );
    last = index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
};

type Props = { code: string; lang: string; filename?: string };

const CodeBlock = ({ code, lang, filename }: Props) => (
  <figure className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#070b14]">
    <figcaption className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
      <span className="flex items-center gap-2 font-mono text-xs text-faint">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-400/60" />
          <span className="size-2.5 rounded-full bg-amber-400/60" />
          <span className="size-2.5 rounded-full bg-emerald-400/60" />
        </span>
        {filename ?? lang}
      </span>
      <CopyButton text={code} />
    </figcaption>
    {/* Focusable so keyboard users can scroll long lines. */}
    <pre tabIndex={0} className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-slate-200">
      <code>{highlight(code)}</code>
    </pre>
  </figure>
);

export default CodeBlock;
