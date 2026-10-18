import { categories, projects } from "../data/catalog";
import CountUp from "./CountUp";

type Point = [number, number];

/** Small background stars: [x, y, radius]. Twinkle delay is derived from the index. */
const stars: [number, number, number][] = [
  [28, 40, 1.4], [96, 24, 1], [250, 30, 1.2], [320, 62, 1], [452, 38, 1.4],
  [30, 230, 1], [112, 262, 1.3], [58, 318, 1], [196, 300, 1], [440, 220, 1.2],
  [462, 300, 1], [36, 410, 1.3], [110, 456, 1], [200, 492, 1.2], [300, 498, 1],
  [462, 470, 1.3], [352, 330, 1], [236, 214, 1], [170, 20, 1], [410, 150, 1],
];

/** Four-point sparkles, drawn larger than plain stars. */
const sparkles: Point[] = [[238, 168], [78, 366], [446, 410]];

const sparkle = ([x, y]: Point, s = 6) =>
  `M${x} ${y - s}L${x} ${y + s}M${x - s} ${y}L${x + s} ${y}`;

type Constellation = {
  nodes: Point[];
  edges: [number, number][];
  labels?: Record<number, string>;
  color: string;
};

/** Node graphs that read as constellations and as a small neural network. */
const constellations: Constellation[] = [
  {
    color: "#67e8f9",
    nodes: [[60, 90], [130, 56], [208, 100], [152, 154], [78, 168]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3]],
    labels: { 1: "RAG", 2: "LLM" },
  },
  {
    color: "#a78bfa",
    nodes: [[352, 410], [424, 362], [402, 462], [326, 478]],
    edges: [[0, 1], [0, 2], [2, 3], [0, 3]],
    labels: { 1: "EVAL" },
  },
];

const edgePath = (nodes: Point[], [a, b]: [number, number]) =>
  `M${nodes[a][0]} ${nodes[a][1]}L${nodes[b][0]} ${nodes[b][1]}`;

/**
 * Line-art rocket cruising through a starfield and AI "constellations".
 * Decorative SVG: motion is pure CSS (see `.rocket-*` in globals.css) and stops
 * under prefers-reduced-motion.
 */
