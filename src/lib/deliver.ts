import type { EnquiryInput } from "./validation";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type DeliveryResult = { ok: true; channel: string } | { ok: false; reason: "not_configured" | "failed" };

export function deliveryConfigured() {
  return Boolean((process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL) || process.env.ENQUIRY_WEBHOOK_URL);
}

export async function deliverEnquiry(d: EnquiryInput): Promise<DeliveryResult> {
  const channels: Promise<boolean>[] = [];
  const names: string[] = [];

  if (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL) {
    names.push("email");
    const rows: [string, string][] = [
      ["Name", d.fullName], ["Business", d.businessName || "—"], ["Phone", d.phone], ["Email", d.email],
      ["Debt type", d.debtType], ["Amount owed", d.amount], ["Overdue", d.overdue], ["Description", d.description || "—"],
    ];
    const html = `<h2>New debt recovery enquiry</h2><table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">${rows
      .map(([k, v]) => `<tr><td style="border:1px solid #ddd"><b>${k}</b></td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table><p>Consent to be contacted: yes</p>`;
    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
    channels.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.ENQUIRY_FROM_EMAIL,
          to: process.env.ENQUIRY_TO_EMAIL!.split(",").map((s) => s.trim()),
          reply_to: d.email,
          subject: `New debt recovery enquiry – ${d.fullName.replace(/[\r\n]/g, " ")}`,
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

  if (!channels.length) {
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
