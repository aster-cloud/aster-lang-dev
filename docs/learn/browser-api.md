---
outline: deep
---

# Browser API Reference

<!-- glossary:block id=browser-api-browser-api-reference-paragraph-1 -->
The `@aster-cloud/aster-lang-ts` package provides the full Aster CNL compiler as a JavaScript library. Use it to compile, validate, and analyze policies directly in the browser or in Node.js without making network requests.
<!-- /glossary:block -->

## Installation

```bash
npm install @aster-cloud/aster-lang-ts
```

## Imports

<!-- glossary:block id=browser-api-imports-paragraph-2 -->
All functions and lexicon objects are exported from the `/browser` subpath:
<!-- /glossary:block -->

```js
import {
  compile,
  evaluate,
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

<!-- glossary:block id=browser-api-lexicons-paragraph-3 -->
A lexicon defines the keyword set for a specific locale. Pass a lexicon to any function that accepts the `lexicon` parameter. When omitted, the compiler defaults to English (`EN_US`).
<!-- /glossary:block -->

<!-- glossary:block id=browser-api-lexicons-paragraph-4 -->
| Lexicon | Locale | Language |
|---------|--------|----------|
| `EN_US` | `en-US` | English |
| `ZH_CN` | `zh-CN` | Simplified Chinese |
| `DE_DE` | `de-DE` | German |
<!-- /glossary:block -->

```js
import { compile, EN_US, ZH_CN } from '@aster-cloud/aster-lang-ts/browser'

// English policy
compile(englishSource, { lexicon: EN_US })

// Chinese policy
compile(chineseSource, { lexicon: ZH_CN })
```

## Functions

### `validateSyntaxWithSpan(source, lexicon?)`

<!-- glossary:block id=browser-api--paragraph-5 -->
Parse the source and return an array of syntax errors. Returns an empty array when the source is valid.
<!-- /glossary:block -->

**Parameters:**

<!-- glossary:block id=browser-api--paragraph-6 -->
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text to validate. |
| `lexicon` | `Lexicon` | No | Keyword set to use. Defaults to `EN_US`. |
<!-- /glossary:block -->

**Returns:** `ValidationError[]`

<!-- glossary:block id=browser-api--paragraph-7 -->
Each `ValidationError` has the following shape:
<!-- /glossary:block -->

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
  Return "Hello, " plus name.`

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

<!-- glossary:block id=browser-api--paragraph-8 -->
Compile a CNL source string into the core intermediate representation.
<!-- /glossary:block -->

**Parameters:**

<!-- glossary:block id=browser-api--paragraph-9 -->
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text. |
| `options` | `object` | No | Compilation options (see below). |
<!-- /glossary:block -->

**Options:**

<!-- glossary:block id=browser-api--paragraph-10 -->
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | Keyword set for parsing. |
| `domain` | `string` | `undefined` | Optional domain hint for compilation. |
| `includeIntermediates` | `boolean` | `false` | When `true`, the result includes the intermediate core representation as a JSON structure. |
<!-- /glossary:block -->

<!-- glossary:block id=browser-api--paragraph-11 -->
**Returns:** A result object with at least `success: boolean`. When `success` is `true`, the compiled output is available. When `includeIntermediates` is `true`, the result contains a `core` field with the intermediate representation.
<!-- /glossary:block -->

**Example:**

```js
import { compile, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module pricing.

Rule calculatePrice given amount as Int, produce Int:
  If amount greater than 100
    Return amount times 90 divided by 100.
  Return amount.`

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

<!-- glossary:block id=browser-api--paragraph-12 -->
Compile the source and run the type checker in a single call. This is a convenience function that combines `compile` with type verification.
<!-- /glossary:block -->

**Parameters:** Same as `compile`.

<!-- glossary:block id=browser-api--paragraph-13 -->
**Returns:** Same as `compile`, with additional type-checking diagnostics when type errors are found.
<!-- /glossary:block -->

**Example:**

