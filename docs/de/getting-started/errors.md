# Fehlerbehandlung

<!-- glossary:block id=errors-error-handling-paragraph-1 -->
Die Aster Policy Engine verwendet Standard-HTTP-Statuscodes und einen konsistenten JSON-Antwortumschlag für alle Fehlerbedingungen.
<!-- /glossary:block -->

## Standard-Fehlerantwortformat

<!-- glossary:block id=errors-standard-error-response-format-paragraph-2 -->
Alle Fehlerantworten — ob von der Anwendungsschicht oder von Richtlinien-Evaluierungsfehlern — verwenden die folgende Struktur:
<!-- /glossary:block -->

```json
{
  "result": null,
  "error": "Menschenlesbare Beschreibung des Fehlers",
  "executionTimeMs": 0
}
```

<!-- glossary:block id=errors-standard-error-response-format-paragraph-3 -->
| Feld             | Typ           | Beschreibung                                                     |
|-------------------|----------------|-----------------------------------------------------------------|
| `result`          | null           | Bei einem Fehler immer `null`                              |
| `error`           | string         | Menschenlesbare Nachricht, die beschreibt, was schiefgelaufen ist             |
| `executionTimeMs` | number         | Vergangene Zeit in Millisekunden; `0` bei vor der Ausführung erkannten Fehlern |
<!-- /glossary:block -->

<!-- glossary:block id=errors-standard-error-response-format-paragraph-4 -->
::: tip Unterscheidung zwischen Evaluierungsfehlern und HTTP-Fehlern
HTTP 4xx/5xx-Statuscodes zeigen Infrastruktur-Fehler an (fehlende Header, Autorisierung, Serverfehler). Eine HTTP `200`-Antwort mit einem nicht-null `error`-Feld bedeutet, dass die Richtlinie erfolgreich geparst und dispatcht wurde, aber die Evaluierung selbst einen Fehler erzeugt hat (z.B. eine Laufzeitausnahme in der Regellogik).
:::
<!-- /glossary:block -->

## HTTP-Statuscodes

### 400 Bad Request

<!-- glossary:block id=errors-400-bad-request-paragraph-5 -->
Wird zurückgegeben, wenn die Anfrage strukturell ungültig ist oder erforderliche Informationen fehlen.
<!-- /glossary:block -->

**Häufige Ursachen:**

<!-- glossary:block id=errors-400-bad-request-paragraph-6 -->
| Szenario                           | Beispiel-`error`-Nachricht                                      |
|------------------------------------|--------------------------------------------------------------|
| Fehlender `X-Tenant-Id`-Header       | `"X-Tenant-Id header is required"`                           |
| Ungültiges `X-Tenant-Id`-Format       | `"X-Tenant-Id must match ^[a-zA-Z0-9_-]{1,64}$"`            |
| Fehlender `Content-Type`-Header      | `"Content-Type must be application/json"`                    |
| Fehlerhafter JSON-Körper                | `"Request body could not be parsed as JSON"`                 |
| Fehlendes erforderliches Body-Feld        | `"Field 'functionName' is required"`                         |
<!-- /glossary:block -->

### 403 Forbidden

<!-- glossary:block id=errors-403-forbidden-paragraph-7 -->
Wird zurückgegeben, wenn der Aufrufer nicht über die erforderlichen Berechtigungen für die angeforderte Operation verfügt.
<!-- /glossary:block -->

**Häufige Ursachen:**

<!-- glossary:block id=errors-403-forbidden-paragraph-8 -->
| Szenario                                  | Beispiel-`error`-Nachricht                                    |
|-------------------------------------------|------------------------------------------------------------|
| `X-User-Role` zu niedrig für den Endpunkt    | `"Role VIEWER is insufficient; MEMBER required"`           |
| Ungültige oder abgelaufene HMAC-Signatur         | `"HMAC signature verification failed"`                     |
| Zeitstempel außerhalb des 5-Minuten-Fensters     | `"Request timestamp is outside the acceptable window"`     |
| Nonce bereits im Replay-Fenster verwendet   | `"Nonce has already been used; possible replay attack"`    |
<!-- /glossary:block -->

### 404 Not Found

<!-- glossary:block id=errors-404-not-found-paragraph-9 -->
Wird zurückgegeben, wenn eine referenzierte Ressource (z.B. eine gespeicherte Richtlinien-ID) innerhalb des aktuellen Mandantenbereichs nicht existiert.
<!-- /glossary:block -->

