import Image from "@/features/showcase/components/PreviewImage";
import Link from "next/link";
import {
  statusLabels,
  statusStage,
  type Category,
  type Project,
  type ProjectStatus,
} from "../data/catalog";
import { ArrowIcon, categoryIcons } from "@/features/site/components/icons";
import LinkActions from "./LinkActions";
import SpotlightCard from "./SpotlightCard";

export const statusPill: Record<ProjectStatus, { dot: string; text: string }> = {
  live: { dot: "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400", text: "text-emerald-300" },
  "in-progress": { dot: "bg-amber-400 animate-pulse", text: "text-amber-200" },
  planned: { dot: "bg-slate-500", text: "text-slate-300" },
};

const stages = ["Planned", "Building", "Live"];

/** Three-step build → ship tracker. Needs --accent from an ancestor. */
export const StageTracker = ({ status }: { status: ProjectStatus }) => {
  const reached = statusStage[status];
  return (
    <div
      role="img"
      aria-label={`Stage ${reached} of ${stages.length}: ${statusLabels[status]}`}
    >
      <div className="flex gap-1.5" aria-hidden>
        {stages.map((label, i) => (
          <span
            key={label}
            className={`h-1 flex-1 rounded-full ${
              i < reached ? "bg-(--accent)" : "bg-white/10"
            } ${i === reached - 1 && status === "in-progress" ? "animate-pulse" : ""}`}
          />
        ))}
      </div>
      <div
        className="mt-1.5 flex justify-between font-mono text-xs uppercase tracking-wider text-faint"
        aria-hidden
      >
        {stages.map((label, i) => (
          <span key={label} className={i < reached ? "text-muted" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

type Props = {
  project: Project;
  category: Category;
  /** Position within its category, used for the "AI-01" style code. */
  index: number;
};

const ProjectCard = ({ project, category, index }: Props) => {
  const { slug, name, summary, tags, status, links, preview } = project;
  const Icon = categoryIcons[category.id];
  const code = `${category.id.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, "0")}`;

  return (
    <SpotlightCard
      accent={category.accent}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface/70 backdrop-blur transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--accent)/40"
    >
      {/* Preview panel: screenshot when provided, generated pattern otherwise. */}
      <div className="preview-pattern relative aspect-16/10 overflow-hidden border-b border-line">
        {preview ? (
          <Image
            src={preview}
            alt={`${name} preview`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <Icon
            className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-(--accent) opacity-25"
            strokeWidth={1.2}
          />
        )}

        <span className="absolute left-4 top-4 rounded-md border border-line bg-black/60 px-2 py-1 font-mono text-xs tracking-widest text-(--accent) backdrop-blur">
          {code}
        </span>
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-line bg-black/60 px-2.5 py-1 text-xs backdrop-blur ${statusPill[status].text}`}
        >
          <span className={`size-1.5 rounded-full ${statusPill[status].dot}`} aria-hidden />
          {statusLabels[status]}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-7">
        <h3 className="font-mono text-lg font-semibold tracking-tight">
          {/* Stretched link: the whole card opens the details page. */}
          <Link
            href={`/projects/${slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-(--accent)"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-white/5 bg-white/5 px-2 py-1 font-mono text-xs text-slate-300"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <StageTracker status={status} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
          <LinkActions name={name} links={links} className="relative z-10" />
          <span
            aria-hidden
            className="ml-auto inline-flex items-center gap-2 font-medium text-(--accent) transition-[gap] group-hover:gap-3"
          >
            Details <ArrowIcon className="size-4" />
          </span>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ProjectCard;
