# Alarms: knowing when the website or portal is down, or under attack

## What watches what

| Watcher | Runs | Catches | How you're told |
| --- | --- | --- | --- |
| **Site checks** (`.github/workflows/uptime.yml`, from GitHub's servers) | every 5 min | website or portal down, portal can't reach its database, sign-in page broken, certificate about to expire, **security headers removed**, **private pages open to the public**, **website page replaced or a strange script added** | GitHub emails you that the run failed + an "outage" issue opens + optional text/phone via `ALERT_WEBHOOK_URL`. The issue closes itself on recovery. |
| **Security watch** (portal, `/api/cron/security`, triggered by `portal-cron.yml`) | every 5 min | password-guessing bursts, **a login that succeeds right after many failures**, an admin signing in from a new place, **a new administrator**, commission or settings changes, one account reading far too much debtor data, forged calls to the payment/enquiry webhooks | email to `SECURITY_ALERT_EMAIL` (one per issue per hour, not a flood). If the email can't be sent, the job fails and GitHub emails you too. |
| **Weekly dependency audit** (`dependency-audit.yml`) + Dependabot | weekly | known vulnerabilities in the website's software | GitHub email / pull request |
| **Railway and Supabase** | built in | a failed deploy or crash (Railway emails you), database problems (Supabase status page) | their own emails: check yours are on |

None of these block anyone or change anything. They raise a flag for a person.

## One-time setup (about 20 minutes)

You enter every secret yourself. Never paste one into a chat or an email.

**1. Railway, portal service → Variables**

| Variable | Value |
| --- | --- |
| `CRON_SECRET` | 32+ random characters (make one in a password manager) |
| `SECURITY_ALERT_EMAIL` | the address(es) that get security emails, comma separated |
| `RESEND_API_KEY` and `EMAIL_FROM` | the same Resend account the website already uses, with a verified sender. (Or `ALERT_WEBHOOK_URL` for a GoHighLevel workflow that sends the message.) |
| `ENQUIRY_INGEST_SECRET` | 32+ random characters (different from the one above) |

**2. Railway, landing service → Variables**

| Variable | Value |
| --- | --- |
| `PORTAL_INGEST_URL` | `https://portal.smallbuisnessdebtrecovery.com/api/enquiries/ingest` |
| `PORTAL_INGEST_SECRET` | exactly the same value as the portal's `ENQUIRY_INGEST_SECRET` |

**3. GitHub, this repository → Settings → Secrets and variables → Actions**

| Where | Name | Value |
| --- | --- | --- |
| Secret | `PORTAL_CRON_SECRET` | the same value as the portal's `CRON_SECRET` |
| Secret (optional) | `ALERT_WEBHOOK_URL` | a GoHighLevel/Zapier/Slack inbound webhook that texts or messages you |
| Variable (only if different) | `LANDING_URL`, `PORTAL_URL` | your real addresses; the defaults are `https://smallbuisnessdebtrecovery.com` and `https://portal.smallbuisnessdebtrecovery.com` |

Then **Actions → Uptime and security checks → Run workflow** once, and check it goes green. Do the same for **Portal scheduled jobs**.

**4. Make sure GitHub emails you.** GitHub → your profile → Settings → Notifications → Actions: tick "Send notifications for failed workflows". Watch this repository (Watch → All activity) so outage issues email you too.

**5. Add an independent 1-minute monitor (recommended).** GitHub's 5-minute schedule is best-effort (it can run late), and **GitHub pauses scheduled workflows in a public repository after 60 days with no activity**. A free monitor such as UptimeRobot or Better Stack is a second pair of eyes that also phones or texts you. Add two monitors, keyword type:

- `https://smallbuisnessdebtrecovery.com/` must contain `Small Business Debt Recovery`
- `https://portal.smallbuisnessdebtrecovery.com/api/health/ready` must return 200

Set the alert contacts to email **and** SMS or the phone app.

**6. Test the security alarm.** After setup, make 6 wrong sign-in attempts each for 4 different made-up email addresses (24 in all; each address is rate limited after 6) and within 10 minutes you should get a "[SECURITY]" email. These are logged as real failed sign-ins, so tell your team first. If not, open **Actions → Portal scheduled jobs** and read the run: it tells you what's missing.

## When an alarm goes off

**"Website or portal check failing" (not marked possible security problem)**
1. Open Railway, the service, **Deployments**: is the latest one crashed or failed? Read the log.
2. If it broke after a deploy, press **Rollback** on the last good deployment.
3. If the portal says it can't reach its database, check status.supabase.com and your Supabase project.
4. Certificate warnings: in Railway, check the custom domain shows a valid certificate; renewals normally happen by themselves.

**"POSSIBLE SECURITY PROBLEM" (private pages open, security headers missing, strange script or replaced page)**
Treat as an incident now:
1. Roll the service back to the last deployment you trust, or take it offline in Railway.
2. Change the secrets: Supabase service key, `CRON_SECRET`, `ENQUIRY_INGEST_SECRET`, `RESEND_API_KEY`, and any Zai credentials.
3. Check GitHub for commits, deploy keys or collaborators you don't recognise, and check Railway's members.
4. Reset every staff password and look at the portal's **Audit log**.
5. If debtor or client information may have been seen, follow **SOP 9** (data breach) and call your solicitor the same day.

**Security email: "failed sign-ins", "one address", "one account"**: someone is guessing passwords. Staff need an authenticator code as well, so failures alone are not a break-in. Check the audit log. If the targeted account is a real person, tell them to use a long unique password.

**Security email: "a sign-in succeeded after failures", "new administrator", "new location for an admin", "bulk data access"**: assume an account may be compromised until you've checked. Reset that person's password, remove or deactivate the account in **Users & access** if it isn't theirs, and review the audit log for what it touched.

**Security email: "commission changed" or "settings changed"**: check it was one of you. If not, treat as an incident.

## What this does NOT do

- It is not a security team. It catches the common, noisy signs. A careful attacker may not trip these alarms.
- It reads the portal's own log, so it can only see what the portal records.
- It doesn't watch Railway, Supabase or Resend themselves, except through the site checks.
- A 5-minute check can miss a problem that lasts under 5 minutes.

What also protects you: staff must use two-factor sign-in (enforced by the portal and the database), the database refuses most mistakes even if the web code has a bug, and strong passwords in a password manager. Consider adding a web application firewall in front of the sites (for example Cloudflare's free plan) once you have clients.
