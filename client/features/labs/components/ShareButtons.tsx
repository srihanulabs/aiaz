"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedinIcon, XIcon } from "@/features/site/components/icons";

const btn =
  "inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-3.5 py-2 text-sm text-muted transition-colors hover:border-cyan-300/40 hover:text-foreground";

/** Share the current page. URLs are read from the browser at click time. */
const ShareButtons = ({ title }: { title: string }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const open = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  const linkedin = () =>
    open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    );
  const x = () =>
    open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
    );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard unavailable — ignore. */
    }
  };

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-faint">Share</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={linkedin} className={btn}>
          <LinkedinIcon className="size-4" />
          LinkedIn
          <span className="sr-only">(opens in a new tab)</span>
        </button>
        <button type="button" onClick={x} className={btn}>
          <XIcon className="size-4" />X
          <span className="sr-only">(opens in a new tab)</span>
        </button>
        <button type="button" onClick={copy} className={btn}>
          {copied ? "Link copied ✓" : "Copy link"}
          <span className="sr-only" role="status">
            {copied ? "Link copied to clipboard" : ""}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
