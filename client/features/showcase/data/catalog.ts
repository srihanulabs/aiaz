export type CategoryId = "ai" | "accessibility" | "rag" | "optimised";

export type ProjectStatus = "live" | "in-progress" | "planned";

export type GroupId = "intelligence" | "quality";

export type Category = {
  id: CategoryId;
  /** Which overview group the category belongs to. */
  group: GroupId;
  name: string;
  tagline: string;
  description: string;
  /** Accent colour used for the category's glow, borders and badges. */
  accent: string;
};

export type Project = {
  slug: string;
  category: CategoryId;
  name: string;
  summary: string;
  tags: string[];
  status: ProjectStatus;
  /** Demo route. Leave undefined until the demo page exists. */
  href?: string;
  /** Screenshot shown on the card (path under /public). Falls back to a generated pattern. */
  preview?: string;
  /**
   * When present (even as `{}`), the card shows GitHub / video / live-demo
   * actions. Any URL left undefined renders as a disabled "coming soon" action.
   */
  links?: ProjectLinks;
};

export type ProjectLinks = {
  github?: string;
  /** YouTube (or other) walkthrough URL. */
  video?: string;
  /** Deployed demo URL. */
  demo?: string;
};

export const groups: { id: GroupId; name: string; description: string }[] = [
  {
    id: "intelligence",
    name: "Intelligence",
    description: "What your product knows, says and does.",
  },
  {
    id: "quality",
    name: "Quality",
    description: "How well it works — for everyone, at any scale.",
  },
];

export const categories: Category[] = [
  {
    id: "ai",
    group: "intelligence",
    name: "AI Interfaces",
    tagline: "Interfaces for intelligent systems",
    description:
      "Streaming chat, prompt tooling and agent observability — production-ready UI for LLM-powered products.",
    accent: "#a78bfa",
  },
  {
    id: "rag",
    group: "intelligence",
    name: "RAG",
    tagline: "Retrieval you can trust",
    description:
      "Components for retrieval-augmented generation: grounded answers, citations, ingestion and hybrid search.",
    accent: "#22d3ee",
  },
  {
    id: "accessibility",
    group: "quality",
    name: "Accessibility",
    tagline: "Inclusive by construction",
    description:
      "Keyboard-first, screen-reader-tested components built against WCAG 2.2 AA and the ARIA Authoring Practices.",
    accent: "#34d399",
  },
  {
    id: "optimised",
    group: "quality",
    name: "Optimised",
    tagline: "Fast at scale",
    description:
      "Performance-tuned React: virtualisation, concurrent rendering and image pipelines measured against Core Web Vitals.",
    accent: "#fbbf24",
  },
];

// Placeholder catalogue — replace entries as real components ship, and set
// `status: "live"` plus an `href` once a demo page exists.
export const projects: Project[] = [
  // AI
  {
    slug: "streaming-chat",
    category: "ai",
    name: "StreamingChat",
    summary:
      "Token-by-token chat UI with markdown rendering, abort, retry and optimistic message state.",
    tags: ["SSE", "Markdown", "React 19"],
    status: "in-progress",
  },
  {
    slug: "prompt-playground",
    category: "ai",
    name: "PromptPlayground",
    summary:
      "Side-by-side prompt and model comparison with parameter controls and shareable runs.",
    tags: ["Multi-model", "Diff view", "TypeScript"],
    status: "planned",
  },
  {
    slug: "agent-trace-viewer",
    category: "ai",
    name: "AgentTraceViewer",
    summary:
      "Timeline of tool calls, reasoning steps and token cost for debugging agent runs.",
    tags: ["Observability", "Timeline", "Tool use"],
    status: "planned",
  },

  // Accessibility
  {
    slug: "accessible-combobox",
    category: "accessibility",
    name: "AccessibleCombobox",
    summary:
      "ARIA 1.2 combobox with full keyboard support and screen-reader announcements for result counts.",
    tags: ["ARIA 1.2", "Keyboard", "WCAG 2.2"],
    status: "in-progress",
  },
  {
    slug: "focus-trap-dialog",
    category: "accessibility",
    name: "FocusTrapDialog",
    summary:
      "Modal dialog with focus trapping, inert background and reliable focus restoration.",
    tags: ["Focus management", "inert", "Esc to close"],
    status: "planned",
  },
  {
    slug: "live-region-toaster",
    category: "accessibility",
    name: "LiveRegionToaster",
    summary:
      "Toast notifications announced politely or assertively, with timing that respects user needs.",
    tags: ["aria-live", "Reduced motion", "Queue"],
    status: "planned",
  },

  // RAG
  {
    slug: "cited-answer",
    category: "rag",
    name: "CitedAnswer",
    summary:
      "Grounded answers with inline citations that highlight the exact source passage on hover.",
    tags: ["Citations", "Grounding", "Highlights"],
    status: "in-progress",
    links: {},
  },
  {
    slug: "ingestion-monitor",
    category: "rag",
    name: "IngestionMonitor",
    summary:
      "Live view of document chunking, embedding and indexing progress with per-file error handling.",
    tags: ["Chunking", "Embeddings", "Progress"],
    status: "planned",
    links: {},
  },
  {
    slug: "hybrid-search-box",
    category: "rag",
    name: "HybridSearchBox",
    summary:
      "Keyword + vector search with reranked results, facets and relevance score inspection.",
    tags: ["Hybrid search", "Rerank", "Facets"],
    status: "planned",
    links: {},
  },

  // Optimised
  {
    slug: "virtualised-table",
    category: "optimised",
    name: "VirtualisedTable",
    summary:
      "Windowed data grid that stays at 60fps with 100k+ rows, sticky headers and resizable columns.",
    tags: ["Virtualisation", "Memoisation", "60fps"],
    status: "in-progress",
  },
  {
    slug: "adaptive-image-gallery",
    category: "optimised",
    name: "AdaptiveImageGallery",
    summary:
      "Responsive gallery with blur placeholders, AVIF/WebP sources and priority hints for LCP.",
    tags: ["AVIF", "LCP", "Lazy loading"],
    status: "planned",
  },
  {
    slug: "deferred-search",
    category: "optimised",
    name: "DeferredSearch",
    summary:
      "Instant-feel filtering over large lists using transitions and deferred values — no debounce hacks.",
    tags: ["useTransition", "useDeferredValue", "Concurrent"],
    status: "planned",
  },
];

export const projectsByCategory = (id: CategoryId): Project[] =>
  projects.filter((p) => p.category === id);

export const statusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  planned: "Planned",
};

/** How far along the build → ship pipeline each status is (out of 3). */
export const statusStage: Record<ProjectStatus, number> = {
  planned: 1,
  "in-progress": 2,
  live: 3,
};

export const statusCounts = (list: Project[]): Record<ProjectStatus, number> => ({
  live: list.filter((p) => p.status === "live").length,
  "in-progress": list.filter((p) => p.status === "in-progress").length,
  planned: list.filter((p) => p.status === "planned").length,
});
