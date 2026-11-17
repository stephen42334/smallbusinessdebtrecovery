#!/usr/bin/env node
// Outside-in checks of the public website and the client portal. Run every 5 minutes by .github/workflows/uptime.yml (from GitHub's servers, so it still works
// when Railway is down). Exits 1 if anything is wrong, and writes the failures to the file named by --out.
//
//   LANDING_URL, PORTAL_URL         the two sites (defaults below)
//   LANDING_MARKER, PORTAL_MARKER   text each home page must contain: if a hacker replaces the page, or it errors, it won't
//   ALLOWED_SCRIPT_HOSTS            hosts the website may load scripts from (comma separated)
//   MIN_CERT_DAYS                   warn this many days before a TLS certificate expires (default 14)
import { writeFileSync, appendFileSync } from "node:fs";
import tls from "node:tls";

const env = (k, d) => (process.env[k] && process.env[k].trim() ? process.env[k].trim() : d);
const LANDING = env("LANDING_URL", "https://smallbuisnessdebtrecovery.com").replace(/\/$/, "");
const PORTAL = env("PORTAL_URL", "https://portal.smallbuisnessdebtrecovery.com").replace(/\/$/, "");
const LANDING_MARKER = env("LANDING_MARKER", "Builder not paying");
const PORTAL_MARKER = env("PORTAL_MARKER", "Small Business Debt Recovery");
const ALLOWED_HOSTS = env("ALLOWED_SCRIPT_HOSTS", "www.googletagmanager.com,www.google-analytics.com").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const MIN_CERT_DAYS = Number(env("MIN_CERT_DAYS", "14"));
const RETRIES = Number(env("RETRIES", "3")), RETRY_WAIT_MS = Number(env("RETRY_WAIT_MS", "15000")), SLOW_MS = Number(env("SLOW_MS", "5000"));
const outFile = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, init = {}) {
  const t0 = Date.now();
  const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(20_000), headers: { "user-agent": "sbdr-uptime-monitor" }, ...init });
  const body = init.method === "HEAD" ? "" : await res.text();
  return { status: res.status, headers: res.headers, body, ms: Date.now() - t0 };
}
const host = (u) => new URL(u).host;

/** Days until the certificate for this site expires (null for plain http, used only in tests). */
function certDays(url) {
  const u = new URL(url);
  if (u.protocol !== "https:") return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const s = tls.connect({ host: u.hostname, port: Number(u.port || 443), servername: u.hostname, timeout: 15_000 }, () => {
      const c = s.getPeerCertificate(); s.end();
      resolve(c?.valid_to ? Math.floor((new Date(c.valid_to).getTime() - Date.now()) / 86_400_000) : null);
    });
    s.on("error", reject); s.on("timeout", () => { s.destroy(); reject(new Error("tls timeout")); });
  });
}

