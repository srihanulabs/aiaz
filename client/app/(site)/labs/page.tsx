import type { Metadata } from "next";
import FollowLinks from "@/features/labs/components/FollowLinks";
import PostCard from "@/features/labs/components/PostCard";
import PostsExplorer from "@/features/labs/components/PostsExplorer";
import { posts } from "@/features/labs/data/posts";
import { BeakerIcon } from "@/features/site/components/icons";

const description =
  "Technical write-ups on AI interfaces, RAG, accessibility and React performance — with the code to back them up.";

export const metadata: Metadata = {
  title: "Labs — technical notes on AI, RAG, accessibility & performance",
  description,
  openGraph: {
    title: "aiaz·labs — Labs",
    description,
    type: "website",
  },
};

export default function LabsPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10" aria-hidden />

        <div className="mx-auto max-w-6xl px-5 pb-16 pt-32 sm:px-8 lg:pt-40">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 font-mono text-xs text-muted">
            <BeakerIcon className="size-4 text-cyan-300" />
            Labs · engineering notes
          </p>
          <h1 className="animate-rise mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight [animation-delay:80ms] sm:text-6xl">
            Notes from the <span className="text-gradient">lab</span>.
          </h1>
          <p className="animate-rise mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted [animation-delay:160ms]">
            {description} New posts are shared on LinkedIn and social media —
            follow along to catch them first.
          </p>
          <div className="animate-rise mt-8 [animation-delay:240ms]">
            <FollowLinks />
          </div>
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <h2 id="featured-heading" className="sr-only">
          Featured post
        </h2>
        <PostCard post={featured} featured />
      </section>

      <section
        aria-labelledby="all-posts-heading"
        className="mx-auto max-w-6xl border-t border-line px-5 py-16 sm:px-8"
      >
        <h2 id="all-posts-heading" className="text-2xl font-semibold tracking-tight">
          All posts
        </h2>
        <p className="mb-8 mt-2 text-muted">Filter by the topic you care about.</p>
        <PostsExplorer posts={[featured, ...rest]} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface/70 p-8 sm:p-12">
          <div className="relative max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Get new posts where you already are
            </h2>
            <p className="mt-3 text-muted">
              Every post lands on LinkedIn and social media first, with the
              demo and source linked back here.
            </p>
            <div className="mt-6">
              <FollowLinks />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
