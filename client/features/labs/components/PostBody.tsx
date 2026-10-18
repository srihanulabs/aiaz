import type { Block } from "../data/posts";
import CodeBlock from "./CodeBlock";

/** Renders `inline code` written with backticks. */
const Inline = ({ text }: { text: string }) => (
  <>
    {text.split("`").map((part, i) =>
      i % 2 === 1 ? (
        <code
          key={i}
          className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-cyan-200"
        >
          {part}
        </code>
      ) : (
        part
      ),
    )}
  </>
);

const PostBody = ({ blocks }: { blocks: Block[] }) => (
  <div className="text-[17px] leading-8 text-slate-300">
    {blocks.map((b, i) => {
      switch (b.type) {
        case "h2":
          return (
            <h2
              key={i}
              id={b.id}
              className="group mt-14 scroll-mt-28 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              <a href={`#${b.id}`} className="no-underline">
                {b.text}
                <span
                  className="ml-2 text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                >
                  #
                </span>
              </a>
            </h2>
          );
        case "p":
          return (
            <p key={i} className="mt-5 text-pretty">
              <Inline text={b.text} />
            </p>
          );
        case "ul":
          return (
            <ul key={i} className="mt-5 space-y-3">
              {b.items.map((item, j) => (
                <li key={j} className="flex gap-3">
                  <span className="mt-3 size-1.5 shrink-0 rounded-full bg-cyan-300" aria-hidden />
                  <span>
                    <Inline text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        case "code":
          return <CodeBlock key={i} code={b.code} lang={b.lang} filename={b.filename} />;
        case "callout":
          return (
            <aside
              key={i}
              className="my-8 rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-5"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-300">
                {b.title}
              </p>
              <p className="mt-2 text-base leading-7">
                <Inline text={b.text} />
              </p>
            </aside>
          );
      }
    })}
  </div>
);

export default PostBody;
