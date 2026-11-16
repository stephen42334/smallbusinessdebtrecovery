import { actionOptions, amountBands, debtorRoles, disputeOptions, jobLocations, licenceOptions, overdueBands, paperworkOptions, paymentClaimOptions, trades, workStatuses } from "@/config/site";

export type EnquiryInput = {
  fullName: string; businessName: string; phone: string; email: string;
  trade: string; debtorRole: string; amount: string; overdue: string; workStatus: string; paperwork: string; paymentClaim: string;
  jobLocation: string; disputed: string; actionTaken: string; licence: string; description: string; consent: boolean;
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
    trade: sanitize(raw.trade, 60),
    debtorRole: sanitize(raw.debtorRole, 60),
    amount: sanitize(raw.amount, 40),
    overdue: sanitize(raw.overdue, 40),
    workStatus: sanitize(raw.workStatus, 60),
    paperwork: sanitize(raw.paperwork, 60),
    paymentClaim: sanitize(raw.paymentClaim, 60),
    jobLocation: sanitize(raw.jobLocation, 80),
    disputed: sanitize(raw.disputed, 80),
    actionTaken: sanitize(raw.actionTaken, 80),
    licence: sanitize(raw.licence, 60),
    description: sanitize(raw.description, 1500, true),
    consent: raw.consent === true || raw.consent === "true" || raw.consent === "on",
  };
}

const oneOf = (list: readonly string[], v: string) => list.includes(v);

export function validateEnquiry(d: EnquiryInput): FieldErrors {
  const e: FieldErrors = {};
  if (d.fullName.length < 2) e.fullName = "Please enter your full name.";
  if (!/^[+()\d\s-]{8,20}$/.test(d.phone) || d.phone.replace(/\D/g, "").length < 8)
    e.phone = "Please enter a valid phone number (e.g. 0412 345 678).";
  if (!EMAIL_RE.test(d.email)) e.email = "Please enter a valid email address.";
  if (!oneOf(trades, d.trade)) e.trade = "Please select your trade.";
  if (!oneOf(debtorRoles, d.debtorRole)) e.debtorRole = "Please tell us who hasn’t paid you.";
  if (!oneOf(amountBands, d.amount)) e.amount = "Please select the approximate amount owed.";
  if (!oneOf(overdueBands, d.overdue)) e.overdue = "Please select how long it has been overdue.";
  if (!oneOf(workStatuses, d.workStatus)) e.workStatus = "Please tell us where the work is at.";
  if (!oneOf(paperworkOptions, d.paperwork)) e.paperwork = "Please tell us what you have in writing.";
  if (!oneOf(paymentClaimOptions, d.paymentClaim)) e.paymentClaim = "Please choose an option.";
  if (!oneOf(jobLocations, d.jobLocation)) e.jobLocation = "Please tell us where the job is.";
  if (!oneOf(disputeOptions, d.disputed)) e.disputed = "Please tell us whether the debt is disputed.";
  if (d.actionTaken && !oneOf(actionOptions, d.actionTaken)) e.actionTaken = "Please select a valid option.";
  if (d.licence && !oneOf(licenceOptions, d.licence)) e.licence = "Please select a valid option.";
  if (!d.consent) e.consent = "Please confirm you consent to us contacting you about this enquiry.";
  return e;
}