/** Everything the home page loads from elsewhere. Anything outside the allow-list, or a known malware pattern, is reported as possible tampering. */
export function integrityProblems(html, ownHost, allowed = ALLOWED_HOSTS) {
  const problems = [];
  const ok = (h) => h === ownHost.toLowerCase() || allowed.includes(h.toLowerCase());
  for (const m of html.matchAll(/<(script|iframe|link|img)\b[^>]*?\b(?:src|href)=["']((?:https?:)?\/\/[^"']+)["']/gi)) {
    let h; try { h = new URL(m[2].startsWith("//") ? `https:${m[2]}` : m[2]).host; } catch { continue; }
    const tag = m[1].toLowerCase();
    if ((tag === "script" || tag === "iframe") && !ok(h)) problems.push(`unexpected <${tag}> from ${h}`);
  }
  for (const [re, label] of [[/eval\s*\(\s*atob\s*\(/i, "eval(atob(...)) obfuscation"], [/document\.write\s*\(\s*unescape\s*\(/i, "document.write(unescape(...)) obfuscation"], [/String\.fromCharCode\s*\((?:\s*\d+\s*,){20,}/i, "long fromCharCode payload"], [/hacked\s+by/i, "defacement text"]])
    if (re.test(html)) problems.push(`suspicious content: ${label}`);
  return problems;
}

const checks = [];
const check = (name, fn, { critical = false } = {}) => checks.push({ name, fn, critical });

// ---- the public website
check("Website: health endpoint", async () => { const r = await get(`${LANDING}/api/health`); if (r.status !== 200 || !/"status"\s*:\s*"ok"/.test(r.body)) throw new Error(`HTTP ${r.status}`); });
check("Website: home page loads with the expected content", async () => {
  const r = await get(`${LANDING}/`); if (r.status !== 200) throw new Error(`HTTP ${r.status}`);
  if (!r.body.toLowerCase().includes(LANDING_MARKER.toLowerCase())) throw new Error(`the page no longer contains "${LANDING_MARKER}" (replaced, or an error page)`);
  if (r.ms > SLOW_MS) throw new Error(`very slow (${r.ms} ms)`);
});
check("Website: nothing unexpected loaded on the home page (tampering check)", async () => {
  const r = await get(`${LANDING}/`); const p = integrityProblems(r.body, host(LANDING));
  if (p.length) throw new Error(p.join("; "));
}, { critical: true });

// ---- the client portal
check("Portal: health endpoint", async () => { const r = await get(`${PORTAL}/api/health`); if (r.status !== 200) throw new Error(`HTTP ${r.status}`); });
check("Portal: can reach its database", async () => { const r = await get(`${PORTAL}/api/health/ready`); if (r.status !== 200) throw new Error(`HTTP ${r.status} (database unreachable)`); });
check("Portal: sign-in page loads", async () => {
  const r = await get(`${PORTAL}/login`); if (r.status !== 200) throw new Error(`HTTP ${r.status}`);
  if (!r.body.includes(PORTAL_MARKER)) throw new Error(`the page no longer contains "${PORTAL_MARKER}"`);
  if (r.ms > SLOW_MS) throw new Error(`very slow (${r.ms} ms)`);
});
check("Portal: security headers are present", async () => {
  const r = await get(`${PORTAL}/login`); const csp = r.headers.get("content-security-policy") ?? "";
  if (!/default-src 'self'/.test(csp) || !/frame-ancestors 'none'/.test(csp)) throw new Error("the Content-Security-Policy header is missing or weaker than expected");
}, { critical: true });
check("Portal: private pages still refuse anonymous visitors", async () => {
  for (const path of ["/admin", "/portal", "/admin/debts"]) {
    const r = await get(`${PORTAL}${path}`);
    if (r.status < 300 || r.status >= 400 || !(r.headers.get("location") ?? "").includes("/login")) throw new Error(`${path} answered HTTP ${r.status} to an anonymous visitor instead of redirecting to sign-in`);
  }
  for (const path of ["/api/admin/debts", "/api/portal/debts", "/api/portal/notifications"]) {
    const r = await get(`${PORTAL}${path}`);
    if (r.status !== 401) throw new Error(`${path} answered HTTP ${r.status} to an anonymous caller (expected 401)`);
  }
}, { critical: true });

// ---- certificates
for (const [label, url] of [["website", LANDING], ["portal", PORTAL]])
  check(`TLS certificate for the ${label} is not about to expire`, async () => { const d = await certDays(url); if (d !== null && d < MIN_CERT_DAYS) throw new Error(`expires in ${d} day(s)`); });

async function runOnce({ name, fn }) {
  let last;
  for (let i = 1; i <= RETRIES; i++) { try { await fn(); return null; } catch (e) { last = e instanceof Error ? e.message : String(e); if (i < RETRIES) await sleep(RETRY_WAIT_MS); } }   // a single blip is not an outage
  return `${name}: ${last}`;
}
if (process.argv[1] && process.argv[1].endsWith("monitor.mjs")) {
  const results = await Promise.all(checks.map(async (c) => ({ c, problem: await runOnce(c) })));
  const failures = results.filter((r) => r.problem), lines = results.map((r) => `${r.problem ? "❌" : "✅"} ${r.problem ?? r.c.name}`);
  console.log(lines.join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Site checks\n\n${lines.map((l) => `- ${l}`).join("\n")}\n`);
  if (outFile) writeFileSync(outFile, JSON.stringify({ failed: failures.length, critical: failures.some((f) => f.c.critical), problems: failures.map((f) => f.problem) }, null, 2));
  process.exit(failures.length ? 1 : 0);
}
