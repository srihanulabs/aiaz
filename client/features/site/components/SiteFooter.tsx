import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "../config";
import { ExternalIcon } from "./icons";

const SiteFooter = () => (
  <footer className="mt-auto border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <Image
          src="/rahul_mishra.jpg"
          alt={siteConfig.author}
          width={44}
          height={44}
          className="size-11 rounded-full border border-line object-cover"
        />
        <div>
          <p className="text-sm font-medium">Built by {siteConfig.author}</p>
          <p className="text-xs text-faint">
            AI · RAG · accessibility · performance
          </p>
        </div>
      </div>

      <nav aria-label="Footer" className="text-sm text-muted">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li>
            <Link href="/#showcase" className="hover:text-foreground">
              Components
            </Link>
          </li>
          <li>
            <Link href="/labs" className="hover:text-foreground">
              Labs
            </Link>
          </li>
          <li>
            <a
              href={siteConfig.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-cyan-300 hover:text-cyan-200"
            >
              rahulmishra.com
              <ExternalIcon className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </ul>
        <p className="mt-3 font-mono text-xs text-faint">
          © {new Date().getFullYear()} {siteConfig.name} · Next.js · React 19 · Tailwind
        </p>
      </nav>
    </div>
  </footer>
);

export default SiteFooter;
