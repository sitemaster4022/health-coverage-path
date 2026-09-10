CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  submitted_at TEXT NOT NULL,
  original_landing_url TEXT NOT NULL,
  original_landing_path TEXT NOT NULL,
  submission_path TEXT NOT NULL,
  referrer TEXT,
  funnel_context TEXT NOT NULL,
  timing_bucket TEXT NOT NULL,
  coverage_date TEXT,
  zip TEXT NOT NULL,
  county TEXT,
  coverage_for TEXT NOT NULL,
  household_size INTEGER NOT NULL,
  income_range TEXT NOT NULL,
  coverage_status TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  consent INTEGER NOT NULL CHECK (consent = 1),
  consent_text TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  msclkid TEXT,
  ttclid TEXT,
  routing_status TEXT NOT NULL,
  buyer_id TEXT,
  external_id TEXT,
  routing_detail TEXT,
  date_of_birth TEXT,
  gender TEXT,
  tobacco_use INTEGER,
  household_ages_json TEXT,
  is_test INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON leads(submitted_at);
CREATE INDEX IF NOT EXISTS idx_leads_context_submitted ON leads(funnel_context, submitted_at);
CREATE INDEX IF NOT EXISTS idx_leads_routing_status ON leads(routing_status);

CREATE TABLE IF NOT EXISTS consent_records (
  lead_id TEXT PRIMARY KEY REFERENCES leads(id) ON DELETE CASCADE,
  consented_at TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

CREATE TABLE IF NOT EXISTS routing_attempts (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  attempted_at TEXT NOT NULL,
  status TEXT NOT NULL,
  buyer_id TEXT,
  external_id TEXT,
  detail TEXT
);

CREATE INDEX IF NOT EXISTS idx_routing_attempts_lead ON routing_attempts(lead_id, attempted_at);

CREATE TABLE IF NOT EXISTS lead_dedup (
  fingerprint TEXT PRIMARY KEY,
  last_seen_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS request_rate_limits (
  bucket_key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_request_rate_limits_expiry ON request_rate_limits(expires_at);

CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  occurred_at TEXT NOT NULL,
  event_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  first_touch_id TEXT NOT NULL,
  original_landing_url TEXT NOT NULL,
  original_landing_path TEXT NOT NULL,
  current_path TEXT NOT NULL,
  referrer TEXT,
  funnel_context TEXT,
  cta TEXT,
  step_number INTEGER,
  step_name TEXT,
  total_steps INTEGER,
  lead_id TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  gclid TEXT,
  fbclid TEXT,
  msclkid TEXT,
  ttclid TEXT
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_name, occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_landing_time ON analytics_events(original_landing_path, occurred_at);
CREATE INDEX IF NOT EXISTS idx_analytics_session_time ON analytics_events(session_id, occurred_at);

PRAGMA optimize;
