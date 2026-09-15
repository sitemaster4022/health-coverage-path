# Cloudflare D1 production setup

Create a D1 database named `health-coverage-path-leads`, apply `migrations/0001_lead_storage.sql`, and bind it to the Worker as `DB`.

After Cloudflare supplies the database ID, add this top-level block to `wrangler.json` through the GitHub workflow before merging the storage release:

```json
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "health-coverage-path-leads",
    "database_id": "CLOUDFLARE_DATABASE_ID",
    "migrations_dir": "migrations"
  }
]
```

Optionally add a secret named `TEST_SUBMISSION_TOKEN` to allow authenticated test submissions that are always held and never sent to a buyer. Buyer routing remains disabled unless `LEAD_ROUTER_URL` is configured.
