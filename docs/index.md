---
layout: home
# Suppress VPFooter on home; DevFooter takes over via CustomLayout layout-bottom slot.
footer: false

hero:
  name: "Policy · Workflow · Decision"
  text: "All in plain English, 中文, Deutsch"
  # No `tagline` here — the bullet-list version lives in HeroTaglineList
  # and renders via #home-hero-info-after slot (next to HeroSubtleLinks).
  # Why: VitePress's frontmatter tagline is a single string, but the
  # list format the project chose for the technical claims (open-source
  # CNL, dual impl, lexicon system, transport surface, license) needs
  # bullets to read scannable. SFC + i18n strings is the clean path.
  #
  # No `image:` either — hero text spans full column width and
  # HeroAnimation renders centered below the CTAs (cloud-aligned).
  actions:
    - theme: brand
      text: Try in Playground
      link: /learn/playground
    - theme: alt
      text: 5-Minute Quick Start
      link: /getting-started/quickstart
---

<div class="vp-doc" style="max-width: 960px; margin: 4rem auto; padding: 0 24px;">

## Choose your path

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 I'm a business expert

Compliance officer, risk analyst, or policy author. You want rules in **your** language, with AI helping you write the first draft.

→ [**Start free on Cloud**](https://aster-lang.cloud)
→ [Read: CNL Quick Reference](/learn/cnl-quick-reference)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 I'm an engineer

You want to write CNL rules and run them. Start in the browser playground; integrate via `@aster-cloud/aster-lang-ts`. Need a managed engine? Aster Cloud has hosted REST / GraphQL / WS.

→ [**Try in Playground**](/learn/playground)
→ [Browser SDK Guide](/learn/browser-api)
→ [Cloud API Docs ↗](https://aster-lang.cloud/docs/api/policies/evaluate)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 I'm an IT decision-maker

You need data sovereignty, GDPR/PII controls, and a clear deployment path. Self-hosted is a first-class option.

→ [Deployment Guide](/learn/deployment-guide)
→ [Compliance Resources](/community/compliance/)
→ [Talk to sales](mailto:hello@aster-lang.dev)

</div>

</div>

---

## What is Aster Lang?

Aster Lang is a **multi-lingual Controlled Natural Language (CNL)** for writing executable business logic — loan-eligibility policies, approval-gate workflows, routing decisions, pricing rules, and anything else where the rule should be **readable by humans and runnable by machines**.

The language treats **policies**, **workflows**, and **decisions** as first-class concepts: the same syntax expresses an eligibility check, an approval flow, or a routing rule. The engine compiles all three to the same audit-grade execution path.

```aster
Module aster.finance.loan.

Define Applicant has creditScore as Int, annualIncome as Int.

Rule evaluateLoanEligibility given applicant as Applicant, produce Text:
  If applicant.creditScore at least 700
    If applicant.annualIncome at least 50000
      Return "approved".
  Return "rejected".
```

The same rule works in 中文:

```aster ignore
模块 aster.finance.loan。

定义 申请人 包含 信用分 as 整数，年收入 as 整数。

规则 evaluateLoanEligibility 给定 申请人 as 申请人，产出 文本：
  如果 申请人.信用分 至少 700
    如果 申请人.年收入 至少 50000
      返回 "已批准"。
  返回 "已拒绝"。
```

Both are parsed, type-checked, and executed by the **same engine**.

---

## Why we built it

Business rules live in three places today:

1. **Buried in code** — only engineers can change them; legal can't read them.
2. **In Excel/Word** — readable but never executed; drift is guaranteed.
3. **In low-code tools** — readable to no one and executable in only one vendor's runtime.

Aster Lang is the fourth option: **rules that read like a memo and run like compiled code**.

---

## Who's using it

> 🚧 Customer stories coming soon. [Reach out](mailto:hello@aster-lang.dev) if you'd like to be featured.

---

## Open source & community

- [**aster-lang-ts**](https://github.com/aster-cloud/aster-lang-ts) — TypeScript compiler & LSP (npm: `@aster-cloud/aster-lang-ts`)
- [**aster-lang-core**](https://github.com/aster-cloud/aster-lang-core) — Java/ANTLR reference compiler
- [**Language packs**](https://github.com/aster-cloud) — `aster-lang-en` / `-zh` / `-de`

Found a bug? Open an issue. Want to add a language? See the lexicon pack guide.

</div>
