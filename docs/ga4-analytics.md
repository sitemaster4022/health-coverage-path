# GA4 analytics integration

## Scope

HealthCoveragePath uses Google Analytics 4 as a secondary, aggregate page-usage layer. The first-party D1 analytics endpoint and its detailed funnel events remain authoritative for product and lead operations.

Measurement ID: G-9DNQ8RYLN2

The Google tag is installed once in the shared SiteLayout head. Because Astro pages use that layout, it covers the homepage, Florida guides, calculator pages, and the About, Contact, Privacy, Terms, Editorial and Lead-Generation Disclosure pages. API routes do not render the layout and do not load GA4.

## What GA4 receives

The integration intentionally sends only the automatic GA4 page_view created by the config command. No custom gtag event bridge is installed.

The config uses:

- page_location: origin plus pathname only; the query string and hash are excluded.
- page_referrer: origin only; query strings and paths are excluded.
- send_page_view: true, exactly once per document load.
- allow_google_signals: false.
- allow_ad_personalization_signals: false.

No form interaction, lead, calculator, TrustedForm or consent event is sent to GA4. Existing first-party events such as page_view, page_cta_click, funnel_start, funnel_step_complete, lead_submit, lead_success, lead_duplicate, lead_failure, calculator_complete and TrustedForm diagnostics continue to go to D1 through the existing hcp:analytics event bus. The optional first-party hcpDataLayer is separate from Google's dataLayer.

Do not add custom GA4 events or parameters without a new privacy review. In particular, never send names, email, phone, ZIP code, income, household size, coverage status, timing, eligibility answers, medical or health information, TrustedForm URLs or tokens, consent text or version, internal lead IDs, buyer IDs, external lead IDs, routing status or raw form data.

## Query-string and attribution safety

First-touch attribution remains unchanged and continues to keep the allowlisted campaign and click fields in first-party storage and D1. GA4 receives no query string, including UTM, gclid, fbclid, msclkid or ttclid values. This is deliberately stricter than the first-party attribution policy because the lead funnel contains sensitive insurance-context data.

The page URL and referrer are sanitized in SiteLayout before the GA4 config runs. Do not replace those values with document.location.href or document.referrer.

## CSP

Both public/_headers and src/middleware.ts include the same additions:

- https://www.googletagmanager.com in script-src: the official async gtag.js loader.
- https://*.google-analytics.com in connect-src: the GA4 collection endpoint, including the regional collection host if one is selected.
- https://*.google-analytics.com in img-src: the Google Analytics image-beacon fallback documented by Google.

No Google Ads, DoubleClick, googlesyndication, googleadservices, analytics.google.com or other advertising origin is allowlisted. TrustedForm origins remain unchanged. The wildcard is limited to the google-analytics.com namespace; do not broaden it to a general Google wildcard.

## Privacy and GA4 property settings

Google's current guidance prohibits sending personally identifiable information to Analytics and says HIPAA-regulated customers must not expose protected health information to Google Analytics. This code therefore keeps detailed health-insurance and lead data first-party only.

In the GA4 property, verify:

1. Admin > Data collection and modification > Data streams > the web stream for G-9DNQ8RYLN2.
2. Enhanced Measurement options are off unless separately reviewed. In particular, do not enable scroll, outbound-click, file-download, form-interaction or site-search collection for this health-insurance site.
3. Google Signals is off.
4. Advertising personalization is off.
5. No Google Ads link, remarketing audience, conversion bidding, enhanced conversion, customer-list upload or user-provided-data collection is configured.
6. Data retention and user access settings match the site's privacy review.

## Production verification

Use synthetic browsing only.

1. Open https://healthcoveragepath.com/ and one Florida guide, calculator and Privacy page.
2. In browser Network, filter for googletagmanager and google-analytics. Confirm one gtag.js request and one page-view collection request per document.
3. Inspect the collection request query/body. Confirm the measurement ID is G-9DNQ8RYLN2, page_location has no query string, page_referrer has no query string, and no names, contact data, ZIP, income, household, coverage, timing, consent, TrustedForm, lead or routing fields appear.
4. Confirm the response CSP includes only the Google origins listed above and that there are no CSP violations or site-origin console errors.
5. Open the lead funnel and submit only synthetic values. Confirm D1 lead, consent and first-party analytics behavior remains unchanged, TrustedForm still issues/persists evidence, routing remains held and buyer delivery remains disabled. Do not expect GA4 to receive funnel details.
6. In GA4, use Reports > Realtime (or the current equivalent) and look for the production page view. If the connected session cannot access the account, report client-side network delivery and have an authorized GA4 user verify Realtime.

GA4 Realtime is not claimed as independently verified unless the property UI actually shows the production page view.

## Disable safely

To remove GA4, delete the two Google tag script blocks from SiteLayout.astro, remove the three Google CSP additions from both header sources, and remove or revise this documentation and the Privacy Policy section. Do not remove Analytics.astro, the hcp:analytics event bus, first-touch attribution, D1 storage, TrustedForm code or buyer-routing safeguards.