```js
import { compileAndTypecheck, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const result = compileAndTypecheck(source, { lexicon: EN_US })

if (result.success) {
  console.log('Compilation and type checking passed.')
}
```

### `extractSchema(source, options?)`

<!-- glossary:block id=browser-api--paragraph-14 -->
Parse the source and extract the parameter schema for a specific function (or the first function if none is specified).
<!-- /glossary:block -->

**Parameters:**

<!-- glossary:block id=browser-api--paragraph-15 -->
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text. |
| `options` | `object` | No | Extraction options (see below). |
<!-- /glossary:block -->

**Options:**

<!-- glossary:block id=browser-api--paragraph-16 -->
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | Keyword set for parsing. |
| `functionName` | `string` | `undefined` | Name of the function to extract. Defaults to the first function in the module. |
<!-- /glossary:block -->

**Returns:** `SchemaResult`

```ts
interface SchemaResult {
  success: boolean
  moduleName?: string
  functionName?: string
  parameters?: ParameterSchema[]
  error?: string
}

type TypeKind =
  | 'primitive'
  | 'struct'
  | 'enum'
  | 'list'
  | 'map'
  | 'option'
  | 'result'
  | 'function'
  | 'unknown'

interface ParameterSchema {
  name: string
  type: string
  typeKind: TypeKind
  optional: boolean
  position: number
  fields: FieldSchema[]
}

interface FieldSchema {
  name: string
  type: string
  typeKind: TypeKind
}
```

**Example:**

```js
import { extractSchema, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module loan.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule checkEligibility given applicant as Applicant, produce Bool:
  If applicant.creditScore less than 600
    Return false.
  Return true.`

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

<!-- glossary:block id=browser-api--paragraph-17 -->
Break the source into a flat array of tokens. Useful for syntax highlighting, tooling integration, or debugging the lexer.
<!-- /glossary:block -->

**Parameters:**

