import Image from "next/image";
import Link from "next/link";
import {
  statusLabels,
  statusStage,
  type Category,
  type Project,
  type ProjectLinks,
  type ProjectStatus,
} from "../data/catalog";
import {
  ArrowIcon,
  ExternalIcon,
  GithubIcon,
  PlayIcon,
  categoryIcons,
} from "@/features/site/components/icons";
import SpotlightCard from "./SpotlightCard";

const statusPill: Record<ProjectStatus, { dot: string; text: string }> = {
  live: { dot: "bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400", text: "text-emerald-300" },
  "in-progress": { dot: "bg-amber-400 animate-pulse", text: "text-amber-200" },
  planned: { dot: "bg-slate-500", text: "text-slate-300" },
};

const stages = ["Planned", "Building", "Live"];

const linkActions = [
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "video", label: "Video", Icon: PlayIcon },
  { key: "demo", label: "Live demo", Icon: ExternalIcon },
] as const satisfies readonly {
  key: keyof ProjectLinks;
  label: string;
  Icon: typeof GithubIcon;
}[];

const actionBase =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors";

const LinkActions = ({ name, links }: { name: string; links: ProjectLinks }) => (
  <ul className="flex flex-wrap gap-2" aria-label={`${name} links`}>
    {linkActions.map(({ key, label, Icon }) => {
      const url = links[key];
      return (
        <li key={key}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionBase} border-(--accent)/30 bg-(--accent)/10 text-(--accent) hover:bg-(--accent)/20`}
            >
              <Icon className="size-4" />
              {label}
              <span className="sr-only">
                {" "}
                for {name} (opens in a new tab)
              </span>
            </a>
          ) : (
            <span
              aria-disabled="true"
              className={`${actionBase} cursor-not-allowed border-line text-faint`}
            >
              <Icon className="size-4" />
              {label}
              <span className="sr-only"> for {name}, coming soon</span>
            </span>
          )}
        </li>
      );
    })}
  </ul>
);

/** Three-step build → ship tracker. */
const StageTracker = ({ status }: { status: ProjectStatus }) => {
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
        className="mt-1.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-faint"
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
  const { name, summary, tags, status, href, links, preview } = project;
  const Icon = categoryIcons[category.id];
  const code = `${category.id.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, "0")}`;

  return (
    <SpotlightCard
      accent={category.accent}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface/70 backdrop-blur transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-(--accent)/40"
    >
      {/* Preview panel: screenshot when provided, generated pattern otherwise. */}
      <div className="preview-pattern relative h-36 overflow-hidden border-b border-line">
        {preview ? (
          <Image
            src={preview}
            alt={`${name} preview`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Icon
            className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-(--accent) opacity-25 transition-[opacity,transform] duration-500 group-hover:scale-110 group-hover:opacity-50"
            strokeWidth={1.2}
          />
        )}

        <span className="absolute left-4 top-4 rounded-md border border-line bg-black/40 px-2 py-1 font-mono text-[10px] tracking-widest text-(--accent) backdrop-blur">
          {code}
        </span>
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-line bg-black/40 px-2.5 py-1 text-xs backdrop-blur ${statusPill[status].text}`}
        >
          <span className={`size-1.5 rounded-full ${statusPill[status].dot}`} aria-hidden />
          {statusLabels[status]}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <h3 className="font-mono text-lg font-semibold tracking-tight">{name}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{summary}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-white/5 bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-300"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <StageTracker status={status} />
        </div>

        <div className="mt-5 border-t border-line pt-4 text-sm">
          {links ? (
            <LinkActions name={name} links={links} />
          ) : href ? (
            <Link
              href={href}
              className="inline-flex items-center gap-2 font-medium text-(--accent) transition-[gap] group-hover:gap-3"
            >
              View demo
              <ArrowIcon className="size-4" />
              <span className="sr-only">of {name}</span>
            </Link>
          ) : (
            <span className="text-faint">Demo coming soon</span>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ProjectCard;
