import { amountBands, debtTypes, overdueBands } from "@/config/site";

export type EnquiryInput = {
  fullName: string; businessName: string; phone: string; email: string;
  debtType: string; amount: string; overdue: string; description: string; consent: boolean;
};
export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

/** Strip control chars + angle brackets, collapse whitespace, cap length. */
export function sanitize(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  let v = value.normalize("NFKC").replace(/[<>]/g, "");
  // eslint-disable-next-line no-control-regex
  v = multiline ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : v.replace(/[\u0000-\u001F\u007F]/g, " ");
  v = multiline ? v.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") : v.replace(/\s+/g, " ");
  return v.trim().slice(0, max);
}

export function cleanEnquiry(raw: Record<string, unknown>): EnquiryInput {
  return {
    fullName: sanitize(raw.fullName, 100),
    businessName: sanitize(raw.businessName, 120),
    phone: sanitize(raw.phone, 30),
    email: sanitize(raw.email, 254).toLowerCase(),
    debtType: sanitize(raw.debtType, 80),
    amount: sanitize(raw.amount, 40),
    overdue: sanitize(raw.overdue, 40),
    description: sanitize(raw.description, 1500, true),
    consent: raw.consent === true || raw.consent === "true" || raw.consent === "on",
  };
}

export function validateEnquiry(d: EnquiryInput): FieldErrors {
  const e: FieldErrors = {};
  if (d.fullName.length < 2) e.fullName = "Please enter your full name.";
  if (!/^[+()\d\s-]{8,20}$/.test(d.phone) || d.phone.replace(/\D/g, "").length < 8)
    e.phone = "Please enter a valid phone number (e.g. 0412 345 678).";
  if (!EMAIL_RE.test(d.email)) e.email = "Please enter a valid email address.";
  if (!(debtTypes as readonly string[]).includes(d.debtType)) e.debtType = "Please select the type of debt.";
  if (!(amountBands as readonly string[]).includes(d.amount)) e.amount = "Please select the approximate amount owed.";
  if (!(overdueBands as readonly string[]).includes(d.overdue)) e.overdue = "Please select how long it has been overdue.";
  if (!d.consent) e.consent = "Please confirm you consent to us contacting you about this enquiry.";
  return e;
}
