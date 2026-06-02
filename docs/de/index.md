---
layout: home
# VPFooter ausblenden (auf home übernimmt DevFooter via CustomLayout layout-bottom slot)
footer: false

hero:
  name: "Eine Open-Source Controlled Natural Language"
  text: "für Policy as Code"
  tagline: "Kompilieren Sie Regeln, geschrieben in English, 中文 oder Deutsch, in dieselbe audit-feste Engine. Zwei Referenzimplementierungen (Java/ANTLR + TypeScript/PEG), bei jedem Commit gegeneinander verifiziert. Lexicon Packs sind sofort verfügbar — eine vierte Sprache hinzufügen heißt eine Konfigurationsdatei schreiben. Integration via REST, GraphQL oder WebSocket. Apache-2.0 lizenziert."
  # Lang-Positionierung (KEINE Spiegelung von aster-lang.cloud)
  # Cloud verkauft Hosting + KI; Lang verkauft die Sprache selbst: die
  # CNL-Spezifikation, die dualen Compiler-Implementierungen, das
  # Lexicon-System und die Integrationsfläche.
  # Kein image: — Hero-Text nimmt die volle Spaltenbreite ein, HeroAnimation rendert mittig unter den CTAs (cloud-aligned)
  actions:
    - theme: brand
      text: Im Playground starten
      link: /de/learn/playground
    - theme: alt
      text: 5-Minuten-Schnellstart
      link: /de/getting-started/quickstart
---

<div class="vp-doc" style="max-width: 960px; margin: 4rem auto; padding: 0 24px;">

## Wählen Sie Ihren Weg

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 24px;">

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 Ich bin Fachexperte

Compliance-Beauftragter, Risikoanalyst oder Policy-Autor. Sie möchten Regeln in **Ihrer** Sprache schreiben — mit KI, die den ersten Entwurf erstellt.

→ [**Kostenlos auf Cloud starten**](https://aster-lang.cloud)
→ [Lesen: CNL-Schnellreferenz](/de/learn/cnl-quick-reference)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 Ich bin Entwickler

Sie möchten Policy-Evaluierung in Ihren Service integrieren. REST in 5 Minuten, GraphQL/WS für komplexere Workflows.

→ [**5-Minuten-Schnellstart**](/de/getting-started/quickstart)
→ [REST-API-Referenz](/api/policies/evaluate)
→ [GraphQL Schema](/graphql/overview)

</div>

<div style="border: 1px solid var(--vp-c-divider); border-radius: 12px; padding: 24px;">

### 👤 Ich bin IT-Entscheider

Sie brauchen Datenhoheit, GDPR/PII-Kontrollen und einen klaren Deployment-Pfad. Self-Hosting ist eine erstklassige Option.

→ [Deployment-Leitfaden](/de/learn/deployment-guide)
→ [Authentifizierung & RBAC](/de/getting-started/authentication)
→ [Vertrieb kontaktieren](mailto:sales@aster-lang.cloud)

</div>

</div>

---

## Was ist Aster Lang?

Aster Lang ist eine **mehrsprachige Controlled Natural Language (CNL)** zum Schreiben ausführbarer Geschäftsregeln — Kreditwürdigkeitsprüfung, Versicherungsbewertung, GDPR-Datenzugriff, Betrugsregeln und alles andere, wo Regeln **für Menschen lesbar und für Maschinen ausführbar** sein sollen.

```aster
Module aster.finance.loan.

Rule evaluateLoanEligibility given applicant:
    If applicant.creditScore is at least 700
    and applicant.annualIncome is at least 50000:
        Return approved.
    Otherwise:
        Return rejected.
```

Dieselbe Regel funktioniert auch auf Chinesisch:

```aster
模块 aster.finance.loan。

规则 evaluateLoanEligibility 给定 申请人：
    如果 申请人.信用分 不低于 700
    并且 申请人.年收入 不低于 50000：
        返回 已批准。
    否则：
        返回 已拒绝。
```

Beide werden von **derselben Engine** geparst, typgeprüft und ausgeführt.

---

## Warum wir das gebaut haben

Geschäftsregeln liegen heute an drei Orten:

1. **Im Code vergraben** — nur Entwickler können sie ändern; die Rechtsabteilung kann sie nicht lesen.
2. **In Excel/Word** — lesbar, aber nie ausgeführt; Drift ist garantiert.
3. **In Low-Code-Tools** — für niemanden lesbar und nur in der Runtime eines einzigen Anbieters ausführbar.

Aster Lang ist die vierte Option: **Regeln, die sich wie ein Memo lesen und wie kompilierter Code laufen**.

---

## Wer es einsetzt

> 🚧 Kundenstories folgen in Kürze. [Melden Sie sich](mailto:hello@aster-lang.dev), wenn Sie hier erscheinen möchten.

---

## Open Source & Community

- [**aster-lang-ts**](https://github.com/aster-lang/aster-lang-ts) — TypeScript-Compiler & LSP (npm: `@aster-cloud/aster-lang-ts`)
- [**aster-lang-core**](https://github.com/aster-lang/aster-lang-core) — Java/ANTLR-Referenzcompiler
- [**Language packs**](https://github.com/aster-lang) — `aster-lang-en` / `-zh` / `-de`

Bug gefunden? Issue eröffnen. Neue Sprache hinzufügen? Siehe Lexicon-Pack-Leitfaden.

</div>
