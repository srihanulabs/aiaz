"use client";

import { useEffect, useRef, useState } from "react";

const CopyButton = ({ text, label = "Copy code" }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      /* Clipboard unavailable (insecure context or denied) — nothing to do. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-cyan-300/40 hover:text-foreground"
    >
      {copied ? "Copied ✓" : label}
      <span className="sr-only" role="status">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
};

export default CopyButton;
