"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string };

/** Sticky "On this page" list that highlights the section being read. */
const TableOfContents = ({ items }: { items: Item[] }) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // Heading nearest the top wins, in document order.
        setActive(items.find((i) => visible.has(i.id))?.id ?? null);
      },
      { rootMargin: "-10% 0px -70% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-xs uppercase tracking-widest text-faint">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {items.map(({ id, text }) => {
          const on = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors ${
                  on
                    ? "border-cyan-300 text-cyan-200"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default TableOfContents;
