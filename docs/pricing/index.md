---
title: Compare Editions
description: Choose between Aster Lang Open Source, Aster Lang Cloud (managed SaaS), and Aster Lang Enterprise (self-hosted).
---

# Compare Editions

Aster Lang ships in three editions. All three run the **same engine and the same language** — what differs is who operates the infrastructure and where the data lives.

::: tip Pricing
For self-serve teams, Cloud offers Free and Pro plans with public pricing at **[aster-lang.cloud/pricing](https://aster-lang.cloud/pricing)**. Enterprise (self-hosted) pricing depends on tenancy size, evaluation volume, and data residency — **[talk to sales](mailto:hello@aster-lang.dev)** for a quote.
:::

## At a glance

| | Open Source | Cloud (SaaS) | Enterprise (Self-Hosted) |
|---|---|---|---|
| **Who runs it** | You — on your machine | We — at `aster-lang.cloud` | You — in your VPC/cluster |
| **License** | Apache-2.0 | Subscription | Subscription + perpetual fallback |
| **Best for** | Building, learning, embedding the parser | Teams who want managed multi-tenant | Regulated industries, data residency, air-gapped |
| **Get started** | `npm i @aster-cloud/aster-lang-ts` | [aster-lang.cloud](https://aster-lang.cloud) | [Contact sales](mailto:hello@aster-lang.dev) |

## Feature comparison

### Language & engine

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Multi-language CNL (English / 中文 / Deutsch) | ✅ | ✅ | ✅ |
| Java/Truffle reference engine | ✅ | ✅ | ✅ |
| TypeScript engine for browser/Node | ✅ | ✅ | ✅ |
| LSP / VS Code extension | ✅ | ✅ | ✅ |
| Custom language pack authoring | ✅ | ✅ | ✅ |

### Policy execution

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| REST `/evaluate` endpoint | self-host | ✅ | ✅ |
| GraphQL endpoint | self-host | ✅ | ✅ |
| WebSocket streaming | self-host | ✅ | ✅ |
| Batch evaluation | self-host | ✅ | ✅ |
| Decision trace (`?trace=true`) | ✅ | ✅ | ✅ |

### AI assistance

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| AI policy drafting (SSE streaming) | BYO key | ✅ | BYO key / on-prem LLM |
| AI policy explanation | BYO key | ✅ | BYO key / on-prem LLM |
| Compile-validate loop | ✅ | ✅ | ✅ |

### Governance & audit

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Hash-chained audit log (SHA-256) | ✅ | ✅ | ✅ |
| Deterministic replay (any historical decision) | ✅ | ✅ | ✅ |
| Tenant isolation | n/a | ✅ | ✅ |
| RBAC (admin / author / reviewer / viewer) | self-implement | ✅ | ✅ |
| HMAC request signing | ✅ | ✅ | ✅ |

### Operations

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| SLA | community | 99.9% (target) | contractual |
| Multi-region failover | n/a | ✅ | customer-defined |
| Air-gapped deployment | ✅ | ❌ | ✅ |
| Kubernetes (K3S) GitOps via ArgoCD | ✅ | ✅ (managed) | ✅ |
| Helm chart | ✅ | n/a | ✅ |
| Native Image build (sub-second boot) | ✅ | ✅ | ✅ |

### Compliance & data residency

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Your code stays under your license | ✅ Apache-2.0 | ✅ | ✅ |
| Data Processing Agreement (DPA) | n/a | [public template](/enterprise/dpa-template) | bespoke |
| DSAR / right-to-be-forgotten | n/a | ✅ | ✅ |
| Telemetry transparency | [docs](/enterprise/telemetry-fields) | [docs](/enterprise/telemetry-fields) | [docs](/enterprise/telemetry-fields) + customer toggles |
| Data residency choice | wherever you deploy | EU / US / APAC pools | your jurisdiction |
| SOC 2 / ISO 27001 | n/a | on the roadmap | inheritable from customer |

### Support

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Community (GitHub Issues, Discord) | ✅ | ✅ | ✅ |
| Business-hour email support | n/a | ✅ | ✅ |
| 24×7 incident channel | n/a | add-on | ✅ |
| Onboarding & training | docs only | docs + chat | dedicated engineer |
| Custom language-pack engineering | DIY | DIY | included |

## Which edition fits you?

<div class="vp-doc">

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 🛠 Open Source

You're a developer evaluating the language, embedding the parser in your own product, or running a single team's policies on your own infrastructure.

- Apache-2.0 — fork it, ship it, sell on top of it
- `npm install @aster-cloud/aster-lang-ts` to get the compiler
- Self-host the API server from this repo

→ [Start in the Playground](/learn/playground)
→ [5-Minute Quick Start](/getting-started/quickstart)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### ☁️ Cloud (SaaS)

You want the managed experience — multi-tenant, AI assistance, hosted audit trail — without operating Kubernetes yourself.

- Sign up, paste a rule, hit Evaluate
- Built-in AI drafting & explanation
- Hash-chained audit log out of the box

→ [**Open aster-lang.cloud →**](https://aster-lang.cloud)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 🏢 Enterprise (Self-Hosted)

You're in a regulated industry — finance, healthcare, government, or anywhere data residency is non-negotiable.

- Runs in your VPC, your K3S, your air-gapped cluster
- Inherit your existing SOC 2 / ISO 27001 controls
- Bespoke DPA + 24×7 incident channel

→ [Read the Enterprise overview](/enterprise/)
→ [Talk to us](mailto:hello@aster-lang.dev)

</div>

</div>

</div>

## Frequently asked

**Is the engine the same in all three editions?**
Yes. The Java/Truffle reference engine and the TypeScript engine are both open source. Cloud and Enterprise add operations, governance, and support — not language features.

**Can I move from Cloud to Enterprise later?**
Yes. Policies are portable plain-text source; audit chains export as JSONL.

**Do you offer an evaluation / proof-of-concept license?**
For Enterprise, yes — typically 30 days with engineering support. [Email us](mailto:hello@aster-lang.dev) with your use case.

**What about pricing?**
[Talk to us](mailto:hello@aster-lang.dev) — we'll size based on evaluation volume, tenants, and residency requirements. Open Source remains free under Apache-2.0.

---

[**Open aster-lang.cloud →**](https://aster-lang.cloud) &nbsp; · &nbsp; [Contact sales](mailto:hello@aster-lang.dev)
