import type { ReactElement, SVGProps } from "react";
import type { CategoryId } from "@/features/showcase/data/catalog";

type IconProps = SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const SparklesIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3z" />
    <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
  </svg>
);

export const AccessibilityIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="4.5" r="1.8" />
    <path d="M5 8.5l7 1.5 7-1.5M12 10v4.5M9 21l3-6.5L15 21" />
  </svg>
);

export const RagIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="5.5" rx="7" ry="2.8" />
    <path d="M5 5.5v6c0 1.5 3.1 2.8 7 2.8M19 5.5v3M5 11.5v6c0 1.5 3.1 2.8 7 2.8" />
    <circle cx="17" cy="16.5" r="3" />
    <path d="M19.2 18.7L22 21.5" />
  </svg>
);

export const BoltIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6l1-8z" />
  </svg>
);

export const ArrowIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const GithubIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" />
    <path d="M10 9.5v5l4.5-2.5L10 9.5z" />
  </svg>
);

export const ExternalIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={1.8} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
);

export const BeakerIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M9 3h6M10 3v6.5L4.6 19a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 9.5V3M7.5 15h9" />
  </svg>
);

export const LinkedinIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13c0-1.7 1-2.6 2.4-2.6S16.5 11.3 16.5 13v3" />
  </svg>
);

export const XIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 4h4l12 16h-4L4 4zM19.5 4l-6.6 7.2M4.5 20l6.6-7.2" />
  </svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <svg {...base} strokeWidth={2} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const categoryIcons: Record<
  CategoryId,
  (props: IconProps) => ReactElement
> = {
  ai: SparklesIcon,
  accessibility: AccessibilityIcon,
  rag: RagIcon,
  optimised: BoltIcon,
};
