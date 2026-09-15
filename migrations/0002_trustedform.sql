-- Forward-only TrustedForm Certify additions. Do not edit 0001.
ALTER TABLE leads ADD COLUMN trustedform_cert_url TEXT;
ALTER TABLE leads ADD COLUMN trustedform_status TEXT NOT NULL DEFAULT 'missing'
  CHECK (trustedform_status IN ('available', 'missing'));

CREATE INDEX IF NOT EXISTS idx_leads_trustedform_status
  ON leads(trustedform_status);
