import SiteFooter from "@/features/site/components/SiteFooter";
import SiteHeader from "@/features/site/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-md focus:bg-cyan-300 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-950"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
