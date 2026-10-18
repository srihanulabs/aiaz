"use client";

import Image from "@/features/showcase/components/PreviewImage";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import {
  categories,
  projects,
  projectsByCategory,
  statusCounts,
  statusLabels,
  type Category,
  type Project,
  type ProjectStatus,
} from "../data/catalog";
import { ArrowIcon, categoryIcons } from "@/features/site/components/icons";
import LinkActions from "./LinkActions";
import { StageTracker, statusPill } from "./ProjectCard";
import SpotlightCard from "./SpotlightCard";

const HOVER_INTENT_MS = 110;

const categoryOf = (p: Project) => categories.find((c) => c.id === p.category)!;

const dot: Record<ProjectStatus, string> = {
  live: "bg-emerald-400",
  "in-progress": "bg-amber-400",
  planned: "border border-slate-500",
};

/** Text half of a preview: identity, summary, progress and actions. */
const PreviewDetails = ({ project, category }: { project: Project; category: Category }) => {
  const Icon = categoryIcons[category.id];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-3 py-1 text-(--accent)">
          <Icon className="size-4" />
          {category.name}
        </span>
        <span className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 ${statusPill[project.status].text}`}>
          <span className={`size-1.5 rounded-full ${statusPill[project.status].dot}`} aria-hidden />
          {statusLabels[project.status]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <h3 className="font-mono text-2xl font-semibold tracking-tight">{project.name}</h3>
        <Link
          href={`/projects/${project.slug}`}
          className="btn-shine group inline-flex shrink-0 items-center gap-2 rounded-lg bg-(--accent) px-5 py-2.5 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
        >
          View project
          <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          <span className="sr-only"> {project.name}</span>
        </Link>
      </div>
      <p className="mt-3 text-pretty leading-relaxed text-muted">{project.summary}</p>

      <LinkActions name={project.name} links={project.links} className="mt-4" />

      {/* Secondary detail: dropped on short desktop screens so the panel always fits. */}
      <div className="lg:[@media(max-height:800px)]:hidden">
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech">
          {project.tags.map((t) => (
            <li key={t} className="rounded-md border border-white/5 bg-white/5 px-2 py-1 font-mono text-xs text-slate-300">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <StageTracker status={project.status} />
        </div>
      </div>
    </div>
  );
};

const ProjectExplorer = () => {
  const [slug, setSlug] = useState(projectsByCategory(categories[0].id)[0].slug);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Arriving via /#rag (e.g. from a project page) opens that category's first project.
  useEffect(() => {
    const apply = () => {
      const first = projects.find((p) => p.category === window.location.hash.slice(1));
      if (first) setSlug(first.slug);
    };
    const t = window.setTimeout(apply, 0);
    window.addEventListener("hashchange", apply);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", apply);
    };
  }, []);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const select = (s: string) => {
    clearTimeout(hoverTimer.current);
    setSlug(s);
  };
  // On phones the preview opens inline, so bring the tapped item (and its button) to the top.
  const choose = (s: string) => {
    select(s);
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    requestAnimationFrame(() =>
      document.getElementById(`project-${s}`)?.scrollIntoView({ behavior, block: "start" }),
    );
  };
  // Mouse hover previews after a short pause, so sweeping across the list doesn't flicker.
  const onEnter = (e: PointerEvent, s: string) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setSlug(s), HOVER_INTENT_MS);
  };

  const active = projects.find((p) => p.slug === slug)!;
  const activeCategory = categoryOf(active);
  const counts = statusCounts(projects);
  const summary = (["live", "in-progress", "planned"] as const).filter((s) => counts[s] > 0);

  return (
    <section id="showcase" aria-labelledby="showcase-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:py-36">
        <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-cyan-300">
              <span className="h-px w-8 bg-cyan-300/60" aria-hidden />
              Projects
            </p>
            <h2 id="showcase-heading" className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Four disciplines. <span className="text-gradient">One lab.</span>
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted">
              Choose a project to preview it, then open its full write-up.
            </p>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted" aria-label="Project status">
            {summary.map((s) => (
              <li key={s} className="inline-flex items-center gap-2">
                <span className={`size-2 rounded-full ${dot[s]}`} aria-hidden />
                {counts[s]} {statusLabels[s].toLowerCase()}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
          <ul className="space-y-10">
            {categories.map((c) => {
              const Icon = categoryIcons[c.id];
              const items = projectsByCategory(c.id);
              return (
                <li
                  key={c.id}
                  id={c.id}
                  style={{ "--accent": c.accent } as CSSProperties}
                  className="scroll-mt-28"
                >
                  <div className="flex items-center gap-3 px-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-(--accent)/30 bg-(--accent)/10 text-(--accent)">
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="truncate text-sm text-faint">{c.tagline}</p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-1">
                    {items.map((p) => {
                      const selected = p.slug === slug;
                      return (
                        <li key={p.slug} id={`project-${p.slug}`} className="scroll-mt-24">
                          <button
                            type="button"
                            aria-pressed={selected}
                            aria-controls="project-preview"
                            onClick={() => choose(p.slug)}
                            onFocus={() => select(p.slug)}
                            onPointerEnter={(e) => onEnter(e, p.slug)}
                            onPointerLeave={() => clearTimeout(hoverTimer.current)}
                            className="group relative flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left transition-colors before:absolute before:inset-y-2.5 before:left-0 before:w-0.5 before:rounded-full before:bg-transparent hover:bg-white/4 aria-pressed:bg-white/6 aria-pressed:before:bg-(--accent)"
                          >
                            <span className={`size-2 shrink-0 rounded-full ${dot[p.status]}`} aria-hidden />
                            <span className="font-mono text-[15px] text-slate-200">{p.name}</span>
                            <span className="sr-only"> — {statusLabels[p.status]}</span>
                            <ArrowIcon className="ml-auto size-4 text-(--accent) opacity-0 transition-opacity group-aria-pressed:opacity-100" />
                          </button>

                          {/* Phones: the preview opens inline under the tapped item. */}
                          {selected && (
                            <div className="px-4 pb-6 pt-3 lg:hidden">
                              {p.preview && (
                                <div className="preview-pattern relative mb-6 aspect-16/10 overflow-hidden rounded-xl border border-line">
                                  <Image
                                    src={p.preview}
                                    alt={`${p.name} preview`}
                                    fill
                                    sizes="(min-width: 640px) 560px, 100vw"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <PreviewDetails project={p} category={c} />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>

          {/* Desktop: one large preview that follows the selection. */}
          <div id="project-preview" className="hidden self-start lg:sticky lg:top-24 lg:block">
            <SpotlightCard
              accent={activeCategory.accent}
              tilt={false}
              className="rounded-3xl border border-line bg-surface/70 p-5"
            >
              <div className="preview-pattern relative h-[clamp(11rem,36svh,25rem)] overflow-hidden rounded-2xl border border-line">
                {projects.map((p, i) =>
                  p.preview ? (
                    <Image
                      key={p.slug}
                      src={p.preview}
                      alt={p.slug === slug ? `${p.name} preview` : ""}
                      aria-hidden={p.slug !== slug}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className={`object-cover object-top transition-opacity duration-500 ${
                        p.slug === slug ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ) : null,
                )}
              </div>
              <div key={slug} aria-live="polite" className="animate-rise px-3 pb-3 pt-6">
                <PreviewDetails project={active} category={activeCategory} />
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectExplorer;
