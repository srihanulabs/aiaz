import { useId, type SVGProps } from "react";

/** aiaz·labs mark: a core node wired to three outer nodes. */
const LogoMark = (props: SVGProps<SVGSVGElement>) => {
  const gradient = useId();

  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient
          id={gradient}
          x1="4"
          y1="4"
          x2="28"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#67e8f9" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d="M16 16L16 5M16 16L6 22M16 16L26 22" stroke={`url(#${gradient})`} />
      <circle cx="16" cy="16" r="4.5" fill={`url(#${gradient})`} />
      <circle cx="16" cy="5" r="2.5" fill="#05070d" stroke="#67e8f9" />
      <circle cx="6" cy="22.5" r="2.5" fill="#05070d" stroke="#a78bfa" />
      <circle cx="26" cy="22.5" r="2.5" fill="#05070d" stroke="#a78bfa" />
    </svg>
  );
};

export default LogoMark;
