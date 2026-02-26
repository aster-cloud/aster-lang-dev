---
outline: deep
---

# Browser-API-Referenz

Das `@aster-cloud/aster-lang-ts`-Paket stellt den vollständigen Aster-CNL-Compiler als JavaScript-Bibliothek bereit. Verwenden Sie es, um Richtlinien direkt im Browser oder in Node.js zu kompilieren, validieren und analysieren, ohne Netzwerkanfragen zu stellen.

## Installation

```bash
npm install @aster-cloud/aster-lang-ts
```

## Imports

Alle Funktionen und Lexikon-Objekte werden vom `/browser`-Unterpfad exportiert:

```js
import {
  compile,
  evaluate,
  validateSyntaxWithSpan,
  extractSchema,
  tokenize,
  generateInputValues,
  compileAndTypecheck,
  EN_US,
  ZH_CN,
  DE_DE,
} from '@aster-cloud/aster-lang-ts/browser'
```

## Lexika

Ein Lexikon definiert den Schlüsselwortsatz für eine bestimmte Locale. Übergeben Sie ein Lexikon an jede Funktion, die den `lexicon`-Parameter akzeptiert. Wenn weggelassen, verwendet der Compiler standardmäßig Englisch (`EN_US`).

| Lexikon | Locale | Sprache |
|---------|--------|----------|
| `EN_US` | `en-US` | Englisch |
| `ZH_CN` | `zh-CN` | Vereinfachtes Chinesisch |
| `DE_DE` | `de-DE` | Deutsch |

```js
import { compile, EN_US, ZH_CN } from '@aster-cloud/aster-lang-ts/browser'

// Englische Richtlinie
compile(englishSource, { lexicon: EN_US })

// Chinesische Richtlinie
compile(chineseSource, { lexicon: ZH_CN })
```

## Funktionen

### `validateSyntaxWithSpan(source, lexicon?)`

Parst den Quellcode und gibt ein Array von Syntaxfehlern zurück. Gibt ein leeres Array zurück, wenn der Quellcode gültig ist.

**Parameter:**

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `source` | `string` | Ja | Der zu validierende CNL-Quelltext. |
| `lexicon` | `Lexicon` | Nein | Zu verwendender Schlüsselwortsatz. Standard: `EN_US`. |

**Gibt zurück:** `ValidationError[]`

### `compile(source, options?)`

Kompiliert einen CNL-Quellstring in die Kern-Zwischendarstellung.

**Parameter:**

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `source` | `string` | Ja | Der CNL-Quelltext. |
| `options` | `object` | Nein | Kompilierungsoptionen. |

**Optionen:**

| Feld | Typ | Standard | Beschreibung |
|-------|------|---------|-------------|
| `lexicon` | `Lexicon` | `EN_US` | Schlüsselwortsatz zum Parsen. |
| `includeIntermediates` | `boolean` | `false` | Wenn `true`, enthält das Ergebnis die Zwischendarstellung als JSON-Struktur. |

### `extractSchema(source, options?)`

Parst den Quellcode und extrahiert das Parameter-Schema für eine bestimmte Funktion.

**Gibt zurück:** `SchemaResult`

### `tokenize(source, lexicon?)`

Zerlegt den Quellcode in ein flaches Array von Token. Nützlich für Syntaxhervorhebung und Tooling-Integration.

### `generateInputValues(parameters, lexicon?)`

Generiert plausible Beispiel-Eingabewerte aus einem Parameter-Schema-Array.

### `evaluate(coreIR, functionName, context)`

Evaluiert eine kompilierte Richtlinie im Browser unter Verwendung des Core-IR-Interpreters.

**Parameter:**

| Parameter | Typ | Erforderlich | Beschreibung |
|-----------|------|----------|-------------|
| `coreIR` | `CoreIR` | Ja | Die kompilierte Kern-Zwischendarstellung von `compile()`. |
| `functionName` | `string` | Ja | Name der aufzurufenden Funktion. |
| `context` | `Record<string, unknown>` | Ja | Kontextobjekt, das Parameternamen auf Werte abbildet. |

**Beispiel:**

```js
import { compile, evaluate, EN_US } from '@aster-cloud/aster-lang-ts/browser'

const source = `Module demo.

Rule greet given name as Text, produce Text:
  Return "Hello, " plus name.`

const compiled = compile(source, { lexicon: EN_US, includeIntermediates: true })

if (compiled.success) {
  const result = evaluate(compiled.core, 'greet', { name: 'World' })
  console.log(result) // { value: "Hello, World" }
}
```

## Wann Browser-API vs REST API vs GraphQL verwenden

| Kriterium | Browser-API | REST API | GraphQL |
|-----------|-------------|----------|---------|
| **Läuft wo** | Browser oder Node.js | Serverseitig | Serverseitig |
| **Netzwerk erforderlich** | Nein | Ja | Ja |
| **Authentifizierung** | Keine | HMAC-Anfragensignierung | HMAC-Anfragensignierung |
| **Am besten für** | Editoren, CI-Checks, lokales Tooling | Produktionsevaluierung, Bereitstellung | Flexible Abfragen, Dashboards |

**Entscheidungshilfe:**

- Verwenden Sie die **Browser-API** für schnelle, offline Validierung und Schema-Extraktion.
- Verwenden Sie die **REST API** für Bereitstellung, Evaluierung, Versionierung und Auditierung in der Produktion.
- Verwenden Sie **GraphQL** für flexible Abfragen über Richtlinien, Versionen und Audit-Datensätze.

## Verwandte Seiten

- [Spielplatz](./playground) — die Browser-API interaktiv im Browser ausprobieren.
- [CNL-Kurzreferenz](./cnl-quick-reference) — vollständige Syntaxanleitung für Aster CNL.
- [Bereitstellungsanleitung](./deployment-guide) — End-to-End-Anleitung vom Quellcode zur Produktion.
- [API: Schema extrahieren](/api/policies/schema) — REST API-Äquivalent von `extractSchema`.
- [API: Richtlinie validieren](/api/policies/validate) — prüfen, ob eine bereitgestellte Richtlinie aufrufbar ist.
