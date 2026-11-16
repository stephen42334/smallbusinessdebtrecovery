/**
 * SINGLE SOURCE OF TRUTH for editable business content.
 *
 * Anything marked `REVIEW:` is unverified/unsupplied and MUST be confirmed
 * by the business (and ideally a compliance adviser) before production.
 * Values come from NEXT_PUBLIC_* env vars; when unset, the visible
 * [PLACEHOLDER] text is kept so nothing is invented.
 */
const env = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback);

export const site = {
  agencyName: env(process.env.NEXT_PUBLIC_AGENCY_NAME, "Small Business Debt Recovery"),
  phone: env(process.env.NEXT_PUBLIC_PHONE, "[PHONE NUMBER]"),
  email: env(process.env.NEXT_PUBLIC_EMAIL, "[EMAIL ADDRESS]"),
  serviceArea: env(process.env.NEXT_PUBLIC_SERVICE_AREA, "[SERVICE AREA]"),
  abn: env(process.env.NEXT_PUBLIC_ABN, "[ABN – TO BE PROVIDED]"),
  // REVIEW: licences / registrations required for debt collection in the states served.
  licences: "[APPLICABLE LICENCES / REGISTRATIONS – TO BE PROVIDED]",
  privacyUrl: env(process.env.NEXT_PUBLIC_PRIVACY_URL, "#privacy-policy-placeholder"),
  termsUrl: env(process.env.NEXT_PUBLIC_TERMS_URL, "#terms-placeholder"),
  siteUrl: env(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  // Optional client/staff portal (separate app at portal.[DOMAIN]). The login link only renders when this is set.
  portalUrl: (process.env.NEXT_PUBLIC_PORTAL_URL ?? "").trim(),
} as const;

export const hasRealPhone = site.phone.replace(/\D/g, "").length >= 8;
export const telHref = hasRealPhone ? `tel:${site.phone.replace(/[^\d+]/g, "")}` : "#enquiry";
export const phoneLabel = site.phone;

/** Editable "Why choose us" blocks. Replace `content` with verified copy. */
export type TrustBlock = { id: string; title: string; icon: string; content: string };
export const trustBlocks: TrustBlock[] = [
  { id: "experience", title: "Relevant debt recovery experience", icon: "briefcase",
    content: "[EDITABLE PLACEHOLDER – describe verified debt recovery experience. Do not state years or figures unless verified.]" },
  { id: "industries", title: "Industries and debt types handled", icon: "hardhat",
    content: "[EDITABLE PLACEHOLDER – describe the trades and construction debt you genuinely handle in NSW (e.g. subcontractor claims against builders).]" },
  { id: "credentials", title: "Professional memberships and credentials", icon: "badge",
    content: "[EDITABLE PLACEHOLDER – list real memberships / licences with registration numbers. Display none until verified.]" },
  { id: "coverage", title: "Geographic service coverage", icon: "map",
    content: "[EDITABLE PLACEHOLDER – confirm NSW coverage once your licensing position is confirmed.]" },
  { id: "communication", title: "Client communication and updates", icon: "message",
    content: "[EDITABLE PLACEHOLDER – describe how and how often clients receive updates, once the process is confirmed.]" },
  { id: "testimonials", title: "Genuine testimonials and case studies", icon: "quote",
    content: "[EDITABLE PLACEHOLDER – add only real, consented client testimonials or case studies.]" },
];

// Enquiry form options. Built for NSW tradies chasing builders; the server validates against these exact lists.
export const trades = ["Carpentry / framing", "Concreting", "Plumbing / drainage", "Electrical", "Roofing", "Bricklaying / masonry", "Painting", "Plastering / rendering", "Tiling / waterproofing", "Landscaping", "Air-conditioning / HVAC", "Earthworks / civil", "Other trade"] as const;
export const debtorRoles = ["Builder / head contractor", "Developer or property owner company", "Another business", "Homeowner (lives or will live there)", "Not sure"] as const;
export const amountBands = ["Under $2,500", "$2,500 – $10,000", "$10,000 – $25,000", "$25,000 – $50,000", "$50,000 – $100,000", "Over $100,000"] as const;
export const overdueBands = ["Not yet due", "Under 30 days", "30 – 60 days", "61 – 90 days", "3 – 6 months", "6 – 12 months", "Over 12 months"] as const;
export const workStatuses = ["Finished the work", "Still working on the job", "Stopped or left the job"] as const;
export const paperworkOptions = ["Signed contract or subcontract", "Accepted quote or purchase order", "Emails or texts only", "Nothing in writing"] as const;
export const paymentClaimOptions = ["Yes – they replied", "Yes – no reply", "No", "Not sure what that is"] as const;
export const jobLocations = ["New South Wales", "Outside NSW (we’ll tell you if we can help)"] as const;
export const disputeOptions = ["No – they haven’t disputed it", "Yes – they dispute some or all of it", "Not sure"] as const;
export const actionOptions = ["Nothing yet", "Reminders / follow-up calls", "Letter of demand sent", "Part payments or a promise to pay", "Already with another agency or solicitor"] as const;
export const licenceOptions = ["Yes", "No", "The work doesn’t need a licence", "Not sure"] as const;

export const faqs = [
  { q: "I’m a tradie and a builder hasn’t paid me. Can you help?", a: "That’s who we built this for. Tell us what happened using the form. We’ll review the details and tell you plainly whether we can help and what your options look like." },
  { q: "The builder says “pay when paid”. Does that mean I have to wait?", a: "Not necessarily. Whether you have to wait depends on your contract and the law. We’ll look at what you signed and explain your options. For a legal view, a construction lawyer is the right person, and we can refer you to an independent legal professional." },
  { q: "What is Security of Payment in NSW?", a: "It’s NSW law that gives eligible construction contractors a faster way to claim progress payments, with short and strict time limits. We can explain in general terms how it may apply to your job. We don’t provide legal advice, and where a legal step is needed we refer you to an independent legal professional." },
  { q: "Does this work if the debtor is a homeowner?", a: "Sometimes. Homeowner debts are assessed case by case, and different rules can apply. Tell us the details and we’ll say whether we can help." },
  { q: "What paperwork should I gather?", a: "Your contract, subcontract or accepted quote, any variations, invoices and payment claims with the dates you sent them, emails and texts with the builder, and photos or sign-off showing the work was done. Don’t worry if some of it is missing." },
  { q: "How much does it cost?", a: "Our pricing is based on commission on recovered debt. The applicable rate and any additional fees or expenses will be explained before you enter into an agreement." },
  { q: "Do I pay if nothing is recovered?", a: "This depends on the agreed terms and any applicable fees or expenses. We’ll explain exactly what applies before you proceed." },
  { q: "Should I act quickly?", a: "Yes. Time limits can apply to a claim, and they can be short in NSW. If you’re unsure, enquire early and tell us the dates of your invoices and claims." },
  { q: "How long does recovery take?", a: "There is no single timeframe. It depends on the debtor’s response, whether the debt is disputed and whether further action is needed." },
  { q: "How do I get started?", a: `Call ${phoneLabel} or complete the enquiry form on this page. We’ll talk through your situation and explain the next steps.` },
];
