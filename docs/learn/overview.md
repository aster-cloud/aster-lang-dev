---
outline: deep
---

# Learn Aster Lang

Aster CNL (Controlled Natural Language) is a purpose-built language for expressing business rules in readable, auditable sentences. Policies written in Aster CNL compile to a deterministic core representation that can be evaluated via REST API, GraphQL, WebSocket, or directly in the browser.

This section covers everything you need to go from first contact to production deployment.

## What is Aster CNL?

Aster CNL sits between plain English and traditional programming languages. It is restrictive enough for a machine to parse unambiguously, yet natural enough for domain experts -- underwriters, compliance officers, product managers -- to read and author without developer assistance.

A minimal policy looks like this:

```
Module pricing.

Rule discountedPrice given amount as Int, tier as Text, produce Int:
  If tier is "gold"
    Return amount times 80 divided by 100.
  Return amount.
```

Key properties of Aster CNL:

- **Deterministic** -- the same input always produces the same output with no side effects.
- **Typed** -- every parameter and return value carries an explicit type (`Int`, `Float`, `Text`, `Bool`, `DateTime`, or a user-defined struct).
- **Multi-language** -- policies can be authored in English (`EN_US`), Simplified Chinese (`ZH_CN`), or German (`DE_DE`) using localized keywords.
- **Auditable** -- the engine records a tamper-evident decision trace for every evaluation.

## Where to Start

| Goal | Page |
|------|------|
| Try Aster CNL in your browser right now | [Playground](./playground) |
| Learn the full syntax with examples | [CNL Quick Reference](./cnl-quick-reference) |
| Compile and validate policies in JavaScript/TypeScript | [Browser API Reference](./browser-api) |
| Deploy policies to the engine and call them at scale | [Deployment Guide](./deployment-guide) |

## How Aster CNL Fits Together

```
                                 +------------------+
  Author a policy (CNL)   --->   |  Browser API     |  <--- validate, extract schema,
                                 |  (aster-lang-ts)  |       generate sample inputs
                                 +--------+---------+
                                          |
                                    deploy source
                                          |
                                          v
                                 +------------------+
                                 |  REST API        |  <--- evaluate policies,
                                 |  (aster-api)     |       manage versions, audit
                                 +------------------+
```

1. **Author** -- write policies in Aster CNL using the playground or any text editor.
2. **Validate** -- use the Browser API or the playground to catch syntax errors before deployment.
3. **Deploy** -- submit the policy source to the REST API. The engine compiles and stores it.
4. **Evaluate** -- call the deployed policy with input data. The engine returns a typed result and an audit record.
5. **Monitor** -- query version history, audit logs, and anomaly detection endpoints to maintain compliance.

## Multi-Language Support

Aster CNL is not English-only. The same logical policy can be expressed in any supported locale:

::: code-group

```txt [English (EN_US)]
Module pricing.

Rule discountedPrice given amount as Int, produce Int:
  If amount greater than 100
    Return amount times 90 divided by 100.
  Return amount.
```

```txt [Chinese (ZH_CN)]
模块 定价。

规则 折扣价格 给定 金额 为 整数，产出 整数：
  如果 金额 大于 100
    返回 金额 乘 90 除以 100。
  返回 金额。
```

```txt [German (DE_DE)]
Modul Preisgestaltung.

Regel rabattPreis gegeben betrag als Ganzzahl, liefert Ganzzahl:
  wenn betrag groesser als 100
    gib zurueck betrag mal 90 geteilt durch 100.
  gib zurueck betrag.
```

:::

The Browser API and REST API accept a `locale` or `lexicon` parameter that tells the compiler which keyword set to use. All locales compile to the same core representation.

## Next Steps

- [Playground](./playground) -- experiment with live compilation and schema extraction.
- [CNL Quick Reference](./cnl-quick-reference) -- the complete syntax in one page.
- [Browser API Reference](./browser-api) -- integrate Aster CNL into your frontend or Node.js tooling.
- [Deployment Guide](./deployment-guide) -- take a policy from source to production.
