import type { ProjectLinks } from "../data/catalog";
import {
  ExternalIcon,
  GithubIcon,
  PlayIcon,
} from "@/features/site/components/icons";

const linkActions = [
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "video", label: "Video", Icon: PlayIcon },
  { key: "demo", label: "Live demo", Icon: ExternalIcon },
] as const satisfies readonly {
  key: keyof ProjectLinks;
  label: string;
  Icon: typeof GithubIcon;
}[];

type Props = {
  name: string;
  links?: ProjectLinks;
  /** Needs the parent to set --accent (SpotlightCard or a style prop). */
  className?: string;
};

/** GitHub / video / live-demo buttons. Only links that exist are shown; renders nothing if none do. */
const LinkActions = ({ name, links, className = "" }: Props) => {
  const available = linkActions.filter(({ key }) => links?.[key]);
  if (available.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={`${name} links`}>
      {available.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={links![key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-(--accent)/30 bg-(--accent)/10 px-3 py-2 text-xs font-medium text-(--accent) transition-colors hover:bg-(--accent)/20"
          >
            <Icon className="size-4" />
            {label}
            <span className="sr-only"> for {name} (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default LinkActions;
