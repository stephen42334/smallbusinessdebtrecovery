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
    content: "[EDITABLE PLACEHOLDER – list the industries and debt types you genuinely handle.]" },
  { id: "credentials", title: "Professional memberships and credentials", icon: "badge",
    content: "[EDITABLE PLACEHOLDER – list real memberships / licences with registration numbers. Display none until verified.]" },
  { id: "coverage", title: "Geographic service coverage", icon: "map",
    content: "[EDITABLE PLACEHOLDER – states/territories actually serviced.]" },
  { id: "communication", title: "Client communication and updates", icon: "message",
    content: "[EDITABLE PLACEHOLDER – describe how and how often clients receive updates, once the process is confirmed.]" },
  { id: "testimonials", title: "Genuine testimonials and case studies", icon: "quote",
    content: "[EDITABLE PLACEHOLDER – add only real, consented client testimonials or case studies.]" },
];

export const debtTypes = ["Commercial debt (e.g. unpaid invoice)", "Consumer debt", "Not sure"] as const;
export const amountBands = ["Under $5,000", "$5,000 – $20,000", "$20,000 – $50,000", "$50,000 – $100,000", "Over $100,000"] as const;
export const overdueBands = ["Under 30 days", "30 – 60 days", "61 – 90 days", "3 – 6 months", "6 – 12 months", "Over 12 months"] as const;

export const faqs = [
  { q: "What types of debt can you help with?", a: "We handle eligible commercial and consumer debt matters. The suitability of a particular debt depends on its circumstances and whether it falls within our services." },
  { q: "Do you work with construction and trades businesses?", a: "Construction and trades businesses are an important audience for our services. If you have an overdue invoice or another outstanding commercial debt, contact us to discuss it." },
  { q: "How much does debt recovery cost?", a: "Our pricing is based on commission on recovered debt. The applicable rate and any additional fees or expenses will be explained before you enter into an agreement." },
  { q: "Do I pay if the debt is not recovered?", a: "This depends on the agreed terms and any applicable fees or expenses. We’ll explain exactly what applies before you proceed." },
  { q: "How long does debt recovery take?", a: "There is no single timeframe that applies to every debt. It depends on factors such as the debtor’s response, whether the debt is disputed and whether further action is required." },
  { q: "What if the debtor disputes the amount?", a: "A disputed debt may require additional assessment and potentially legal advice. We’ll explain the options available and any relevant referral process." },
  { q: "Can you arrange legal action?", a: "Where appropriate, we can explain the legal referral pathway. Any legal work is subject to arrangements with the relevant legal professional and the circumstances of the matter." },
  { q: "What information should I provide?", a: "Start with the amount owed, the payment due date, the debtor’s details and a brief explanation of the circumstances." },
  { q: "How do I get started?", a: `Call ${phoneLabel} or complete the enquiry form on this page. We’ll discuss your situation and explain the next steps.` },
];
