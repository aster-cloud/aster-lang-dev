---
outline: deep
---

# Bereitstellungsanleitung

Diese Anleitung führt durch den vollständigen Lebenszyklus einer Aster-CNL-Richtlinie: Verfassen, Validieren, Bereitstellen auf der Engine, Ausführen gegen Live-Daten und Verwalten von Versionen über die Zeit.

## Richtlinien-Lebenszyklus

```
Verfassen  -->  Validieren  -->  Bereitstellen  -->  Ausführen  -->  Überwachen
  |              |                |               |               |
  |  CNL         |  Syntax       | POST an       | POST an       | Audit-
  |  schreiben   |  prüfen       | /policies     | /evaluate     | Protokolle
  |              |                |               |               | abfragen
```

Jede Phase kann über die REST API, die Browser-API oder eine Kombination aus beiden durchgeführt werden.

## Schritt 1 — Richtlinie verfassen

Schreiben Sie Ihre Richtlinie in Aster CNL mit einem beliebigen Texteditor oder dem [Spielplatz](./playground). Eine vollständige Richtlinie umfasst eine Moduldeklaration, optionale Struct-Definitionen und eine oder mehrere Regeln.

```
Module Loan.Approval.

Define Applicant has creditScore as Int, income as Int, age as Int.

Rule isEligible given applicant as Applicant, requestedAmount as Int, produce Bool:
  If applicant.age < 18:
    produce false
  If applicant.creditScore < 650:
    produce false
  If applicant.income < requestedAmount * 3:
    produce false
  produce true
```

Speichern Sie diesen Text in einer Datei (z.B. `loan-approval.aster`) oder behalten Sie ihn als String in Ihrem Bereitstellungsskript.

## Schritt 2 — Lokal validieren

Validieren Sie die Richtlinie vor der Bereitstellung, um Syntaxfehler frühzeitig zu erkennen.

**Browser-API-Validierung:**

```js
import { validateSyntaxWithSpan, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = fs.readFileSync('loan-approval.aster', 'utf-8')
const errors = validateSyntaxWithSpan(source, EN_US)

if (errors.length > 0) {
  errors.forEach(e => {
    const loc = e.span ? ` (L${e.span.start.line}:${e.span.start.col})` : ''
    console.error(`ERROR${loc}: ${e.message}`)
  })
  process.exit(1)
}

console.log('Validation passed.')
```

## Schritt 3 — Schema extrahieren

Vor der Bereitstellung extrahieren Sie das Parameter-Schema, damit nachgelagerte Konsumenten genau wissen, welche Eingabeform bereitzustellen ist.

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies/schema \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d "{
    \"source\": $(jq -Rs . < loan-approval.aster),
    \"functionName\": \"isEligible\",
    \"locale\": \"en-US\"
  }"
```

## Schritt 4 — Richtlinie bereitstellen

Übermitteln Sie den Richtlinienquellcode an die Engine. Die Engine kompiliert, speichert und aktiviert ihn.

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d "{
    \"source\": $(jq -Rs . < loan-approval.aster),
    \"locale\": \"en-US\",
    \"notes\": \"Initial deployment of loan eligibility policy\"
  }"
```

Eine erfolgreiche Bereitstellung gibt die Richtlinien-ID und die Versionsnummer zurück:

```json
{
  "policyId": "d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a",
  "version": 1,
  "moduleName": "Loan.Approval",
  "functionName": "isEligible",
  "active": true
}
```

## Schritt 5 — Richtlinie ausführen

Nach der Bereitstellung evaluieren Sie die Richtlinie, indem Sie auf Modul und Funktionsname verweisen.

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d '{
    "policyModule": "Loan.Approval",
    "policyFunction": "isEligible",
    "context": [
      {
        "creditScore": 720,
        "income": 85000,
        "age": 34
      },
      10000
    ]
  }'
```

## Schritt 6 — Überwachen und auditieren

### Audit-Protokolle einsehen

Jede Evaluierung erzeugt einen Audit-Datensatz. Fragen Sie das Audit-Protokoll ab, um Entscheidungen zu überprüfen:

```bash
curl -s -X GET \
  "https://policy.aster-lang.dev/api/v1/audit/logs?policyModule=Loan.Approval&limit=10" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID"
```

### Hash-Ketten-Integrität überprüfen

```bash
curl -s -X POST https://policy.aster-lang.dev/api/v1/audit/verify-chain \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d '{"policyModule": "Loan.Approval"}'
```

## Versionsverwaltung

### Versionen auflisten

```bash
curl -s -X GET \
  "https://policy.aster-lang.dev/api/v1/policies/$POLICY_ID/versions" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID"
```

### Auf eine frühere Version zurücksetzen

```bash
curl -s -X POST \
  "https://policy.aster-lang.dev/api/v1/policies/$POLICY_ID/rollback" \
  -H "Authorization: Bearer $ASTER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: $ASTER_TENANT_ID" \
  -d '{
    "targetVersion": 1,
    "reason": "Version 2 incorrectly rejects applicants with income between 45000-49999"
  }'
```

Das Rollback ist atomar — nachfolgende Evaluierungsanfragen verwenden sofort die wiederhergestellte Version.

## Bereitstellungs-Checkliste

| Schritt | Befehl / Aktion | Status |
|------|------------------|--------|
| Syntaxvalidierung bestanden | `validateSyntaxWithSpan()` gibt `[]` zurück | |
| Schema stimmt mit erwartetem Vertrag überein | `extractSchema()` gibt korrekte Parameter zurück | |
| Testevaluierung liefert erwartetes Ergebnis | `POST /evaluate-source` mit bekannten Eingaben | |
| Richtlinie bereitgestellt | `POST /policies` gibt `policyId` und `version` zurück | |
| Live-Evaluierung bestätigt | `POST /evaluate` gibt erwartetes Ergebnis zurück | |
| Audit-Protokolleintrag erstellt | `GET /audit/logs` zeigt den Evaluierungsdatensatz | |

## Verwandte Seiten

- [API: Richtlinie evaluieren](/api/policies/evaluate) — vollständige Referenz für den Evaluierungsendpunkt.
- [API: Quellcode evaluieren](/api/policies/evaluate-source) — Inline-Quellcode kompilieren und evaluieren.
- [API: Schema extrahieren](/api/policies/schema) — Parametertypen programmatisch ermitteln.
- [API: Versionshistorie](/api/policies/versions) — alle Versionen einer bereitgestellten Richtlinie auflisten.
- [API: Rollback](/api/policies/rollback) — auf eine frühere Version zurücksetzen.
- [Browser-API-Referenz](./browser-api) — clientseitige Validierung und Schema-Extraktion.
