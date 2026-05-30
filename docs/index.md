---
layout: home

hero:
  name: "Aster Lang"
  text: "Policy-as-Code in Plain English (and 中文 · Deutsch)"
  tagline: "Let business experts write executable rules in their own language. AI drafts. Engines run. Auditors trust."
  image:
    src: /logo.svg
    alt: Aster Lang
  actions:
    - theme: brand
      text: Try in Playground
      link: /learn/playground
    - theme: alt
      text: 5-Minute Quick Start
      link: /getting-started/quickstart
    - theme: alt
      text: API Reference
      link: /api/policies/evaluate

features:
  - title: 🌍 Write rules in your own language
    details: English, Simplified Chinese, and German are first-class citizens — same semantics, same engine. Adding a new language is a configuration task, not an engineering one.

  - title: 🤖 AI drafts. You review.
    details: Built-in LLM assistance generates rule drafts from plain prompts, explains existing rules, and auto-repairs syntax errors. Streaming over SSE, validated before suggested.

  - title: ⚡ Production-grade execution
    details: Java + GraalVM Truffle interpreter for high-throughput evaluation. Native Image builds boot in milliseconds. P99 latency under 200ms.

  - title: 🔒 Tamper-evident audit
    details: Every policy evaluation is recorded in the engine's tamper-evident AuditLog, hash-chained with SHA-256. Verify any chain via GET /api/v1/audit/verify-chain?start=…&end=…. Replay any historical decision deterministically — clocks and UUIDs are controlled at runtime.

  - title: 🏢 SaaS or self-hosted
    details: Use aster-lang.cloud for managed multi-tenant, or deploy to your own K3S cluster via ArgoCD GitOps. Your data, your jurisdiction.

  - title: 🧰 Drop-in via REST, GraphQL, or WebSocket
    details: Submit policy source inline or reference a stored policy by ID. Batch evaluate. Stream traces. RBAC + HMAC signing on every endpoint.
---

<div class="vp-doc" style="max-width: 960px; margin: 4rem auto; padding: 0 24px;">

## Choose your path

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 I'm a business expert

Compliance officer, risk analyst, or policy author. You want rules in **your** language, with AI helping you write the first draft.

→ [**Open the SaaS**](https://aster-lang.cloud)
→ [Read: CNL Quick Reference](/learn/cnl-quick-reference)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 I'm an engineer

You want to integrate policy evaluation into your service. REST in 5 minutes, GraphQL/WS for advanced flows.

→ [**5-Minute Quick Start**](/getting-started/quickstart)
→ [REST API Reference](/api/policies/evaluate)
→ [GraphQL Schema](/graphql/overview)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 I'm an IT decision-maker

You need data sovereignty, GDPR/PII controls, and a clear deployment path. Self-hosted is a first-class option.

→ [Deployment Guide](/learn/deployment-guide)
→ [Authentication & RBAC](/getting-started/authentication)
→ [Talk to us](mailto:hello@aster-lang.dev)

</div>

</div>

---

## What is Aster Lang?

Aster Lang is a **multi-lingual Controlled Natural Language (CNL)** for writing executable business policies — loan eligibility, insurance underwriting, GDPR data access, fraud rules, and anything else where the rule should be **readable by humans and runnable by machines**.

```aster
Module aster.finance.loan.

Rule evaluateLoanEligibility given applicant:
    If applicant.creditScore is at least 700
    and applicant.annualIncome is at least 50000:
        Return approved.
    Otherwise:
        Return rejected.
```

The same rule works in 中文:

```aster
模块 aster.finance.loan。

规则 evaluateLoanEligibility 给定 申请人：
    如果 申请人.信用分 不低于 700
    并且 申请人.年收入 不低于 50000：
        返回 已批准。
    否则：
        返回 已拒绝。
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

- [**aster-lang-ts**](https://github.com/aster-lang/aster-lang-ts) — TypeScript compiler & LSP (npm: `@aster-cloud/aster-lang-ts`)
- [**aster-lang-core**](https://github.com/aster-lang/aster-lang-core) — Java/ANTLR reference compiler
- [**Language packs**](https://github.com/aster-lang) — `aster-lang-en` / `-zh` / `-de`

Found a bug? Open an issue. Want to add a language? See the lexicon pack guide.

</div>
