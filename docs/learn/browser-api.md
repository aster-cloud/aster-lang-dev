---
outline: deep
---

# Browser API Reference

The `@aster-cloud/aster-lang-ts` package provides the full Aster CNL compiler as a JavaScript library. Use it to compile, validate, and analyze policies directly in the browser or in Node.js without making network requests.

## Installation

```bash
npm install @aster-cloud/aster-lang-ts
```

## Imports

All functions and lexicon objects are exported from the `/browser` subpath:

```js
import {
  compile,
  validateSyntaxWithSpan,
  extractSchema,
  tokenize,
  generateInputValues,
  compileAndTypecheck,
  EN_US,
  ZH_CN,
  DE_DE,
} from '@aster-cloud/aster-lang-ts/browser'
```

## Lexicons

A lexicon defines the keyword set for a specific locale. Pass a lexicon to any function that accepts the `lexicon` parameter. When omitted, the compiler defaults to English (`EN_US`).

| Lexicon | Locale | Language |
|---------|--------|----------|
| `EN_US` | `en-US` | English |
| `ZH_CN` | `zh-CN` | Simplified Chinese |
| `DE_DE` | `de-DE` | German |

```js
import { compile, EN_US, ZH_CN } from '@aster-cloud/aster-lang-ts/browser'

// English policy
compile(englishSource, { lexicon: EN_US })

// Chinese policy
compile(chineseSource, { lexicon: ZH_CN })
```

## Functions

### `validateSyntaxWithSpan(source, lexicon?)`

Parse the source and return an array of syntax errors. Returns an empty array when the source is valid.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text to validate. |
| `lexicon` | `Lexicon` | No | Keyword set to use. Defaults to `EN_US`. |

**Returns:** `ValidationError[]`

Each `ValidationError` has the following shape:

```ts
interface ValidationError {
  message: string
  span?: {
    start: { line: number; col: number }
    end: { line: number; col: number }
  }
}
```

**Example:**

```js
import { validateSyntaxWithSpan, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module demo.

Rule greet given name as Text, produce Text:
  produce "Hello, " + name`

const errors = validateSyntaxWithSpan(source, EN_US)

