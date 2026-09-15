# Cloudflare D1 production setup

Create a D1 database named `health-coverage-path-leads`, apply
`migrations/0001_lead_storage.sql`, then apply the forward-only
`migrations/0002_trustedform.sql` migration. Bind the database to the Worker
as `DB`.

Production migrations and deployments should run through the existing
GitHub-connected Cloudflare deployment process. Do not commit database
credentials or apply production changes with local credentials.

After Cloudflare supplies the database ID, add this top-level block to
`wrangler.json` through the GitHub workflow before the initial storage release:

~~~json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "health-coverage-path-leads",
    "database_id": "CLOUDFLARE_DATABASE_ID",
    "migrations_dir": "migrations"
  }
]
~~~

Optionally add a secret named `TEST_SUBMISSION_TOKEN` to allow authenticated
synthetic test submissions that are always held and never sent to a buyer.

Buyer routing remains disabled unless both `LEAD_ROUTER_URL` and the explicit
`BUYER_DELIVERY_ENABLED=true` flag are configured. Neither is configured by
this repository's TrustedForm work.
