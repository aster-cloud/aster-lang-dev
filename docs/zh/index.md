---
layout: home

hero:
  name: "Aster Lang API"
  text: "策略引擎 REST API 与开发者文档"
  tagline: "通过简单的 REST API 评估以自然语言编写的业务策略"
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/getting-started/quickstart
    - theme: alt
      text: API 参考
      link: /api/policies/evaluate

features:
  - title: 策略评估
    details: 通过 REST、GraphQL 或 WebSocket 评估 CNL（受控自然语言）策略。支持内联提交策略源码或通过 ID 引用已存储的策略。支持批量评估以实现高吞吐量工作负载。
    icon: ⚡

  - title: 审计与合规
    details: 每次评估都会生成防篡改的审计记录，采用 SHA-256 哈希链。管理员可以随时验证完整审计日志的完整性，满足监管和合规要求。
    icon: 🔒

  - title: 多租户
    details: 内置租户隔离，确保每个组织的策略和审计记录完全分离。基于角色的访问控制（RBAC）与 HMAC 请求签名保护每个端点。
    icon: 🏢
---