<!-- glossary:block id=browser-api--paragraph-18 -->
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source` | `string` | Yes | The CNL source text. |
| `lexicon` | `Lexicon` | No | Keyword set. Defaults to `EN_US`. |
<!-- /glossary:block -->

**Returns:** `Token[]`

<!-- glossary:block id=browser-api--paragraph-19 -->
Each token includes the token type, raw text value, and position information.
<!-- /glossary:block -->

**Example:**

```js
import { tokenize, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module demo.

Rule greet given name as Text, produce Text:
  Return "Hello, " plus name.`

const tokens = tokenize(source, EN_US)

tokens.forEach(t => {
  console.log(`${t.type}: ${JSON.stringify(t.value)}`)
})
```

### `generateInputValues(parameters, lexicon?)`

<!-- glossary:block id=browser-api--paragraph-20 -->
Generate a set of plausible sample input values from a parameter schema array. This is useful for populating test forms, generating documentation examples, or prefilling the `context` object in API requests.
<!-- /glossary:block -->

**Parameters:**

<!-- glossary:block id=browser-api--paragraph-21 -->
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `parameters` | `ParameterSchema[]` | Yes | The parameter array from an `extractSchema` result. |
| `lexicon` | `Lexicon` | No | Keyword set. Defaults to `EN_US`. |
<!-- /glossary:block -->

**Returns:** `Record<string, unknown>`

<!-- glossary:block id=browser-api--paragraph-22 -->
A plain object mapping parameter names to generated values. Struct parameters are expanded into nested objects.
<!-- /glossary:block -->

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
  Return true.`

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

### `evaluate(coreIR, functionName, context)`

<!-- glossary:block id=browser-api--paragraph-23 -->
Evaluate a compiled policy in the browser using the core IR interpreter. This allows full policy execution without network requests.
<!-- /glossary:block -->

**Parameters:**

<!-- glossary:block id=browser-api--paragraph-24 -->
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `coreIR` | `CoreIR` | Yes | The compiled core intermediate representation from `compile()`. |
| `functionName` | `string` | Yes | Name of the function to invoke. |
| `context` | `Record<string, unknown>` | Yes | Context object mapping parameter names to values. |
<!-- /glossary:block -->

**Returns:** `EvalResult`

**Example:**

```js
import { compile, evaluate, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module demo.

Rule greet given name as Text, produce Text:
  Return "Hello, " plus name.`

const compiled = compile(source, { lexicon: EN_US, includeIntermediates: true })

if (compiled.success) {
  const result = evaluate(compiled.core, 'greet', { name: 'World' })
  console.log(result) // { value: "Hello, World" }
}
```

## When to Use Browser API vs REST API vs GraphQL

<!-- glossary:block id=browser-api-when-to-use-browser-api-vs-rest-api-vs-graphql-paragraph-25 -->
| Criterion | Browser API | REST API | GraphQL |
|-----------|-------------|----------|---------|
| **Runs where** | Browser or Node.js | Server-side | Server-side |
| **Network required** | No | Yes | Yes |
| **Authentication** | None | HMAC request signing | HMAC request signing |
| **Policy storage** | None (stateless) | Versioned, persisted | Versioned, persisted |
| **Evaluation** | `evaluate` (local, no audit) | Full evaluation with audit | Full evaluation with audit |
| **Validation** | `validateSyntaxWithSpan` | `/evaluate-source` (dry run) | `validatePolicy` mutation |
| **Schema extraction** | `extractSchema` | `POST /policies/schema` | `policySchema` query |
| **Batch evaluation** | Not supported | `POST /policies/evaluate/batch` | Not supported |
| **Audit trail** | Not generated | Automatic SHA-256 chain | Automatic SHA-256 chain |
| **Best for** | Editors, CI checks, local tooling | Production evaluation, deployment | Flexible queries, dashboards |
<!-- /glossary:block -->

**Decision guide:**

<!-- glossary:block id=browser-api-when-to-use-browser-api-vs-rest-api-vs-graphql-list-item-26 -->
- Use the **Browser API** when you need fast, offline validation and schema extraction -- for example, in an in-browser editor, a CI lint step, or a local development script.
<!-- /glossary:block -->
<!-- glossary:block id=browser-api-when-to-use-browser-api-vs-rest-api-vs-graphql-list-item-27 -->
- Use the **REST API** when you need to deploy, evaluate, version, and audit policies in production. The REST API is the primary interface for runtime policy execution.
<!-- /glossary:block -->
<!-- glossary:block id=browser-api-when-to-use-browser-api-vs-rest-api-vs-graphql-list-item-28 -->
- Use **GraphQL** when you need flexible queries across policies, versions, and audit records -- for example, when building an admin dashboard that fetches only the fields it needs.
<!-- /glossary:block -->

## Typical Workflow

<!-- glossary:block id=browser-api-typical-workflow-paragraph-29 -->
Combine the Browser API and REST API for a complete development cycle:
<!-- /glossary:block -->

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

<!-- glossary:block id=browser-api-related-pages-list-item-30 -->
- [Playground](./playground) -- try the Browser API interactively in your browser.
<!-- /glossary:block -->
<!-- glossary:block id=browser-api-related-pages-list-item-31 -->
- [CNL Quick Reference](./cnl-quick-reference) -- complete syntax guide for Aster CNL.
<!-- /glossary:block -->
<!-- glossary:block id=browser-api-related-pages-list-item-32 -->
- [Deployment Guide](./deployment-guide) -- end-to-end guide from source to production.
<!-- /glossary:block -->
<!-- glossary:block id=browser-api-related-pages-list-item-33 -->
- [API: Extract Schema](/api/policies/schema) -- REST API equivalent of `extractSchema`.
<!-- /glossary:block -->
<!-- glossary:block id=browser-api-related-pages-list-item-34 -->
- [API: Validate Policy](/api/policies/validate) -- check if a deployed policy is callable.
<!-- /glossary:block -->
