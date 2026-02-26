---
layout: home

hero:
  name: "Aster Lang API"
  text: "Policy Engine REST API & Entwicklerdokumentation"
  tagline: "Evaluieren Sie in natürlicher Sprache geschriebene Geschäftsrichtlinien über eine einfache REST-API"
  actions:
    - theme: brand
      text: Schnellstart
      link: /de/getting-started/quickstart
    - theme: alt
      text: API-Referenz
      link: /api/policies/evaluate

features:
  - title: Richtlinien-Evaluierung
    details: Evaluieren Sie CNL-Richtlinien (Controlled Natural Language) über REST, GraphQL oder WebSocket. Übermitteln Sie Richtlinienquellcode inline oder referenzieren Sie eine gespeicherte Richtlinie per ID. Unterstützt Batch-Evaluierung für hohe Durchsatzanforderungen.
    icon: ⚡

  - title: Audit & Compliance
    details: Jede Evaluierung erzeugt einen manipulationssicheren Audit-Datensatz mit SHA-256-Hash-Verkettung. Administratoren können die Integrität des vollständigen Audit-Protokolls jederzeit überprüfen und regulatorische sowie Compliance-Anforderungen erfüllen.
    icon: 🔒

  - title: Mandantenfähig
    details: Integrierte Mandantenisolierung stellt sicher, dass Richtlinien und Audit-Datensätze jeder Organisation vollständig getrennt sind. Rollenbasierte Zugriffskontrolle (RBAC) mit HMAC-Anfragensignierung schützt jeden Endpunkt.
    icon: 🏢
---
