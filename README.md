# Debt Recovery Landing Page (Australia)

Next.js 16 · TypeScript · Tailwind CSS 4 · Lucide icons. A conversion-focused landing page for an Australian
debt recovery agency (construction & trades audience), with a working server-side enquiry endpoint.

## Run locally
```bash
cp .env.example .env.local   # optional – placeholders show if empty
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production (honours $PORT, binds 0.0.0.0)
npm run lint                 # type-check
```

## Where to edit content
| What | Where |
|---|---|
| Agency name, phone, email, ABN, service area, links | env vars `NEXT_PUBLIC_*` (see `.env.example`) → `src/config/site.ts` |
| "Why choose us" blocks (all **placeholders**) | `trustBlocks` in `src/config/site.ts` |
| FAQ copy, form dropdown options | `src/config/site.ts` |
| Section copy | `src/components/Sections.tsx` |
| Photos | drop `problem.jpg` and/or `cta.jpg` (jpg/jpeg/webp/png) into `public/images/` – picked up automatically at build. Use **real** construction/trades photos you have rights to. |

`NEXT_PUBLIC_*` values are baked in at **build** time – redeploy after changing them.

## Enquiry form & backend (`POST /api/enquiry`)
- Server-side validation of every field, email format, allow-listed dropdown values, required consent.
- Sanitisation (control chars/angle brackets stripped, lengths capped); HTML-escaped in emails.
- Spam: hidden honeypot, minimum time-to-submit (3s), per-IP rate limit (5 per 10 min, in-memory), body-size cap, same-origin check.
- Success is shown **only** when a delivery channel confirms. Otherwise the user sees an error with a phone fallback.
- Nothing is stored; PII is never logged in production.
- Delivery channels (configure at least one; both may be used):
  - **Email via Resend** (HTTPS – works on Railway, which blocks SMTP on lower plans): `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` (sender domain must be verified in Resend).
  - **Webhook** (Zapier/Make/GHL inbound): `ENQUIRY_WEBHOOK_URL` (+ optional `ENQUIRY_WEBHOOK_SECRET` sent as `X-Webhook-Secret`).
- **Dev fallback:** with `NODE_ENV=development` and nothing configured, the enquiry is logged to the console and the UI says it was *not* delivered. In production with nothing configured the API returns **503**.

## SEO
Title/description per brief, Open Graph + Twitter, generated OG image, `en-AU`, canonical, semantic headings, `sitemap.xml`, `robots.txt`.
**Indexing is OFF by default** (noindex + `Disallow: /`) so an unreviewed page with placeholders can't be indexed. Set `ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL` once reviewed.

## Analytics
`src/lib/analytics.ts` pushes to `window.dataLayer`. Set `NEXT_PUBLIC_GTM_ID` (preferred) or `NEXT_PUBLIC_GA_MEASUREMENT_ID`; with neither, events are no-ops.
Events: `landing_page_view`, `cta_click`, `phone_click`, `form_start`, `form_submit`, `form_submit_error`, `form_validation_failure`. No PII is sent.
(`phone_click` fires only once a real phone number is configured; with the placeholder the button is tracked as `cta_click`.)

## Deploy to Railway
Config: `railway.json` (Railpack build, `npm start`, health check `/api/health`). `npm start` uses `$PORT` and `0.0.0.0`.

**Dashboard (recommended):** Railway → New Project → Deploy from GitHub repo → add variables from `.env.example` → Deploy → Settings → Networking → Generate Domain.

**CLI:**
```bash
npm i -g @railway/cli
railway login
railway init                      # or: railway link
railway variables --set "NEXT_PUBLIC_AGENCY_NAME=Your Agency" --set "NEXT_PUBLIC_PHONE=1300 000 000" \
  --set "RESEND_API_KEY=..." --set "ENQUIRY_TO_EMAIL=you@example.com.au" --set "ENQUIRY_FROM_EMAIL=Enquiries <enquiries@yourdomain.com.au>"
railway up
railway domain                    # generate the public URL
curl https://<your-domain>/api/health
```

## ⚠️ Items to review before production (unverified / not supplied)
1. Agency name, phone, email, service area, ABN – all placeholders.
2. **Licences/registrations** for debt collection (state-based licensing may apply) and professional memberships – placeholder; display only verified ones.
3. **Privacy Policy and Terms** – links are placeholders; the Privacy Act / APP notice must cover the enquiry form's data collection.
4. "Why choose us" blocks, testimonials, case studies – placeholders. None invented; no stats, years or badges.
5. Commission %, fees and unsuccessful-recovery terms – deliberately not stated.
6. Compliance copy (Competition and Consumer Act, ASIC/ACCC debt collection guidelines, any state requirements; consumer-debt handling) – have a lawyer review all claims, including: "structured recovery process", "negotiation/escalation", and the footer statement "not a law firm… may be referred to an independent legal professional" (confirm this reflects actual practice).
7. Imagery – no photography included; add real photos (see above).
8. Whether the 3-second-minimum / rate-limit / consent wording suits your needs; consider Cloudflare Turnstile if spam grows.
9. Rate limiter is in-memory (single instance); use Redis if scaled horizontally.
