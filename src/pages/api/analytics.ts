import type { APIRoute } from 'astro';
import type { D1Database } from '../../lib/d1-types';
import { claimRequestQuota, saveAnalyticsEvent } from '../../lib/lead-storage';
import type { NormalizedLead } from '../../lib/lead-routing';

export const prerender = false;

const allowedEvents = new Set(['page_view','page_cta_click','funnel_start','funnel_step_complete','funnel_abandon','lead_submit','lead_success','lead_duplicate','lead_failure','calculator_complete']);
const attributionKeys = ['utmSource','utmMedium','utmCampaign','utmTerm','utmContent','gclid','fbclid','msclkid','ttclid'] as const;
const clean = (value: unknown, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const nullable = (value: unknown, max = 200) => clean(value, max) || null;
const validId = (value: string) => /^[a-zA-Z0-9-]{8,80}$/.test(value);
const validPath = (value: string) => value.startsWith('/') && !value.startsWith('//') && !/[\r\n]/.test(value);
const reply = (status = 204) => new Response(null, { status, headers: { 'cache-control':'no-store, max-age=0', 'x-robots-tag':'noindex, nofollow, noarchive' } });
async function hash(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request, locals }) => {
  if (Number(request.headers.get('content-length') || 0) > 10_000) return reply(413);
  let raw: Record<string, unknown>;
  try { raw = await request.json(); } catch { return reply(400); }
  const eventName = clean(raw.event, 60);
  const sessionId = clean(raw.session_id, 80);
  const firstTouchId = clean(raw.first_touch_id, 80);
  const originalLandingUrl = clean(raw.original_landing_url, 500);
  const originalLandingPath = clean(raw.original_landing_path, 300);
  const currentPath = clean(raw.current_path, 300);
  if (!allowedEvents.has(eventName) || !validId(sessionId) || !validId(firstTouchId) || !validPath(originalLandingPath) || !validPath(currentPath) || !validPath(originalLandingUrl.split('?')[0])) return reply(422);
  const incoming = raw.attribution && typeof raw.attribution === 'object' ? raw.attribution as Record<string, unknown> : {};
  const attribution = Object.fromEntries(attributionKeys.map((key) => [key, nullable(incoming[key], key.startsWith('utm') ? 160 : 300)])) as NormalizedLead['attribution'];
  const env = (locals.runtime?.env || {}) as { DB?: D1Database };
  if (!env.DB) return reply(503);
  try {
    const requestIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (requestIp) {
      const windowMs = 15 * 60_000;
      const bucket = Math.floor(Date.now() / windowMs);
      if (!(await claimRequestQuota(env.DB, await hash(`analytics|${requestIp}|${bucket}`), (bucket + 1) * windowMs, 180))) return reply(429);
    }
    await saveAnalyticsEvent(env.DB, {
      id: crypto.randomUUID(), occurredAt: new Date().toISOString(), eventName, sessionId, firstTouchId,
      originalLandingUrl, originalLandingPath, currentPath, referrer: nullable(raw.referrer, 500),
      funnelContext: nullable(raw.funnel_context, 40), cta: nullable(raw.cta, 100),
      stepNumber: Number.isInteger(Number(raw.step_number)) ? Number(raw.step_number) : null,
      stepName: nullable(raw.step_name, 80), totalSteps: Number.isInteger(Number(raw.total_steps)) ? Number(raw.total_steps) : null,
      leadId: nullable(raw.lead_id, 80), attribution,
    });
    return reply();
  } catch (cause) {
    console.error(JSON.stringify({ event:'analytics_storage_failed', eventName, error:cause instanceof Error ? cause.name : 'unknown' }));
    return reply(503);
  }
};

export const ALL: APIRoute = () => reply(405);
