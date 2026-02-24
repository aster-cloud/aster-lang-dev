# Evaluate Policy from Source

Compile and evaluate a CNL (Controlled Natural Language) policy source string on the fly, without requiring the policy to be deployed first. Optionally returns a full decision trace for debugging.

## Endpoint

`POST /api/v1/policies/evaluate-source`

## Required Role

`MEMBER`

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trace` | `boolean` | `false` | When `true`, the response includes a structured `decisionTrace` object showing which rules fired and how the result was derived. |

## Headers

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <token>` | Yes |
| `Content-Type` | `application/json` | Yes |
| `X-Tenant-ID` | Tenant identifier string | Yes |

## Request Body

```json
{
  "source": "string",
  "context": {},
  "locale": "en-US",
  "functionName": "evaluate"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | `string` | Yes | Raw CNL policy source text. The engine parses, canonicalizes, and compiles this string before evaluation. Parsing errors are returned in the `error` field. |
| `context` | `object` | Yes | A single context object whose keys map to the declared parameter names of the target function. For multi-parameter functions, wrap each argument under its declared parameter name. |
| `locale` | `string` | No | BCP 47 locale tag that identifies the CNL keyword set used in `source`. Defaults to `"en-US"`. Use `"zh-CN"` for Simplified Chinese CNL syntax. |
| `functionName` | `string` | No | Name of the function to invoke within the compiled module. Defaults to `"evaluate"`. If the source defines only one function, that function is called regardless of this value. |

## Response Body

```json
{
  "result": "<any>",
  "executionTimeMs": 0,
  "error": null,
  "decisionTrace": null
}
```

| Field | Type | Description |
|-------|------|-------------|
| `result` | `any` | The value returned by the evaluated function. |
| `executionTimeMs` | `number` | Total wall-clock time in milliseconds including compilation and execution. |
| `error` | `string \| null` | Parse, compile, or runtime error message; `null` on success. |
| `decisionTrace` | `object \| null` | Present only when `?trace=true` is set. Contains an ordered list of rule nodes, each recording whether the rule condition matched and its contribution to the final result. `null` when tracing is disabled. |

### Decision Trace Structure

When `?trace=true` is used, `decisionTrace` has the following shape:

```json
{
  "functionName": "string",
  "steps": [
    {
      "ruleIndex": 0,
      "condition": "string",
      "conditionMet": true,
      "returnValue": "<any>",
      "notes": "string"
    }
  ],
  "finalResult": "<any>"
}
```

## HTTP Status Codes

| Status | Meaning |
|--------|---------|
| `200 OK` | Compilation and evaluation attempted. Check `error` for compile-time or runtime failures. |
| `400 Bad Request` | Malformed request body or missing required fields. |
| `401 Unauthorized` | Missing or invalid bearer token. |
| `403 Forbidden` | Token is valid but the caller lacks the `MEMBER` role. |
| `500 Internal Server Error` | Unexpected engine failure. |

## Examples

### Without Trace

::: code-group

```bash [curl]
curl -X POST "https://policy.aster-lang.dev/api/v1/policies/evaluate-source?trace=false" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: acme-corp" \
  -d '{
    "source": "Module Discount.\nRule calculate given order:\n  If order.total > 100 return 10\n  return 0",
    "context": { "order": { "total": 150 } },
    "locale": "en-US",
    "functionName": "calculate"
  }'
```

```js [JavaScript]
const response = await fetch(
  'https://policy.aster-lang.dev/api/v1/policies/evaluate-source?trace=false',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer <token>',
      'Content-Type': 'application/json',
      'X-Tenant-ID': 'acme-corp',
    },
    body: JSON.stringify({
      source:
        'Module Discount.\nRule calculate given order:\n  If order.total > 100 return 10\n  return 0',
      context: { order: { total: 150 } },
      locale: 'en-US',
      functionName: 'calculate',
    }),
  }
);

const data = await response.json();
```

:::

### With Decision Trace

::: code-group

```bash [curl]
curl -X POST "https://policy.aster-lang.dev/api/v1/policies/evaluate-source?trace=true" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: acme-corp" \
  -d '{
    "source": "Module Discount.\nRule calculate given order:\n  If order.total > 100 return 10\n  return 0",
    "context": { "order": { "total": 150 } },
    "locale": "en-US",
    "functionName": "calculate"
  }'
```

```js [JavaScript]
const response = await fetch(
  'https://policy.aster-lang.dev/api/v1/policies/evaluate-source?trace=true',
  {
    method: 'POST',
    headers: {
      Authorization: 'Bearer <token>',
      'Content-Type': 'application/json',
      'X-Tenant-ID': 'acme-corp',
    },
    body: JSON.stringify({
      source:
        'Module Discount.\nRule calculate given order:\n  If order.total > 100 return 10\n  return 0',
      context: { order: { total: 150 } },
      locale: 'en-US',
      functionName: 'calculate',
    }),
  }
);

const data = await response.json();
// data.decisionTrace.steps → array of rule evaluation steps
```

:::

### Example Response (trace=true)

```json
{
  "result": 10,
  "executionTimeMs": 12,
  "error": null,
  "decisionTrace": {
    "functionName": "calculate",
    "steps": [
      {
        "ruleIndex": 0,
        "condition": "order.total > 100",
        "conditionMet": true,
        "returnValue": 10,
        "notes": "Rule matched — early return"
      }
    ],
    "finalResult": 10
  }
}
```
