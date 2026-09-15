/** D1 schema contract. Apply migrations/0001_lead_storage.sql, then forward-only TrustedForm additions in migrations/0002_trustedform.sql. */
export const LEAD_TABLES = ['leads', 'consent_records', 'routing_attempts', 'lead_dedup', 'request_rate_limits', 'analytics_events'] as const;

export const TRUSTEDFORM_LEAD_FIELDS = ['trustedform_cert_url', 'trustedform_status'] as const;

export const OPTIONAL_BUYER_FIELDS = [
  'date_of_birth',
  'gender',
  'tobacco_use',
  'household_ages_json',
  'county',
] as const;
