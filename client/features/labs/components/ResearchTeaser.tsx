import Link from "next/link";
import { posts } from "../data/posts";
import { ArrowIcon } from "@/features/site/components/icons";
import PostCard from "./PostCard";

/** Home-page strip linking to the Labs research notes. */
const ResearchTeaser = () => {
  // Published notes first, then upcoming ones.
  const shown = [...posts].sort((a, b) => Number(b.status === "published") - Number(a.status === "published")).slice(0, 3);

  return (
    <section id="research" aria-labelledby="research-heading" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:py-36">
        <div className="reveal flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-cyan-300">
              <span className="h-px w-8 bg-cyan-300/60" aria-hidden />
              Labs · research
            </p>
            <h2 id="research-heading" className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Notes, experiments and findings from building these projects
            </h2>
          </div>
          <Link href="/labs" className="group inline-flex shrink-0 items-center gap-2 font-medium text-cyan-300 transition-[gap] hover:gap-3">
            All research <ArrowIcon className="size-4" />
          </Link>
        </div>

        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {shown.map((p) => (
            <li key={p.slug} className="reveal">
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ResearchTeaser;
