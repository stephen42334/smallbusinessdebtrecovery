import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { Briefcase, BadgeCheck, Building2, ClipboardList, FileSignature, HardHat, Home, Landmark, MapPin, MessageSquare, Quote, Scale, Search, Send, Wallet, Phone, Mail, Globe2, Hammer } from "lucide-react";
import { faqs, site, trustBlocks } from "@/config/site";
import { EnquiryCta, PhoneCta } from "./Cta";
import { EnquiryForm } from "./EnquiryForm";

const wrap = "mx-auto max-w-7xl px-4 sm:px-6";
const h2 = "text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl";

/** Returns /images/<name> if a real photo has been dropped into public/images. */
function photo(name: string) {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", "images", `${name}.${ext}`))) return `/images/${name}.${ext}`;
  }
  return null;
}

export function Hero() {
  return (
    <section id="top" className="blueprint bg-navy text-white">
      <div className={`${wrap} grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:py-20`}>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Debt recovery for NSW tradies and subcontractors</p>
          <h1 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">Builder not paying you?</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-200">
            <p>You’ve done the work. You’ve sent the invoice. Maybe you’ve even sent a payment claim.</p>
            <p className="font-semibold text-white">The money still hasn’t arrived.</p>
            <p>Wages, materials and suppliers don’t wait, and chasing a builder takes time you should be spending on the next job.</p>
            <p>{site.agencyName} helps NSW tradies and subcontractors pursue overdue payments from builders and other businesses. We look at your paperwork and your dates, explain your options, and chase the debt for you.</p>
            <p>Time limits can apply in NSW, so it pays to speak up early. Our fees are commission-based, linked to the amount recovered and subject to the agreed terms.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <EnquiryCta location="hero">DISCUSS YOUR UNPAID INVOICE</EnquiryCta>
            <PhoneCta location="hero" />
          </div>
        </div>
        <div id="enquiry" className="relative scroll-mt-24"><EnquiryForm /></div>
      </div>
    </section>
  );
}

const story = [
  { icon: Hammer, t: "Job done", d: "Your crew is paid. Materials are covered." },
  { icon: Send, t: "Claim sent", d: "The payment date comes and goes." },
  { icon: Phone, t: "“Pay when paid”", d: "Another excuse. Another delay." },
  { icon: Wallet, t: "Still unpaid", d: "Cash that should be funding your next job." },
];

