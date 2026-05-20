# Authentifizierung

<!-- glossary:block id=authentication-authentication-paragraph-1 -->
Die Aster Policy Engine erzwingt ein dreischichtiges Sicherheitsmodell bei jeder Anfrage. Jede Schicht ist unabhängig; alle drei müssen erfüllt sein, damit eine Anfrage erfolgreich ist.
<!-- /glossary:block -->

## Schicht 1 — Mandantenisolierung (`X-Tenant-Id`)

<!-- glossary:block id=authentication-layer-1-tenant-isolation-paragraph-2 -->
Jede Anfrage muss einen `X-Tenant-Id`-Header enthalten. Dieser Header legt den Mandantenkontext der Anfrage fest: Richtlinien, Audit-Datensätze und alle Daten sind auf den angegebenen Mandanten beschränkt und für andere Mandanten nicht sichtbar.
<!-- /glossary:block -->

**Format:** `^[a-zA-Z0-9_-]{1,64}$`

<!-- glossary:block id=authentication-layer-1-tenant-isolation-paragraph-3 -->
Ein fehlender oder fehlerhafter `X-Tenant-Id` gibt sofort `400 Bad Request` zurück, bevor eine andere Validierung durchgeführt wird.
<!-- /glossary:block -->

```bash
curl https://policy.aster-lang.dev/api/v1/policies \
  -H "X-Tenant-Id: acme-corp"
```

<!-- glossary:block id=authentication-layer-1-tenant-isolation-paragraph-4 -->
::: tip Mandanten-ID-Konventionen
Verwenden Sie einen stabilen, menschenlesbaren Bezeichner wie Ihren Organisationsslug oder Umgebungsnamen (z.B. `acme-corp`, `acme-corp-staging`). Mandanten-IDs sind groß-/kleinschreibungsempfindlich.
:::
<!-- /glossary:block -->

## Schicht 2 — HMAC-Anfragensignierung

<!-- glossary:block id=authentication-layer-2-hmac-request-signing-paragraph-5 -->
Jede Anfrage muss HMAC-Signatur-Header enthalten. Der Server validiert die Signatur, bevor die Anfrage verarbeitet wird, um Manipulation während der Übertragung und Replay-Angriffe zu verhindern.
<!-- /glossary:block -->

### Erforderliche Header

<!-- glossary:block id=authentication-required-headers-paragraph-6 -->
| Header               | Beschreibung                                                          |
|----------------------|----------------------------------------------------------------------|
| `X-Aster-Signature`  | Hexadezimal kodierter HMAC-SHA256 der kanonischen Nachricht (siehe unten)        |
| `X-Aster-Nonce`      | Zufällig generierter String (empfohlen 16+ Bytes, Hex oder UUID)      |
| `X-Aster-Timestamp`  | Unix-Zeitstempel in **Millisekunden** zum Zeitpunkt der Signierung          |
<!-- /glossary:block -->

<!-- glossary:block id=authentication-required-headers-paragraph-7 -->
Eine Anfrage, bei der einer dieser drei Header fehlt, gibt `401 Unauthorized` zurück.
<!-- /glossary:block -->

### Kanonisches Nachrichtenformat

<!-- glossary:block id=authentication-canonical-message-format-paragraph-8 -->
Der HMAC wird über den folgenden pipe-getrennten String berechnet:
<!-- /glossary:block -->

```
{HTTP-method}|{path}|{query}|{X-Aster-Timestamp}|{X-Aster-Nonce}|{body-sha256}
```

<!-- glossary:block id=authentication-canonical-message-format-paragraph-9 -->
| Komponente | Beschreibung | Beispiel |
|-----------|-------------|---------|
| `HTTP-method` | HTTP-Methode in Großbuchstaben | `POST` |
| `path` | Anfrage-URI-Pfad | `/api/v1/policies/evaluate-source` |
| `query` | Roher Abfragestring (leerer String wenn keiner) | `trace=true` |
| `X-Aster-Timestamp` | Zeitstempelwert aus Header | `1708776000000` |
| `X-Aster-Nonce` | Nonce-Wert aus Header | `c3ab8ff13720e8ad9047dd39466b3c89` |
| `body-sha256` | Hexadezimaler SHA-256-Hash des rohen Anfragekörpers in Kleinbuchstaben | `a1b2c3d4...` |
<!-- /glossary:block -->

<!-- glossary:block id=authentication-canonical-message-format-paragraph-10 -->
Der HMAC-Schlüssel ist das **API-Geheimnis**, das Ihrem Mandanten ausgestellt wurde. Das Geheimnis wird in dieser Prioritätsreihenfolge aufgelöst:
<!-- /glossary:block -->

<!-- glossary:block id=authentication-canonical-message-format-list-item-11 -->
1. Umgebungsvariable `ASTER_HMAC_SECRET_{TENANT_ID}` (Mandanten-ID in Großbuchstaben, Bindestriche durch Unterstriche ersetzt)
<!-- /glossary:block -->
<!-- glossary:block id=authentication-canonical-message-format-list-item-12 -->
2. Konfigurationseigenschaft `aster.security.hmac.secret-key`
<!-- /glossary:block -->

### Beispiel: Signaturberechnung (Bash)

