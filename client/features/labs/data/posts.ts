import type { CategoryId } from "@/features/showcase/data/catalog";

export type PostStatus = "published" | "soon";

/** Article body, as typed blocks. Inline `code` is written with backticks. */
export type Block =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; filename?: string; code: string }
  | { type: "callout"; title: string; text: string };

export type LabsPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: CategoryId;
  tags: string[];
  readTime: string;
  status: PostStatus;
  /** ISO date (YYYY-MM-DD). Set when the post is published. */
  publishedAt?: string;
  /** Where the post lives (internal route or external article). Required to be clickable. */
  href?: string;
  /** Image for the featured card (path under /public). */
  preview?: string;
  /** Article body. Posts without content render an "in the works" page. */
  content?: Block[];
};

// Placeholder topics — replace with your real posts. To publish one, set
// `status: "published"`, `publishedAt` and `href`. The first entry is featured.
export const posts: LabsPost[] = [
  {
    slug: "streaming-chat-ui",
    title: "Building a streaming chat UI that doesn't jank",
    excerpt:
      "Token-by-token rendering, scroll behaviour and abort handling — the patterns that keep an LLM chat feeling instant.",
    category: "ai",
    tags: ["Streaming", "React 19", "UX"],
    readTime: "4 min read",
    status: "published",
    publishedAt: "2026-10-19",
    href: "/labs/streaming-chat-ui",
    preview: "/previews/streaming-chat.webp",
    content: [
      {
        type: "p",
        text: "A chat interface that streams tokens looks simple: append text as it arrives. In practice it is one of the easiest ways to ship a janky UI. Every chunk can trigger a render, a layout pass and a scroll jump — dozens of times per second.",
      },
      { type: "h2", id: "why-it-janks", text: "Why streaming UIs jank" },
      {
        type: "ul",
        items: [
          "Each network chunk calls `setState`, so React re-renders far more often than the screen refreshes.",
          "Markdown re-parsing the whole message on every token is quadratic work.",
          "Auto-scrolling fights the user when they scroll up to re-read.",
        ],
      },
      { type: "h2", id: "stream-with-fetch", text: "Stream with fetch, not polling" },
      {
        type: "p",
        text: "The Fetch API exposes the response as a `ReadableStream`. Wrap it in an async generator and the rest of your UI can consume tokens with a plain `for await` loop — and cancel with an `AbortSignal`.",
      },
      {
        type: "code",
        lang: "ts",
        filename: "stream.ts",
        code: `export async function* streamTokens(prompt: string, signal: AbortSignal) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error("Request failed");

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) return;
    yield value;
  }
}`,
      },
      { type: "h2", id: "batch-to-the-frame", text: "Batch renders to the frame" },
      {
        type: "p",
        text: "Network chunks arrive on their own schedule; the screen refreshes at 60 or 120Hz. Buffer the incoming text and flush it once per animation frame, so React renders at most once per paint no matter how fast tokens arrive.",
      },
      {
        type: "code",
        lang: "tsx",
        filename: "useStreamedText.ts",
        code: `export function useStreamedText() {
  const [text, setText] = useState("");
  const buffer = useRef("");
  const frame = useRef(0);

  const push = (chunk: string) => {
    buffer.current += chunk;
    if (frame.current) return; // a flush is already scheduled

    frame.current = requestAnimationFrame(() => {
      const next = buffer.current;
      buffer.current = "";
      frame.current = 0;
      setText((t) => t + next);
    });
  };

  return { text, push };
}`,
      },
      {
        type: "callout",
        title: "Measure before you optimise",
        text: "Record a Performance profile of a long response. If you don't see long tasks or layout thrashing, you don't need this — but chat UIs with markdown and code highlighting almost always do.",
      },
      { type: "h2", id: "respect-scroll", text: "Respect the user's scroll" },
      {
        type: "p",
        text: "Only follow the stream if the reader is already at the bottom. The moment they scroll up, stop — and offer a button to jump back down.",
      },
      {
        type: "code",
        lang: "ts",
        code: `const nearBottom =
  el.scrollHeight - el.scrollTop - el.clientHeight < 80;

if (nearBottom) el.scrollTo({ top: el.scrollHeight });`,
      },
      { type: "h2", id: "escape-hatch", text: "Always ship an escape hatch" },
      {
        type: "p",
        text: "A stop button wired to `AbortController.abort()` is the single most appreciated control in an LLM interface. Keep the partial answer on screen, mark it as stopped, and let the user retry from there.",
      },
    ],
  },
  {
    slug: "verifiable-citations",
    title: "Citations users can actually verify",
    excerpt:
      "How to ground RAG answers and link every claim back to the exact source passage.",
    category: "rag",
    tags: ["RAG", "Grounding", "Citations"],
    readTime: "6 min read",
    status: "soon",
  },
  {
    slug: "aria-combobox",
    title: "Keyboard-first comboboxes: ARIA 1.2 in practice",
    excerpt:
      "What the spec says, what screen readers really announce, and the bugs that slip through.",
    category: "accessibility",
    tags: ["ARIA", "Keyboard", "WCAG 2.2"],
    readTime: "7 min read",
    status: "soon",
  },
  {
    slug: "virtualised-tables",
    title: "Rendering 100k rows at 60fps",
    excerpt:
      "Windowing, memoisation and measuring with the profiler — a practical guide to fast data grids.",
    category: "optimised",
    tags: ["Performance", "Virtualisation"],
    readTime: "9 min read",
    status: "soon",
  },
  {
    slug: "hybrid-search",
    title: "Hybrid search: when keywords beat embeddings",
    excerpt:
      "Combining BM25 with vector search and reranking, and how to tell which one is winning.",
    category: "rag",
    tags: ["Hybrid search", "Rerank", "Evaluation"],
    readTime: "10 min read",
    status: "soon",
  },
  {
    slug: "live-regions",
    title: "Announcing changes: aria-live without the noise",
    excerpt:
      "Polite vs assertive, toasts, async results — making dynamic UI usable with a screen reader.",
    category: "accessibility",
    tags: ["aria-live", "Screen readers"],
    readTime: "5 min read",
    status: "soon",
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** Other posts, preferring the same category, for "keep reading". */
export const relatedPosts = (post: LabsPost, count = 2): LabsPost[] => {
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  return [...same, ...others.filter((p) => p.category !== post.category)].slice(0, count);
};
