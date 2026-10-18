import Link from "next/link";
import { ArrowIcon } from "@/features/site/components/icons";
import RegistryTerminal from "./RegistryTerminal";

const headline: { word: string; gradient?: boolean }[] = [
  { word: "Engineering" },
  { word: "the" },
  { word: "next" },
  { word: "generation" },
  { word: "of" },
  { word: "intelligent", gradient: true },
  { word: "products.", gradient: true },
];

const Hero = () => (
  <section className="relative isolate overflow-hidden">
    <div className="bg-grid absolute inset-0 -z-10" aria-hidden />

    <div className="mx-auto max-w-6xl px-5 pb-20 pt-32 sm:px-8 lg:pt-40">
      <div className="max-w-3xl">
        <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 font-mono text-xs text-muted">
          <span className="relative flex size-2" aria-hidden>
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          AI engineering lab · actively developed
        </p>

        <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight [perspective:600px] sm:text-6xl">
          {headline.map(({ word, gradient }, i) => (
            <span
              key={i}
              className="animate-word inline-block pr-[0.25em]"
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              {gradient ? <span className="text-gradient">{word}</span> : word}
            </span>
          ))}
        </h1>

        <p className="animate-rise mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted [animation-delay:800ms]">
          A working lab for AI interfaces, retrieval (RAG), accessibility and
          performance. Every idea is built, tested and shown running, so you
          can judge it for yourself.
        </p>

        <div className="animate-rise mt-9 flex flex-wrap items-center gap-4 [animation-delay:950ms]">
          <a
            href="#showcase"
            className="btn-shine group inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200"
          >
            Explore the showcase
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <Link
            href="/labs"
            className="rounded-lg border border-line px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-cyan-300/40 hover:bg-white/5"
          >
            Read the Labs
          </Link>
        </div>
      </div>

      <div className="mt-14">
        <RegistryTerminal />
      </div>
    </div>
  </section>
);

export default Hero;
