"use client";
import { track } from "@/lib/analytics";
import { hasRealPhone, telHref } from "@/config/site";
import { FileText, Phone } from "lucide-react";

/** Sticky bottom bar on mobile: click-to-call + enquiry. */
export function MobileBar() {
  return (
    <aside aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-accent/30 bg-black p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <a href={telHref} onClick={() => track(hasRealPhone ? "phone_click" : "cta_click", { location: "mobile_bar", label: "call" })}
         className="flex min-h-12 items-center justify-center gap-2 rounded-md border-2 border-white/70 font-bold text-white"><Phone size={18} aria-hidden />Call now</a>
      <a href="#enquiry" onClick={() => track("cta_click", { location: "mobile_bar", label: "enquire" })}
         className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent font-bold text-black"><FileText size={18} aria-hidden />Enquire</a>
    </aside>
  );
}