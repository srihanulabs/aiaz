import Link from "next/link";
import { siteConfig } from "../config";
import LogoMark from "./LogoMark";

const SiteFooter = () => (
  <footer className="mt-auto border-t border-line">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between">
      <Link href="/" className="flex items-center gap-2.5 font-mono text-base font-semibold tracking-tight">
        <LogoMark className="size-7" />
        <span>
          aiaz<span className="text-cyan-300">·</span>labs
        </span>
      </Link>

      <nav aria-label="Footer" className="text-sm text-muted">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
          <li>
            <Link href="/#showcase" className="hover:text-foreground">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/labs" className="hover:text-foreground">
              Labs
            </Link>
          </li>
          <li className="font-mono text-xs text-faint">
            © {new Date().getFullYear()} {siteConfig.domain}
          </li>
        </ul>
      </nav>
    </div>
  </footer>
);

export default SiteFooter;
