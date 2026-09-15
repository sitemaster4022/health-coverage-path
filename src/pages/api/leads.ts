import type { APIRoute } from 'astro';
import type { D1Database, TrustedFormStatus } from '../../lib/d1-types';
import { CONSENT_TEXT, CONSENT_VERSION } from '../../consts';
import { claimLeadFingerprint, claimRequestQuota, releaseLeadFingerprint, saveLead, saveRoutingResult } from '../../lib/lead-storage';
import { routeLead, type NormalizedLead } from '../../lib/lead-routing';

export const prerender = false;

const allowedContexts = new Set(['job_loss','medicaid_loss','turning_26','cobra','self_employed','special_enrollment','unemployed','other','not_sure']);
const allowedTiming = new Set(['already_ended','next_30','days_31_60','over_60_future','over_60_past','event_last_30','event_31_60','event_over_60','need_now','unsure']);
const allowedCoverageFor = new Set(['self','self_spouse','self_children','family','other']);
const allowedIncome = new Set(['under_16000','16000_29999','30000_49999','50000_79999','80000_plus','unsure']);
const allowedStatus = new Set(['ending','lost','cobra_offered','on_cobra','uninsured']);
const attributionKeys = ['utmSource','utmMedium','utmCampaign','utmTerm','utmContent','gclid','fbclid','msclkid','ttclid'] as const;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store, max-age=0',
    'pragma': 'no-cache', 'x-content-type-options': 'nosniff', 'x-robots-tag': 'noindex, nofollow, noarchive',
  },
});
const clean = (value: unknown, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const nullable = (value: unknown, max = 200) => clean(value, max) || null;
const digits = (value: unknown) => clean(value, 30).replace(/\D/g, '');
const validDate = (value: string) => !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)));
const normalizeTrustedFormCertificateUrl = (value: unknown) => {
  const candidate = nullable(value, 500);
  if (!candidate || /[\r\n]/.test(candidate)) return null;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'cert.trustedform.com' || parsed.pathname === '/' || parsed.search || parsed.hash) return null;
    return candidate;
  } catch {
    return null;
  }
};
const validPath = (value: string) => value.startsWith('/') && !value.startsWith('//') && !/[\r\n]/.test(value);

