import {
  categories,
  projects,
  projectsByCategory,
  statusLabels,
  type ProjectStatus,
} from "../data/catalog";
import { categoryIcons } from "@/features/site/components/icons";
import CountUp from "./CountUp";

const dot: Record<ProjectStatus, string> = {
  live: "bg-emerald-400",
  "in-progress": "bg-amber-400 animate-pulse",
  planned: "border border-slate-500",
};

const legend: ProjectStatus[] = ["live", "in-progress", "planned"];

/** Delay for the nth row so the readout "types in" left to right, top to bottom. */
const rowDelay = (n: number) => ({ animationDelay: `${700 + n * 70}ms` });

const summary = categories
  .map(
    (c) =>
      `${c.name}: ${projectsByCategory(c.id)
        .map((p) => `${p.name} (${statusLabels[p.status].toLowerCase()})`)
        .join(", ")}`,
  )
  .join(". ");

/** Wide, short readout of every component grouped by category. Decorative but data-driven. */
const RegistryTerminal = () => {
  let row = 0;

  return (
    <div
      className="animate-rise overflow-hidden rounded-2xl border border-line bg-surface [animation-delay:400ms]"
      role="img"
      aria-label={`Component registry. ${projects.length} components in ${categories.length} categories. ${summary}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3" aria-hidden>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-amber-400/70" />
          <span className="size-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 hidden font-mono text-xs text-faint sm:inline">component registry</span>
        </div>
        <p className="whitespace-nowrap font-mono text-xs text-muted">
          <CountUp value={projects.length} /> components · {categories.length} categories
        </p>
      </div>

      <div className="p-5 font-mono text-[13px] leading-6" aria-hidden>
        <p className="animate-rise text-slate-300" style={rowDelay(row++)}>
          <span className="text-emerald-400">❯</span> show components{" "}
          <span className="text-faint">--by category</span>
          <span className="caret ml-1" />
        </p>

        <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcons[c.id];
            const items = projectsByCategory(c.id);
            return (
              <div key={c.id}>
                <p
                  className="animate-rise flex items-center gap-2 border-b border-line pb-2 font-semibold"
                  style={{ color: c.accent, ...rowDelay(row++) }}
                >
                  <Icon className="size-4" />
                  {c.name}
                  <span className="ml-auto font-normal text-faint">{items.length}</span>
                </p>
                <ul className="mt-2 space-y-0.5">
                  {items.map((p) => (
                    <li
                      key={p.slug}
                      className="animate-rise flex items-center gap-2.5 text-slate-300"
                      style={rowDelay(row++)}
                    >
                      <span className={`size-2 shrink-0 rounded-full ${dot[p.status]}`} />
                      {p.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-line px-5 py-2.5 font-mono text-xs text-faint"
        aria-hidden
      >
        {legend.map((s) => (
          <span key={s} className="inline-flex items-center gap-2">
            <span className={`size-2 rounded-full ${dot[s]}`} />
            {statusLabels[s]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RegistryTerminal;
