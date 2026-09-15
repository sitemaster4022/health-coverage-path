import type { D1Database } from './d1-types';
import type { NormalizedLead, RoutingResult } from './lead-routing';

export interface AnalyticsEvent {
  id: string;
  occurredAt: string;
  eventName: string;
  sessionId: string;
  firstTouchId: string;
  originalLandingUrl: string;
  originalLandingPath: string;
  currentPath: string;
  referrer: string | null;
  funnelContext: string | null;
  cta: string | null;
  stepNumber: number | null;
  stepName: string | null;
  totalSteps: number | null;
  leadId: string | null;
  attribution: NormalizedLead['attribution'];
}

export async function claimLeadFingerprint(db: D1Database, fingerprint: string, now: number) {
  const result = await db.prepare(`
    INSERT INTO lead_dedup (fingerprint, last_seen_at) VALUES (?, ?)
    ON CONFLICT(fingerprint) DO UPDATE SET last_seen_at = excluded.last_seen_at
    WHERE excluded.last_seen_at - lead_dedup.last_seen_at >= ?
    RETURNING fingerprint
  `).bind(fingerprint, now, 15 * 60_000).first();
  return Boolean(result);
}

export async function releaseLeadFingerprint(db: D1Database, fingerprint: string, now: number) {
  await db.prepare('DELETE FROM lead_dedup WHERE fingerprint = ? AND last_seen_at = ?').bind(fingerprint, now).run();
}

export async function claimRequestQuota(db: D1Database, bucketKey: string, expiresAt: number, limit: number) {
  if (Math.random() < 0.01) {
    await db.prepare('DELETE FROM request_rate_limits WHERE expires_at < ?').bind(Date.now() - 24 * 60 * 60_000).run();
  }
  const result = await db.prepare(`
    INSERT INTO request_rate_limits (bucket_key, request_count, expires_at) VALUES (?, 1, ?)
    ON CONFLICT(bucket_key) DO UPDATE SET request_count = request_count + 1
    WHERE request_count < ?
    RETURNING request_count
  `).bind(bucketKey, expiresAt, limit).first();
  return Boolean(result);
}

export async function saveLead(db: D1Database, lead: NormalizedLead) {
  const a = lead.attribution;
  await db.batch([
    db.prepare(`INSERT INTO leads (
      id, submitted_at, original_landing_url, original_landing_path, submission_path, referrer,
      funnel_context, timing_bucket, coverage_date, zip, county, coverage_for, household_size,
      income_range, coverage_status, first_name, last_name, email, phone, consent, consent_text,
      consent_version, trustedform_cert_url, trustedform_status, user_agent, ip_address,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid, msclkid, ttclid,
      routing_status, is_test
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`)
      .bind(lead.id, lead.submittedAt, lead.originalLandingUrl, lead.originalLandingPath,
        lead.submissionPath, lead.referrer, lead.context, lead.timingBucket, lead.coverageDate,
        lead.zip, lead.county, lead.coverageFor, lead.householdSize, lead.incomeRange,
        lead.coverageStatus, lead.firstName, lead.lastName, lead.email, lead.phone,
        lead.consentText, lead.consentVersion, lead.trustedFormCertificateUrl, lead.trustedFormStatus,
        lead.userAgent, lead.ipAddress, a.utmSource, a.utmMedium, a.utmCampaign, a.utmTerm, a.utmContent,
        a.gclid, a.fbclid, a.msclkid, a.ttclid, lead.isTest ? 1 : 0),
    db.prepare(`INSERT INTO consent_records
      (lead_id, consented_at, consent_text, consent_version, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(lead.id, lead.submittedAt, lead.consentText, lead.consentVersion, lead.ipAddress, lead.userAgent),
  ]);
}

export async function saveRoutingResult(db: D1Database, leadId: string, result: RoutingResult) {
  const detail = result.detail?.slice(0, 1000) ?? null;
  await db.batch([
    db.prepare(`UPDATE leads SET routing_status = ?, buyer_id = ?, external_id = ?, routing_detail = ? WHERE id = ?`)
      .bind(result.status, result.buyerId, result.externalId, detail, leadId),
    db.prepare(`INSERT INTO routing_attempts (id, lead_id, attempted_at, status, buyer_id, external_id, detail)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), leadId, new Date().toISOString(), result.status, result.buyerId, result.externalId, detail),
  ]);
}

export async function saveAnalyticsEvent(db: D1Database, event: AnalyticsEvent) {
  const a = event.attribution;
  await db.prepare(`INSERT INTO analytics_events (
    id, occurred_at, event_name, session_id, first_touch_id, original_landing_url,
    original_landing_path, current_path, referrer, funnel_context, cta, step_number,
    step_name, total_steps, lead_id, utm_source, utm_medium, utm_campaign, utm_term,
    utm_content, gclid, fbclid, msclkid, ttclid
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(event.id, event.occurredAt, event.eventName, event.sessionId, event.firstTouchId,
      event.originalLandingUrl, event.originalLandingPath, event.currentPath, event.referrer,
      event.funnelContext, event.cta, event.stepNumber, event.stepName, event.totalSteps,
      event.leadId, a.utmSource, a.utmMedium, a.utmCampaign, a.utmTerm, a.utmContent,
      a.gclid, a.fbclid, a.msclkid, a.ttclid).run();
}
