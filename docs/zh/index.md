---
layout: home
# 隐藏 VPFooter（home 由 DevFooter 接管,通过 CustomLayout 的 layout-bottom slot）
footer: false

hero:
  name: "策略 · 流程 · 决策"
  text: "用 English、中文、Deutsch 都行"
  # tagline 用 HeroTaglineList SFC 渲染（六条技术契约列表），通过
  # #home-hero-info-after slot 注入。原因：VitePress frontmatter
  # tagline 只支持单行字符串，但本项目对技术声明的呈现需要 bullets。
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

想写 CNL 规则并运行它。先用浏览器演练场；通过 `@aster-cloud/aster-lang-ts` 集成。需要托管引擎？Aster Cloud 提供 REST / GraphQL / WS。

→ [**在演练场开始**](/zh/learn/playground)
→ [浏览器 SDK 指南](/zh/learn/browser-api)
→ [Cloud API 文档 ↗](https://aster-lang.cloud/zh/docs/api/policies/evaluate)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 我是 IT 决策者

你需要数据主权、GDPR/PII 控制和清晰的部署路径。自托管是一等选项。

→ [部署指南](/zh/learn/deployment-guide)
→ [合规资源](/community/compliance/)

</div>

</div>

---

## 什么是 Aster Lang?

Aster Lang 是用于编写可执行业务逻辑的 **多语言受控自然语言(CNL)** —— 贷款资质策略、审批门禁流程、路由决策、定价规则,以及任何需要规则 **既能被人阅读又能被机器运行** 的场景。

语言把 **策略**、**流程**、**决策** 当作一等公民:同一套语法既能表达资质检查,也能表达审批流转或路由规则。引擎将三者编译到同一条审计级执行路径。

```aster ignore
Module aster.finance.loan.

Define Applicant has creditScore as Int, annualIncome as Int.

Rule evaluateLoanEligibility given applicant as Applicant, produce Text:
  If applicant.creditScore at least 700
    If applicant.annualIncome at least 50000
      Return "approved".
  Return "rejected".
```

同一条规则也可以用中文书写:

```aster
模块 aster.finance.loan。

定义 申请人 包含 信用分 as 整数，年收入 as 整数。

规则 evaluateLoanEligibility 给定 申请人 as 申请人，产出 文本：
  如果 申请人.信用分 至少 700
    如果 申请人.年收入 至少 50000
      返回 "已批准"。
  返回 "已拒绝"。
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

- [**aster-lang-ts**](https://github.com/aster-cloud/aster-lang-ts) —— TypeScript 编译器与 LSP(npm:`@aster-cloud/aster-lang-ts`)
- [**aster-lang-core**](https://github.com/aster-cloud/aster-lang-core) —— Java/ANTLR 参考编译器
- [**Language packs**](https://github.com/aster-cloud) —— `aster-lang-en` / `-zh` / `-de`

发现 bug?提个 issue。想新增语言?见词典包指南。

</div>
