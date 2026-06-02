---
title: Editionen vergleichen
description: Wählen Sie zwischen Aster Lang Open Source, Aster Lang Cloud (managed SaaS) und Aster Lang Enterprise (selbst gehostet).
---

# Editionen vergleichen

Aster Lang ist in drei Editionen verfügbar. Alle drei nutzen **dieselbe Engine und dieselbe Sprache** — der Unterschied liegt darin, wer den Betrieb übernimmt und wo die Daten liegen.

::: tip Preise
Für Self-Service-Teams bietet Cloud Free- und Pro-Pläne mit öffentlicher Preisliste unter **[aster-lang.cloud/pricing](https://aster-lang.cloud/pricing)**. Enterprise (selbst gehostet) richtet sich nach Mandantengröße, Auswertungsvolumen und Datenresidenz — **[Vertrieb sprechen](mailto:sales@aster-lang.cloud)** für ein Angebot.
:::

## Auf einen Blick

| | Open Source | Cloud (SaaS) | Enterprise (Self-Hosted) |
|---|---|---|---|
| **Wer betreibt es** | Sie — lokal oder in eigener Infrastruktur | Wir — auf `aster-lang.cloud` | Sie — in Ihrer VPC / Ihrem Cluster |
| **Lizenz** | Apache-2.0 | Abonnement | Abonnement + dauerhaftes Fallback |
| **Geeignet für** | Bauen, Lernen, Parser einbetten | Teams, die Managed-SaaS wollen | Regulierte Branchen, Datenresidenz, Air-Gap |
| **Einstieg** | `npm i @aster-cloud/aster-lang-ts` | [aster-lang.cloud](https://aster-lang.cloud) | [Vertrieb kontaktieren](mailto:sales@aster-lang.cloud) |

## Funktionsvergleich

### Sprache & Engine

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Mehrsprachige CNL (English / 中文 / Deutsch) | ✅ | ✅ | ✅ |
| Java/Truffle-Referenz-Engine | ✅ | ✅ | ✅ |
| TypeScript-Engine für Browser/Node | ✅ | ✅ | ✅ |
| LSP / VS-Code-Extension | ✅ | ✅ | ✅ |
| Eigene Sprachpakete | ✅ | ✅ | ✅ |

### Policy-Ausführung

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| REST `/evaluate` | selbst hosten | ✅ | ✅ |
| GraphQL | selbst hosten | ✅ | ✅ |
| WebSocket-Streaming | selbst hosten | ✅ | ✅ |
| Batch-Auswertung | selbst hosten | ✅ | ✅ |
| Decision Trace (`?trace=true`) | ✅ | ✅ | ✅ |

### KI-Unterstützung

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| KI-Policy-Entwurf (SSE-Streaming) | eigener Key | ✅ | eigener Key / On-Prem-LLM |
| KI-Policy-Erklärung | eigener Key | ✅ | eigener Key / On-Prem-LLM |
| Compile-Validate-Schleife | ✅ | ✅ | ✅ |

### Governance & Audit

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Hash-verketteter Audit-Log (SHA-256) | ✅ | ✅ | ✅ |
| Deterministische historische Wiedergabe | ✅ | ✅ | ✅ |
| Mandanten-Isolation | n/a | ✅ | ✅ |
| RBAC (admin / author / reviewer / viewer) | selbst implementieren | ✅ | ✅ |
| HMAC-Request-Signatur | ✅ | ✅ | ✅ |

### Betrieb

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| SLA | Community | 99,9 % (Ziel) | vertraglich |
| Multi-Region-Failover | n/a | ✅ | kundendefiniert |
| Air-Gap-Deployment | ✅ | ❌ | ✅ |
| Kubernetes (K3S) GitOps via ArgoCD | ✅ | ✅ (verwaltet) | ✅ |
| Helm-Chart | ✅ | n/a | ✅ |
| Native Image (Sub-Sekunden-Boot) | ✅ | ✅ | ✅ |

### Compliance & Datenresidenz

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Ihr Code bleibt unter Ihrer Lizenz | ✅ Apache-2.0 | ✅ | ✅ |
| Auftragsverarbeitungsvertrag (AVV/DPA) | n/a | [öffentliche Vorlage](/community/compliance/dpa-template) | individuell |
| DSAR / Recht auf Vergessenwerden | n/a | ✅ | ✅ |
| Telemetrie-Transparenz | [Doku](/community/compliance/telemetry-fields) | [Doku](/community/compliance/telemetry-fields) | [Doku](/community/compliance/telemetry-fields) + Kundenschalter |
| Datenresidenz | je nach Deployment | EU / US / APAC | Ihre Jurisdiktion |
| SOC 2 / ISO 27001 | n/a | in Planung | vom Kunden vererbbar |

### Support

| | Open Source | Cloud | Enterprise |
|---|:---:|:---:|:---:|
| Community (GitHub Issues, Discord) | ✅ | ✅ | ✅ |
| E-Mail-Support zu Geschäftszeiten | n/a | ✅ | ✅ |
| 24×7-Incident-Kanal | n/a | Zusatzoption | ✅ |
| Onboarding & Schulung | nur Doku | Doku + Chat | dedizierter Engineer |
| Eigene Sprachpaket-Entwicklung | DIY | DIY | enthalten |

## Welche Edition passt zu Ihnen?

<div class="vp-doc">

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 🛠 Open Source

Sie sind Entwickler, evaluieren die Sprache, betten den Parser in Ihr Produkt ein oder betreiben Policies eines Teams in eigener Infrastruktur.

- Apache-2.0 — forken, ausliefern, weiterverkaufen
- `npm install @aster-cloud/aster-lang-ts` für den Compiler
- API-Server aus diesem Repo selbst betreiben

→ [Im Playground starten](/de/learn/playground)
→ [5-Minuten-Schnellstart](/de/getting-started/quickstart)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### ☁️ Cloud (SaaS)

Sie wollen den Managed-Komfort — mehrmandantenfähig, KI-Unterstützung, gehostetes Audit — ohne Kubernetes selbst zu betreiben.

- Registrieren, Regel einfügen, Evaluate drücken
- KI-Entwurf & -Erklärung integriert
- Hash-verketteter Audit-Log ab Werk
- [Eigene Domänenvokabulare](https://aster-lang.cloud/domain-vocabularies) — Free: keine · Pro: 5.000 Begriffe · Enterprise: unbegrenzt

→ [**Kostenlos auf aster-lang.cloud starten →**](https://aster-lang.cloud)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 🏢 Enterprise (Self-Hosted)

Sie sind in einer regulierten Branche — Finanzen, Gesundheit, öffentlicher Sektor — oder Datenresidenz ist nicht verhandelbar.

- Betrieb in Ihrer VPC, Ihrem K3S, Ihrem Air-Gap-Cluster
- Erbt Ihre vorhandenen SOC 2 / ISO 27001 Kontrollen
- Individueller AVV + 24×7-Incident-Kanal

→ [Enterprise-Übersicht](/community/compliance/)
→ [Vertrieb sprechen](mailto:sales@aster-lang.cloud)

</div>

</div>

</div>

## Häufige Fragen

**Ist die Engine in allen drei Editionen identisch?**
Ja. Die Java/Truffle-Referenz-Engine und die TypeScript-Engine sind beide Open Source. Cloud und Enterprise ergänzen Betrieb, Governance und Support — nicht die Sprache.

**Kann ich später von Cloud auf Enterprise wechseln?**
Ja. Policies sind portabler Klartext-Quellcode; Audit-Ketten lassen sich als JSONL exportieren.

**Gibt es eine Evaluierungs- / PoC-Lizenz?**
Für Enterprise üblich 30 Tage Evaluation mit Engineering-Support. [E-Mail an uns](mailto:sales@aster-lang.cloud) mit Ihrem Anwendungsfall.

**Und die Preise?**
[Sprechen Sie mit uns](mailto:sales@aster-lang.cloud) — Bepreisung nach Auswertungsvolumen, Mandanten und Residenzanforderungen. Open Source bleibt unter Apache-2.0 kostenlos.

---

[**Zu aster-lang.cloud →**](https://aster-lang.cloud) &nbsp; · &nbsp; [Vertrieb kontaktieren](mailto:sales@aster-lang.cloud)
