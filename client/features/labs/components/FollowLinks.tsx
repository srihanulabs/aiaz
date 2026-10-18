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

/** Social buttons for the profiles set in siteConfig. Renders nothing until one is set. */
const FollowLinks = () => {
  const available = items.filter(({ key }) => siteConfig.socials[key]);
  if (available.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-3" aria-label="Follow on social media">
      {available.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={siteConfig.socials[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/20"
          >
            <Icon className="size-5" />
            {label}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FollowLinks;
