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
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Debt recovery for Australian businesses and outstanding debt matters</p>
          <h1 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">Still chasing money you’ve already earned?</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-200">
            <p>You’ve finished the job. Sent the invoice. Followed up.</p>
            <p className="font-semibold text-white">But the payment still hasn’t arrived.</p>
            <p>Meanwhile, wages, materials, suppliers and operating costs keep coming.</p>
            <p>You have a business to run. You shouldn’t have to spend your days chasing overdue payments.</p>
            <p>{site.agencyName} provides debt recovery services for commercial and consumer debt matters, helping clients pursue outstanding money through a structured recovery process.</p>
            <p>With commission-based pricing, our fees are linked to the amount recovered, subject to the agreed terms.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <EnquiryCta location="hero">DISCUSS YOUR OUTSTANDING DEBT</EnquiryCta>
            <PhoneCta location="hero" />
          </div>
        </div>
        <div id="enquiry" className="relative scroll-mt-24"><EnquiryForm /></div>
      </div>
    </section>
  );
}

const story = [
  { icon: Hammer, t: "Job delivered", d: "Workers paid. Materials covered." },
  { icon: Send, t: "Invoice sent", d: "The payment date passes." },
  { icon: Phone, t: "Calls and emails", d: "Another follow-up. Another promise." },
  { icon: Wallet, t: "Still unpaid", d: "Money that could fund the next job." },
];

export function Problem() {
  const img = photo("problem");
  return (
    <section id="problem" className="bg-white py-16 sm:py-24">
      <div className={`${wrap} grid gap-12 lg:grid-cols-2 lg:items-center`}>
        <div>
          <h2 className={`${h2} text-navy`}>You’ve done the work. Now it’s time to address the unpaid invoice.</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-700">
            <p>If you run a construction or trades business, you know how quickly one overdue invoice can become a headache.</p>
            <p>You’ve paid your workers. You’ve covered the materials. You’ve delivered the job.</p>
            <p className="font-semibold text-navy">Then the payment date passes.</p>
            <p>You send another email. Make another call. Get another promise.</p>
            <p>And the money still isn’t in your account.</p>
            <p>That money could be helping you pay suppliers, cover operating costs, fund the next job or keep your business moving.</p>
            <p>Instead, you’re spending valuable time chasing someone else for payment.</p>
            <p className="font-semibold text-navy">There is another option.</p>
            <p>You can speak with a debt recovery agency about the steps available to pursue the outstanding amount.</p>
          </div>
          <div className="mt-8"><EnquiryCta location="problem">DISCUSS YOUR OUTSTANDING DEBT</EnquiryCta></div>
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
  { icon: Building2, title: "Commercial Debt Recovery", body: "For businesses seeking assistance with outstanding commercial debts, including unpaid invoices and other eligible business payment obligations.", note: "Relevant audiences include builders, subcontractors, trades businesses, suppliers and other commercial operators." },
  { icon: Home, title: "Consumer Debt Recovery", body: "For eligible consumer debt matters, subject to the nature of the debt, applicable requirements and the services provided.", note: "" },
  { icon: Scale, title: "Recovery Process and Legal Referrals", body: "Where appropriate, the recovery process may involve further escalation or referral to a legal professional.", note: "We’ll explain the available process and what may be involved in your circumstances. Any legal work is carried out by the relevant legal professional, not by us." },
];

export function Services() {
  return (
    <section id="services" className="bg-mist py-16 sm:py-24">
      <div className={wrap}>
        <h2 className={`${h2} text-navy`}>Debt recovery services</h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{site.agencyName} assists with both commercial and consumer debt recovery matters, with a structured process from assessment through to further escalation where appropriate.</p>
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
        <p className="mt-8 text-sm text-slate-600"><span className="font-semibold text-navy">Relevant to:</span> builders, subcontractors, plumbers, electricians, roofers, concreters, HVAC contractors and other Australian trades and construction businesses with overdue invoices.</p>
      </div>
    </section>
  );
}

const steps = [
  { icon: ClipboardList, t: "Tell us what is owed", d: "Share the basics: who owes you, how much, when it was due and what has happened so far. The enquiry form takes about two minutes." },
  { icon: Search, t: "We assess the matter", d: "We review the details and tell you plainly whether the debt suits the services we provide. Not every debt will be a fit." },
  { icon: FileSignature, t: "Understand the costs and agreement", d: "Before anything starts, we explain the commission arrangement, any additional fees or expenses, the recovery process and the terms of engagement." },
  { icon: Send, t: "Recovery action begins", d: "Once you’ve agreed to the terms, we carry out the agreed recovery activities, including debtor communication and follow-up." },
  { icon: Landmark, t: "Legal referral where appropriate", d: "If a matter needs legal attention, we explain the referral pathway and what the next steps may involve. Legal work is carried out by an independent legal professional." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navy py-16 text-white sm:py-24">
      <div className={wrap}>
        <h2 className={h2}>A clear process. A conversation before you commit.</h2>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">Five steps from first enquiry to recovery action. You’ll understand the costs and terms before any recovery work begins.</p>
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
        <div className="mt-10"><EnquiryCta location="how_it_works">DISCUSS YOUR OUTSTANDING DEBT</EnquiryCta></div>
      </div>
    </section>
  );
}

const pricingPoints = [
  "The applicable commission percentage.", "When commission becomes payable.", "Whether additional fees or expenses apply.",
  "How unsuccessful recovery attempts are treated.", "What happens if a debt is disputed.", "Any other relevant conditions in the agreement.",
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-white py-16 sm:py-24">
      <div className={`${wrap} grid gap-10 lg:grid-cols-2 lg:items-center`}>
        <div>
          <h2 className={`${h2} text-navy`}>Commission-based debt recovery</h2>
          <div className="mt-6 space-y-4 text-lg text-slate-700">
            <p>You’ve already carried the cost of the unpaid work.</p>
            <p>We understand why you want clarity before paying someone to help recover the money.</p>
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
        <p className="mt-4 max-w-3xl text-lg text-slate-700">When you’re trusting someone to handle an outstanding debt, you need to understand who they are and how they work. We believe that starts with clear communication, a transparent process and a straightforward explanation of your options.</p>
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
          <p className="mt-5 text-lg text-slate-200">You’ve already spent time chasing the payment.</p>
          <p className="mt-3 text-lg text-slate-200">Let’s have a conversation about the debt, understand your situation and discuss whether our recovery services may be suitable.</p>
          <div className="mt-8"><EnquiryCta location="final_cta">DISCUSS YOUR OUTSTANDING DEBT</EnquiryCta></div>
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
          <p className="mt-3 text-sm">Debt recovery for Australian businesses and outstanding debt matters.</p>
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
        <p>Debt recovery services are subject to assessment, applicable laws and the terms of the engagement agreement. Recovery is not guaranteed.</p>
        <p className="mt-2">{site.agencyName} is not a law firm and does not provide legal advice. Where legal action is appropriate, matters may be referred to an independent legal professional.</p>
        <p className="mt-2">© {new Date().getFullYear()} {site.agencyName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