async function fingerprint(value: string) {
  const data = new TextEncoder().encode(value.toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, locals }) => {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 24_000) return json({ ok: false, error: 'Request too large' }, 413);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }

  if (clean(raw.company)) return json({ ok: true, id: crypto.randomUUID() }, 202);
  const elapsed = Number(raw.completedAt) - Number(raw.startedAt);
  if (!Number.isFinite(elapsed) || elapsed < 5000) return json({ ok: false, error: 'Please complete the form before submitting.' }, 400);

  const context = clean(raw.context, 40);
  const timingBucket = clean(raw.timingBucket, 40);
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
  const originalLandingPath = clean(raw.originalLandingPath, 300);
  const submissionPath = clean(raw.submissionPath, 300);
  const referrer = nullable(raw.referrer, 500);
  const consentVersion = clean(raw.consentVersion, 80);
  const trustedFormCertificateUrl = normalizeTrustedFormCertificateUrl(raw.xxTrustedFormCertUrl);
  const trustedFormStatus: TrustedFormStatus = trustedFormCertificateUrl ? 'available' : 'missing';
  const consent = raw.consent === 'yes';
  const incomingAttribution = raw.attribution && typeof raw.attribution === 'object' ? raw.attribution as Record<string, unknown> : {};
  const attribution = Object.fromEntries(attributionKeys.map((key) => [key, nullable(incomingAttribution[key], key.startsWith('utm') ? 160 : 300)])) as NormalizedLead['attribution'];
  const query = new URLSearchParams();
  const queryNames: Record<(typeof attributionKeys)[number], string> = { utmSource:'utm_source', utmMedium:'utm_medium', utmCampaign:'utm_campaign', utmTerm:'utm_term', utmContent:'utm_content', gclid:'gclid', fbclid:'fbclid', msclkid:'msclkid', ttclid:'ttclid' };
  for (const key of attributionKeys) if (attribution[key]) query.set(queryNames[key], attribution[key]!);
  const originalLandingUrl = `${originalLandingPath}${query.size ? `?${query}` : ''}`;

  const invalid = !allowedContexts.has(context) || !allowedTiming.has(timingBucket) || !validDate(coverageDate) || !/^3\d{4}$/.test(zip) ||
    !allowedCoverageFor.has(coverageFor) || !Number.isInteger(householdSize) || householdSize < 1 || householdSize > 8 ||
    !allowedIncome.has(incomeRange) || !allowedStatus.has(coverageStatus) || firstName.length < 1 || lastName.length < 1 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10 || phone.length > 15 ||
    !validPath(originalLandingPath) || !validPath(submissionPath) || !consent || consentVersion !== CONSENT_VERSION;
  if (invalid) return json({ ok: false, error: 'Please review the form fields and try again.' }, 422);

  const env = (locals.runtime?.env || {}) as { DB?: D1Database; LEAD_ROUTER_URL?: string; LEAD_ROUTER_TOKEN?: string; BUYER_DELIVERY_ENABLED?: string; TEST_SUBMISSION_TOKEN?: string };
  if (!env.DB) return json({ ok: false, error: 'Secure lead storage is temporarily unavailable. Please try again later.' }, 503);

  const requestIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  if (requestIp) {
    const windowMs = 15 * 60_000;
    const bucket = Math.floor(Date.now() / windowMs);
    const rateKey = await fingerprint(`lead|${requestIp}|${bucket}`);
    if (!(await claimRequestQuota(env.DB, rateKey, (bucket + 1) * windowMs, 8))) return json({ ok: false, error: 'Too many requests. Please try again later.' }, 429);
  }

  const isTest = Boolean(env.TEST_SUBMISSION_TOKEN && raw.testSubmission === true && request.headers.get('x-hcp-test-token') === env.TEST_SUBMISSION_TOKEN);
  const duplicateKey = await fingerprint(`${email}|${phone}|${zip}`);
  const now = Date.now();
  if (!(await claimLeadFingerprint(env.DB, duplicateKey, now))) return json({ ok: true, duplicate: true, status: 'held' }, 202);

  const lead: NormalizedLead = {
    id: crypto.randomUUID(), submittedAt: new Date(now).toISOString(), originalLandingUrl, originalLandingPath,
    submissionPath, referrer, context, timingBucket, coverageDate: coverageDate || null, zip, county: null,
    coverageFor, householdSize, incomeRange, coverageStatus, firstName, lastName, email, phone, consent: true,
    consentText: CONSENT_TEXT, consentVersion, trustedFormCertificateUrl, trustedFormStatus,
    userAgent: request.headers.get('user-agent'),
    ipAddress: requestIp,
    attribution, optionalBuyerFields: { dateOfBirth: null, gender: null, tobaccoUse: null, householdAges: null }, isTest,
  };

  try { await saveLead(env.DB, lead); }
  catch (cause) {
    await releaseLeadFingerprint(env.DB, duplicateKey, now).catch(() => undefined);
    console.error(JSON.stringify({ event: 'lead_storage_failed', leadId: lead.id, error: cause instanceof Error ? cause.name : 'unknown' }));
    return json({ ok: false, error: 'Secure lead storage is temporarily unavailable. Please try again later.' }, 503);
  }

  const routing = await routeLead(lead, env);
  try { await saveRoutingResult(env.DB, lead.id, routing); }
  catch (cause) { console.error(JSON.stringify({ event: 'routing_audit_failed', leadId: lead.id, status: routing.status, error: cause instanceof Error ? cause.name : 'unknown' })); }
  console.log(JSON.stringify({ event: 'lead_submission', leadId: lead.id, context: lead.context, routingStatus: routing.status, isTest }));
  return json({ ok: true, id: lead.id, status: routing.status }, routing.status === 'delivered' ? 200 : 202);
};

export const ALL: APIRoute = () => json({ ok: false, error: 'Method not allowed' }, 405);
