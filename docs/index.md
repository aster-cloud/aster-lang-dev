---
layout: home

hero:
  name: "Aster Lang API"
  text: "Policy Engine REST API & Developer Documentation"
  tagline: "Evaluate business policies written in natural language via a simple REST API"
  actions:
    - theme: brand
      text: Quick Start
      link: /getting-started/quickstart
    - theme: alt
      text: API Reference
      link: /api/policies/evaluate

features:
  - title: Policy Evaluation
    details: Evaluate CNL (Controlled Natural Language) policies via REST, GraphQL, or WebSocket. Submit policy source inline or reference a stored policy by ID. Supports batch evaluation for high-throughput workloads.
    icon: ⚡

  - title: Audit & Compliance
    details: Every evaluation produces a tamper-evident audit record with SHA-256 hash chaining. Administrators can verify the integrity of the full audit log at any time, satisfying regulatory and compliance requirements.
    icon: 🔒

  - title: Multi-tenant
    details: Built-in tenant isolation ensures each organisation's policies and audit records are fully separated. Role-Based Access Control (RBAC) with HMAC request signing protects every endpoint.
    icon: 🏢
---
