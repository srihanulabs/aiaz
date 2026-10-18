"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, type FocusEvent, type KeyboardEvent } from "react";
import {
  categories,
  projects,
  projectsByCategory,
} from "@/features/showcase/data/catalog";
import {
  ArrowIcon,
  BeakerIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  categoryIcons,
} from "./icons";
import LogoMark from "./LogoMark";

type Spy = { showcase: boolean; category: string | null };

/** Tracks which home-page section sits in the middle of the viewport. */
const useScrollSpy = (enabled: boolean): Spy => {
  const [spy, setSpy] = useState<Spy>({ showcase: false, category: null });

  useEffect(() => {
    if (!enabled) return;
    const visible = new Set<string>();
    const ids = ["showcase", ...categories.map((c) => c.id)];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setSpy({
          showcase: visible.has("showcase"),
          category: categories.find((c) => visible.has(c.id))?.id ?? null,
        });
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? spy : { showcase: false, category: null };
};

const pill =
  "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors";
const pillIdle = "text-muted hover:bg-white/5 hover:text-foreground";
const pillActive = "bg-white/12 text-white";

const SiteHeader = () => {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onLabs = pathname.startsWith("/labs");
  const spy = useScrollSpy(onHome);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();
  const mobileId = useId();

  const closeAll = () => {
    setMenuOpen(false);
    setMobileOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") closeAll();
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setMenuOpen(false);
  };

  const homeActive = onHome && !spy.showcase;
  const componentsActive = onHome && spy.showcase;

  return (
    <header className="animate-drop fixed inset-x-0 top-0 z-50" onKeyDown={onKeyDown}>
      {/* Soft blurred backdrop that fades out downward — no box, no border. */}
      <div
        className="pointer-events-none absolute inset-0 bg-background/70 backdrop-blur-md [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto grid h-18 max-w-6xl grid-cols-[1fr_auto] items-center px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr]">

        <Link
          href="/"
          onClick={closeAll}
          className="flex items-center gap-2.5 justify-self-start font-mono text-base font-semibold tracking-tight"
        >
          <LogoMark className="size-7" />
          <span>
            aiaz<span className="text-cyan-300">·</span>labs
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-white/3 p-1">
            <li>
              <Link
                href="/"
                aria-current={homeActive || undefined}
                className={`${pill} ${homeActive ? pillActive : pillIdle}`}
              >
                Home
              </Link>
            </li>

            <li
              className="relative"
              onPointerEnter={(e) => e.pointerType === "mouse" && setMenuOpen(true)}
              onPointerLeave={(e) => e.pointerType === "mouse" && setMenuOpen(false)}
              onBlur={onBlur}
            >
              <div
                className={`flex items-center rounded-full ${componentsActive ? pillActive : ""}`}
              >
                <Link
                  href="/#showcase"
                  onClick={closeAll}
                  aria-current={componentsActive || undefined}
                  className={`${pill} pr-1 ${componentsActive ? "" : pillIdle}`}
                >
                  Components
                </Link>
                <button
                  type="button"
                  aria-expanded={menuOpen}
                  aria-controls={menuId}
                  aria-label="Component categories"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="mr-1 grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  <ChevronDownIcon
                    className={`size-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {menuOpen && (
                <div
                  id={menuId}
                  className="animate-rise absolute left-1/2 top-full w-136 -translate-x-1/2 pt-3"
                >
                  <div className="rounded-2xl border border-white/10 bg-[#070b14]/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                    <ul className="grid grid-cols-2 gap-1">
                      {categories.map((c) => {
                        const Icon = categoryIcons[c.id];
                        const current = spy.category === c.id;
                        return (
                          <li key={c.id}>
                            <Link
                              href={`/#${c.id}`}
                              onClick={closeAll}
                              style={{ "--accent": c.accent } as React.CSSProperties}
                              className={`group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white/5 ${current ? "bg-white/5" : ""}`}
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-(--accent)/30 bg-(--accent)/10 text-(--accent)">
                                <Icon className="size-5" />
                              </span>
                              <span className="min-w-0">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                  {c.name}
                                  <span className="rounded bg-white/5 px-1.5 font-mono text-[10px] text-faint">
                                    {projectsByCategory(c.id).length}
                                  </span>
                                </span>
                                <span className="mt-0.5 block text-xs leading-snug text-muted">
                                  {c.tagline}
                                </span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                    <Link
                      href="/#showcase"
                      onClick={closeAll}
                      className="mt-1 flex items-center justify-between rounded-xl border-t border-white/5 px-3 pb-2 pt-3 text-xs text-muted transition-colors hover:text-foreground"
                    >
                      <span>{projects.length} components across {categories.length} categories</span>
                      <span className="inline-flex items-center gap-1.5 font-medium text-cyan-300">
                        View all <ArrowIcon className="size-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link
                href="/labs"
                aria-current={onLabs ? "page" : undefined}
                className={`${pill} ${onLabs ? pillActive : pillIdle}`}
              >
                <BeakerIcon className="size-4" />
                Labs
                <span className="rounded bg-cyan-300 px-1.5 py-px font-mono text-[10px] font-semibold text-slate-950">
                  NEW
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href="/#showcase"
            onClick={closeAll}
            className="btn-shine hidden items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200 md:inline-flex"
          >
            Browse components
            <ArrowIcon className="size-4" />
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-xl border border-white/10 md:hidden"
          >
            {mobileOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>

        {mobileOpen && (
          <nav
            id={mobileId}
            aria-label="Mobile"
            className="animate-rise absolute inset-x-0 top-full mt-2 rounded-2xl border border-white/10 bg-[#070b14] p-3 shadow-2xl shadow-black/60 md:hidden"
          >
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" onClick={closeAll} className="block rounded-xl px-3 py-3 font-medium hover:bg-white/5">
                  Home
                </Link>
              </li>
              <li>
                <p className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-widest text-faint">
                  Components
                </p>
                <ul>
                  {categories.map((c) => {
                    const Icon = categoryIcons[c.id];
                    return (
                      <li key={c.id}>
                        <Link
                          href={`/#${c.id}`}
                          onClick={closeAll}
                          style={{ "--accent": c.accent } as React.CSSProperties}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-white/5"
                        >
                          <Icon className="size-5 text-(--accent)" />
                          {c.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="border-t border-white/5 pt-2">
                <Link href="/labs" onClick={closeAll} className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium hover:bg-white/5">
                  <BeakerIcon className="size-5 text-cyan-300" />
                  Labs
                  <span className="rounded bg-cyan-300 px-1.5 py-px font-mono text-[10px] font-semibold text-slate-950">
                    NEW
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
