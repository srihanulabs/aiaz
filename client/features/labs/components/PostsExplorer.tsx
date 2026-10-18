"use client";

import { useState, type CSSProperties } from "react";
import { categories, type CategoryId } from "@/features/showcase/data/catalog";
import { categoryIcons } from "@/features/site/components/icons";
import type { LabsPost } from "../data/posts";
import PostCard from "./PostCard";

type Filter = CategoryId | "all";

const PostsExplorer = ({ posts }: { posts: LabsPost[] }) => {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const chip =
    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors";

  return (
    <div>
      <div role="group" aria-label="Filter posts by topic" className="flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={filter === "all"}
          onClick={() => setFilter("all")}
          className={`${chip} ${
            filter === "all"
              ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
              : "border-line bg-surface/70 text-muted hover:text-foreground"
          }`}
        >
          All
          <span className="font-mono text-xs text-faint">{posts.length}</span>
        </button>

        {categories.map((c) => {
          const Icon = categoryIcons[c.id];
          const count = posts.filter((p) => p.category === c.id).length;
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(c.id)}
              style={{ "--accent": c.accent } as CSSProperties}
              className={`${chip} ${
                active
                  ? "border-(--accent)/50 bg-(--accent)/15 text-foreground"
                  : "border-line bg-surface/70 text-muted hover:border-(--accent)/40 hover:text-foreground"
              }`}
            >
              <Icon className="size-4 text-(--accent)" />
              {c.name}
              <span className="font-mono text-xs text-faint">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status">
        Showing {visible.length} {visible.length === 1 ? "post" : "posts"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-12 text-muted">No posts in this topic yet.</p>
      ) : (
        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <li key={p.slug} className="reveal">
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostsExplorer;