const HeroRocket = () => (
  <div className="animate-rise relative mx-auto w-full max-w-md lg:max-w-none [animation-delay:300ms]">
    <div
      className="absolute inset-[8%] -z-10 rounded-full bg-[radial-gradient(circle_at_60%_45%,rgb(103_232_249/0.14),rgb(167_139_250/0.1)_45%,transparent_70%)] blur-2xl"
      aria-hidden
    />

    <svg
      viewBox="0 0 480 520"
      className="h-auto w-full overflow-visible"
      fill="none"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <defs>
        <linearGradient id="rocket-stroke" gradientUnits="userSpaceOnUse" x1="-50" y1="-110" x2="50" y2="60">
          <stop offset="0" stopColor="#67e8f9" />
          <stop offset="0.55" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#f0abfc" />
        </linearGradient>
        <linearGradient id="rocket-flame" gradientUnits="userSpaceOnUse" x1="0" y1="46" x2="0" y2="120">
          <stop offset="0" stopColor="#f0abfc" />
          <stop offset="1" stopColor="#67e8f9" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Stars */}
      <g fill="#cbd5e1" stroke="none">
        {stars.map(([x, y, r], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            className="rocket-twinkle"
            style={{ animationDelay: `${(i * 370) % 3600}ms` }}
          />
        ))}
      </g>
      <g stroke="#cbd5e1" strokeWidth={1}>
        {sparkles.map((p, i) => (
          <path
            key={i}
            d={sparkle(p)}
            className="rocket-twinkle"
            style={{ animationDelay: `${i * 900}ms` }}
          />
        ))}
      </g>

      {/* Planet with ring, upper right */}
      <g stroke="#94a3b8" strokeOpacity={0.55}>
        <circle cx={398} cy={92} r={24} />
        <path d="M388 74c8 3 20 3 28-1M376 96c14 5 34 4 46-4" strokeOpacity={0.35} />
        <ellipse cx={398} cy={92} rx={46} ry={11} transform="rotate(-22 398 92)" />
      </g>

      {/* Orbit path the rocket is flying along */}
      <ellipse
        cx={290}
        cy={262}
        rx={205}
        ry={78}
        transform="rotate(-24 290 262)"
        stroke="#94a3b8"
        strokeOpacity={0.22}
        strokeDasharray="2 7"
      />

      {/* AI constellations */}
      {constellations.map(({ nodes, edges, labels, color }, c) => (
        <g key={c} stroke={color}>
          <g strokeOpacity={0.3}>
            {edges.map((e, i) => (
              <path key={i} d={edgePath(nodes, e)} />
            ))}
          </g>
          {/* Data pulses travelling along each edge */}
          <g strokeWidth={2} strokeDasharray="7 93">
            {edges.map((e, i) => (
              <path
                key={i}
                d={edgePath(nodes, e)}
                pathLength={100}
                className="rocket-pulse"
                style={{ animationDelay: `${(i * 700 + c * 400) % 4200}ms` }}
              />
            ))}
          </g>
          {nodes.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={3.5} fill="#05070d" />
              <circle cx={x} cy={y} r={1.2} fill={color} stroke="none" />
              {labels?.[i] && (
                <text
                  x={x + 9}
                  y={y - 8}
                  fill={color}
                  fillOpacity={0.8}
                  stroke="none"
                  fontSize={10}
                  letterSpacing={1}
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {labels[i]}
                </text>
              )}
            </g>
          ))}
        </g>
      ))}

      {/* Rocket: outer group bobs, inner group sets the heading */}
      <g className="rocket-bob">
        <g transform="translate(290 262) rotate(32)">
          {/* Exhaust trail */}
          <g stroke="#67e8f9" strokeOpacity={0.45} strokeDasharray="10 14" className="rocket-trail">
            <path d="M-14 100V190" />
            <path d="M0 112V230" />
            <path d="M14 100V180" />
          </g>

          {/* Flame */}
          <g className="rocket-flame" stroke="url(#rocket-flame)">
            <path d="M-11 48C-9 80 -3 96 0 112C3 96 9 80 11 48" />
            <path d="M-5 48C-4 64 -1 74 0 82C1 74 4 64 5 48" />
          </g>

          <g stroke="url(#rocket-stroke)" fill="#05070d">
            {/* Fins */}
            <path d="M-24 0L-50 38V62L-24 34Z" />
            <path d="M24 0L50 38V62L24 34Z" />
            {/* Body */}
            <path d="M0 -112C28 -82 32 -30 25 34H-25C-32 -30 -28 -82 0 -112Z" />
            {/* Nozzle */}
            <path d="M-15 34L-19 50H19L15 34" />
          </g>

          <g stroke="url(#rocket-stroke)">
            {/* Window */}
            <circle cx={0} cy={-52} r={13} />
            <circle cx={0} cy={-52} r={7} strokeOpacity={0.6} />
            {/* Panel line */}
            <path d="M-27 -2H27" strokeOpacity={0.6} />
            {/* Neural-net motif on the fuselage */}
            <path d="M-10 12L0 22L10 12M0 22V28M-10 12V6M10 12V6" strokeOpacity={0.8} />
            <circle cx={-10} cy={6} r={1.8} />
            <circle cx={10} cy={6} r={1.8} />
            <circle cx={0} cy={28} r={1.8} />
          </g>
        </g>
      </g>
    </svg>

    <p className="mx-auto -mt-2 w-fit whitespace-nowrap rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-center font-mono text-xs text-muted">
      <CountUp value={projects.length} /> projects · {categories.length} disciplines
    </p>
  </div>
);

export default HeroRocket;
