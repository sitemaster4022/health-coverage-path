import type { APIRoute } from 'astro';
import { CONSENT_TEXT, CONSENT_VERSION } from '../../consts';
import { routeLead, type NormalizedLead } from '../../lib/lead-routing';

export const prerender = false;

const recent = new Map<string, number>();
const allowedContexts = new Set(['general','job_loss','medicaid_loss','turning_26','cobra','self_employed','special_enrollment','unemployed']);
const allowedCoverageFor = new Set(['self','self_spouse','self_children','family','other']);
const allowedIncome = new Set(['under_16000','16000_29999','30000_49999','50000_79999','80000_plus','unsure']);
const allowedStatus = new Set(['ending','lost','cobra_offered','on_cobra','uninsured']);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
});
const clean = (value: unknown, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const digits = (value: unknown) => clean(value, 30).replace(/\D/g, '');
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

async function fingerprint(value: string) {
  const data = new TextEncoder().encode(value.toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, locals }) => {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 20_000) return json({ ok: false, error: 'Request too large' }, 413);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }

  if (clean(raw.company)) return json({ ok: true, id: crypto.randomUUID() }, 202);
  const elapsed = Number(raw.completedAt) - Number(raw.startedAt);
  if (!Number.isFinite(elapsed) || elapsed < 5000) return json({ ok: false, error: 'Please complete the form before submitting.' }, 400);

  const context = clean(raw.context, 40);
  const coverageDate = clean(raw.coverageDate, 10);
  const zip = digits(raw.zip);
  const coverageFor = clean(raw.coverageFor, 30);
  const householdSize = Number(raw.householdSize);
  const incomeRange = clean(raw.incomeRange, 30);
  const coverageStatus = clean(raw.coverageStatus, 30);
  const firstName = clean(raw.firstName, 60);
  const lastName = clean(raw.lastName, 60);
  const email = clean(raw.email, 160).toLowerCase();
  const phone = digits(raw.phone);
  const landingPage = clean(raw.landingPage, 300);
  const referrer = clean(raw.referrer, 500) || null;
  const consentVersion = clean(raw.consentVersion, 80);
  const consent = raw.consent === 'yes';

  const invalid = !allowedContexts.has(context) || !validDate(coverageDate) || !/^3\d{4}$/.test(zip) ||
    !allowedCoverageFor.has(coverageFor) || !Number.isInteger(householdSize) || householdSize < 1 || householdSize > 8 ||
    !allowedIncome.has(incomeRange) || !allowedStatus.has(coverageStatus) || firstName.length < 1 || lastName.length < 1 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10 || phone.length > 15 ||
    !landingPage.startsWith('/') || !consent || consentVersion !== CONSENT_VERSION;
  if (invalid) return json({ ok: false, error: 'Please review the form fields and try again.' }, 422);

  const duplicateKey = await fingerprint(`${email}|${phone}|${zip}`);
  const now = Date.now();
  for (const [key, time] of recent) if (now - time > 15 * 60_000) recent.delete(key);
  if (recent.has(duplicateKey)) return json({ ok: true, duplicate: true }, 202);
  recent.set(duplicateKey, now);

  const lead: NormalizedLead = {
    id: crypto.randomUUID(), submittedAt: new Date(now).toISOString(), landingPage, referrer, context, coverageDate, zip,
    coverageFor, householdSize, incomeRange, coverageStatus, firstName, lastName, email, phone, consent: true,
    consentText: CONSENT_TEXT, consentVersion,
    userAgent: request.headers.get('user-agent'),
    ipAddress: request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
  };

  const env = (locals.runtime?.env || {}) as { LEAD_ROUTER_URL?: string; LEAD_ROUTER_TOKEN?: string };
  const routing = await routeLead(lead, env);
  console.log(JSON.stringify({ event: 'lead_submission', lead, routing, loggedAt: new Date().toISOString() }));

  if (routing.status === 'failed') return json({ ok: false, error: 'Routing temporarily unavailable', id: lead.id }, 502);
  return json({ ok: true, id: lead.id, status: routing.status }, routing.status === 'held' ? 202 : 200);
};

export const ALL: APIRoute = () => json({ ok: false, error: 'Method not allowed' }, 405);
