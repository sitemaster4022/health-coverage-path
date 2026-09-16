# Funnel conversion order

## Scope

This change keeps the existing context-aware lead funnel, D1 payload, first-party analytics, TrustedForm markup, GA4 page-only integration, and buyer-neutral routing intact. It changes the visible question order and explains why the less-obvious questions help the consumer.

## Audited baseline on main

The general flow was:

1. `coverage_change` — What changed with your coverage?
2. `coverage_timing` — When did it end or when will it end?
3. `florida_zip` — Florida ZIP code
4. `coverage_household` — coverage target and tax household size
5. `income_range` — expected yearly household income
6. `coverage_status` — current coverage status
7. `contact_identity` — name and email
8. `phone_consent` — phone and consent

Targeted guide flows already skipped `coverage_change`, but began with timing.

## New flow

General or homepage traffic now uses:

`florida_zip → coverage_household → income_range → coverage_change → coverage_timing → coverage_status → contact_identity → phone_consent`

Context-specific guide traffic uses:

`florida_zip → coverage_household → income_range → coverage_timing → coverage_status → contact_identity → phone_consent`

The situation selector is therefore skipped for guides whose source context already identifies the life event, including job loss, Medicaid loss, turning 26, self-employed, COBRA and the other existing context values. The existing dynamic timing prompts remain driven by that context.

The progress bar uses the actual visible flow length: eight steps for general traffic and seven for targeted traffic. Back navigation, validation and analytics use the semantic step constants rather than assuming DOM order.

## Copy rationale

- ZIP asks for the area first and explains that local plan availability and prices vary; it does not promise a quote or every available plan.
- Coverage target and tax household size are kept together. The copy explains that household size can affect the income limits used to estimate Marketplace savings and that tax-household size can matter even when not everyone needs coverage.
- Expected yearly income explains that it is a factor in possible premium savings without promising eligibility or a lower premium.
- The general situation question is framed as “What brought you here today?” and appears only after the consumer has seen the connection to local options and possible savings.
- Timing explains that it may affect whether a Special Enrollment Period is available, while keeping low-friction ranges.
- Contact information remains at the end and is preceded by an honest transition: “We have enough information to narrow down your next steps.” No quote, plan, eligibility or savings result is promised.
- ZIP, income and final contact/consent buttons use “See Available Options,” “Check Potential Savings,” and “Check My Options” where those labels accurately describe the next action.

## Coverage status decision

`coverage_status` is retained in every flow. It is a separately validated and persisted lead field that distinguishes coverage ending, coverage already lost, COBRA offered, COBRA active and currently uninsured. Source context and timing do not fully determine those states, so removing it would reduce lead-quality information and risk changing downstream data compatibility. No enum values or stored field names changed.

## Data and analytics compatibility

No D1 migration or API change was required. Existing fields remain mapped as before: context, timing bucket, ZIP, coverage target, household size, income range, coverage status, attribution, contact, consent and TrustedForm evidence.

First-party analytics remains authoritative. Existing event names are unchanged, and `step_name` values remain semantic (`florida_zip`, `coverage_household`, `income_range`, `coverage_change`, `coverage_timing`, `coverage_status`, `contact_identity`, `phone_consent`). `step_number` and `total_steps` now describe the visible context-specific order.

The GA4 integration is unchanged and remains page-only. No form answers or funnel events are bridged to Google Analytics.

TrustedForm element roles, consent language, hidden certificate handling and certificate persistence are unchanged. Buyer delivery remains disabled and valid submissions remain held.

## Authority references

- [HealthCare.gov — plan estimator](https://www.healthcare.gov/apply-and-enroll/health-insurance-plans-estimator-overview/)
- [HealthCare.gov — savings and household income](https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/)
- [HealthCare.gov — household size](https://www.healthcare.gov/income-and-household-information/household-size/)
- [HealthCare.gov — expected income](https://www.healthcare.gov/income-and-household-information/income/)
- [HealthCare.gov — Special Enrollment Period](https://www.healthcare.gov/coverage-outside-open-enrollment/special-enrollment-period/)
- [CMS — household size and income technical assistance](https://www.cms.gov/marketplace/technical-assistance-resources/household-size-income)
