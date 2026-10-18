import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import CodeBlock from "@/features/labs/components/CodeBlock";
import FollowLinks from "@/features/labs/components/FollowLinks";
import PostCard from "@/features/labs/components/PostCard";
import TableOfContents from "@/features/labs/components/TableOfContents";
import { posts } from "@/features/labs/data/posts";
import {
  ArrowIcon,
  PlayIcon,
  categoryIcons,
} from "@/features/site/components/icons";
import {
  projectsByCategory,
  statusLabels,
  statusStage,
  type Category,
  type Project,
} from "../data/catalog";
import type { ProjectDetails } from "../data/details";
import LinkActions from "./LinkActions";
import ProjectCard, { StageTracker, statusPill } from "./ProjectCard";

const milestones = [
  "Design & API",
  "Build",
  "Accessibility & performance testing",
  "Demo & write-up",
];

/** Milestones finished for each status: planned → none, building → design, live → all. */
const doneCount = (status: Project["status"]) =>
  status === "live" ? milestones.length : statusStage[status] - 1;

const youtubeId = (url?: string) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) return u.searchParams.get("v");
  } catch {
    /* not a URL */
  }
  return null;
};

const Section = ({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 border-t border-line pt-12 first:border-0 first:pt-0">
    <p className="font-mono text-xs uppercase tracking-widest text-(--accent)">{eyebrow}</p>
    <h2 id={`${id}-heading`} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
      {title}
    </h2>
    <div className="mt-6">{children}</div>
  </section>
);

type Props = {
  project: Project;
  category: Category;
  details: ProjectDetails;
};

/** Template used by every /components/[slug] page. Content comes from the catalog + details data. */
const ProjectDetailsView = ({ project, category, details }: Props) => {
  const Icon = categoryIcons[category.id];
  const { name, summary, tags, status, links, preview } = project;
  const index = projectsByCategory(category.id).findIndex((p) => p.slug === project.slug);
  const videoId = youtubeId(links?.video);
  const done = doneCount(status);
  const relatedPosts = posts.filter((p) => p.category === category.id).slice(0, 2);
  const moreProjects = projectsByCategory(category.id).filter((p) => p.slug !== project.slug);

  const toc = [
    { id: "overview", text: "Overview" },
    { id: "features", text: "Key features" },
    { id: "how-it-works", text: "How it works" },
    { id: "demo", text: "Demo" },
    { id: "usage", text: "Usage" },
    { id: "spotlight", text: details.spotlight.title },
    { id: "status", text: "Status & stack" },
  ];

  return (
    <article style={{ "--accent": category.accent } as CSSProperties}>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-32 sm:px-8 lg:pt-40">
          <nav aria-label="Breadcrumb" className="animate-rise font-mono text-xs text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/#showcase" className="hover:text-foreground">Components</Link></li>
              <li aria-hidden>/</li>
              <li><Link href={`/#${category.id}`} className="hover:text-foreground">{category.name}</Link></li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground">{name}</li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="animate-rise flex flex-wrap items-center gap-3 font-mono text-xs [animation-delay:80ms]">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-3 py-1 text-(--accent)">
                  <Icon className="size-4" />
                  {category.name}
                </span>
                <span className={`inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 ${statusPill[status].text}`}>
                  <span className={`size-1.5 rounded-full ${statusPill[status].dot}`} aria-hidden />
                  {statusLabels[status]}
                </span>
              </div>

              <h1 className="animate-rise mt-6 font-mono text-4xl font-semibold tracking-tight [animation-delay:160ms] sm:text-5xl">
                {name}
              </h1>
              <p className="animate-rise mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted [animation-delay:240ms]">
                {summary}
              </p>

              <ul className="animate-rise mt-6 flex flex-wrap gap-2 [animation-delay:300ms]" aria-label="Tech">
                {tags.map((t) => (
                  <li key={t} className="rounded-md border border-white/5 bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-300">{t}</li>
                ))}
              </ul>

              <div className="animate-rise mt-8 [animation-delay:360ms]">
                <LinkActions name={name} links={links ?? {}} />
              </div>
            </div>

            <div className="animate-rise [animation-delay:200ms]">
              <div className="preview-pattern relative aspect-16/10 overflow-hidden rounded-2xl border border-line">
                {preview ? (
                  <Image
                    src={preview}
                    alt={`${name} preview`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 560px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <Icon className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 text-(--accent) opacity-30" strokeWidth={1.1} />
                )}
                <span className="absolute left-4 top-4 rounded-md border border-line bg-black/60 px-2 py-1 font-mono text-[10px] tracking-widest text-(--accent) backdrop-blur">
                  {`${category.id.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, "0")}`}
                </span>
              </div>
              <p className="mt-3 text-xs text-faint">Illustrative preview of the intended interface.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 space-y-16">
          <Section id="overview" eyebrow="Overview" title="What it solves">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface/70 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-faint">The problem</p>
                <p className="mt-3 leading-relaxed text-slate-300">{details.problem}</p>
              </div>
              <div className="rounded-2xl border border-(--accent)/30 bg-(--accent)/5 p-6">
                <p className="font-mono text-xs uppercase tracking-widest text-(--accent)">The approach</p>
                <p className="mt-3 leading-relaxed text-slate-200">{details.solution}</p>
              </div>
            </div>
          </Section>

          <Section id="features" eyebrow="Features" title="Key features">
            <ul className="grid gap-4 sm:grid-cols-2">
              {details.features.map((f, i) => (
                <li key={f.title} className="rounded-2xl border border-line bg-surface/70 p-5">
                  <span className="font-mono text-xs text-(--accent)">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="how-it-works" eyebrow="Under the hood" title="How it works">
            <ol className="space-y-0">
              {details.steps.map((s, i) => (
                <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < details.steps.length - 1 && (
                    <span className="absolute left-4.5 top-10 bottom-0 w-px bg-line" aria-hidden />
                  )}
                  <span className="relative grid size-9 shrink-0 place-items-center rounded-full border border-(--accent)/40 bg-(--accent)/10 font-mono text-sm text-(--accent)">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="demo" eyebrow="See it" title="Demo">
            {videoId ? (
              <div className="aspect-video overflow-hidden rounded-2xl border border-line">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={`${name} walkthrough`}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            ) : (
              <div className="preview-pattern grid aspect-video place-items-center rounded-2xl border border-line">
                <div className="text-center">
                  <PlayIcon className="mx-auto size-12 text-(--accent) opacity-70" strokeWidth={1.2} />
                  <p className="mt-3 font-medium">Walkthrough video coming soon</p>
                  <p className="mt-1 text-sm text-muted">A short screen recording will appear here.</p>
                </div>
              </div>
            )}
            <div className="mt-5">
              <LinkActions name={name} links={links ?? {}} />
            </div>
          </Section>

          <Section id="usage" eyebrow="Developer experience" title="Usage">
            <p className="mb-2 text-sm text-muted">
              Planned API — this shows the intended developer experience and may change as the component is built.
            </p>
            <CodeBlock code={details.usage.code} lang={details.usage.lang} filename={details.usage.filename} />
          </Section>

          <Section id="spotlight" eyebrow={category.name} title={details.spotlight.title}>
            <p className="mb-5 text-muted">{details.spotlight.intro}</p>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-120 text-left text-sm">
                <caption className="sr-only">{details.spotlight.title}</caption>
                <thead className="bg-white/3 font-mono text-xs uppercase tracking-widest text-faint">
                  <tr>
                    {details.spotlight.head.map((h) => (
                      <th key={h} scope="col" className="px-5 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {details.spotlight.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-line">
                      {row.map((cell, i) =>
                        i === 0 ? (
                          <th key={i} scope="row" className="px-5 py-3.5 align-top font-mono text-[13px] font-medium text-(--accent)">{cell}</th>
                        ) : (
                          <td key={i} className="px-5 py-3.5 align-top text-slate-300">{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="status" eyebrow="Roadmap" title="Status & stack">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface/70 p-6">
                <h3 className="font-semibold">Build progress</h3>
                <div className="mt-4"><StageTracker status={status} /></div>
                <ol className="mt-6 space-y-3">
                  {milestones.map((m, i) => {
                    const state = i < done ? "done" : i === done ? "current" : "todo";
                    return (
                      <li key={m} className="flex items-center gap-3 text-sm">
                        <span
                          className={`grid size-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                            state === "done"
                              ? "border-emerald-400 bg-emerald-400 text-slate-950"
                              : state === "current"
                                ? "border-(--accent) text-(--accent)"
                                : "border-line text-faint"
                          }`}
                          aria-hidden
                        >
                          {state === "done" ? "✓" : state === "current" ? "●" : ""}
                        </span>
                        <span className={state === "todo" ? "text-faint" : ""}>
                          {m}
                          <span className="sr-only"> — {state === "done" ? "done" : state === "current" ? "in progress" : "not started"}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <div className="rounded-2xl border border-line bg-surface/70 p-6">
                <h3 className="font-semibold">Tech stack</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {details.stack.map((t) => (
                    <li key={t} className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1.5 font-mono text-xs text-slate-300">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <TableOfContents items={toc} />
            <Link href="/#showcase" className="group inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
              <ArrowIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
              All components
            </Link>
          </div>
        </aside>
      </div>

      {(relatedPosts.length > 0 || moreProjects.length > 0) && (
        <section className="border-t border-line" aria-label="Related">
          <div className="mx-auto max-w-6xl space-y-16 px-5 py-16 sm:px-8">
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">From the Labs</h2>
                <ul className="mt-8 grid gap-5 md:grid-cols-2">
                  {relatedPosts.map((p) => (
                    <li key={p.slug} className="reveal"><PostCard post={p} /></li>
                  ))}
                </ul>
              </div>
            )}
            {moreProjects.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">More in {category.name}</h2>
                <ul className="mt-8 grid gap-5 md:grid-cols-2">
                  {moreProjects.map((p) => (
                    <li key={p.slug} className="reveal">
                      <ProjectCard project={p} category={category} index={projectsByCategory(category.id).findIndex((x) => x.slug === p.slug)} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="reveal rounded-3xl border border-line bg-surface/70 p-8 sm:p-10">
              <h2 className="text-xl font-semibold tracking-tight">Follow the build</h2>
              <p className="mb-6 mt-2 text-muted">Updates on this component land on LinkedIn and social media first.</p>
              <FollowLinks />
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default ProjectDetailsView;
