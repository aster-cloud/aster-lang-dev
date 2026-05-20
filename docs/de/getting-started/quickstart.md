# Schnellstart

<!-- glossary:block id=quickstart-quick-start-paragraph-1 -->
Diese Anleitung führt Sie in unter fünf Minuten durch Ihre erste Richtlinienevaluierung.
<!-- /glossary:block -->

## Voraussetzungen

<!-- glossary:block id=quickstart-prerequisites-list-item-2 -->
- Eine Mandanten-ID und ein API-Schlüssel, ausgestellt von Ihrem Aster-Kontoadministrator
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-prerequisites-list-item-3 -->
- `curl` auf Ihrem System verfügbar (oder ein beliebiger HTTP-Client)
<!-- /glossary:block -->

<!-- glossary:block id=quickstart-prerequisites-paragraph-4 -->
Falls Sie noch keine Mandanten-ID haben, kontaktieren Sie Ihren Administrator oder lesen Sie die Mandanten-Onboarding-Dokumentation.
<!-- /glossary:block -->

## Schritt 1 — Anmeldedaten festlegen

<!-- glossary:block id=quickstart-step-1-set-your-credentials-paragraph-5 -->
Exportieren Sie Ihre Anmeldedaten als Umgebungsvariablen, damit die folgenden Beispiele ohne Änderung funktionieren:
<!-- /glossary:block -->

```bash
export ASTER_TENANT_ID="my-tenant"
export ASTER_API_SECRET="your-api-secret-here"
```

## Schritt 2 — Eine einfache Richtlinie evaluieren

<!-- glossary:block id=quickstart-step-2-evaluate-a-simple-policy-paragraph-6 -->
Der `evaluate-source`-Endpunkt akzeptiert eine direkt im Anfragekörper geschriebene Richtlinie. Dies ist der schnellste Weg zu experimentieren, ohne zuerst eine gespeicherte Richtlinie zu erstellen.
<!-- /glossary:block -->

```bash
curl -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: my-tenant" \
  -H "X-User-Role: MEMBER" \
  -d '{
    "source": "Module demo.\n\nRule greet given name as Text, produce Text:\n  Return \"Hello, \" + name + \"!\".",
    "context": {"name": "World"},
    "functionName": "greet",
    "locale": "en-US"
  }'
```

<!-- glossary:block id=quickstart-step-2-evaluate-a-simple-policy-paragraph-7 -->
Das `source`-Feld enthält die vollständige Aster-CNL-Richtlinie. Die obige Richtlinie definiert eine Regel `greet`, die einen `name`-Parameter akzeptiert und einen Begrüßungsstring zurückgibt. Das `context`-Objekt liefert die Eingabewerte.
<!-- /glossary:block -->

## Schritt 3 — Das Ergebnis verstehen

<!-- glossary:block id=quickstart-step-3-understand-the-result-paragraph-8 -->
Eine erfolgreiche Evaluierung gibt HTTP `200` mit einem JSON-Körper zurück:
<!-- /glossary:block -->

```json
{
  "result": "Hello, World!",
  "error": null,
  "executionTimeMs": 12
}
```

<!-- glossary:block id=quickstart-step-3-understand-the-result-paragraph-9 -->
| Feld              | Typ           | Beschreibung                                                      |
|--------------------|----------------|------------------------------------------------------------------|
| `result`           | any            | Der von der evaluierten Regel zurückgegebene Wert                         |
| `error`            | string \| null | Fehlermeldung bei fehlgeschlagener Evaluierung; `null` bei Erfolg            |
| `executionTimeMs`  | number         | Wanduhrzeit für die Evaluierung der Richtlinie in Millisekunden    |
<!-- /glossary:block -->

<!-- glossary:block id=quickstart-step-3-understand-the-result-paragraph-10 -->
Wenn `error` nicht null ist, ist das `result`-Feld `null`. Eine vollständige Liste der Fehlerszenarien finden Sie unter [Fehlerbehandlung](./errors).
<!-- /glossary:block -->

## Schritt 4 — Batch-Evaluierung ausprobieren

<!-- glossary:block id=quickstart-step-4-try-batch-evaluation-paragraph-11 -->
Wenn Sie dieselbe Richtlinie gegen mehrere Eingabesätze in einem einzigen Netzwerk-Roundtrip evaluieren müssen, verwenden Sie den `evaluate-source-batch`-Endpunkt.
<!-- /glossary:block -->

```bash
curl -X POST https://policy.aster-lang.dev/api/v1/policies/evaluate-source-batch \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: my-tenant" \
  -H "X-User-Role: MEMBER" \
  -d '{
    "source": "Module demo.\n\nRule greet given name as Text, produce Text:\n  Return \"Hello, \" + name + \"!\".",
    "functionName": "greet",
    "locale": "en-US",
    "inputs": [
      {"name": "Alice"},
      {"name": "Bob"},
      {"name": "Carol"}
    ]
  }'
```

<!-- glossary:block id=quickstart-step-4-try-batch-evaluation-paragraph-12 -->
Die Antwort enthält ein `results`-Array mit einem Eintrag pro Eingabe in derselben Reihenfolge:
<!-- /glossary:block -->

```json
{
  "results": [
    {"result": "Hello, Alice!", "error": null, "executionTimeMs": 8},
    {"result": "Hello, Bob!",   "error": null, "executionTimeMs": 3},
    {"result": "Hello, Carol!", "error": null, "executionTimeMs": 3}
  ]
}
```

<!-- glossary:block id=quickstart-step-4-try-batch-evaluation-paragraph-13 -->
Einzelne Elemente im Batch können unabhängig fehlschlagen. Ein nicht-null `error` bei einem Element bricht die verbleibenden Evaluierungen nicht ab.
<!-- /glossary:block -->

## Nächste Schritte

<!-- glossary:block id=quickstart-next-steps-paragraph-14 -->
Nachdem Sie eine funktionierende Evaluierung haben, erkunden Sie diese Themen, um das Beste aus der API herauszuholen:
<!-- /glossary:block -->

<!-- glossary:block id=quickstart-next-steps-list-item-15 -->
- [Authentifizierung](./authentication) — HMAC-Signierung zum Schutz Ihrer Anfragen hinzufügen
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-next-steps-list-item-16 -->
- [Überblick](./overview) — Die vollständigen Fähigkeiten der Policy Engine verstehen
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-next-steps-list-item-17 -->
- [Fehlerbehandlung](./errors) — Fehler in Ihrer Anwendung elegant behandeln
<!-- /glossary:block -->
<!-- glossary:block id=quickstart-next-steps-list-item-18 -->
- [API-Referenz](/api/policies/evaluate) — Vollständige Referenz für alle Endpunkte und Felder
<!-- /glossary:block -->
