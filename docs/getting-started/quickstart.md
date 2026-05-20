# Quick Start

<!-- glossary:block id=quickstart-quick-start-paragraph-1 -->
This guide walks you through your first policy evaluation in under five minutes.
<!-- /glossary:block -->

## Prerequisites

<!-- glossary:block id=quickstart-prerequisites-list-item-2 -->
- A tenant ID and API key issued by your Aster account administrator
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-prerequisites-list-item-3 -->
- `curl` available on your system (or any HTTP client)
<!-- /glossary:block -->

<!-- glossary:block id=quickstart-prerequisites-paragraph-4 -->
If you do not yet have a tenant ID, contact your administrator or refer to the tenant onboarding documentation.
<!-- /glossary:block -->

## Step 1 — Set Your Credentials

<!-- glossary:block id=quickstart-step-1-set-your-credentials-paragraph-5 -->
Export your credentials as environment variables so the examples below work without modification:
<!-- /glossary:block -->

```bash
export ASTER_TENANT_ID="my-tenant"
export ASTER_API_SECRET="your-api-secret-here"
```

## Step 2 — Evaluate a Simple Policy

<!-- glossary:block id=quickstart-step-2-evaluate-a-simple-policy-paragraph-6 -->
The `evaluate-source` endpoint accepts a policy written directly in the request body. This is the fastest way to experiment without first creating a stored policy.
<!-- /glossary:block -->

```bash
curl -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: my-tenant" \
  -H "X-User-Role: MEMBER" \
  -d '{
    "source": "Module demo.\n\nRule greet given name as Text, produce Text:\n  Return \"Hello, \" + name + \"!\".",
    "context": {"name": "World"},
    "functionName": "greet",
    "locale": "en-US"
  }'
```

<!-- glossary:block id=quickstart-step-2-evaluate-a-simple-policy-paragraph-7 -->
The `source` field contains the full Aster CNL policy. The policy above defines a single rule `greet` that accepts a `name` parameter and returns a greeting string. The `context` object supplies the input values.
<!-- /glossary:block -->

## Step 3 — Understand the Result

<!-- glossary:block id=quickstart-step-3-understand-the-result-paragraph-8 -->
A successful evaluation returns HTTP `200` with a JSON body:
<!-- /glossary:block -->

```json
{
  "result": "Hello, World!",
  "error": null,
  "executionTimeMs": 12
}
```

<!-- glossary:block id=quickstart-step-3-understand-the-result-paragraph-9 -->
| Field              | Type           | Description                                                      |
|--------------------|----------------|------------------------------------------------------------------|
| `result`           | any            | The value returned by the evaluated rule                         |
| `error`            | string \| null | Error message if evaluation failed; `null` on success            |
| `executionTimeMs`  | number         | Wall-clock time taken to evaluate the policy, in milliseconds    |
<!-- /glossary:block -->

<!-- glossary:block id=quickstart-step-3-understand-the-result-paragraph-10 -->
If `error` is non-null, the `result` field will be `null`. See [Error Handling](./errors) for a full list of failure scenarios.
<!-- /glossary:block -->

## Step 4 — Try Batch Evaluation

<!-- glossary:block id=quickstart-step-4-try-batch-evaluation-paragraph-11 -->
When you need to evaluate the same policy against multiple input sets in a single network round-trip, use the `evaluate-source-batch` endpoint.
<!-- /glossary:block -->

```bash
curl -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source-batch \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: my-tenant" \
  -H "X-User-Role: MEMBER" \
  -d '{
    "source": "Module demo.\n\nRule greet given name as Text, produce Text:\n  Return \"Hello, \" + name + \"!\".",
    "functionName": "greet",
    "locale": "en-US",
    "inputs": [
      {"name": "Alice"},
      {"name": "Bob"},
      {"name": "Carol"}
    ]
  }'
```

<!-- glossary:block id=quickstart-step-4-try-batch-evaluation-paragraph-12 -->
The response contains a `results` array with one entry per input, in the same order:
<!-- /glossary:block -->

```json
{
  "results": [
    {"result": "Hello, Alice!", "error": null, "executionTimeMs": 8},
    {"result": "Hello, Bob!",   "error": null, "executionTimeMs": 3},
    {"result": "Hello, Carol!", "error": null, "executionTimeMs": 3}
  ]
}
```

<!-- glossary:block id=quickstart-step-4-try-batch-evaluation-paragraph-13 -->
Individual items in the batch may fail independently. A non-null `error` on one item does not abort the remaining evaluations.
<!-- /glossary:block -->

## Next Steps

<!-- glossary:block id=quickstart-next-steps-paragraph-14 -->
Now that you have a working evaluation, explore these topics to make the most of the API:
<!-- /glossary:block -->

<!-- glossary:block id=quickstart-next-steps-list-item-15 -->
- [Authentication](./authentication) — add HMAC signing to protect your requests
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-next-steps-list-item-16 -->
- [Overview](./overview) — understand the full capabilities of the policy engine
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-next-steps-list-item-17 -->
- [Error Handling](./errors) — handle failures gracefully in your application
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-next-steps-list-item-18 -->
- [API Reference](/api/policies/evaluate) — complete reference for all endpoints and fields
<!-- /glossary:block -->
