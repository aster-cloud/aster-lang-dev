---
outline: deep
---

# 浏览器 API 参考

`@aster-cloud/aster-lang-ts` 包提供完整的 Aster CNL 编译器作为 JavaScript 库。使用它在浏览器或 Node.js 中直接编译、验证和分析策略，无需网络请求。

## 安装

```bash
npm install @aster-cloud/aster-lang-ts
```

## 导入

所有函数和词法对象从 `/browser` 子路径导出：

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

## 词法集

词法集定义特定区域的关键字集。将词法集传递给任何接受 `lexicon` 参数的函数。省略时，编译器默认使用英语（`EN_US`）。

| 词法集 | 区域设置 | 语言 |
|---------|--------|----------|
| `EN_US` | `en-US` | 英语 |
| `ZH_CN` | `zh-CN` | 简体中文 |
| `DE_DE` | `de-DE` | 德语 |

```js
import { compile, EN_US, ZH_CN } from '@aster-cloud/aster-lang-ts/browser'

// 英语策略
compile(englishSource, { lexicon: EN_US })

// 中文策略
compile(chineseSource, { lexicon: ZH_CN })
```

## 函数

### `validateSyntaxWithSpan(source, lexicon?)`

解析源码并返回语法错误数组。源码有效时返回空数组。

**参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `source` | `string` | 是 | 要验证的 CNL 源文本。 |
| `lexicon` | `Lexicon` | 否 | 使用的关键字集。默认为 `EN_US`。 |

**返回：** `ValidationError[]`

每个 `ValidationError` 具有以下结构：

```ts
interface ValidationError {
  message: string
  span?: {
    start: { line: number; col: number }
    end: { line: number; col: number }
  }
}
```

**示例：**

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

将 CNL 源字符串编译为核心中间表示。

**参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `source` | `string` | 是 | CNL 源文本。 |
| `options` | `object` | 否 | 编译选项（见下文）。 |

**选项：**

| 字段 | 类型 | 默认值 | 描述 |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | 解析用的关键字集。 |
| `domain` | `string` | `undefined` | 可选的编译域提示。 |
| `includeIntermediates` | `boolean` | `false` | 为 `true` 时，结果包含中间核心表示的 JSON 结构。 |

**返回：** 至少包含 `success: boolean` 的结果对象。当 `success` 为 `true` 时，编译输出可用。当 `includeIntermediates` 为 `true` 时，结果包含中间表示的 `core` 字段。

**示例：**

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

在单次调用中编译源码并运行类型检查器。这是将 `compile` 与类型验证结合的便利函数。

**参数：** 与 `compile` 相同。

**返回：** 与 `compile` 相同，发现类型错误时附带额外的类型检查诊断。

**示例：**

```js
import { compileAndTypecheck, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const result = compileAndTypecheck(source, { lexicon: EN_US })

if (result.success) {
  console.log('Compilation and type checking passed.')
}
```

### `extractSchema(source, options?)`

解析源码并提取特定函数的参数 schema（未指定时使用第一个函数）。

**参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `source` | `string` | 是 | CNL 源文本。 |
| `options` | `object` | 否 | 提取选项（见下文）。 |

**选项：**

| 字段 | 类型 | 默认值 | 描述 |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | 解析用的关键字集。 |
| `functionName` | `string` | `undefined` | 要提取的函数名。默认为模块中的第一个函数。 |

**返回：** `SchemaResult`

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

**示例：**

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

将源码分解为扁平的 token 数组。适用于语法高亮、工具集成或调试词法分析器。

**参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `source` | `string` | 是 | CNL 源文本。 |
| `lexicon` | `Lexicon` | 否 | 关键字集。默认为 `EN_US`。 |

**返回：** `Token[]`

每个 token 包含 token 类型、原始文本值和位置信息。

**示例：**

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

从参数 schema 数组生成一组合理的示例输入值。适用于填充测试表单、生成文档示例或预填充 API 请求中的 `context` 对象。

**参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `parameters` | `ParameterSchema[]` | 是 | 来自 `extractSchema` 结果的参数数组。 |
| `lexicon` | `Lexicon` | 否 | 关键字集。默认为 `EN_US`。 |