```json
HTTP/1.1 404 Not Found

{
  "result": null,
  "error": "Policy 'pricing-v3' not found for tenant 'my-tenant'",
  "executionTimeMs": 0
}
```

### 429 Too Many Requests

<!-- glossary:block id=errors-429-too-many-requests-paragraph-10 -->
Wird zurückgegeben, wenn der Mandant sein Ratenlimit überschritten hat. Die Antwort enthält einen `Retry-After`-Header.
<!-- /glossary:block -->

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
```

```json
{
  "result": null,
  "error": "Rate limit exceeded; retry after 30 seconds",
  "executionTimeMs": 0
}
```

### 500 Internal Server Error

<!-- glossary:block id=errors-500-internal-server-error-paragraph-11 -->
Wird bei unerwarteten serverseitigen Fehlern zurückgegeben. Diese Fehler werden automatisch protokolliert und sollten dem Support gemeldet werden, falls sie bestehen bleiben.
<!-- /glossary:block -->

```json
HTTP/1.1 500 Internal Server Error

{
  "result": null,
  "error": "An unexpected error occurred. Reference ID: a3f9c2d1",
  "executionTimeMs": 0
}
```

<!-- glossary:block id=errors-500-internal-server-error-paragraph-12 -->
::: warning Bei einem 500-Fehler
Notieren Sie die `Reference ID` in der Fehlermeldung und geben Sie sie an, wenn Sie den Support kontaktieren. Sie identifiziert den Protokolleintrag für Ihre Anfrage eindeutig.
:::
<!-- /glossary:block -->

## Evaluierungsfehler (HTTP 200 mit nicht-null `error`)

<!-- glossary:block id=errors-evaluation-level-errors-http-200-with-non-null-paragraph-13 -->
Selbst wenn eine Anfrage strukturell gültig und autorisiert ist, kann die Richtlinienevaluierung selbst fehlschlagen. In diesen Fällen ist der HTTP-Statuscode `200`, aber das `error`-Feld im Antwortkörper ist nicht null.
<!-- /glossary:block -->

**Häufige Ursachen:**

<!-- glossary:block id=errors-evaluation-level-errors-http-200-with-non-null-paragraph-14 -->
| Szenario                                    | Beispiel-`error`-Nachricht                                         |
|---------------------------------------------|-----------------------------------------------------------------|
| Syntaxfehler im CNL-Quellcode                  | `"Parse error at line 3: unexpected token 'produce'"`           |
| Funktionsname nicht in Richtlinie gefunden           | `"Rule 'calculate' not found in module 'pricing'"`              |
| Typfehler bei Kontexteingabe              | `"Expected Number for parameter 'amount', got String"`          |
| Laufzeitausnahme in Regellogik         | `"Division by zero in rule 'split-cost' at line 7"`             |
| Locale nicht unterstützt                        | `"Unsupported locale 'fr-FR'"`                                  |
<!-- /glossary:block -->

## Best Practices für die Fehlerbehandlung

<!-- glossary:block id=errors-error-handling-best-practices-list-item-15 -->
1. **Prüfen Sie immer sowohl den HTTP-Statuscode als auch das `error`-Feld.** Eine `200`-Antwort garantiert keine erfolgreiche Evaluierung.
<!-- /glossary:block -->

<!-- glossary:block id=errors-error-handling-best-practices-list-item-16 -->
2. **Implementieren Sie Wiederholungslogik für `429`- und `500`-Antworten.** Verwenden Sie den `Retry-After`-Header für Ratenlimit-Fehler und exponentielles Backoff für Serverfehler.
<!-- /glossary:block -->

<!-- glossary:block id=errors-error-handling-best-practices-list-item-17 -->
3. **Wiederholen Sie `400`- oder `403`-Antworten nicht, ohne die zugrundeliegende Ursache zu beheben.** Diese Fehler zeigen ein clientseitiges Problem an, das sich nicht von selbst löst.
<!-- /glossary:block -->

<!-- glossary:block id=errors-error-handling-best-practices-list-item-18 -->
4. **Bei Batch-Evaluierungen** überprüfen Sie jedes Element im `results`-Array einzeln — ein Fehler bei einem Element betrifft die anderen nicht.
<!-- /glossary:block -->
