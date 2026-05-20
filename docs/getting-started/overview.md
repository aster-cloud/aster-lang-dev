# Overview

<!-- glossary:block id=overview-overview-paragraph-1 -->
Aster Policy Engine is a production-grade REST service for evaluating business rules written in **Aster CNL** (Controlled Natural Language). It is built on [Quarkus](https://quarkus.io/) and designed for low-latency, multi-tenant deployments.
<!-- /glossary:block -->

## Base URL

```
https://policy.aster-lang.dev
```

<!-- glossary:block id=overview-base-url-paragraph-2 -->
All API paths are prefixed with `/api/v1/`.
<!-- /glossary:block -->

## Supported Protocols

<!-- glossary:block id=overview-supported-protocols-paragraph-3 -->
| Protocol  | Endpoint prefix               | Use case                                       |
|-----------|-------------------------------|------------------------------------------------|
| REST      | `/api/v1/`                    | Standard request/response evaluation           |
| GraphQL   | `/graphql`                    | Flexible queries and mutations                 |
| WebSocket | `/ws/v1/evaluate`             | Streaming evaluation and live policy updates   |
<!-- /glossary:block -->

## Request Requirements

<!-- glossary:block id=overview-request-requirements-paragraph-4 -->
Every request to the API must satisfy the following requirements.
<!-- /glossary:block -->

### Required Headers

<!-- glossary:block id=overview-required-headers-paragraph-5 -->
| Header           | Description                                               |
|------------------|-----------------------------------------------------------|
| `Content-Type`   | Must be `application/json` for all POST/PUT requests      |
| `X-Tenant-Id`    | Identifies the tenant context for the request             |
<!-- /glossary:block -->

### Optional Security Headers

<!-- glossary:block id=overview-optional-security-headers-paragraph-6 -->
Requests that modify state or carry sensitive inputs should also include HMAC signing headers. See [Authentication](./authentication) for the full signing protocol.
<!-- /glossary:block -->

<!-- glossary:block id=overview-optional-security-headers-paragraph-7 -->
| Header               | Description                                    |
|----------------------|------------------------------------------------|
| `X-Aster-Signature`  | HMAC-SHA256 signature of the request body      |
| `X-Aster-Nonce`      | Random nonce used in signature computation     |
| `X-Aster-Timestamp`  | Unix timestamp (seconds) at time of signing    |
| `X-User-Role`        | Role claim used for RBAC enforcement           |
<!-- /glossary:block -->

## API Versioning

<!-- glossary:block id=overview-api-versioning-paragraph-8 -->
The current API version is **v1**. The version is encoded in the URL path (`/api/v1/`), not in a header or query parameter. Breaking changes will be introduced under a new version prefix (`/api/v2/`) with an overlap period before the old version is retired.
<!-- /glossary:block -->

## Content Type

<!-- glossary:block id=overview-content-type-paragraph-9 -->
All request and response bodies use `application/json`. Requests that omit `Content-Type: application/json` on POST or PUT endpoints will receive a `400 Bad Request` response.
<!-- /glossary:block -->

## Rate Limits

<!-- glossary:block id=overview-rate-limits-paragraph-10 -->
Rate limiting is applied per tenant. Requests that exceed the limit receive a `429 Too Many Requests` response with a `Retry-After` header indicating when the window resets.
<!-- /glossary:block -->

## What is Aster CNL?

<!-- glossary:block id=overview-what-is-aster-cnl-paragraph-11 -->
Aster CNL is a subset of English (with localisation support for other languages such as Simplified Chinese) designed to express business rules unambiguously. A minimal policy looks like this:
<!-- /glossary:block -->

```
Module pricing.

Rule discounted-price given amount as Number, tier as Text, produce Number:
  If tier is "gold":
    Return amount * 0.8.
  Return amount.
```

<!-- glossary:block id=overview-what-is-aster-cnl-paragraph-12 -->
Policies are submitted either as source text (evaluated on-the-fly) or as stored policy objects that are pre-compiled and cached. See the [API Reference](/api/policies/evaluate) for details on both modes.
<!-- /glossary:block -->

## Next Steps

<!-- glossary:block id=overview-next-steps-list-item-13 -->
- [Authentication](./authentication) — configure tenant IDs, HMAC signing, and RBAC roles
<!-- /glossary:block -->
<!-- glossary:block id=overview-next-steps-list-item-14 -->
- [Quick Start](./quickstart) — run your first policy evaluation in under five minutes
<!-- /glossary:block -->
<!-- glossary:block id=overview-next-steps-list-item-15 -->
- [Error Handling](./errors) — understand error response formats and common failure modes
<!-- /glossary:block -->