if (errors.length === 0) {
  console.log('No syntax errors.')
} else {
  errors.forEach(e => {
    const loc = e.span ? `L${e.span.start.line}:${e.span.start.col}` : 'unknown'
    console.error(`[${loc}] ${e.message}`)
  })
}
```

### `compile(source, options?)`

Compile a CNL source string into the core intermediate representation.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text. |
| `options` | `object` | No | Compilation options (see below). |

**Options:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | Keyword set for parsing. |
| `domain` | `string` | `undefined` | Optional domain hint for compilation. |
| `includeIntermediates` | `boolean` | `false` | When `true`, the result includes the intermediate core representation as a JSON structure. |

**Returns:** A result object with at least `success: boolean`. When `success` is `true`, the compiled output is available. When `includeIntermediates` is `true`, the result contains a `core` field with the intermediate representation.

**Example:**

```js
import { compile, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module pricing.

Rule calculatePrice given amount as Int, produce Int:
  If amount > 100:
    produce amount * 90 / 100
  produce amount`

const result = compile(source, {
  lexicon: EN_US,
  includeIntermediates: true,
})

if (result.success) {
  console.log('Compilation succeeded.')
  console.log('Core IR:', JSON.stringify(result.core, null, 2))
} else {
  console.error('Compilation failed:', result.parseErrors)
}
```

### `compileAndTypecheck(source, options?)`

Compile the source and run the type checker in a single call. This is a convenience function that combines `compile` with type verification.

**Parameters:** Same as `compile`.

**Returns:** Same as `compile`, with additional type-checking diagnostics when type errors are found.

**Example:**

```js
import { compileAndTypecheck, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const result = compileAndTypecheck(source, { lexicon: EN_US })

if (result.success) {
  console.log('Compilation and type checking passed.')
}
```

### `extractSchema(source, options?)`

Parse the source and extract the parameter schema for a specific function (or the first function if none is specified).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text. |
| `options` | `object` | No | Extraction options (see below). |

**Options:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | Keyword set for parsing. |
| `functionName` | `string` | `undefined` | Name of the function to extract. Defaults to the first function in the module. |

**Returns:** `SchemaResult`

```ts
interface SchemaResult {
  success: boolean
  moduleName?: string
  functionName?: string
  parameters?: ParameterSchema[]
  error?: string
}

interface ParameterSchema {
  name: string
  type: string
  typeKind: 'PRIMITIVE' | 'STRUCT'
  optional: boolean
  position: number
  fields: FieldSchema[]
}

interface FieldSchema {
  name: string
  type: string
  typeKind: 'PRIMITIVE' | 'STRUCT'
}
```

**Example:**

```js
import { extractSchema, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module loan.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule checkEligibility given applicant as Applicant, produce Bool:
  If applicant.creditScore < 600:
    produce false
  produce true`

const schema = extractSchema(source, { lexicon: EN_US })

if (schema.success) {
  console.log(`Module: ${schema.moduleName}`)
  console.log(`Function: ${schema.functionName}`)
  schema.parameters.forEach(p => {
    console.log(`  ${p.name}: ${p.type} (${p.typeKind})`)
    p.fields.forEach(f => {
      console.log(`    .${f.name}: ${f.type}`)
    })
  })
}
```

### `tokenize(source, lexicon?)`

Break the source into a flat array of tokens. Useful for syntax highlighting, tooling integration, or debugging the lexer.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text. |
| `lexicon` | `Lexicon` | No | Keyword set. Defaults to `EN_US`. |

**Returns:** `Token[]`

Each token includes the token type, raw text value, and position information.

**Example:**

```js
import { tokenize, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module demo.

Rule greet given name as Text, produce Text:
  produce "Hello, " + name`

const tokens = tokenize(source, EN_US)

tokens.forEach(t => {
  console.log(`${t.type}: ${JSON.stringify(t.value)}`)
})
```

### `generateInputValues(parameters, lexicon?)`

Generate a set of plausible sample input values from a parameter schema array. This is useful for populating test forms, generating documentation examples, or prefilling the `context` object in API requests.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parameters` | `ParameterSchema[]` | Yes | The parameter array from an `extractSchema` result. |
| `lexicon` | `Lexicon` | No | Keyword set. Defaults to `EN_US`. |

**Returns:** `Record<string, unknown>`

A plain object mapping parameter names to generated values. Struct parameters are expanded into nested objects.

**Example:**

```js
import {
  extractSchema,
  generateInputValues,
  EN_US,
} from '@aster-cloud/aster-lang-ts/browser'

const source = `Module loan.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule checkEligibility given applicant as Applicant, produce Bool:
  produce true`

const schema = extractSchema(source, { lexicon: EN_US })

if (schema.success) {
  const inputs = generateInputValues(schema.parameters, EN_US)
  console.log(JSON.stringify(inputs, null, 2))
  // {
  //   "applicant": {
  //     "creditScore": 0,
  //     "income": 0,
  //     "age": 0
  //   }
  // }
}
```

## When to Use Browser API vs REST API vs GraphQL

| Criterion | Browser API | REST API | GraphQL |
|-----------|-------------|----------|---------|
| **Runs where** | Browser or Node.js | Server-side | Server-side |
| **Network required** | No | Yes | Yes |
| **Authentication** | None | Bearer token + HMAC | Bearer token |
| **Policy storage** | None (stateless) | Versioned, persisted | Versioned, persisted |
| **Evaluation** | Not supported | Full evaluation with audit | Full evaluation with audit |
| **Validation** | `validateSyntaxWithSpan` | `/evaluate-source` (dry run) | `validatePolicy` mutation |
| **Schema extraction** | `extractSchema` | `POST /policies/schema` | `policySchema` query |
| **Batch evaluation** | Not supported | `POST /evaluate-source-batch` | Not supported |
| **Audit trail** | Not generated | Automatic SHA-256 chain | Automatic SHA-256 chain |
| **Best for** | Editors, CI checks, local tooling | Production evaluation, deployment | Flexible queries, dashboards |

**Decision guide:**

- Use the **Browser API** when you need fast, offline validation and schema extraction -- for example, in an in-browser editor, a CI lint step, or a local development script.
- Use the **REST API** when you need to deploy, evaluate, version, and audit policies in production. The REST API is the primary interface for runtime policy execution.
- Use **GraphQL** when you need flexible queries across policies, versions, and audit records -- for example, when building an admin dashboard that fetches only the fields it needs.

## Typical Workflow

Combine the Browser API and REST API for a complete development cycle:

```js
import {
  validateSyntaxWithSpan,
  extractSchema,
  compile,
  generateInputValues,
  EN_US,
} from '@aster-cloud/aster-lang-ts/browser'

const source = loadPolicySource()

// 1. Validate syntax locally (no network)
const errors = validateSyntaxWithSpan(source, EN_US)
if (errors.length > 0) {
  reportErrors(errors)
  process.exit(1)
}

// 2. Extract schema to verify parameter contract
const schema = extractSchema(source, { lexicon: EN_US })
assertSchemaMatchesContract(schema)

// 3. Compile to verify full compilation succeeds
const compiled = compile(source, { lexicon: EN_US })
if (!compiled.success) {
  reportCompileFailure(compiled)
  process.exit(1)
}

// 4. Generate sample inputs for smoke test
const sampleInputs = generateInputValues(schema.parameters, EN_US)

// 5. Deploy via REST API
await deployPolicy(source)

// 6. Smoke-test the deployed policy via REST API
const result = await evaluatePolicy('Loan.Approval', 'isEligible', sampleInputs)
console.log('Smoke test result:', result)
```

## Related Pages

- [Playground](./playground) -- try the Browser API interactively in your browser.
- [CNL Quick Reference](./cnl-quick-reference) -- complete syntax guide for Aster CNL.
- [Deployment Guide](./deployment-guide) -- end-to-end guide from source to production.
- [API: Extract Schema](/api/policies/schema) -- REST API equivalent of `extractSchema`.
- [API: Validate Policy](/api/policies/validate) -- check if a deployed policy is callable.