```bash
TENANT_ID="acme-corp"
TIMESTAMP=$(($(date +%s) * 1000))
NONCE=$(openssl rand -hex 16)
BODY='{"source":"Module demo.\n\nRule ping produce Text:\n  Return \"pong\".","functionName":"ping","context":{},"locale":"en-US"}'
API_SECRET="your-api-secret-here"
METHOD="POST"
PATH_URI="/api/v1/policies/evaluate-source"
QUERY=""

BODY_HASH=$(printf '%s' "${BODY}" | openssl dgst -sha256 | awk '{print $2}')
CANONICAL="${METHOD}|${PATH_URI}|${QUERY}|${TIMESTAMP}|${NONCE}|${BODY_HASH}"
SIGNATURE=$(printf '%s' "${CANONICAL}" | openssl dgst -sha256 -hmac "${API_SECRET}" | awk '{print $2}')

curl -X POST "https://policy.aster-lang.dev${PATH_URI}" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-User-Role: MEMBER" \
  -H "X-Aster-Signature: ${SIGNATURE}" \
  -H "X-Aster-Nonce: ${NONCE}" \
  -H "X-Aster-Timestamp: ${TIMESTAMP}" \
  -d "${BODY}"
```

### Replay-Schutz

<!-- glossary:block id=authentication-replay-prevention-paragraph-13 -->
Der Server lehnt Anfragen ab, bei denen `X-Aster-Timestamp` mehr als **5 Minuten** (300.000 Millisekunden) in der Vergangenheit oder Zukunft liegt, und gibt `401 Unauthorized` zurück. Außerdem wird jeder Nonce für die Dauer des Replay-Fensters gespeichert; eine zweite Anfrage mit demselben Nonce innerhalb des Fensters wird mit `409 Conflict` abgelehnt.
<!-- /glossary:block -->

## Schicht 3 — Rollenbasierte Zugriffskontrolle (`X-User-Role`)

<!-- glossary:block id=authentication-layer-3-role-based-access-control-paragraph-14 -->
Der `X-User-Role`-Header enthält den Rollenanspruch des Aufrufers. Der Server erzwingt eine strenge Rollenhierarchie:
<!-- /glossary:block -->

```
OWNER > ADMIN > MEMBER > VIEWER
```

<!-- glossary:block id=authentication-layer-3-role-based-access-control-paragraph-15 -->
Jede Rolle ist additiv: eine höhere Rolle erbt alle Berechtigungen der darunter liegenden Rollen.
<!-- /glossary:block -->

### Rollenberechtigungen

<!-- glossary:block id=authentication-role-permissions-paragraph-16 -->
| Rolle     | Erlaubte Aktionen                                                         |
|----------|---------------------------------------------------------------------------|
| `VIEWER` | Gespeicherte Richtlinien lesen (GET)                                                |
| `MEMBER` | Alle VIEWER-Berechtigungen + Richtlinien evaluieren (POST an Evaluierungsendpunkte) |
| `ADMIN`  | Alle MEMBER-Berechtigungen + Audit-Protokolle lesen und verifizieren                       |
| `OWNER`  | Alle ADMIN-Berechtigungen + Mandanteneinstellungen und RBAC-Zuweisungen verwalten       |
<!-- /glossary:block -->

### Endpunktanforderungen

<!-- glossary:block id=authentication-endpoint-requirements-paragraph-17 -->
| Endpunktkategorie        | Mindestrolle |
|--------------------------|-----------------------|
| Richtlinien-Evaluierung        | `MEMBER`              |
| Richtlinienverwaltung (CRUD) | `MEMBER`              |
| Audit-Protokoll lesen           | `ADMIN`               |
| Audit-Protokoll-Verifizierung   | `ADMIN`               |
| Mandantenverwaltung    | `OWNER`               |
<!-- /glossary:block -->

<!-- glossary:block id=authentication-endpoint-requirements-paragraph-18 -->
Eine Anfrage mit unzureichender Rolle gibt `403 Forbidden` zurück.
<!-- /glossary:block -->

### Optionale Header

<!-- glossary:block id=authentication-optional-headers-paragraph-19 -->
| Header | Beschreibung | Standard |
|--------|-------------|---------|
| `X-User-Id` | Identifiziert den Aufrufer in Audit-Protokollen | `anonymous` |
<!-- /glossary:block -->

### Beispiel: Vollständige Anfrage mit allen Schichten

```bash
TENANT_ID="acme-corp"
TIMESTAMP=$(($(date +%s) * 1000))
NONCE=$(openssl rand -hex 16)
BODY='{"source":"Module demo.\n\nRule ping produce Text:\n  Return \"pong\".","functionName":"ping","context":{},"locale":"en-US"}'
API_SECRET="your-api-secret-here"
METHOD="POST"
PATH_URI="/api/v1/policies/evaluate-source"

BODY_HASH=$(printf '%s' "${BODY}" | openssl dgst -sha256 | awk '{print $2}')
SIGNATURE=$(printf '%s' "${METHOD}|${PATH_URI}||${TIMESTAMP}|${NONCE}|${BODY_HASH}" | openssl dgst -sha256 -hmac "${API_SECRET}" | awk '{print $2}')

curl -X POST "https://policy.aster-lang.dev${PATH_URI}" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Id: ${TENANT_ID}" \
  -H "X-User-Id: user@acme.com" \
  -H "X-User-Role: MEMBER" \
  -H "X-Aster-Signature: ${SIGNATURE}" \
  -H "X-Aster-Nonce: ${NONCE}" \
  -H "X-Aster-Timestamp: ${TIMESTAMP}" \
  -d "${BODY}"
```

## Zusammenfassung

<!-- glossary:block id=authentication-summary-paragraph-20 -->
| Schicht | Header                                              | Erforderlich  | Fehlerantwort      |
|-------|--------------------------------------------------------|-----------|-----------------------|
| 1     | `X-Tenant-Id`                                          | Immer    | `400 Bad Request`     |
| 2     | `X-Aster-Signature`, `X-Aster-Nonce`, `X-Aster-Timestamp` | Immer | `401 Unauthorized`  |
| 3     | `X-User-Role`                                          | Immer    | `403 Forbidden`       |
| —     | `X-User-Id`                                            | Optional  | Standard: `anonymous` |
<!-- /glossary:block -->