export function Problem() {
  const img = photo("problem");
  return (
    <section id="problem" className="bg-white py-16 sm:py-24">
      <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center`}>
        <div>
          <h2 className={`${h2} text-navy`}>You did the work. The builder owes you.</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-700">
            <p>If you’re a subbie, you know the pattern.</p>
            <p>You pay your crew and your suppliers up front. You finish the job. You send the invoice or progress claim.</p>
            <p className="font-semibold text-navy">Then you hear “pay when paid”, “the variation’s disputed”, or nothing at all.</p>
            <p>Every week the builder holds your money is a week they’re using it and you’re not. It can be hard to keep pushing without damaging the relationship or losing the next job.</p>
            <p>NSW has specific rules about getting paid for construction work, and the time limits can be short. Waiting and hoping can cost you options.</p>
            <p className="font-semibold text-navy">You don’t have to work it out alone.</p>
            <p>We’ll look at your contract, your invoices and your dates, explain where you stand, and take over the chasing.</p>
          </div>
          <div className="mt-8"><EnquiryCta location="problem">DISCUSS YOUR UNPAID INVOICE</EnquiryCta></div>
        </div>
        <div className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy">
            {img ? (
              <Image src={img} alt="Tradesperson reviewing paperwork on a construction site" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" priority={false} />
            ) : (
              <div className="blueprint flex h-full w-full items-center justify-center" role="img" aria-label="Construction site illustration placeholder"><HardHat size={96} className="text-accent/70" aria-hidden /></div>
            )}
          </div>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {story.map(({ icon: I, t, d }, i) => (
              <li key={t} className={`rounded-lg border p-3 ${i === 3 ? "border-forest bg-accent/15" : "border-slate-200 bg-mist"}`}>
                <I size={22} className="text-forest" aria-hidden /><p className="mt-2 text-sm font-bold text-navy">{t}</p><p className="mt-0.5 text-xs text-slate-600">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const cards = [
  { icon: Building2, title: "Unpaid by a builder or head contractor", body: "For NSW subcontractors and trades owed progress payments, final claims or retention by a builder or head contractor.", note: "This is our focus. We review your contract, claims and dates, then pursue the debt." },
  { icon: Landmark, title: "Unpaid by another business", body: "For unpaid invoices owed by developers, property owner companies, suppliers and other commercial customers.", note: "" },
  { icon: Home, title: "Unpaid by a homeowner", body: "For eligible debts owed by homeowners. These are assessed case by case, because different rules can apply.", note: "If legal action is the right next step, we explain the options and can refer you to an independent legal professional." },
];

export function Services() {
  return (
    <section id="services" className="bg-mist py-16 sm:py-24">
      <div className={wrap}>
        <h2 className={`${h2} text-navy`}>Debt recovery services</h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{site.agencyName} helps NSW tradies and subcontractors recover unpaid invoices, with a structured process from assessment through to further escalation where appropriate.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: I, title, body, note }) => (
            <article key={title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-accent"><I size={24} aria-hidden /></span>
              <h3 className="mt-5 text-xl font-bold text-navy">{title}</h3>
              <p className="mt-3 text-slate-700">{body}</p>
              {note && <p className="mt-3 text-sm text-slate-600">{note}</p>}
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600"><span className="font-semibold text-navy">Built for:</span> carpenters, concreters, plumbers, electricians, roofers, bricklayers, painters, plasterers, tilers, landscapers, HVAC contractors, earthworks crews and other NSW trades with overdue invoices.</p>
      </div>
    </section>
  );
}

const steps = [
  { icon: ClipboardList, t: "Tell us what happened", d: "Who owes you, how much, what’s in writing and the dates you invoiced or sent claims. The form takes about three minutes." },
  { icon: Search, t: "We review your paperwork and timing", d: "We look at your contract or quote, your invoices and any claims, and tell you plainly whether we can help. Not every debt is a fit." },
  { icon: FileSignature, t: "Agree the terms", d: "Before anything starts, we explain the commission, any other fees or expenses, the recovery process and the terms of engagement." },
  { icon: Send, t: "We chase the money", d: "Once you’ve agreed, we handle debtor communication and follow-up for you, and keep you updated." },
  { icon: Scale, t: "Legal step if needed", d: "If a matter needs legal attention, such as a formal claim process, we explain the pathway. Legal work is carried out by an independent legal professional." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navy py-16 text-white sm:py-24">
      <div className={wrap}>
        <h2 className={h2}>A clear process. A straight answer first.</h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">Five steps from your first enquiry to recovery action. You’ll know where you stand, and what it costs, before any work begins.</p>
        <ol className="mt-12 grid gap-6 md:grid-cols-5">
          {steps.map(({ icon: I, t, d }, i) => (
            <li key={t} className="relative rounded-xl border border-white/15 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-black"><I size={22} aria-hidden /></span>
                <span className="text-4xl font-black text-slate-400" aria-hidden>0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-base font-bold uppercase leading-snug"><span className="sr-only">Step {i + 1}: </span>{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10"><EnquiryCta location="how_it_works">DISCUSS YOUR UNPAID INVOICE</EnquiryCta></div>
      </div>
    </section>
  );
}

const pricingPoints = [
  "The applicable commission percentage.", "When commission becomes payable.", "Whether additional fees or expenses apply.",
  "How unsuccessful recovery attempts are treated.", "What happens if the builder disputes the debt.", "Any other relevant conditions in the agreement.",
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-24">
      <div className={`${wrap} grid gap-10 lg:grid-cols-2 lg:items-center`}>
        <div>
          <h2 className={`${h2} text-navy`}>Commission-based debt recovery</h2>
          <div className="mt-6 space-y-4 text-lg text-slate-700">
            <p>You’ve already carried the cost of the unpaid work.</p>
            <p>You shouldn’t have to find money up front to chase money you’re already owed. We understand why you want clarity on fees first.</p>
            <p>Our pricing is based on commission on recovered debt.</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-mist p-7">
          <p className="font-bold text-navy">Before you engage us, we’ll explain:</p>
          <ul className="mt-4 space-y-3">
            {pricingPoints.map((p) => <li key={p} className="flex gap-3 text-slate-800"><BadgeCheck className="mt-0.5 shrink-0 text-forest" size={20} aria-hidden />{p}</li>)}
          </ul>
          <p className="mt-5 font-semibold text-navy">No guessing. No surprises about the agreed fees.</p>
          <div className="mt-6"><EnquiryCta location="pricing">ASK ABOUT OUR FEES</EnquiryCta></div>
        </div>
      </div>
    </section>
  );
}

const trustIcons = { briefcase: Briefcase, hardhat: HardHat, badge: BadgeCheck, map: MapPin, message: MessageSquare, quote: Quote } as const;

export function WhyChoose() {
  return (
    <section id="why-us" className="bg-mist py-16 sm:py-24">
      <div className={wrap}>
        <h2 className={`${h2} text-navy`}>Why speak with {site.agencyName}?</h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">When you’re trusting someone with money a builder owes you, you need to know who they are and how they work. That starts with clear communication, a transparent process and a straight explanation of your options.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trustBlocks.map((b) => {
            const I = trustIcons[b.icon as keyof typeof trustIcons];
            return (
              <article key={b.id} data-editable-placeholder={b.id} className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
                <I className="text-forest" size={26} aria-hidden />
                <h3 className="mt-3 text-lg font-bold text-navy">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{b.content}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className={`${h2} text-navy`}>Frequently asked questions</h2>
        <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-lg font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {q}<span aria-hidden className="text-2xl text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 pr-8 text-slate-700">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const img = photo("cta");
  return (
    <section id="contact" className="blueprint relative overflow-hidden bg-navy py-16 text-white sm:py-24">
      {img && <Image src={img} alt="" fill sizes="100vw" className="object-cover opacity-20" />}
      <div className={`${wrap} relative grid gap-10 lg:grid-cols-2 lg:items-center`}>
        <div>
          <h2 className={h2}>Let’s talk about the money you’re owed.</h2>
          <p className="mt-5 text-lg text-slate-200">You’ve already spent enough time chasing the payment.</p>
          <p className="mt-3 text-lg text-slate-200">Tell us what happened. We’ll review your paperwork and dates, and tell you plainly whether we can help.</p>
          <div className="mt-8"><EnquiryCta location="final_cta">DISCUSS YOUR UNPAID INVOICE</EnquiryCta></div>
        </div>
        <dl className="space-y-4 rounded-xl border border-white/15 bg-white/5 p-7">
          {[[Phone, "Phone", site.phone], [Mail, "Email", site.email], [Building2, "Agency", site.agencyName], [Globe2, "Service area", site.serviceArea]].map(([I, k, v]) => {
            const Icon = I as typeof Phone;
            return (
              <div key={k as string}>
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300"><Icon className="text-accent" size={16} aria-hidden />{k as string}</dt>
                <dd className="mt-1 pl-6 text-lg font-semibold">{v as string}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-black pb-24 pt-12 text-slate-300 md:pb-12">
      <div className={`${wrap} grid gap-8 md:grid-cols-3`}>
        <div>
          <Image src="/images/logo.webp" alt={`${site.agencyName} logo`} width={2000} height={667} sizes="260px" className="h-auto w-64" />
          <p className="mt-3 text-sm">Debt recovery for NSW tradies and subcontractors.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">Contact</p>
          <p className="mt-2">{site.phone}</p><p>{site.email}</p><p>{site.serviceArea}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">Business information</p>
          <p className="mt-2">ABN: {site.abn}</p><p>{site.licences}</p>
          <p className="mt-3 flex gap-4"><a className="underline hover:text-white" href={site.privacyUrl}>Privacy Policy</a><a className="underline hover:text-white" href={site.termsUrl}>Terms &amp; Conditions</a>{site.portalUrl && <a className="underline hover:text-white" href={site.portalUrl}>Client login</a>}</p>
        </div>
      </div>
      <div className={`${wrap} mt-10 border-t border-white/10 pt-6 text-xs leading-relaxed text-slate-400`}>
        <p>Debt recovery services are subject to assessment, applicable laws and the terms of the engagement agreement. Recovery is not guaranteed. Time limits may apply to claims.</p>
        <p className="mt-2">{site.agencyName} is not a law firm and does not provide legal advice. Where legal action is appropriate, matters may be referred to an independent legal professional.</p>
        <p className="mt-2">© {new Date().getFullYear()} {site.agencyName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
