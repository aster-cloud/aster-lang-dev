---
layout: home
# 隐藏 VPFooter（home 由 DevFooter 接管,通过 CustomLayout 的 layout-bottom slot）
footer: false

hero:
  name: "用母语"
  text: "写策略"
  tagline: "用母语撰写业务规则。AI 起草，人工审核，GraalVM 执行。哈希链审计开箱即用。"
  # 文案与 aster-lang.cloud hero 保持一致（messages/zh.json `hero.*`）
  # 不设 image:让 hero 文本占满列宽,HeroAnimation 在 CTA 下方居中渲染（对齐 cloud）
  actions:
    - theme: brand
      text: 在演练场开始
      link: /zh/learn/playground
    - theme: alt
      text: 5 分钟快速开始
      link: /zh/getting-started/quickstart
---

<div class="vp-doc" style="max-width: 960px; margin: 4rem auto; padding: 0 24px;">

## 选择你的路径

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 我是业务专家

合规官、风险分析师或策略作者。你希望用 **自己** 的语言写规则,并让 AI 帮你起草初稿。

→ [**在 Cloud 免费开始**](https://aster-lang.cloud)
→ [阅读:CNL 快速参考](/zh/learn/cnl-quick-reference)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 我是工程师

你想把策略评估集成到服务里。REST 5 分钟接入,GraphQL/WS 适用于复杂流程。

→ [**5 分钟快速开始**](/zh/getting-started/quickstart)
→ [REST API 参考](/api/policies/evaluate)
→ [GraphQL Schema](/graphql/overview)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 我是 IT 决策者

你需要数据主权、GDPR/PII 控制和清晰的部署路径。自托管是一等选项。

→ [部署指南](/zh/learn/deployment-guide)
→ [认证与 RBAC](/zh/getting-started/authentication)
→ [联系销售](mailto:sales@aster-lang.cloud)

</div>

</div>

---

## 什么是 Aster Lang?

Aster Lang 是用于编写可执行业务策略的 **多语言受控自然语言(CNL)** —— 贷款资格、保险核保、GDPR 数据访问、欺诈规则,以及任何需要规则 **既能被人阅读又能被机器运行** 的场景。

```aster
Module aster.finance.loan.

Rule evaluateLoanEligibility given applicant:
    If applicant.creditScore is at least 700
    and applicant.annualIncome is at least 50000:
        Return approved.
    Otherwise:
        Return rejected.
```

同一条规则也可以用中文书写:

```aster
模块 aster.finance.loan。

规则 evaluateLoanEligibility 给定 申请人：
    如果 申请人.信用分 不低于 700
    并且 申请人.年收入 不低于 50000：
        返回 已批准。
    否则：
        返回 已拒绝。
```

两者由 **同一个引擎** 解析、类型检查、执行。

---

## 为什么我们要做这件事

今天的业务规则散落在三处:

1. **埋在代码里** —— 只有工程师能改;法务读不懂。
2. **在 Excel/Word 里** —— 可读但从不执行;漂移不可避免。
3. **在低代码工具里** —— 谁都读不懂,且只能在某家厂商的运行时跑。

Aster Lang 是第四个选项:**像备忘录一样可读、像编译代码一样运行的规则**。

---

## 谁在使用

> 🚧 客户案例即将推出。如果你愿意被收录,[联系我们](mailto:hello@aster-lang.dev)。

---

## 开源与社区

- [**aster-lang-ts**](https://github.com/aster-lang/aster-lang-ts) —— TypeScript 编译器与 LSP(npm:`@aster-cloud/aster-lang-ts`)
- [**aster-lang-core**](https://github.com/aster-lang/aster-lang-core) —— Java/ANTLR 参考编译器
- [**Language packs**](https://github.com/aster-lang) —— `aster-lang-en` / `-zh` / `-de`

发现 bug?提个 issue。想新增语言?见词典包指南。

</div>
