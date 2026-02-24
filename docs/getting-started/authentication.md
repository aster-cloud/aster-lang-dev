# Authentication

The Aster Policy Engine enforces a three-layer security model on every request. Each layer is independent; all three must be satisfied for a request to succeed.

## Layer 1 — Tenant Isolation (`X-Tenant-Id`)

Every request must carry an `X-Tenant-Id` header. This header establishes the tenant context for the request: policies, audit records, and all data are scoped to the specified tenant and are never visible to other tenants.

**Format:** `^[a-zA-Z0-9_-]{1,64}$`

A missing or malformed `X-Tenant-Id` returns `400 Bad Request` immediately, before any other validation is performed.

```bash
curl https://policy.aster-lang.dev/api/v1/policies \
  -H "X-Tenant-Id: acme-corp"
```

::: tip Tenant ID conventions
Use a stable, human-readable identifier such as your organisation slug or environment name (e.g. `acme-corp`, `acme-corp-staging`). Tenant IDs are case-sensitive.
:::

## Layer 2 — HMAC Request Signing

For requests that carry a body (POST, PUT, PATCH), you can sign the payload to prevent tampering in transit and to protect against replay attacks. The server validates the signature before processing the request.

### Required Headers

| Header               | Description                                                          |
|----------------------|----------------------------------------------------------------------|
| `X-Aster-Signature`  | Hex-encoded HMAC-SHA256 of the canonical message (see below)        |
| `X-Aster-Nonce`      | A randomly-generated string (recommend 16+ bytes, hex or UUID)      |
| `X-Aster-Timestamp`  | Unix timestamp in seconds at the moment of signing                   |

### Canonical Message Format

The HMAC is computed over the following newline-delimited string:

```
{X-Tenant-Id}\n{X-Aster-Timestamp}\n{X-Aster-Nonce}\n{raw-request-body}
```

The HMAC key is the **API secret** issued to your tenant during onboarding.

### Example: Computing the Signature (Bash)

```bash
TENANT_ID="acme-corp"
TIMESTAMP=$(date +%s)
NONCE=$(openssl rand -hex 16)
BODY='{"source":"Module demo.\n\nRule ping produce Text:\n  Return \"pong\".","functionName":"ping","context":{},"locale":"en-US"}'
API_SECRET="your-api-secret-here"

MESSAGE="${TENANT_ID}\n${TIMESTAMP}\n${NONCE}\n${BODY}"
SIGNATURE=$(printf '%s' "${TENANT_ID}
${TIMESTAMP}
${NONCE}
${BODY}" | openssl dgst -sha256 -hmac "${API_SECRET}" | awk '{print $2}')

curl -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-Aster-Signature: ${SIGNATURE}" \
  -H "X-Aster-Nonce: ${NONCE}" \
  -H "X-Aster-Timestamp: ${TIMESTAMP}" \
  -d "${BODY}"
```

### Replay Prevention

The server rejects requests where `X-Aster-Timestamp` is more than **300 seconds** (5 minutes) in the past or future. Additionally, each `(X-Aster-Nonce, X-Aster-Timestamp)` pair is stored for the duration of the replay window; a second request using the same nonce within the window is rejected with `403 Forbidden`.

::: warning Signature validation is optional but strongly recommended
Requests without HMAC headers are accepted but logged as unsigned. In a future API version, signing may become mandatory for mutation endpoints.
:::

## Layer 3 — Role-Based Access Control (`X-User-Role`)

The `X-User-Role` header carries the caller's role claim. The server enforces a strict role hierarchy:

```
OWNER > ADMIN > MEMBER > VIEWER
```

Each role is additive: a higher role inherits all permissions of roles below it.

### Role Permissions

| Role     | Permitted actions                                                         |
|----------|---------------------------------------------------------------------------|
| `VIEWER` | Read stored policies (GET)                                                |
| `MEMBER` | All VIEWER permissions + evaluate policies (POST to evaluation endpoints) |
| `ADMIN`  | All MEMBER permissions + read and verify audit logs                       |
| `OWNER`  | All ADMIN permissions + manage tenant settings and RBAC assignments       |

### Endpoint Requirements

| Endpoint category        | Minimum required role |
|--------------------------|-----------------------|
| Policy evaluation        | `MEMBER`              |
| Policy management (CRUD) | `MEMBER`              |
| Audit log read           | `ADMIN`               |
| Audit log verification   | `ADMIN`               |
| Tenant administration    | `OWNER`               |

A request with an insufficient role returns `403 Forbidden`.

### Example: Full Request with All Three Layers

```bash
curl -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: acme-corp" \
  -H "X-User-Role: MEMBER" \
  -H "X-Aster-Signature: 3d9e2f1a..." \
  -H "X-Aster-Nonce: c3ab8ff13720e8ad9047dd39466b3c89" \
  -H "X-Aster-Timestamp: 1708776000" \
  -d '{
    "source": "Module demo.\n\nRule ping produce Text:\n  Return \"pong\".",
    "functionName": "ping",
    "context": {},
    "locale": "en-US"
  }'
```

## Summary

| Layer | Header(s)                                              | Required  | Failure response      |
|-------|--------------------------------------------------------|-----------|-----------------------|
| 1     | `X-Tenant-Id`                                          | Always    | `400 Bad Request`     |
| 2     | `X-Aster-Signature`, `X-Aster-Nonce`, `X-Aster-Timestamp` | Recommended | `403 Forbidden`  |
| 3     | `X-User-Role`                                          | Always    | `403 Forbidden`       |
