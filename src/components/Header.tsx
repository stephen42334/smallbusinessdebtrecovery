import Image from "next/image";
import { site } from "@/config/site";
import { EnquiryCta, PhoneCta } from "./Cta";

const links = [["Services", "#services"], ["How it works", "#how-it-works"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-accent/30 bg-black">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label={`${site.agencyName} – home`} className="shrink-0"><Image src="/images/logo.webp" alt={`${site.agencyName} logo`} width={2000} height={667} priority sizes="180px" className="h-16 w-auto" /></a>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm font-medium text-slate-200 lg:flex">
          {links.map(([l, h]) => <a key={h} href={h} className="hover:text-white">{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          {site.portalUrl && <a href={site.portalUrl} className="hidden rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white sm:block">Client login</a>}
          <div className="hidden md:block"><PhoneCta location="header" prefix="" variant="outline" /></div>
          <div className="hidden sm:block"><EnquiryCta location="header">Get in touch</EnquiryCta></div>
        </div>
      </div>
    </header>
  );
}
