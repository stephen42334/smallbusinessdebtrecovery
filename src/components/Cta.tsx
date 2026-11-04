"use client";
import { track } from "@/lib/analytics";
import { hasRealPhone, phoneLabel, telHref } from "@/config/site";
import { ArrowRight, Phone } from "lucide-react";

const base = "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-base font-bold tracking-wide transition-colors min-h-12 text-center";
const variants = {
  primary: "bg-accent text-black hover:bg-accent-dark",
  outline: "border-2 border-white/70 text-white hover:bg-white hover:text-navy",
  outlineDark: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
};

export function EnquiryCta({ children, location, variant = "primary" }: { children: React.ReactNode; location: string; variant?: keyof typeof variants }) {
  return (
    <a href="#enquiry" className={`${base} ${variants[variant]}`} onClick={() => track("cta_click", { location, label: String(children) })}>
      {children}<ArrowRight size={18} aria-hidden />
    </a>
  );
}

export function PhoneCta({ location, variant = "outline", prefix = "CALL" }: { location: string; variant?: keyof typeof variants; prefix?: string }) {
  return (
    <a href={telHref} className={`${base} ${variants[variant]}`}
       onClick={() => track(hasRealPhone ? "phone_click" : "cta_click", { location, label: "call" })}>
      <Phone size={18} aria-hidden />{prefix ? `${prefix} ` : ""}{phoneLabel}
    </a>
  );
}
