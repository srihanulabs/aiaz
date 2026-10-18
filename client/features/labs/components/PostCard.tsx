import Image from "next/image";
import Link from "next/link";
import { categories } from "@/features/showcase/data/catalog";
import SpotlightCard from "@/features/showcase/components/SpotlightCard";
import { ArrowIcon, categoryIcons } from "@/features/site/components/icons";
import type { LabsPost } from "../data/posts";

type Props = {
  post: LabsPost;
  featured?: boolean;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const PostCard = ({ post, featured = false }: Props) => {
  const category = categories.find((c) => c.id === post.category)!;
  const Icon = categoryIcons[category.id];
  const readable = post.status === "published" && post.href;

  const title = readable ? (
    <Link href={post.href!} className="after:absolute after:inset-0 after:content-['']">
      {post.title}
    </Link>
  ) : (
    post.title
  );

  return (
    <SpotlightCard
      accent={category.accent}
      className={`group relative flex h-full flex-col rounded-2xl border border-line bg-surface/70 backdrop-blur transition-[border-color,transform] duration-300 hover:border-(--accent)/40 ${
        featured ? "p-8 sm:p-10 lg:flex-row lg:gap-10" : "p-6 hover:-translate-y-1"
      }`}
    >
      {featured && (
        <div className="preview-pattern relative mb-8 grid min-h-48 place-items-center overflow-hidden rounded-xl border border-line lg:mb-0 lg:w-2/5 lg:min-h-64">
          {post.preview ? (
            <Image
              src={post.preview}
              alt=""
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
            />
          ) : (
            <Icon className="size-24 text-(--accent) opacity-40" strokeWidth={1.1} />
          )}
          <span className="absolute left-4 top-4 rounded-md border border-line bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-(--accent) backdrop-blur">
            Featured
          </span>
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs">
          <span className="inline-flex items-center gap-1.5 text-(--accent)">
            <Icon className="size-4" />
            {category.name}
          </span>
          <span className="text-faint">·</span>
          <span className="text-faint">{post.readTime}</span>
          <span className="text-faint">·</span>
          <span className={post.status === "published" ? "text-emerald-300" : "text-faint"}>
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            ) : (
              "Coming soon"
            )}
          </span>
        </div>

        <h3
          className={`mt-4 font-semibold tracking-tight ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {title}
        </h3>
        <p className="mt-3 flex-1 text-pretty leading-relaxed text-muted">{post.excerpt}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
          {post.tags.map((t) => (
            <li
              key={t}
              className="rounded-md border border-white/5 bg-white/5 px-2 py-1 font-mono text-[11px] text-slate-300"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-line pt-4 text-sm">
          {readable ? (
            <span className="inline-flex items-center gap-2 font-medium text-(--accent) transition-[gap] group-hover:gap-3">
              Read the post <ArrowIcon className="size-4" />
            </span>
          ) : (
            <span className="text-faint">In the works</span>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default PostCard;
