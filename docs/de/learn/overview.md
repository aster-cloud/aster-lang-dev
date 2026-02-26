---
outline: deep
---

# Aster Lang lernen

Aster CNL (Controlled Natural Language) ist eine speziell entwickelte Sprache zur Formulierung von Geschäftsregeln in lesbaren, auditierbaren Sätzen. In Aster CNL geschriebene Richtlinien kompilieren zu einer deterministischen Kerndarstellung, die über REST API, GraphQL, WebSocket oder direkt im Browser evaluiert werden kann.

Dieser Abschnitt deckt alles ab, was Sie vom ersten Kontakt bis zur Produktionsbereitstellung benötigen.

## Was ist Aster CNL?

Aster CNL liegt zwischen reinem Englisch und traditionellen Programmiersprachen. Es ist restriktiv genug, damit eine Maschine es eindeutig parsen kann, und gleichzeitig natürlich genug, damit Domänenexperten — Versicherer, Compliance-Beauftragte, Produktmanager — es ohne Entwicklerunterstützung lesen und verfassen können.

Eine minimale Richtlinie sieht so aus:

```
Module pricing.

Rule discountedPrice given amount as Int, tier as Text, produce Int:
  If tier is "gold"
    Return amount times 80 divided by 100.
  Return amount.
```

Schlüsseleigenschaften von Aster CNL:

- **Deterministisch** — dieselbe Eingabe erzeugt immer dieselbe Ausgabe ohne Seiteneffekte.
- **Typisiert** — jeder Parameter und Rückgabewert trägt einen expliziten Typ (`Int`, `Float`, `Text`, `Bool`, `DateTime` oder eine benutzerdefinierte Struktur).
- **Mehrsprachig** — Richtlinien können in Englisch (`EN_US`), vereinfachtem Chinesisch (`ZH_CN`) oder Deutsch (`DE_DE`) mit lokalisierten Schlüsselwörtern verfasst werden.
- **Auditierbar** — die Engine zeichnet eine manipulationssichere Entscheidungsverfolgung für jede Evaluierung auf.

## Wo anfangen

| Ziel | Seite |
|------|------|
| Aster CNL jetzt im Browser ausprobieren | [Spielplatz](./playground) |
| Die vollständige Syntax mit Beispielen lernen | [CNL-Kurzreferenz](./cnl-quick-reference) |
| Richtlinien in JavaScript/TypeScript kompilieren und validieren | [Browser-API-Referenz](./browser-api) |
| Richtlinien zur Engine bereitstellen und im großen Maßstab aufrufen | [Bereitstellungsanleitung](./deployment-guide) |

## Wie Aster CNL zusammenpasst

```
                                 +------------------+
  Richtlinie verfassen (CNL) --->|  Browser-API     |  <--- validieren, Schema extrahieren,
                                 |  (aster-lang-ts)  |       Beispiel-Eingaben generieren
                                 +--------+---------+
                                          |
                                    Quellcode bereitstellen
                                          |
                                          v
                                 +------------------+
                                 |  REST API        |  <--- Richtlinien evaluieren,
                                 |  (aster-api)     |       Versionen verwalten, auditieren
                                 +------------------+
```

1. **Verfassen** — Schreiben Sie Richtlinien in Aster CNL mit dem Spielplatz oder einem beliebigen Texteditor.
2. **Validieren** — Verwenden Sie die Browser-API oder den Spielplatz, um Syntaxfehler vor der Bereitstellung zu erkennen.
3. **Bereitstellen** — Übermitteln Sie den Richtlinienquellcode an die REST API. Die Engine kompiliert und speichert ihn.
4. **Evaluieren** — Rufen Sie die bereitgestellte Richtlinie mit Eingabedaten auf. Die Engine gibt ein typisiertes Ergebnis und einen Audit-Datensatz zurück.
5. **Überwachen** — Fragen Sie Versionshistorie, Audit-Protokolle und Anomalie-Erkennungsendpunkte ab, um die Compliance aufrechtzuerhalten.

## Mehrsprachige Unterstützung

Aster CNL ist nicht nur auf Englisch beschränkt. Dieselbe logische Richtlinie kann in jeder unterstützten Locale ausgedrückt werden:

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

Die Browser-API und REST API akzeptieren einen `locale`- oder `lexicon`-Parameter, der dem Compiler mitteilt, welchen Schlüsselwortsatz er verwenden soll. Alle Locales kompilieren zur selben Kerndarstellung.

## Nächste Schritte

- [Spielplatz](./playground) — experimentieren Sie mit Live-Kompilierung und Schema-Extraktion.
- [CNL-Kurzreferenz](./cnl-quick-reference) — die vollständige Syntax auf einer Seite.
- [Browser-API-Referenz](./browser-api) — integrieren Sie Aster CNL in Ihr Frontend oder Node.js-Tooling.
- [Bereitstellungsanleitung](./deployment-guide) — bringen Sie eine Richtlinie vom Quellcode in die Produktion.
