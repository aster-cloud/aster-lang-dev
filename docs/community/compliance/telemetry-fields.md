---
title: Telemetry fields — data minimization
description: Per-field justification for the opt-in telemetry uploaded by self-hosted Aster Lang deployments to Aster Lang Cloud. GDPR Art 5(1)(c) evidence.
---

::: info Public mirror
This page is a redacted public mirror of an internal aster-cloud document. For executed copies, customer-specific terms, or unredacted internal references, contact [hello@aster-lang.dev](mailto:hello@aster-lang.dev).
:::

This document enumerates every field the on-prem telemetry uploader
sends to the Aster SaaS ingest endpoint, alongside the rationale for
collecting it. It is the audit-trail for **GDPR Art 5(1)(c)** ("data
minimization") and **Art 30** (records of processing activities).

The wire contract is defined in code at
the telemetry schema contract module — any new field must amend both
that module **and** this document in the same PR.

The contract is also served publicly at `/api/v1/telemetry/schema`;
machine-readable consumers should read from there rather than scraping
this Markdown file.

---

## Schema v1 — current

| Field | Type | Required | Why we collect it | Legal basis |
|-------|------|----------|-------------------|-------------|
| `schemaVersion` | number | yes | Wire format negotiation. SaaS rejects unknown versions, on-prem refuses to send mismatched ones. | Necessary for service operation |
| `periodStart` | ISO-8601 | yes | Inclusive lower bound of the aggregation window. Half of the dedupe key `(license_id, period_start, period_end)`. | Necessary for service operation (preventing duplicate processing) |
| `periodEnd` | ISO-8601 | yes | Exclusive upper bound. Other half of the dedupe key. | Same as above |
| `activeSeats` | integer | yes | Count of distinct users with at least one login in the window. Aster customer-success uses this to identify SKUs that are undersized before the customer hits the seat wall. | Legitimate interest — capacity planning |
| `policiesActive` | integer | yes | Count of policies marked active in the deployment. Capacity / abuse detection signal. | Legitimate interest |
| `policyExecutionsCount` | integer | yes | Total policy executions in the window. Engagement signal — distinguishes production use from evaluation. | Legitimate interest |
| `totalProvisionedSeats` | integer | yes | Total user rows currently provisioned, regardless of recent activity. Required for seat-limit pressure estimation. | Necessary for service operation (billing compliance) |
| `seatLimitHit` | boolean | yes | Single bit: did the deployment touch its seat limit at any point in the window? | Necessary for service operation |
| `featuresUsed` | string[] | yes | Sorted list of **license-declared** feature names exercised during the window. No per-user usage tracking; cannot leak features that were never licensed. | Legitimate interest |
| `appVersion` | string | no | Aster build SHA. Drives bug-fix backport prioritization. | Legitimate interest |
| `nodeVersion` | string | no | Node.js major version. Drives EOL communication. | Legitimate interest |

---

## What we deliberately do NOT collect

- **User identifiers** — no userId, email, IP, agent string.
- **Tenant / org names** — `customer` header is the legal entity name
  from the license; can be masked to `anon-<hex>-<len>` via
  `ASTER_TELEMETRY_MASK_CUSTOMER=1` (see telemetry overview).
- **Policy content** — only counts, never policy bodies, names, or
  rule strings.
- **Execution outcomes** — only the aggregate count, never which
  policy ran or what it decided.
- **Stack traces / errors** — telemetry is success-path only; errors
  go to ops via Slack alerts, never to SaaS.
- **Geolocation** — handled SaaS-side via `dataRegion` stamping (see
  J2/J3 records of processing).
- **Performance metrics** — latency, memory, CPU not in scope.
- **Browser telemetry** — opt-in is server-side; the browser is not
  involved.

A field is included **only if** removing it would prevent Aster from
delivering a contracted service (billing, license verification,
capacity-based account management). The "legitimate interest"
fields are individually justifiable as proportionate; the schema would
not pass a DPIA without that proportionality test.

---

## Related documents

- Threat model + opt-in / opt-out flow: the telemetry overview (internal)
- DPA template (Art 28 controller / processor agreement):
  [DPA template](/community/compliance/dpa-template)
- Retention + DSAR delete: the access-audit module
  (cron: `/api/cron/telemetry-retention-gc`)
- At-rest encryption of HMAC verification secrets:
  an internal runbook (available to enterprise customers under NDA)
