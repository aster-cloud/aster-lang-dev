---
outline: deep
---

# Deployment Guide

<!-- glossary:block id=deployment-guide-deployment-guide-paragraph-1 -->
This guide walks through the full lifecycle of an Aster CNL policy: authoring, validating, deploying to the engine, executing against live data, and managing versions over time.
<!-- /glossary:block -->

## Policy Lifecycle

```
Author  -->  Validate  -->  Deploy  -->  Execute  -->  Monitor
  |             |              |            |             |
  |  write CNL  |  check for   | POST to    | POST to     | query audit
  |  source     |  syntax      | /policies  | /evaluate   | logs and
  |             |  errors      |            |             | versions
```

<!-- glossary:block id=deployment-guide-policy-lifecycle-paragraph-2 -->
Each stage can be performed through the REST API, the Browser API, or a combination of both.
<!-- /glossary:block -->

## Step 1 -- Author the Policy

<!-- glossary:block id=deployment-guide-step-1-author-the-policy-paragraph-3 -->
Write your policy in Aster CNL using any text editor or the [Playground](./playground). A complete policy includes a module declaration, optional struct definitions, and one or more rules.
<!-- /glossary:block -->

```
Module Loan.Approval.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule isEligible given applicant as Applicant, requestedAmount as Int, produce Bool:
  If applicant.age < 18:
    produce false
  If applicant.creditScore < 650:
    produce false
  If applicant.income < requestedAmount * 3:
    produce false
  produce true
```

<!-- glossary:block id=deployment-guide-step-1-author-the-policy-paragraph-4 -->
Save this text to a file (e.g. `loan-approval.aster`) or keep it as a string in your deployment script.
<!-- /glossary:block -->

## Step 2 -- Validate Locally

<!-- glossary:block id=deployment-guide-step-2-validate-locally-paragraph-5 -->
Before deploying, validate the policy to catch syntax errors early. You can validate using the Browser API in a Node.js script or directly in the browser.
<!-- /glossary:block -->

**Browser API validation:**

```js
import { validateSyntaxWithSpan, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = fs.readFileSync('loan-approval.aster', 'utf-8')
const errors = validateSyntaxWithSpan(source, EN_US)

if (errors.length > 0) {
  errors.forEach(e => {
    const loc = e.span ? ` (L${e.span.start.line}:${e.span.start.col})` : ''
    console.error(`ERROR${loc}: ${e.message}`)
  })
  process.exit(1)
}

console.log('Validation passed.')
```

<!-- glossary:block id=deployment-guide-step-2-validate-locally-paragraph-6 -->
**REST API validation (evaluate-source dry run):**
<!-- /glossary:block -->

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d "{
    \"source\": $(jq -Rs . < loan-approval.aster),
    \"context\": {\"applicant\": {\"creditScore\": 700, \"income\": 50000, \"age\": 30}, \"requestedAmount\": 10000},
    \"functionName\": \"isEligible\",
    \"locale\": \"en-US\"
  }"
```

<!-- glossary:block id=deployment-guide-step-2-validate-locally-paragraph-7 -->
A successful response with `"error": null` confirms the policy compiles and evaluates correctly.
<!-- /glossary:block -->

## Step 3 -- Extract the Schema

<!-- glossary:block id=deployment-guide-step-3-extract-the-schema-paragraph-8 -->
Before deployment, extract the parameter schema so downstream consumers know exactly what input shape to provide.
<!-- /glossary:block -->

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies/schema \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d "{
    \"source\": $(jq -Rs . < loan-approval.aster),
    \"functionName\": \"isEligible\",
    \"locale\": \"en-US\"
  }"
```

<!-- glossary:block id=deployment-guide-step-3-extract-the-schema-paragraph-9 -->
The response lists each parameter with its name, type, type kind, and nested fields (for struct types). Use this schema to build API contracts, generate forms, or validate caller input.
<!-- /glossary:block -->

## Step 4 -- Deploy the Policy

<!-- glossary:block id=deployment-guide-step-4-deploy-the-policy-paragraph-10 -->
Submit the policy source to the engine. The engine compiles, stores, and activates it.
<!-- /glossary:block -->

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d "{
    \"source\": $(jq -Rs . < loan-approval.aster),
    \"locale\": \"en-US\",
    \"notes\": \"Initial deployment of loan eligibility policy\"
  }"
```

<!-- glossary:block id=deployment-guide-step-4-deploy-the-policy-paragraph-11 -->
A successful deployment returns the policy ID and the version number:
<!-- /glossary:block -->

```json
{
  "policyId": "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
  "version": 1,
  "moduleName": "Loan.Approval",
  "functionName": "isEligible",
  "active": true
}
```

<!-- glossary:block id=deployment-guide-step-4-deploy-the-policy-paragraph-12 -->
Store the `policyId` -- you will need it for version management and rollback operations.
<!-- /glossary:block -->

## Step 5 -- Execute the Policy

<!-- glossary:block id=deployment-guide-step-5-execute-the-policy-paragraph-13 -->
Once deployed, evaluate the policy by referencing its module and function name.
<!-- /glossary:block -->

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d '{
    "policyModule": "Loan.Approval",
    "policyFunction": "isEligible",
    "context": [
      {
        "creditScore": 720,
        "income": 85000,
        "age": 34
      },
      10000
    ]
  }'
```

