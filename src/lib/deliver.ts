import { createHmac, randomUUID } from "node:crypto";
import type { EnquiryInput } from "./validation";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type DeliveryResult = { ok: true; channel: string } | { ok: false; reason: "not_configured" | "failed" };

/** The portal receives every enquiry for review (invite as a client, or reject). It needs an https URL and a shared secret of 32+ characters. */
export const portalConfigured = () => Boolean(/^https:\/\//i.test(process.env.PORTAL_INGEST_URL ?? "") && (process.env.PORTAL_INGEST_SECRET ?? "").length >= 32);

export function deliveryConfigured() {
  return Boolean((process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL) || process.env.ENQUIRY_WEBHOOK_URL || portalConfigured());
}

/** Signs the body so the portal knows the enquiry really came from this website: `t=<seconds>,v=base64url(HMAC-SHA256(secret, `${t}.${body}`))`. */
export function signBody(body: string, secret: string, nowMs = Date.now()) {
  const t = Math.floor(nowMs / 1000);
  return `t=${t},v=${createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url")}`;
}

/** Send the enquiry to the portal, retrying a few times (a short blip must not lose a lead). The same id is sent each time, so the portal stores it once. */
export async function sendToPortal(d: EnquiryInput, enquiryId: string, fetchImpl: typeof fetch = fetch, waitMs = [500, 1500]): Promise<boolean> {
  const body = JSON.stringify({ enquiryId, ...d, consent: undefined });
  for (let attempt = 0; attempt <= waitMs.length; attempt++) {
    try {
      const r = await fetchImpl(process.env.PORTAL_INGEST_URL!, {
        method: "POST", headers: { "Content-Type": "application/json", "x-enquiry-signature": signBody(body, process.env.PORTAL_INGEST_SECRET!) }, body, signal: AbortSignal.timeout(8_000) });
      if (r.ok) return true;
      if (r.status >= 400 && r.status < 500 && r.status !== 429) return false;   // a rejected enquiry will not succeed on retry
    } catch { /* network error: retry */ }
    if (attempt < waitMs.length) await new Promise((res) => setTimeout(res, waitMs[attempt]));
  }
  return false;
}


export async function deliverEnquiry(d: EnquiryInput): Promise<DeliveryResult> {
  const channels: Promise<boolean>[] = [];
  const names: string[] = [];

  // The portal comes first. If it is configured but cannot be reached, the email still goes out, clearly marked, so a lead is never lost.
  let portalFailed = false;
  if (portalConfigured()) {
    const ok = await sendToPortal(d, randomUUID());
    if (ok) { names.push("portal"); channels.push(Promise.resolve(true)); }
    else { portalFailed = true; console.error(JSON.stringify({ event: "enquiry_portal_delivery_failed" })); }   // no personal data in the log
  }

  if (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL) {
    names.push("email");
    const rows: [string, string][] = [
      ["Name", d.fullName], ["Business", d.businessName || "—"], ["Phone", d.phone], ["Email", d.email],
      ["Trade", d.trade], ["Who hasn't paid", d.debtorRole], ["Amount owed", d.amount], ["Overdue", d.overdue],
      ["Work status", d.workStatus], ["In writing", d.paperwork], ["Payment claim sent (Security of Payment)", d.paymentClaim],
      ["Job location", d.jobLocation], ["Disputed", d.disputed], ["Action so far", d.actionTaken || "—"], ["NSW licence for this work", d.licence || "—"],
      ["Description", d.description || "—"],
    ];
    const warning = portalFailed ? "NOT SAVED TO THE PORTAL. Please add this enquiry manually." : "";
    const html = `${warning ? `<p style="color:#b00020;font-weight:bold">${warning}</p>` : ""}<h2>New debt recovery enquiry</h2><table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">${rows
      .map(([k, v]) => `<tr><td style="border:1px solid #ddd"><b>${k}</b></td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table><p>Consent to be contacted: yes</p>`;
    const text = (warning ? `${warning}\n\n` : "") + rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    channels.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM_EMAIL,
          to: process.env.ENQUIRY_TO_EMAIL!.split(",").map((s) => s.trim()),
          reply_to: d.email,
          subject: `${portalFailed ? "[NOT IN PORTAL] " : ""}New debt recovery enquiry – ${d.fullName.replace(/[\r\n]/g, " ")}`,
          html, text,
        }),
        signal: AbortSignal.timeout(10_000),
      }).then((r) => r.ok).catch(() => false),
    );
  }

  if (process.env.ENQUIRY_WEBHOOK_URL) {
    names.push("webhook");
    channels.push(
      fetch(process.env.ENQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(process.env.ENQUIRY_WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.ENQUIRY_WEBHOOK_SECRET } : {}) },
        body: JSON.stringify({ source: "landing-page", receivedAt: new Date().toISOString(), ...d }),
        signal: AbortSignal.timeout(10_000),
      }).then((r) => r.ok).catch(() => false),
    );
  }

  if (!channels.length && !portalFailed) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[enquiry:dev-fallback] No delivery configured – enquiry NOT sent. Fields received:", d);
      return { ok: true, channel: "dev-console" };
    }
    return { ok: false, reason: "not_configured" };
  }
  const results = await Promise.all(channels);
  // Succeed if at least one channel confirmed delivery.
  const idx = results.findIndex(Boolean);
  return idx >= 0 ? { ok: true, channel: names[idx] } : { ok: false, reason: "failed" };
}
