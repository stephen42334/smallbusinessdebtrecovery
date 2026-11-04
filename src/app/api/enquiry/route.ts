import { NextResponse } from "next/server";
import { cleanEnquiry, validateEnquiry } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { deliverEnquiry } from "@/lib/deliver";

export const dynamic = "force-dynamic";
const MAX_BODY = 20_000;

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
  if (!rateLimit(`enq:${ip}`)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Please wait a few minutes or call us instead." }, { status: 429 });
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false, error: "Request origin not allowed." }, { status: 403 });
  }

  const text = await req.text();
  if (text.length > MAX_BODY) return NextResponse.json({ ok: false, error: "Submission too large." }, { status: 413 });
  let raw: Record<string, unknown>;
  try { raw = JSON.parse(text); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }
  if (!raw || typeof raw !== "object") return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  // Spam: honeypot filled, or submitted implausibly fast (<3s after form render).
  const started = Number(raw.startedAt);
  const tooFast = !Number.isFinite(started) || Date.now() - started < 3000;
  if ((typeof raw.website === "string" && raw.website.trim() !== "") || tooFast) {
    if (typeof raw.website === "string" && raw.website.trim() !== "") return NextResponse.json({ ok: true }); // silently drop bots
    return NextResponse.json({ ok: false, error: "That was submitted very quickly. Please check your details and try again." }, { status: 400 });
  }

  const data = cleanEnquiry(raw);
  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "Please correct the highlighted fields.", fieldErrors: errors }, { status: 422 });
  }

  const result = await deliverEnquiry(data);
  if (!result.ok) {
    console.error(`[enquiry] delivery ${result.reason}`); // no personal data logged
    return NextResponse.json(
      { ok: false, error: "We couldn’t send your enquiry just now. Please call us or try again shortly." },
      { status: result.reason === "not_configured" ? 503 : 502 },
    );
  }
  return NextResponse.json({ ok: true, ...(result.channel === "dev-console" ? { devFallback: true } : {}) });
}
