"use client";
import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Lock, TriangleAlert } from "lucide-react";
import { amountBands, debtTypes, overdueBands, phoneLabel, site } from "@/config/site";
import { cleanEnquiry, validateEnquiry, type FieldErrors } from "@/lib/validation";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";
const input = "w-full rounded-md border border-slate-300 bg-white px-3.5 py-3 text-base text-charcoal placeholder:text-slate-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-accent/40 aria-[invalid=true]:border-red-600";

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-navy">{label}{required && <span aria-hidden className="text-red-600"> *</span>}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [devFallback, setDevFallback] = useState(false);
  const started = useRef(false);
  const renderedAt = useRef(Date.now());

  const aria = (k: keyof FieldErrors) => ({ "aria-invalid": errors[k] ? true : undefined, "aria-describedby": errors[k] ? `${k}-err` : undefined } as const);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw: Record<string, unknown> = Object.fromEntries(fd.entries());
    raw.consent = fd.get("consent") === "on";
    const errs = validateEnquiry(cleanEnquiry(raw));
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus("idle"); setMessage("");
      track("form_validation_failure", { fields: Object.keys(errs).join(","), count: Object.keys(errs).length, source: "client" });
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    setStatus("submitting"); setMessage("");
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...raw, startedAt: renderedAt.current }) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok === true) {
        setDevFallback(data.devFallback === true); setStatus("success"); track("form_submit", { debt_type: String(raw.debtType) });
      } else {
        if (data.fieldErrors) { setErrors(data.fieldErrors); track("form_validation_failure", { fields: Object.keys(data.fieldErrors).join(","), source: "server" }); }
        setStatus("error"); setMessage(data.error || "Something went wrong. Please try again or call us.");
        track("form_submit_error", { status: res.status });
      }
    } catch {
      setStatus("error"); setMessage("We couldn’t reach the server. Please check your connection and try again, or call us.");
      track("form_submit_error", { status: 0 });
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl bg-white p-8 text-center shadow-2xl">
        <CheckCircle2 className="mx-auto text-green-600" size={48} aria-hidden />
        <h3 className="mt-4 text-2xl font-extrabold text-navy">Enquiry received</h3>
        <p className="mt-2 text-slate-700">Thanks — our team will review the details and contact you using the phone number or email you provided. If it’s urgent, call {phoneLabel}.</p>
        {devFallback && <p className="mt-4 rounded bg-amber-100 p-3 text-sm text-amber-900">Development mode: no email/webhook is configured, so this enquiry was only logged to the server console and was NOT delivered.</p>}
      </div>
    );
  }

  return (
    <form id="enquiry-form" onSubmit={onSubmit} noValidate onFocus={() => { if (!started.current) { started.current = true; track("form_start"); } }}
          className="rounded-xl bg-white p-5 shadow-2xl sm:p-7" aria-labelledby="form-title">
      <h2 id="form-title" className="text-xl font-extrabold text-navy">Discuss your outstanding debt</h2>
      <p className="mt-1 text-sm text-slate-600">Takes about two minutes. Fields marked * are required.</p>

      {/* Honeypot – hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id="fullName" label="Full name" required error={errors.fullName}><input id="fullName" name="fullName" autoComplete="name" className={input} {...aria("fullName")} /></Field>
        <Field id="businessName" label="Business name" error={errors.businessName}><input id="businessName" name="businessName" autoComplete="organization" className={input} /></Field>
        <Field id="phone" label="Phone number" required error={errors.phone}><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0412 345 678" className={input} {...aria("phone")} /></Field>
        <Field id="email" label="Email address" required error={errors.email}><input id="email" name="email" type="email" autoComplete="email" className={input} {...aria("email")} /></Field>
        <Field id="debtType" label="Type of debt" required error={errors.debtType}>
          <select id="debtType" name="debtType" defaultValue="" className={input} {...aria("debtType")}><option value="" disabled>Select…</option>{debtTypes.map((d) => <option key={d}>{d}</option>)}</select>
        </Field>
        <Field id="amount" label="Approximate amount owed" required error={errors.amount}>
          <select id="amount" name="amount" defaultValue="" className={input} {...aria("amount")}><option value="" disabled>Select…</option>{amountBands.map((d) => <option key={d}>{d}</option>)}</select>
        </Field>
        <div className="sm:col-span-2">
          <Field id="overdue" label="How long has it been overdue?" required error={errors.overdue}>
            <select id="overdue" name="overdue" defaultValue="" className={input} {...aria("overdue")}><option value="" disabled>Select…</option>{overdueBands.map((d) => <option key={d}>{d}</option>)}</select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="description" label="Brief description" error={errors.description}>
            <textarea id="description" name="description" rows={3} maxLength={1500} placeholder="What was the work or service, and what has happened so far?" className={input} />
          </Field>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input type="checkbox" name="consent" id="consent" className="mt-1 h-5 w-5 shrink-0 accent-accent" {...aria("consent")} />
          <span>I consent to {site.agencyName} contacting me about this enquiry and handling my information in line with the <a className="text-forest underline" href={site.privacyUrl}>Privacy Policy</a>. *</span>
        </label>
        {errors.consent && <p id="consent-err" role="alert" className="mt-1 text-sm text-red-700">{errors.consent}</p>}
      </div>

      {status === "error" && (
        <div role="alert" className="mt-4 flex gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800"><TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />{message}</div>
      )}

      <button type="submit" disabled={status === "submitting"}
        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-accent px-6 py-3.5 text-base font-bold tracking-wide text-black transition-colors hover:bg-accent-dark disabled:opacity-70">
        {status === "submitting" ? <><Loader2 className="animate-spin" size={18} aria-hidden />SENDING…</> : "DISCUSS YOUR OUTSTANDING DEBT"}
      </button>
      <p className="mt-3 flex items-start gap-2 text-xs text-slate-600"><Lock size={14} className="mt-0.5 shrink-0" aria-hidden />Your details are used only to respond to this enquiry and are not sold or shared for marketing. Please don’t include bank or card details.</p>
    </form>
  );
}