**返回：** `Record<string, unknown>`

将参数名映射到生成值的普通对象。结构体参数展开为嵌套对象。

**示例：**

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

在浏览器中使用核心 IR 解释器评估已编译的策略。允许无需网络请求即可完整执行策略。

**参数：**

| 参数 | 类型 | 必需 | 描述 |
|-----------|------|----------|-------------|
| `coreIR` | `CoreIR` | 是 | 来自 `compile()` 的已编译核心中间表示。 |
| `functionName` | `string` | 是 | 要调用的函数名。 |
| `context` | `Record<string, unknown>` | 是 | 将参数名映射到值的上下文对象。 |

**返回：** `EvalResult`

**示例：**

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

## 何时使用浏览器 API vs REST API vs GraphQL

| 标准 | 浏览器 API | REST API | GraphQL |
|-----------|-------------|----------|---------|
| **运行位置** | 浏览器或 Node.js | 服务器端 | 服务器端 |
| **需要网络** | 否 | 是 | 是 |
| **认证** | 无 | HMAC 请求签名 | HMAC 请求签名 |
| **策略存储** | 无（无状态） | 版本化、持久化 | 版本化、持久化 |
| **评估** | `evaluate`（本地，无审计） | 带审计的完整评估 | 带审计的完整评估 |
| **验证** | `validateSyntaxWithSpan` | `/evaluate-source`（干运行） | `validatePolicy` 变更 |
| **Schema 提取** | `extractSchema` | `POST /policies/schema` | `policySchema` 查询 |
| **批量评估** | 不支持 | `POST /policies/evaluate/batch` | 不支持 |
| **审计追踪** | 不生成 | 自动 SHA-256 链 | 自动 SHA-256 链 |
| **最适合** | 编辑器、CI 检查、本地工具 | 生产评估、部署 | 灵活查询、仪表板 |

**决策指南：**

- 当需要快速、离线验证和 schema 提取时使用**浏览器 API** — 例如在浏览器编辑器、CI lint 步骤或本地开发脚本中。
- 当需要在生产中部署、评估、版本化和审计策略时使用 **REST API**。REST API 是运行时策略执行的主要接口。
- 当需要跨策略、版本和审计记录的灵活查询时使用 **GraphQL** — 例如构建仅获取所需字段的管理仪表板。

## 典型工作流

结合浏览器 API 和 REST API 完成完整开发周期：

```js
import {
  validateSyntaxWithSpan,
  extractSchema,
  compile,
  generateInputValues,
  EN_US,
} from '@aster-cloud/aster-lang-ts/browser'

const source = loadPolicySource()

// 1. 本地验证语法（无需网络）
const errors = validateSyntaxWithSpan(source, EN_US)
if (errors.length > 0) {
  reportErrors(errors)
  process.exit(1)
}

// 2. 提取 schema 以验证参数合约
const schema = extractSchema(source, { lexicon: EN_US })
assertSchemaMatchesContract(schema)

// 3. 编译以验证完整编译成功
const compiled = compile(source, { lexicon: EN_US })
if (!compiled.success) {
  reportCompileFailure(compiled)
  process.exit(1)
}

// 4. 生成示例输入用于冒烟测试
const sampleInputs = generateInputValues(schema.parameters, EN_US)

// 5. 通过 REST API 部署
await deployPolicy(source)

// 6. 通过 REST API 冒烟测试已部署的策略
const result = await evaluatePolicy('Loan.Approval', 'isEligible', sampleInputs)
console.log('Smoke test result:', result)
```

## 相关页面

- [演练场](./playground) — 在浏览器中交互式体验浏览器 API。
- [CNL 快速参考](./cnl-quick-reference) — Aster CNL 的完整语法指南。
- [部署指南](./deployment-guide) — 从源码到生产的端到端指南。
- [API：提取 Schema](/api/policies/schema) — `extractSchema` 的 REST API 等价。
- [API：验证策略](/api/policies/validate) — 检查已部署策略是否可调用。
