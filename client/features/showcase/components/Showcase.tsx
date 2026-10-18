import type { CSSProperties } from "react";
import {
  categories,
  groups,
  projects,
  projectsByCategory,
  statusCounts,
  type Category,
} from "../data/catalog";
import { ArrowIcon, categoryIcons } from "@/features/site/components/icons";
import ProjectCard from "./ProjectCard";
import SpotlightCard from "./SpotlightCard";

const segmentClass = {
  live: "bg-(--accent)",
  "in-progress": "bg-(--accent)/50 animate-pulse",
  planned: "bg-white/10",
} as const;

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const Icon = categoryIcons[category.id];
  const items = projectsByCategory(category.id);
  const counts = statusCounts(items);

  return (
    <SpotlightCard
      accent={category.accent}
      className="group relative flex h-full flex-col rounded-3xl border border-line bg-surface/70 p-7 backdrop-blur transition-colors hover:border-(--accent)/40"
    >
      <span
        className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-8xl font-bold text-transparent [-webkit-text-stroke:1px_rgb(148_163_184/0.15)]"
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="relative grid size-12 place-items-center rounded-xl border border-(--accent)/30 bg-(--accent)/10 text-(--accent)">
        <Icon className="size-6" />
      </span>

      <p className="relative mt-6 font-mono text-xs uppercase tracking-widest text-(--accent)">
        {category.tagline}
      </p>
      <h3 className="relative mt-1 text-2xl font-semibold tracking-tight">
        <a
          href={`#${category.id}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {category.name}
        </a>
      </h3>
      <p className="relative mt-3 max-w-md flex-1 text-sm leading-relaxed text-muted">
        {category.description}
      </p>

      <ul className="relative mt-6 flex flex-wrap gap-2" aria-label={`${category.name} components`}>
        {items.map((p) => (
          <li
            key={p.slug}
            className="rounded-md border border-white/5 bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-300"
          >
            {p.name}
          </li>
        ))}
      </ul>

      <div className="relative mt-6 border-t border-line pt-5">
        <div
          role="img"
          aria-label={`${counts.live} live, ${counts["in-progress"]} in progress, ${counts.planned} planned`}
          className="flex gap-1.5"
        >
          {items.map((p) => (
            <span key={p.slug} className={`h-1.5 flex-1 rounded-full ${segmentClass[p.status]}`} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-mono text-xs text-faint">
            {counts.live} live · {counts["in-progress"]} building · {counts.planned} planned
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-(--accent) transition-[gap] group-hover:gap-3">
            Explore <ArrowIcon className="size-4" />
          </span>
        </div>
      </div>
    </SpotlightCard>
  );
};

const Showcase = () => {
  const totals = statusCounts(projects);

  return (
    <section id="showcase" aria-labelledby="showcase-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8">
        <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-cyan-300">
              <span className="h-px w-8 bg-cyan-300/60" aria-hidden />
              Component library
            </p>
            <h2
              id="showcase-heading"
              className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl"
            >
              Four disciplines.{" "}
              <span className="text-gradient">One component lab.</span>
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Components grouped by the problem they solve — each one typed,
              built in this repository and shown with its build status.
            </p>
          </div>

          <dl className="grid shrink-0 grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface/70 text-center">
            {[
              { label: "Live", value: totals.live, dot: "bg-emerald-400" },
              { label: "Building", value: totals["in-progress"], dot: "bg-amber-400" },
              { label: "Planned", value: totals.planned, dot: "bg-slate-500" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col px-6 py-4">
                <dd className="order-1 font-mono text-2xl font-semibold">{s.value}</dd>
                <dt className="order-2 mt-1 inline-flex items-center justify-center gap-1.5 text-xs text-faint">
                  <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden />
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-14 space-y-12">
          {groups.map((g) => (
            <div key={g.id}>
              <div className="reveal flex items-center gap-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-foreground">
                  {g.name}
                </h3>
                <span className="h-px flex-1 bg-line" aria-hidden />
                <p className="hidden text-sm text-faint sm:block">{g.description}</p>
              </div>
              <ul className="mt-5 grid gap-5 md:grid-cols-2">
                {categories
                  .filter((c) => c.group === g.id)
                  .map((c) => (
                    <li key={c.id} className="reveal">
                      <CategoryCard category={c} index={categories.indexOf(c)} />
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {categories.map((c, ci) => {
        const Icon = categoryIcons[c.id];
        const items = projectsByCategory(c.id);

        return (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-heading`}
            style={{ "--accent": c.accent } as CSSProperties}
            className="scroll-mt-24 border-t border-line py-16"
          >
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
              <div className="reveal flex items-start gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-(--accent)/30 bg-(--accent)/10 text-(--accent)">
                  <Icon className="size-6" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-(--accent)">
                    {String(ci + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")} · {c.tagline}
                  </p>
                  <h3
                    id={`${c.id}-heading`}
                    className="mt-1 text-2xl font-semibold tracking-tight"
                  >
                    {c.name}
                  </h3>
                  <p className="mt-2 max-w-2xl text-muted">{c.description}</p>
                </div>
              </div>

              <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((p, i) => (
                  <li key={p.slug} className="reveal">
                    <ProjectCard project={p} category={c} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </section>
  );
};

export default Showcase;
