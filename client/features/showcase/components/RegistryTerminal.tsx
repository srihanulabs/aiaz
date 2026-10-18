import Link from "next/link";
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

/** Delay for the nth row so the readout "types in" top to bottom. */
const rowDelay = (n: number) => ({ animationDelay: `${600 + n * 60}ms` });

/**
 * Compact registry of every component, grouped by category. Each name links to
 * its details page, so the hero doubles as quick navigation.
 */
const RegistryTerminal = () => {
  let row = 0;

  return (
    <section
      aria-label="Project registry"
      className="animate-rise overflow-hidden rounded-2xl border border-line bg-surface [animation-delay:300ms]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2" aria-hidden>
          <span className="size-3 rounded-full bg-red-400/70" />
          <span className="size-3 rounded-full bg-amber-400/70" />
          <span className="size-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 hidden font-mono text-xs text-faint sm:inline">project registry</span>
        </div>
        <p className="whitespace-nowrap font-mono text-xs text-muted">
          <CountUp value={projects.length} /> projects · {categories.length} disciplines
        </p>
      </div>

      <div className="p-5 font-mono text-[13px] leading-6">
        <p className="animate-rise text-slate-300" style={rowDelay(row++)} aria-hidden>
          <span className="text-emerald-400">❯</span> show projects{" "}
          <span className="text-faint">--by category</span>
          <span className="caret ml-1" />
        </p>

        <div className="mt-5 grid gap-x-6 gap-y-6 sm:grid-cols-2">
          {categories.map((c) => {
            const Icon = categoryIcons[c.id];
            const items = projectsByCategory(c.id);
            return (
              <div key={c.id}>
                <Link
                  href={`/#${c.id}`}
                  className="animate-rise flex items-center gap-2 border-b border-line pb-2 font-semibold transition-opacity hover:opacity-80"
                  style={{ color: c.accent, ...rowDelay(row++) }}
                >
                  <Icon className="size-4" />
                  {c.name}
                  <span className="ml-auto font-normal text-faint">{items.length}</span>
                </Link>
                <ul className="mt-2 space-y-0.5">
                  {items.map((p) => (
                    <li key={p.slug} className="animate-rise" style={rowDelay(row++)}>
                      <Link
                        href={`/projects/${p.slug}`}
                        className="-mx-2 flex items-center gap-2.5 rounded-md px-2 py-0.5 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <span className={`size-2 shrink-0 rounded-full ${dot[p.status]}`} aria-hidden />
                        {p.name}
                        <span className="sr-only"> — {statusLabels[p.status]}</span>
                      </Link>
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
    </section>
  );
};

export default RegistryTerminal;
