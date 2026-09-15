# TrustedForm Certify integration

## Purpose and scope

HealthCoveragePath uses the free TrustedForm Certify Web SDK as supplemental,
buyer-neutral evidence of the page and form interaction associated with a lead.
Our own affirmative checkbox, consent text and version, timestamp, IP address,
user agent, D1 consent record and lead audit trail remain the source records for
our system.

Currently enabled:

- TrustedForm Certify Web SDK on the server-rendered lead form.
- The documented `xxTrustedFormCertUrl` certificate URL, when available.
- D1 coverage status of `available` or `missing`.
- URL-free diagnostic analytics events.

Explicitly not enabled:

- TrustedForm Retain or Auto-Retain.
- TrustedForm Verify or Match/Insights API calls.
- Jornaya.
- PX, SmartFinancial or any other buyer integration.
- Live buyer delivery.

## Official implementation

The current ActiveProspect documentation describes the Certify Web SDK as a
page-installed JavaScript snippet that adds hidden fields to a form. The
documented default certificate field is `xxTrustedFormCertUrl`, whose value
points to a URL beginning with `https://cert.trustedform.com/`.

This repository loads the SDK asynchronously after the server-rendered form is
already present:

~~~text
https://api.trustedform.com/trustedform.js
~~~

The loader matches the account-provided `field=xxTrustedFormCertUrl` and
`use_tagged_consent=true` settings and includes the account snippet's cache-busting
`l=` parameter. The SDK
may also create its documented token and ping helper fields. We intentionally
remove those helper fields before posting to our API because the current
buyer-neutral system needs only the certificate URL and does not call Retain,
Verify or another TrustedForm API.

The lead form is one single-page progressive flow. It has one offer, one native
submit button, a consent-language wrapper and a consent-opt-in control. The
certificate URL is read at final submission time. A missing or malformed value
does not destroy a legitimate lead: the lead is stored with
`trustedform_status='missing'`.

The current consent language does not name one fixed advertiser and does not
present a consumer-selected advertiser list. Therefore the implementation does
not add a misleading `consent-advertiser-name` or opted-advertiser tag. Any
future Verify or buyer-specific work must reconcile the legal consent language
and required advertiser tags before changing this decision.

## Data model

Migration `0002_trustedform.sql` adds these nullable/status fields to
`leads`:

| Column | Meaning |
| --- | --- |
| `trustedform_cert_url` | Validated HTTPS URL whose host is exactly `cert.trustedform.com`; null when unavailable. |
| `trustedform_status` | `available` when the URL passes validation, otherwise `missing`. |

The URL is stored once on the lead. The existing
`consent_records.lead_id` primary-key foreign key associates that lead and its
TrustedForm evidence with the exact consent event without duplicating the URL.

The normalized routing object exposes
`trustedFormCertificateUrl` and `trustedFormStatus`. A future buyer
adapter may map the former to the buyer's required field, commonly
`xxTrustedFormCertUrl`. The router remains held unless both an approved router
URL and the explicit buyer-delivery flag are configured.

## CSP

The CSP adds only the documented SDK origin
`https://api.trustedform.com` to:

- `script-src`, for the Web SDK script;
- `connect-src`, for SDK network requests;
- `img-src`, for the documented no-JavaScript beacon.

The certificate host `https://cert.trustedform.com` is the destination of the
stored URL, not a page resource loaded by this integration, so it is not added
to the page CSP. Frame embedding, object loading, form action restrictions and
unrelated external connections remain restricted.

Both `src/middleware.ts` and `public/_headers` carry the same explicit
allowlist because the middleware sets runtime headers and the static host
configuration remains part of the deployment contract.

## Account and domain prerequisites

Before expecting certificate coverage:

1. Create or activate a free TrustedForm Certify account through
   ActiveProspect.
2. In the TrustedForm Issuing Certificates settings, enable **Use Consent
   Tags** so the account-generated snippet uses `use_tagged_consent=true`.
3. Add `healthcoveragepath.com` under the account's Domains section. Follow
   ActiveProspect's displayed ownership-verification instructions and add its
   unique DNS TXT record. Include any future lead-capture subdomain separately
   if the dashboard requires it.
4. Confirm the account's current snippet and this repository's loader agree on
   the field name and tagged-consent setting. No password, API key or paid
   product key belongs in this repository.
5. If D1 has not yet received the migration, apply `0002_trustedform.sql`
   through the approved GitHub-connected Cloudflare process before testing a
   submission.

Domain verification is important for correct first-party attribution and
advanced retention features. Retain/Auto-Retain remains intentionally
disabled here.

## Testing

Use synthetic values only. If a production test is needed, configure the
existing `TEST_SUBMISSION_TOKEN` Worker secret and send the matching test
header; test submissions are always held. Do not use a real consumer or
contact a buyer.

For a browser check:

1. Load the live page with JavaScript and ad blockers disabled for the test.
2. Inspect the live form DOM for `xxTrustedFormCertUrl` and the other SDK
   fields; the certificate URL should start with
   `https://cert.trustedform.com/`.
3. Complete the flow with synthetic data and submit once.
4. Confirm the API request contains the certificate URL, the lead response
   remains `held`, the D1 lead has `trustedform_status='available'`, and
   the consent record is still present.
5. Confirm no buyer endpoint receives the request and no ordinary log contains
   the certificate URL or consumer data.
6. If the SDK is blocked, delayed or unavailable, confirm a synthetic lead can
   still be stored with `trustedform_status='missing'`.

Known causes of missing certificates include ad blockers, disabled JavaScript,
poor connectivity, submitting before asynchronous certificate creation,
incorrect script/form order, an outage, and missing or incorrect consent tags.
The client emits only `trustedform_certificate_available` or
`trustedform_certificate_missing`; it never sends the full URL to ordinary
analytics.

## Disable or remove safely

To disable capture temporarily, remove or gate the loader in
`LeadFunnel.astro` and remove the three TrustedForm CSP host additions after
confirming no other feature uses them. Keep the nullable migration columns and
historical values; do not rewrite or delete `0001_lead_storage.sql`. A future
removal should use a new forward-only migration if the database platform
requires schema cleanup.
