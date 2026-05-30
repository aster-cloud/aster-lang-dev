---
title: 版本对比
description: 在 Aster Lang 开源版、托管 SaaS（Aster Lang Cloud）与企业自托管版本之间做出选择。
---

# 版本对比

Aster Lang 提供三种版本。三种版本运行**完全相同的引擎和同一套语言**——差异仅在于由谁运维、数据存放在何处。

::: tip 价格
自助团队请直接看 Cloud 的 Free 与 Pro 公开定价:**[aster-lang.cloud/pricing](https://aster-lang.cloud/pricing)**。企业版(自托管)价格取决于租户规模、评估量与数据驻留要求 — 请**[联系销售](mailto:sales@aster-lang.cloud)**获取报价。
:::

## 一览表

| | 开源版 | Cloud（SaaS） | 企业版（自托管） |
|---|---|---|---|
| **由谁运维** | 您 — 本机或自有基础设施 | 我们 — 托管在 `aster-lang.cloud` | 您 — 部署到 VPC / 集群 |
| **许可证** | Apache-2.0 | 订阅 | 订阅 + 永久回退授权 |
| **适合谁** | 构建、学习、嵌入解析器 | 希望托管多租户的团队 | 受监管行业、数据驻留、内网隔离 |
| **如何开始** | `npm i @aster-cloud/aster-lang-ts` | [aster-lang.cloud](https://aster-lang.cloud) | [联系销售](mailto:sales@aster-lang.cloud) |

## 功能对比

### 语言与引擎

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| 多语言 CNL（English / 中文 / Deutsch） | ✅ | ✅ | ✅ |
| Java/Truffle 参考引擎 | ✅ | ✅ | ✅ |
| 浏览器/Node 端 TypeScript 引擎 | ✅ | ✅ | ✅ |
| LSP / VS Code 扩展 | ✅ | ✅ | ✅ |
| 自定义语言包 | ✅ | ✅ | ✅ |

### 策略执行

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| REST `/evaluate` | 自行部署 | ✅ | ✅ |
| GraphQL | 自行部署 | ✅ | ✅ |
| WebSocket 流式 | 自行部署 | ✅ | ✅ |
| 批量评估 | 自行部署 | ✅ | ✅ |
| 决策追踪（`?trace=true`） | ✅ | ✅ | ✅ |

### AI 辅助

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| AI 策略草稿（SSE 流式） | 自带密钥 | ✅ | 自带密钥 / 私有 LLM |
| AI 策略解释 | 自带密钥 | ✅ | 自带密钥 / 私有 LLM |
| 编译—校验环 | ✅ | ✅ | ✅ |

### 治理与审计

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| 哈希链审计日志（SHA-256） | ✅ | ✅ | ✅ |
| 确定性历史决策回放 | ✅ | ✅ | ✅ |
| 租户隔离 | n/a | ✅ | ✅ |
| RBAC（admin / author / reviewer / viewer） | 自行实现 | ✅ | ✅ |
| HMAC 请求签名 | ✅ | ✅ | ✅ |

### 运维

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| SLA | 社区 | 99.9%（目标） | 合同约定 |
| 多区域故障切换 | n/a | ✅ | 客户定义 |
| 内网隔离部署 | ✅ | ❌ | ✅ |
| 基于 ArgoCD 的 Kubernetes (K3S) GitOps | ✅ | ✅（托管） | ✅ |
| Helm Chart | ✅ | n/a | ✅ |
| Native Image（亚秒级启动） | ✅ | ✅ | ✅ |

### 合规与数据驻留

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| 您的代码归您所有 | ✅ Apache-2.0 | ✅ | ✅ |
| 数据处理协议（DPA） | n/a | [公开模板](/enterprise/dpa-template) | 定制 |
| DSAR / 数据被遗忘权 | n/a | ✅ | ✅ |
| 遥测透明度 | [文档](/enterprise/telemetry-fields) | [文档](/enterprise/telemetry-fields) | [文档](/enterprise/telemetry-fields) + 客户可控开关 |
| 数据驻留选择 | 视您的部署位置 | EU / US / APAC | 您的司法辖区 |
| SOC 2 / ISO 27001 | n/a | 路线图 | 可由客户继承 |

### 技术支持

| | 开源版 | Cloud | 企业版 |
|---|:---:|:---:|:---:|
| 社区（GitHub Issues、Discord） | ✅ | ✅ | ✅ |
| 工作时间邮件支持 | n/a | ✅ | ✅ |
| 7×24 事故通道 | n/a | 加购 | ✅ |
| 入职培训 | 仅文档 | 文档 + 在线沟通 | 专属工程师 |
| 定制语言包开发 | 自行 | 自行 | 包含 |

## 哪个版本适合您？

<div class="vp-doc">

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 🛠 开源版

您是开发者，正在评估语言、把解析器嵌入自有产品，或在自有基础设施上运行单团队策略。

- Apache-2.0 — 可 Fork、发布、商用
- `npm install @aster-cloud/aster-lang-ts` 获取编译器
- 从本仓库自行部署 API 服务

→ [在演练场开始](/zh/learn/playground)
→ [5 分钟快速开始](/zh/getting-started/quickstart)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### ☁️ Cloud（SaaS）

希望获得托管体验——多租户、AI 辅助、托管审计——无须自行运维 Kubernetes。

- 注册、粘贴规则、点击"评估"
- 内建 AI 草稿与解释
- 哈希链审计开箱即用
- [自定义领域词汇](https://aster-lang.cloud/domain-vocabularies) — Free: 无 · Pro: 5,000 词条 · Enterprise: 无限

→ [**在 aster-lang.cloud 免费开始 →**](https://aster-lang.cloud)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 🏢 企业版（自托管）

您来自受监管行业——金融、医疗、政府，或任何数据驻留不可妥协的场景。

- 部署在您的 VPC、K3S、内网集群
- 继承您现有的 SOC 2 / ISO 27001 控制
- 定制 DPA + 7×24 事故通道

→ [企业版概览](/enterprise/)
→ [联系销售](mailto:sales@aster-lang.cloud)

</div>

</div>

</div>

## 常见问题

**三个版本的引擎一样吗？**
一样。Java/Truffle 参考引擎与 TypeScript 引擎均开源；Cloud 与企业版在其上增加运维、治理与支持，并未扩展语言本身。

**可以从 Cloud 迁到企业版吗？**
可以。策略是可移植的纯文本源码；审计链以 JSONL 导出。

**有评估 / POC 许可吗？**
企业版通常提供 30 天评估窗口，并附工程支持。请[发邮件给我们](mailto:sales@aster-lang.cloud)说明用例。

**价格呢？**
[联系我们](mailto:sales@aster-lang.cloud)——根据评估量、租户数与驻留要求报价。开源版在 Apache-2.0 下永久免费。

---

[**前往 aster-lang.cloud →**](https://aster-lang.cloud) &nbsp; · &nbsp; [联系销售](mailto:sales@aster-lang.cloud)
