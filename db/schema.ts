/** D1 schema contract. The executable migration lives in migrations/0001_lead_storage.sql. */
export const LEAD_TABLES = ['leads', 'consent_records', 'routing_attempts', 'lead_dedup', 'request_rate_limits', 'analytics_events'] as const;

export const OPTIONAL_BUYER_FIELDS = [
  'date_of_birth',
  'gender',
  'tobacco_use',
  'household_ages_json',
  'county',
] as const;
