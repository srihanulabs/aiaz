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

const actionBase =
  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors";

type Props = {
  name: string;
  links: ProjectLinks;
  /** Needs the parent to set --accent (SpotlightCard or a style prop). */
  className?: string;
};

/** GitHub / video / live-demo buttons. Unset URLs render as disabled "coming soon". */
const LinkActions = ({ name, links, className = "" }: Props) => (
  <ul className={`flex flex-wrap gap-2 ${className}`} aria-label={`${name} links`}>
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
              <span className="sr-only"> for {name} (opens in a new tab)</span>
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

export default LinkActions;
