export type RoutingStatus = 'held' | 'delivered' | 'rejected' | 'failed';

export interface NormalizedLead {
  id: string;
  submittedAt: string;
  landingPage: string;
  referrer: string | null;
  context: string;
  coverageDate: string;
  zip: string;
  coverageFor: string;
  householdSize: number;
  incomeRange: string;
  coverageStatus: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: true;
  consentText: string;
  consentVersion: string;
  userAgent: string | null;
  ipAddress: string | null;
}

export interface RoutingResult {
  status: RoutingStatus;
  buyerId: string | null;
  externalId: string | null;
  detail?: string;
}

interface RouterEnv { LEAD_ROUTER_URL?: string; LEAD_ROUTER_TOKEN?: string }

/**
 * Buyer-neutral routing seam. Until an approved buyer is configured, valid
 * submissions are held and recorded in structured Worker logs. A future buyer
 * adapter can implement ping/post, field mapping, price floors and returns here
 * without changing the public funnel.
 */
export async function routeLead(lead: NormalizedLead, env: RouterEnv): Promise<RoutingResult> {
  if (!env.LEAD_ROUTER_URL) {
    return { status: 'held', buyerId: null, externalId: null, detail: 'No approved buyer router configured' };
  }

  try {
    const response = await fetch(env.LEAD_ROUTER_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(env.LEAD_ROUTER_TOKEN ? { authorization: `Bearer ${env.LEAD_ROUTER_TOKEN}` } : {}),
      },
      body: JSON.stringify({ version: 'health-lead-v1', lead }),
    });
    const responseText = (await response.text()).slice(0, 1000);
    if (!response.ok) return { status: 'failed', buyerId: null, externalId: null, detail: `Router HTTP ${response.status}: ${responseText}` };
    let parsed: Record<string, unknown> = {};
    try { parsed = JSON.parse(responseText || '{}'); } catch { /* A 2xx text response is still delivery success. */ }
    return {
      status: 'delivered',
      buyerId: typeof parsed.buyerId === 'string' ? parsed.buyerId : 'configured-router',
      externalId: typeof parsed.externalId === 'string' ? parsed.externalId : null,
    };
  } catch (cause) {
    return { status: 'failed', buyerId: null, externalId: null, detail: cause instanceof Error ? cause.message : 'Router request failed' };
  }
}
