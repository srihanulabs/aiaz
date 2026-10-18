import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FollowLinks from "@/features/labs/components/FollowLinks";
import PostBody from "@/features/labs/components/PostBody";
import PostCard from "@/features/labs/components/PostCard";
import ShareButtons from "@/features/labs/components/ShareButtons";
import TableOfContents from "@/features/labs/components/TableOfContents";
import { getPost, posts, relatedPosts } from "@/features/labs/data/posts";
import { categories } from "@/features/showcase/data/catalog";
import { siteConfig } from "@/features/site/config";
import { ArrowIcon, BeakerIcon, categoryIcons } from "@/features/site/components/icons";

export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({
  params,
}: PageProps<"/labs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Labs`,
    description: post.excerpt,
    authors: [{ name: siteConfig.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [siteConfig.author],
      tags: post.tags,
    },
    // Unpublished placeholder pages shouldn't be indexed.
    robots: post.content ? undefined : { index: false, follow: false },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default async function PostPage({ params }: PageProps<"/labs/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const category = categories.find((c) => c.id === post.category)!;
  const Icon = categoryIcons[category.id];
  const toc = (post.content ?? []).flatMap((b) =>
    b.type === "h2" ? [{ id: b.id, text: b.text }] : [],
  );
  const related = relatedPosts(post);

  return (
    <article style={{ "--accent": category.accent } as React.CSSProperties}>
      <div className="reading-progress" aria-hidden />

      <header className="relative isolate overflow-hidden border-b border-line">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-32 sm:px-8 lg:pt-40">
          <Link
            href="/labs"
            className="animate-rise group inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-foreground"
          >
            <ArrowIcon className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            All posts
          </Link>

          <div className="animate-rise mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs [animation-delay:80ms]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-3 py-1 text-(--accent)">
              <Icon className="size-4" />
              {category.name}
            </span>
            <span className="text-faint">{post.readTime}</span>
            {post.publishedAt && (
              <>
                <span className="text-faint">·</span>
                <time dateTime={post.publishedAt} className="text-faint">
                  {formatDate(post.publishedAt)}
                </time>
              </>
            )}
          </div>

          <h1 className="animate-rise mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-tight [animation-delay:160ms] sm:text-6xl">
            {post.title}
          </h1>
          <p className="animate-rise mt-8 font-mono text-xs uppercase tracking-widest text-faint [animation-delay:220ms]">
            Abstract
          </p>
          <p className="animate-rise mt-3 max-w-2xl text-pretty text-lg leading-relaxed text-muted [animation-delay:260ms]">
            {post.excerpt}
          </p>

          <p className="animate-rise mt-8 font-mono text-sm text-muted [animation-delay:320ms]">
            {siteConfig.author} · {siteConfig.name}
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="max-w-3xl">
          {post.content ? (
            <PostBody blocks={post.content} />
          ) : (
            <div className="rounded-2xl border border-line bg-surface/70 p-8">
              <BeakerIcon className="size-8 text-cyan-300" />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                This post is in the works
              </h2>
              <p className="mt-3 text-muted">
                It&apos;s still being written up in the lab. Check back soon.
              </p>
              <div className="mt-6">
                <FollowLinks />
              </div>
            </div>
          )}

          {post.content && (
            <div className="mt-14 border-t border-line pt-8 lg:hidden">
              <ShareButtons title={post.title} />
            </div>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-10">
            <TableOfContents items={toc} />
            {post.content && <ShareButtons title={post.title} />}
          </div>
        </aside>
      </div>

      <section className="border-t border-line" aria-labelledby="keep-reading">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <h2 id="keep-reading" className="text-2xl font-semibold tracking-tight">
            Related research
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {related.map((p) => (
              <li key={p.slug} className="reveal">
                <PostCard post={p} />
              </li>
            ))}
          </ul>

        </div>
      </section>
    </article>
  );
}
