---
outline: deep
---

# 部署指南

本指南介绍 Aster CNL 策略的完整生命周期：编写、验证、部署到引擎、针对实时数据执行，以及随时间管理版本。

## 策略生命周期

```
编写  -->  验证  -->  部署  -->  执行  -->  监控
  |             |              |            |             |
  |  编写 CNL  |  检查语法   | POST 到    | POST 到     | 查询审计
  |  源码       |  错误       | /policies  | /evaluate   | 日志和
  |             |              |            |             | 版本
```

每个阶段可以通过 REST API、浏览器 API 或两者组合执行。

## 第一步 — 编写策略

使用任何文本编辑器或[演练场](./playground)编写 Aster CNL 策略。完整策略包括模块声明、可选的结构体定义和一个或多个规则。

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

将此文本保存到文件（如 `loan-approval.aster`）或在部署脚本中作为字符串保留。

## 第二步 — 本地验证

部署前验证策略以尽早捕获语法错误。可以在 Node.js 脚本中或直接在浏览器中使用浏览器 API 进行验证。

**浏览器 API 验证：**

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

**REST API 验证（evaluate-source 干运行）：**

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

成功响应 `"error": null` 确认策略编译和评估正确。

## 第三步 — 提取 Schema

部署前提取参数 schema，让下游消费者确切知道需要提供什么输入结构。

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

响应列出每个参数的名称、类型、类型种类和嵌套字段（对于结构体类型）。使用此 schema 构建 API 合约、生成表单或验证调用者输入。

## 第四步 — 部署策略

将策略源码提交到引擎。引擎编译、存储并激活它。

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

成功部署返回策略 ID 和版本号：

```json
{
  "policyId": "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
  "version": 1,
  "moduleName": "Loan.Approval",
  "functionName": "isEligible",
  "active": true
}
```

保存 `policyId` — 版本管理和回滚操作需要它。

## 第五步 — 执行策略

部署后，通过引用模块和函数名评估策略。

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

响应：

```json
{
  "result": true,
  "executionTimeMs": 4,
  "error": null,
  "decisionTrace": null
}
```

对于在单个请求中针对多组输入的批量评估，使用 `/api/v1/policies/evaluate-source-batch` 端点。详情参阅[批量评估](/api/policies/batch)参考。

## 第六步 — 监控与审计

### 查看审计日志

每次评估都产生审计记录。查询审计日志以审查决策：

```bash
curl -s -X GET \
  "https://policy.aster-lang.dev/api/v1/audit/logs?policyModule=Loan.Approval&limit=10" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID"
```

### 验证哈希链完整性

审计记录通过 SHA-256 哈希链接。验证链未被篡改：

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/audit/verify-chain \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d '{"policyModule": "Loan.Approval"}'
```

## 版本管理

### 列出版本

检索已部署策略的完整版本历史：

```bash
curl -s -X GET \
  "https://policy.aster-lang.dev/api/v1/policies/$POLICY_ID/versions" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID"
```

### 部署新版本

要更新策略，提交修订后的源码。引擎创建新版本并激活它：

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

### 回滚到先前版本

如果新版本导致问题，可立即回滚到任何先前版本：

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

回滚是原子性的 — 后续评估请求立即使用恢复的版本。回滚会在版本历史中创建新条目以供审计。

## 部署检查清单

在将策略推向生产前使用此检查清单。

| 步骤 | 命令/操作 | 状态 |
|------|------------------|--------|
| 语法验证通过 | `validateSyntaxWithSpan()` 返回 `[]` | |
| Schema 匹配预期合约 | `extractSchema()` 返回正确参数 | |
| 测试评估返回预期结果 | `POST /evaluate-source` 使用已知输入 | |
| 策略已部署 | `POST /policies` 返回 `policyId` 和 `version` | |
| 实时评估确认 | `POST /evaluate` 返回预期结果 | |
| 审计日志条目已创建 | `GET /audit/logs` 显示评估记录 | |

## 相关页面

- [API：评估策略](/api/policies/evaluate) — 评估端点的完整参考。
- [API：评估源码](/api/policies/evaluate-source) — 编译和评估内联源码。
- [API：提取 Schema](/api/policies/schema) — 以编程方式发现参数类型。
- [API：版本历史](/api/policies/versions) — 列出已部署策略的所有版本。
- [API：回滚](/api/policies/rollback) — 恢复到先前版本。
- [浏览器 API 参考](./browser-api) — 客户端验证和 schema 提取。
