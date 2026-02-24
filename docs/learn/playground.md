---
outline: deep
---

# Playground

The Aster Playground is an interactive editor that compiles Aster CNL policies in real time, directly in your browser. No server round-trip is required -- the full compiler runs client-side via the `@aster-cloud/aster-lang-ts` package.

Use the playground to experiment with syntax, validate policies before deployment, inspect parameter schemas, and generate sample input data.

<script setup>
import { defineAsyncComponent } from 'vue'
const AsterPlayground = defineAsyncComponent(() =>
  import('../.vitepress/components/AsterPlayground.vue')
)
</script>

<AsterPlayground />

## Features

### Multi-Language Support

Use the **Language** dropdown to switch between supported locales:

| Locale | Language | Example keyword set |
|--------|----------|---------------------|
| `EN_US` | English | `Module`, `Rule`, `given`, `If`, `produce` |
| `ZH_CN` | Simplified Chinese | `模块`, `规则`, `给定`, `如果`, `产出` |
| `DE_DE` | German | `Modul`, `Regel`, `gegeben`, `wenn`, `gib zurueck` |

When you switch languages, the editor loads a starter template in that locale. All locales compile to the same underlying core representation.

### Real-Time Validation

Every keystroke triggers a debounced analysis pass. The compiler parses your source, checks for syntax errors, and reports diagnostics within roughly 300 milliseconds. Errors appear in the **Diagnostics** tab with line and column positions so you can locate problems immediately.

### Schema Extraction

When your policy compiles without errors, the playground extracts the parameter schema for the first rule in the module. The **Schema** tab displays each parameter's name, type, and type kind (`PRIMITIVE` or `STRUCT`). This is the same schema the REST API returns from the `/api/v1/policies/schema` endpoint.

### Sample Input Generation

Based on the extracted schema, the playground generates a set of plausible sample input values. The **Inputs** tab shows this JSON object, which you can copy and use as the `context` field in a REST API evaluation request.

## Output Tabs

The results panel on the right side of the playground contains four tabs.

### Diagnostics

Lists all syntax errors found during parsing. Each entry shows:

- **Severity** -- currently all diagnostics are reported at the `ERROR` level.
- **Location** -- the line and column (`L3:5`) where the error was detected.
- **Message** -- a human-readable description of what went wrong.

When there are no errors, the tab displays a success confirmation.

### Schema

Displays the parameter schema extracted from the first rule in the compiled module. The table columns are:

| Column | Description |
|--------|-------------|
| **Name** | The parameter name as declared in the rule signature. |
| **Type** | The type name (`Int`, `Float`, `Text`, `Bool`, `DateTime`, or a user-defined struct name). |
| **Kind** | `PRIMITIVE` for built-in scalar types, `STRUCT` for user-defined record types with named fields. |

The module name and function name are shown above the table.

### Core IR

Shows the compiled intermediate representation (Core IR) as a JSON tree. This is the internal data structure the evaluation engine operates on. Inspecting the Core IR is useful for understanding how the compiler translates your CNL source into executable logic.

When compilation fails, this tab displays the parse error details instead.

### Inputs

Displays auto-generated sample input values as a JSON object. The generator creates type-appropriate placeholder values:

- `Int` and `Float` parameters receive numeric values.
- `Text` parameters receive short placeholder strings.
- `Bool` parameters receive `true` or `false`.
- `STRUCT` parameters receive nested objects with sample values for each declared field.

You can copy this JSON directly into a `context` field when calling the REST API.

## Starter Templates

The **Template** dropdown offers pre-built examples for each locale:

**English (EN_US)**
- **Basic Rule** -- a simple pricing rule with an `If` condition.
- **Eligibility Check** -- a loan eligibility rule using a `Define` struct with multiple conditions.
- **Struct Types** -- an insurance quote calculator that returns a constructed struct value.

**Chinese (ZH_CN)**
- **Basic Rule** -- the pricing rule expressed with Chinese keywords.
- **Eligibility Check** -- the loan eligibility rule in Chinese.

**German (DE_DE)**
- **Basic Rule** -- the pricing rule expressed with German keywords.

Select a template to replace the editor contents. Click **Reset** to revert to the first template for the current language.

## Keyboard Shortcuts

The editor supports standard CodeMirror key bindings:

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo |
| `Ctrl+F` / `Cmd+F` | Find |
| `Ctrl+H` / `Cmd+H` | Find and replace |

## Using Playground Results in Code

The playground runs the same functions exposed by the Browser API. Anything you see here can be reproduced programmatically:

```js
import {
  compile,
  validateSyntaxWithSpan,
  extractSchema,
  generateInputValues,
  EN_US,
} from '@aster-cloud/aster-lang-ts/browser'

const source = `Module pricing.

Rule calculatePrice given amount, produce:
  If amount greater than 100
    Return amount times 90 divided by 100.
  Return amount.`

// Diagnostics tab
const errors = validateSyntaxWithSpan(source, EN_US)

// Schema tab
const schema = extractSchema(source, { lexicon: EN_US })

// Core IR tab
const compiled = compile(source, { lexicon: EN_US, includeIntermediates: true })

// Inputs tab
if (schema.success) {
  const inputs = generateInputValues(schema.parameters, EN_US)
}
```

See the [Browser API Reference](./browser-api) for full documentation of each function.
