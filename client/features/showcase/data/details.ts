/**
 * Long-form content for each project's details page, keyed by project slug.
 * Written as design intent: the components are in development, so usage
 * snippets show the planned API and numbers are targets, not measurements.
 */
export type ProjectDetails = {
  problem: string;
  solution: string;
  features: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  usage: { filename: string; lang: string; code: string };
  /** Category-specific table (keyboard map, pipeline, performance targets…). */
  spotlight: { title: string; intro: string; head: string[]; rows: string[][] };
  stack: string[];
};

export const details: Record<string, ProjectDetails> = {
  "streaming-chat": {
    problem:
      "Streaming responses look simple, but naive implementations re-render on every token, jump the reader's scroll position and leave users with no way to stop or recover.",
    solution:
      "StreamingChat renders tokens once per frame, protects the reader's scroll position and ships stop, retry and regenerate controls out of the box.",
    features: [
      { title: "Frame-batched rendering", text: "Incoming tokens are buffered and flushed once per animation frame, so React never renders faster than the screen refreshes." },
      { title: "Incremental markdown", text: "Lists, code blocks and inline formatting render as they stream, without reflowing the message." },
      { title: "Abort, retry, regenerate", text: "Stop mid-answer, keep the partial text, and retry from the same point." },
      { title: "Scroll anchoring", text: "Follows the stream only while the reader is at the bottom, with a jump-to-latest button otherwise." },
    ],
    steps: [
      { title: "Send", text: "The message is added optimistically and a request opens with an AbortController." },
      { title: "Stream", text: "Chunks are buffered and flushed on the next animation frame." },
      { title: "Render", text: "Markdown is parsed incrementally; code blocks are highlighted once they close." },
      { title: "Settle", text: "The final message is committed, controls return and any error offers a retry." },
    ],
    usage: {
      filename: "ChatPage.tsx",
      lang: "tsx",
      code: `<StreamingChat
  endpoint="/api/chat"
  onFinish={(message) => save(message)}
  suggestions={["Summarise this report", "Draft a reply"]}
/>`,
    },
    spotlight: {
      title: "States and interactions",
      intro: "Every state a real conversation passes through, and what the user sees.",
      head: ["State", "Behaviour"],
      rows: [
        ["Idle", "Input focused, suggestions visible."],
        ["Streaming", "Tokens appended per frame; Stop button shown."],
        ["Stopped", "Partial answer kept, marked as stopped, Retry offered."],
        ["Error", "Message preserved with inline retry; typed input is never lost."],
        ["Offline", "Sending disabled with a clear explanation."],
      ],
    },
    stack: ["React 19", "TypeScript", "Fetch streams", "AbortController", "Tailwind CSS"],
  },

  "prompt-playground": {
    problem:
      "Comparing prompts and models usually means copy-pasting between tabs, losing parameters and eyeballing the differences.",
    solution:
      "PromptPlayground runs one prompt against several models side by side with shared parameters, highlighted differences and shareable runs.",
    features: [
      { title: "Side-by-side runs", text: "Send the same prompt to multiple models at once and watch the answers stream in parallel." },
      { title: "Parameter controls", text: "Temperature, max tokens and top-p per model, saved with every run." },
      { title: "Word-level diff", text: "Differences between outputs are highlighted so you can see what changed, not just that it did." },
      { title: "Shareable runs", text: "A run captures prompt, settings and outputs behind a single link." },
    ],
    steps: [
      { title: "Write", text: "Compose the prompt and any variables." },
      { title: "Configure", text: "Pick models and set parameters for each." },
      { title: "Run", text: "Requests fire in parallel and stream back independently." },
      { title: "Compare", text: "Review diffs, latency and cost, then share or save the run." },
    ],
    usage: {
      filename: "Playground.tsx",
      lang: "tsx",
      code: `<PromptPlayground
  models={["model-a", "model-b"]}
  defaultParams={{ temperature: 0.2, maxTokens: 512 }}
  onRun={(run) => saveRun(run)}
/>`,
    },
    spotlight: {
      title: "Metrics captured per run",
      intro: "Enough detail to reproduce a run and judge it fairly.",
      head: ["Metric", "What it shows"],
      rows: [
        ["Latency", "Time to first token and total completion time."],
        ["Tokens", "Prompt and completion token counts."],
        ["Cost", "Estimated from the model's token pricing."],
        ["Diff", "Word-level differences between outputs."],
        ["Parameters", "Exact settings, so any run can be repeated."],
      ],
    },
    stack: ["React 19", "TypeScript", "Server-Sent Events", "Zod", "Tailwind CSS"],
  },

  "agent-trace-viewer": {
    problem:
      "Agent runs fail somewhere inside a chain of tool calls, and plain logs hide what the model actually did and why.",
    solution:
      "AgentTraceViewer turns a run into a navigable timeline of LLM calls and tool invocations, with inputs, outputs, latency and token cost for every step.",
    features: [
      { title: "Span timeline", text: "A Gantt-style view shows what ran, in what order and for how long." },
      { title: "Nested call tree", text: "Collapse or expand sub-agents and tool calls to focus on the failing branch." },
      { title: "Payload inspector", text: "Select any span to read its exact input and output as formatted JSON." },
      { title: "Cost roll-ups", text: "Token usage and spend summed per span and per run." },
    ],
    steps: [
      { title: "Capture", text: "Emit spans from your agent runtime as it executes." },
      { title: "Normalise", text: "Map them to one span schema regardless of framework." },
      { title: "Visualise", text: "Render the timeline and call tree." },
      { title: "Inspect", text: "Select a span to see its payloads, errors and cost." },
    ],
    usage: {
      filename: "TracePage.tsx",
      lang: "tsx",
      code: `<AgentTraceViewer
  trace={trace}
  onSelectSpan={(span) => console.log(span.name)}
/>`,
    },
    spotlight: {
      title: "Span schema",
      intro: "The small, framework-neutral shape every trace is converted to.",
      head: ["Field", "Purpose"],
      rows: [
        ["name", "Human-readable label, e.g. tool.search_docs."],
        ["kind", "llm, tool or agent — drives colour and grouping."],
        ["startMs / endMs", "Position and length on the timeline."],
        ["input / output", "Payloads shown in the inspector."],
        ["tokens / costUsd", "Usage roll-ups per span and per run."],
      ],
    },
    stack: ["React 19", "TypeScript", "SVG & CSS timeline", "OpenTelemetry-style spans"],
  },

  "accessible-combobox": {
    problem:
      "Autocomplete is one of the most frequently broken widgets: mouse-only, silent to screen readers, or a trap for keyboard focus.",
    solution:
      "AccessibleCombobox follows the ARIA 1.2 combobox pattern with a complete keyboard model and live announcements of the result count.",
    features: [
      { title: "ARIA 1.2 semantics", text: "combobox and listbox roles with aria-activedescendant, so DOM focus stays in the input." },
      { title: "Full keyboard model", text: "Arrows, Home/End, Enter and Escape behave the way users expect." },
      { title: "Result announcements", text: "A polite live region reports how many options are available as you type." },
      { title: "Visible focus, strong contrast", text: "Focus rings and states designed to meet WCAG 2.2 AA contrast." },
    ],
    steps: [
      { title: "Type", text: "The option list filters as the query changes." },
      { title: "Announce", text: "The result count is sent to a live region." },
      { title: "Navigate", text: "Arrow keys move the active option while focus stays in the input." },
      { title: "Select", text: "Enter commits the choice; Escape closes the list and keeps the text." },
    ],
    usage: {
      filename: "BookingForm.tsx",
      lang: "tsx",
      code: `<AccessibleCombobox
  label="Destination"
  options={cities}
  onSelect={(city) => setDestination(city)}
/>`,
    },
    spotlight: {
      title: "Keyboard and screen reader behaviour",
      intro: "The contract the component is built and tested against.",
      head: ["Key", "Action"],
      rows: [
        ["↓ / ↑", "Move the active option; the option is announced."],
        ["Enter", "Select the active option."],
        ["Esc", "Close the list and keep the typed text."],
        ["Home / End", "Jump to the first or last option."],
        ["Tab", "Close the list and move to the next control."],
      ],
    },
    stack: ["React 19", "TypeScript", "ARIA 1.2", "aria-live", "Tailwind CSS"],
  },

  "focus-trap-dialog": {
    problem:
      "Modals often let focus escape behind the overlay, lose the user's place on close, or leave background content readable to screen readers.",
    solution:
      "FocusTrapDialog traps focus, makes the page behind it inert and returns focus to the control that opened it.",
    features: [
      { title: "Focus trap", text: "Tab and Shift+Tab cycle within the dialog and never reach the page behind." },
      { title: "Inert background", text: "The rest of the page is removed from the accessibility tree while the dialog is open." },
      { title: "Configurable dismissal", text: "Escape and overlay clicks can be enabled or blocked for destructive flows." },
      { title: "Focus restoration", text: "On close, focus returns to the trigger so users keep their place." },
    ],
    steps: [
      { title: "Open", text: "Remember the trigger and mark the background inert." },
      { title: "Focus", text: "Move focus to the first control, or one you specify." },
      { title: "Trap", text: "Cycle focus at the dialog boundaries." },
      { title: "Close", text: "Remove inert and restore focus to the trigger." },
    ],
    usage: {
      filename: "DeleteProject.tsx",
      lang: "tsx",
      code: `<FocusTrapDialog
  title="Delete project?"
  open={open}
  onClose={() => setOpen(false)}
>
  <p>This can't be undone.</p>
</FocusTrapDialog>`,
    },
    spotlight: {
      title: "Behaviour contract",
      intro: "What the dialog guarantees at each moment.",
      head: ["Moment", "Guarantee"],
      rows: [
        ["On open", "Focus moves inside; the background becomes inert."],
        ["While open", "Tab and Shift+Tab never leave the dialog."],
        ["Escape", "Closes the dialog unless it is marked blocking."],
        ["On close", "Focus returns to the element that opened it."],
        ["Screen readers", "role=\"dialog\", aria-modal and a labelled title."],
      ],
    },
    stack: ["React 19", "TypeScript", "inert attribute", "ARIA dialog pattern"],
  },

  "live-region-toaster": {
    problem:
      "Toasts vanish before they can be read, and for screen reader users they often make no sound at all.",
    solution:
      "LiveRegionToaster announces messages through aria-live with the right urgency and gives people control over how long they stay.",
    features: [
      { title: "Polite and assertive", text: "Routine updates are announced politely; errors interrupt appropriately." },
      { title: "Time to read", text: "Timers pause on hover and focus, and every toast can be dismissed manually." },
      { title: "Sensible queue", text: "Duplicates are merged and the number of visible toasts is capped." },
      { title: "Reduced motion", text: "Entrance and exit animations respect the user's motion preference." },
    ],
    steps: [
      { title: "Trigger", text: "The app calls toast.success() or toast.error()." },
      { title: "Queue", text: "Messages are de-duplicated and ordered." },
      { title: "Announce", text: "The text is placed in the correct live region." },
      { title: "Display", text: "The visual toast appears and its timer pauses on interaction." },
    ],
    usage: {
      filename: "save.ts",
      lang: "ts",
      code: `toast.success("Changes saved");

toast.error("Payment failed", {
  urgency: "assertive",
  action: { label: "Retry", onClick: retry },
});`,
    },
    spotlight: {
      title: "Announcement rules",
      intro: "How each kind of message is announced and for how long it stays.",
      head: ["Type", "Live region", "Timing"],
      rows: [
        ["Success / info", "polite", "Auto-dismiss after 6 s; pauses on hover and focus."],
        ["Warning", "polite", "Auto-dismiss after 10 s."],
        ["Error", "assertive", "Stays until dismissed."],
        ["With an action", "By type", "Never auto-dismisses."],
      ],
    },
    stack: ["React 19", "TypeScript", "aria-live", "prefers-reduced-motion"],
  },

  "cited-answer": {
    problem:
      "RAG answers read confidently but are hard to trust: users can't see where a claim came from or check it.",
    solution:
      "CitedAnswer attaches numbered citations to claims and reveals the exact source passage on hover or focus.",
    features: [
      { title: "Inline citations", text: "Numbered markers sit beside the claim they support." },
      { title: "Highlighted passages", text: "The source panel scrolls to and highlights the exact supporting text." },
      { title: "Accessible by design", text: "Citations are focusable and announced, not hover-only." },
      { title: "Unsupported claims flagged", text: "Statements without a source are visibly marked." },
    ],
    steps: [
      { title: "Retrieve", text: "Fetch relevant chunks, each with an id." },
      { title: "Generate", text: "The model answers using only those chunks and emits [n] markers." },
      { title: "Resolve", text: "Each marker is mapped to its chunk, document and page." },
      { title: "Reveal", text: "Hover or focus shows the highlighted passage." },
    ],
    usage: {
      filename: "Answer.tsx",
      lang: "tsx",
      code: `<CitedAnswer
  answer={answer.text}
  sources={answer.sources}
  onOpenSource={(source) => openViewer(source)}
/>`,
    },
    spotlight: {
      title: "Retrieval pipeline",
      intro: "Where citations come from, end to end.",
      head: ["Stage", "What happens", "Output"],
      rows: [
        ["Retrieve", "Search the index for relevant chunks.", "Top-k chunks with ids"],
        ["Generate", "Model answers using only those chunks.", "Text with [n] markers"],
        ["Verify", "Check every marker maps to a real source.", "Validated citations"],
        ["Present", "Render markers and the source panel.", "Interactive answer"],
      ],
    },
    stack: ["React 19", "TypeScript", "Markdown", "ARIA"],
  },

  "ingestion-monitor": {
    problem:
      "Ingestion is a black box: documents silently fail, stall in a queue or end up half-indexed.",
    solution:
      "IngestionMonitor shows every document's progress through chunking, embedding and indexing, with clear errors and one-click retry.",
    features: [
      { title: "Per-document progress", text: "See exactly which stage each file is in and how far along it is." },
      { title: "Stage totals", text: "Counts for uploaded, chunked, embedded and indexed items at a glance." },
      { title: "Errors with context", text: "Failures say what went wrong and offer a retry for just that document." },
      { title: "Live updates", text: "Progress streams in without refreshing the page." },
    ],
    steps: [
      { title: "Upload", text: "Files are stored and validated." },
      { title: "Chunk", text: "Documents are split into overlapping passages." },
      { title: "Embed", text: "Passages are converted into vectors." },
      { title: "Index", text: "Vectors are written to the search store." },
    ],
    usage: {
      filename: "Knowledge.tsx",
      lang: "tsx",
      code: `<IngestionMonitor
  jobId={jobId}
  onRetry={(documentId) => retry(documentId)}
/>`,
    },
    spotlight: {
      title: "Pipeline stages",
      intro: "What each stage does and where it tends to fail.",
      head: ["Stage", "What happens", "Typical failure"],
      rows: [
        ["Upload", "File stored and validated.", "Unsupported format"],
        ["Chunk", "Split into passages with overlap.", "Empty or scanned pages"],
        ["Embed", "Passages converted to vectors.", "Rate limits, timeouts"],
        ["Index", "Vectors written to the store.", "Write conflicts"],
      ],
    },
    stack: ["React 19", "TypeScript", "Server-Sent Events", "TanStack Query"],
  },

  "hybrid-search-box": {
    problem:
      "Keyword search misses meaning and vector search misses exact terms — and users can't tell why a result ranked where it did.",
    solution:
      "HybridSearchBox combines both approaches, reranks the results and exposes the scores behind each one.",
    features: [
      { title: "Keyword + vector", text: "Exact matches and semantic matches from a single query." },
      { title: "Reranking", text: "A second pass orders the best candidates by relevance." },
      { title: "Facets and filters", text: "Narrow by source, date and more without losing the query." },
      { title: "Score inspector", text: "See the BM25, vector and rerank scores for any result." },
    ],
    steps: [
      { title: "Query", text: "Run keyword and vector searches in parallel." },
      { title: "Fuse", text: "Merge both lists with reciprocal rank fusion." },
      { title: "Rerank", text: "A cross-encoder reorders the top candidates." },
      { title: "Explain", text: "Show per-stage scores so ranking is transparent." },
    ],
    usage: {
      filename: "Search.tsx",
      lang: "tsx",
      code: `<HybridSearchBox
  search={(query, filters) => api.search(query, filters)}
  facets={["source", "updated"]}
  showScores
/>`,
    },
    spotlight: {
      title: "Ranking signals",
      intro: "Why combining signals beats relying on one.",
      head: ["Signal", "Strength", "Weakness"],
      rows: [
        ["BM25 keyword", "Exact terms, IDs and names", "Misses paraphrases"],
        ["Vector similarity", "Meaning and synonyms", "Can blur exact matches"],
        ["Rank fusion", "Balances both lists", "Needs tuning"],
        ["Reranker", "Best final ordering", "Adds latency"],
      ],
    },
    stack: ["React 19", "TypeScript", "BM25", "Vector search", "Reciprocal rank fusion"],
  },

  "virtualised-table": {
    problem:
      "Rendering tens of thousands of rows as DOM nodes freezes scrolling and bloats memory.",
    solution:
      "VirtualisedTable renders only the rows in view, plus a small buffer, so it stays smooth at any dataset size.",
    features: [
      { title: "Windowed rendering", text: "A fixed number of DOM rows are recycled as you scroll." },
      { title: "Sticky headers, resizable columns", text: "Familiar grid behaviour on top of the windowing." },
      { title: "Memoised cells", text: "Cells re-render only when their data changes." },
      { title: "Grid semantics", text: "ARIA grid roles and keyboard navigation for assistive tech." },
    ],
    steps: [
      { title: "Measure", text: "Read the viewport and row height." },
      { title: "Window", text: "Compute the visible range plus overscan." },
      { title: "Render", text: "Draw only those rows, positioned absolutely." },
      { title: "Recycle", text: "Update the same nodes as the user scrolls." },
    ],
    usage: {
      filename: "Orders.tsx",
      lang: "tsx",
      code: `<VirtualisedTable
  rows={orders}
  columns={columns}
  rowHeight={44}
  overscan={6}
/>`,
    },
    spotlight: {
      title: "Performance targets",
      intro: "Goals the component is built toward, to be verified with profiling.",
      head: ["Metric", "Target", "How it's measured"],
      rows: [
        ["Scroll frame rate", "60 fps", "Performance panel while scrolling"],
        ["Rows supported", "100,000+", "Synthetic dataset"],
        ["Rows in the DOM", "Under 60", "Elements panel count"],
        ["Interaction latency (INP)", "Under 200 ms", "Web Vitals"],
      ],
    },
    stack: ["React 19", "TypeScript", "ResizeObserver", "Memoisation"],
  },

  "adaptive-image-gallery": {
    problem:
      "Image-heavy pages tank Largest Contentful Paint: oversized files, no reserved space and everything loading at once.",
    solution:
      "AdaptiveImageGallery serves the right format and size to each device, reserves layout space and prioritises the first images.",
    features: [
      { title: "Modern formats", text: "AVIF and WebP with fallbacks, chosen per browser through srcset." },
      { title: "Blur placeholders", text: "A tiny preview fades into the full image as it loads." },
      { title: "Zero layout shift", text: "Aspect ratios are reserved up front so nothing jumps." },
      { title: "Priority and lazy loading", text: "Above-the-fold images load first; the rest wait until needed." },
    ],
    steps: [
      { title: "Describe", text: "Provide width, height and a blur hash for each image." },
      { title: "Choose", text: "Pick format and size for the viewport." },
      { title: "Load", text: "Prioritise the first images and lazy-load the rest." },
      { title: "Reveal", text: "Fade from blur to sharp." },
    ],
    usage: {
      filename: "Gallery.tsx",
      lang: "tsx",
      code: `<AdaptiveImageGallery
  images={photos}
  columns={{ base: 1, md: 2, lg: 3 }}
  priorityCount={3}
/>`,
    },
    spotlight: {
      title: "Performance targets",
      intro: "Goals the component is built toward, to be verified in Lighthouse and field data.",
      head: ["Metric", "Target", "How it's measured"],
      rows: [
        ["Largest Contentful Paint", "2.5 s or better", "Lighthouse and field data"],
        ["Cumulative Layout Shift", "0", "Layout shift regions"],
        ["Above-the-fold payload", "Under 250 KB", "Network panel"],
        ["Format fallback", "AVIF → WebP → JPEG", "Content negotiation"],
      ],
    },
    stack: ["React 19", "Next.js Image", "AVIF / WebP", "IntersectionObserver"],
  },

  "deferred-search": {
    problem:
      "Filtering a large list on every keystroke blocks typing, and debouncing only hides the lag while making results feel slow.",
    solution:
      "DeferredSearch keeps the input instantly responsive by rendering the expensive list at lower priority with React's concurrent features.",
    features: [
      { title: "Deferred list rendering", text: "useDeferredValue lets the list lag behind the input without blocking it." },
      { title: "Transitions for filters", text: "useTransition marks heavy updates as interruptible." },
      { title: "Stale-result cue", text: "A subtle indicator shows when the list is catching up." },
      { title: "Interruptible renders", text: "New keystrokes abandon outdated work immediately." },
    ],
    steps: [
      { title: "Type", text: "The input updates immediately at urgent priority." },
      { title: "Defer", text: "The list receives a deferred copy of the query." },
      { title: "Render", text: "React renders results in the background and can interrupt." },
      { title: "Commit", text: "Fresh results swap in as soon as they're ready." },
    ],
    usage: {
      filename: "Catalog.tsx",
      lang: "tsx",
      code: `const [query, setQuery] = useState("");
const deferredQuery = useDeferredValue(query);

<SearchInput value={query} onChange={setQuery} />
<ResultList query={deferredQuery} />`,
    },
    spotlight: {
      title: "Before and after",
      intro: "How the common approaches compare.",
      head: ["Approach", "Typing feel", "Result freshness"],
      rows: [
        ["Filter on every keystroke", "Janks on large lists", "Always current"],
        ["Debounce", "Smooth, but results are delayed", "Waits for a pause"],
        ["Deferred value", "Always smooth", "Updates as soon as React can"],
      ],
    },
    stack: ["React 19", "TypeScript", "useDeferredValue", "useTransition"],
  },
};
