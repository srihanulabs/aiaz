import { siteConfig } from "@/features/site/config";
import {
  GithubIcon,
  LinkedinIcon,
  XIcon,
} from "@/features/site/components/icons";

const items = [
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "x", label: "X", Icon: XIcon },
  { key: "github", label: "GitHub", Icon: GithubIcon },
] as const;

const base =
  "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors";

/** Social buttons from siteConfig; unset ones render disabled. */
const FollowLinks = () => (
  <ul className="flex flex-wrap gap-3" aria-label="Follow on social media">
    {items.map(({ key, label, Icon }) => {
      const url = siteConfig.socials[key];
      return (
        <li key={key}>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${base} border-cyan-300/30 bg-cyan-300/10 text-cyan-200 hover:bg-cyan-300/20`}
            >
              <Icon className="size-5" />
              {label}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <span
              aria-disabled="true"
              className={`${base} cursor-not-allowed border-line text-faint`}
            >
              <Icon className="size-5" />
              {label}
              <span className="sr-only">, coming soon</span>
            </span>
          )}
        </li>
      );
    })}
  </ul>
);

export default FollowLinks;