Response:

```json
{
  "result": true,
  "executionTimeMs": 4,
  "error": null,
  "decisionTrace": null
}
```

<!-- glossary:block id=deployment-guide-step-5-execute-the-policy-paragraph-14 -->
For batch evaluation against multiple input sets in a single request, use the `/api/v1/policies/evaluate-source-batch` endpoint. See the [Batch Evaluate](/api/policies/batch) reference for details.
<!-- /glossary:block -->

## Step 6 -- Monitor and Audit

### View Audit Logs

<!-- glossary:block id=deployment-guide-view-audit-logs-paragraph-15 -->
Every evaluation produces an audit record. Query the audit log to review decisions:
<!-- /glossary:block -->

```bash
curl -s -X GET \
  "https://policy.aster-lang.dev/api/v1/audit/logs?policyModule=Loan.Approval&limit=10" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID"
```

### Verify Hash Chain Integrity

<!-- glossary:block id=deployment-guide-verify-hash-chain-integrity-paragraph-16 -->
Audit records are linked by SHA-256 hash chaining, enforced by `AuditEventListener` at the policy engine layer. SaaS dashboard activity events are stored separately and reference these chained audit ids. Verify a chain over a time range:
<!-- /glossary:block -->

```bash
START="2026-01-01T00:00:00Z"
END="2026-12-31T23:59:59Z"

curl -s "https://policy.aster-lang.dev/api/v1/audit/verify-chain?start=${START}&end=${END}" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-Id: $ASTER_TENANT_ID"
```

The endpoint returns `{ valid, brokenAt, reason, recordsVerified }`. Any `valid: false` response indicates tampered or missing records within the range.

## Version Management

### List Versions

<!-- glossary:block id=deployment-guide-list-versions-paragraph-17 -->
Retrieve the full version history for a deployed policy:
<!-- /glossary:block -->

```bash
curl -s -X GET \
  "https://policy.aster-lang.dev/api/v1/policies/$POLICY_ID/versions" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID"
```

### Deploy a New Version

<!-- glossary:block id=deployment-guide-deploy-a-new-version-paragraph-18 -->
To update a policy, submit the revised source. The engine creates a new version and activates it:
<!-- /glossary:block -->

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d "{
    \"source\": $(jq -Rs . < loan-approval-v2.aster),
    \"locale\": \"en-US\",
    \"notes\": \"Raised credit score threshold from 650 to 700 per compliance review CR-204\"
  }"
```

### Rollback to a Previous Version

<!-- glossary:block id=deployment-guide-rollback-to-a-previous-version-paragraph-19 -->
If a new version causes problems, roll back instantly to any previous version:
<!-- /glossary:block -->

```bash
curl -s -X POST \
  "https://policy.aster-lang.dev/api/v1/policies/$POLICY_ID/rollback" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d '{
    "targetVersion": 1,
    "reason": "Version 2 incorrectly rejects applicants with income between 45000-49999"
  }'
```

<!-- glossary:block id=deployment-guide-rollback-to-a-previous-version-paragraph-20 -->
The rollback is atomic -- subsequent evaluation requests immediately use the restored version. A rollback creates a new entry in the version history for auditability.
<!-- /glossary:block -->

## Deployment Checklist

<!-- glossary:block id=deployment-guide-deployment-checklist-paragraph-21 -->
Use this checklist before promoting a policy to production.
<!-- /glossary:block -->

<!-- glossary:block id=deployment-guide-deployment-checklist-paragraph-22 -->
| Step | Command / Action | Status |
|------|------------------|--------|
| Syntax validation passes | `validateSyntaxWithSpan()` returns `[]` | |
| Schema matches expected contract | `extractSchema()` returns correct parameters | |
| Test evaluation returns expected result | `POST /evaluate-source` with known inputs | |
| Policy deployed | `POST /policies` returns `policyId` and `version` | |
| Live evaluation confirmed | `POST /evaluate` returns expected result | |
| Audit log entry created | `GET /audit/logs` shows the evaluation record | |
<!-- /glossary:block -->

## Related Pages

<!-- glossary:block id=deployment-guide-related-pages-list-item-23 -->
- [API: Evaluate Policy](/api/policies/evaluate) -- full reference for the evaluate endpoint.
<!-- /glossary:block -->
<!-- glossary:block id=deployment-guide-related-pages-list-item-24 -->
- [API: Evaluate Source](/api/policies/evaluate-source) -- compile and evaluate inline source.
<!-- /glossary:block -->
<!-- glossary:block id=deployment-guide-related-pages-list-item-25 -->
- [API: Extract Schema](/api/policies/schema) -- discover parameter types programmatically.
<!-- /glossary:block -->
<!-- glossary:block id=deployment-guide-related-pages-list-item-26 -->
- [API: Version History](/api/policies/versions) -- list all versions of a deployed policy.
<!-- /glossary:block -->
<!-- glossary:block id=deployment-guide-related-pages-list-item-27 -->
- [API: Rollback](/api/policies/rollback) -- revert to a previous version.
<!-- /glossary:block -->
<!-- glossary:block id=deployment-guide-related-pages-list-item-28 -->
- [Browser API Reference](./browser-api) -- client-side validation and schema extraction.
<!-- /glossary:block -->
