---
outline: deep
---

# CNL-Kurzreferenz

Diese Seite ist eine umfassende Referenz für die Aster CNL (Controlled Natural Language) Syntax. Alle Beispiele verwenden den englischen (`EN_US`) Schlüsselwortsatz, sofern nicht anders angegeben.

## Moduldeklaration

Jede Richtlinie beginnt mit genau einer Moduldeklaration. Der Modulname ist ein punktgetrennter Bezeichner, der mit einem Punkt endet.

```
Module <Name>.
```

Beispiele:

```
Module pricing.
Module Loan.Approval.
Module Insurance.Auto.Quote.
```

Der Modulname wird verwendet, um die Richtlinie bei der Bereitstellung und Evaluierung über die REST API zu adressieren.

## Regeldefinition

Eine Regel ist eine benannte Funktion mit typisierten Parametern und einem Rückgabetyp. Der Körper ist ein eingerückter Anweisungsblock.

```
Rule <name> given <param> as <Type>, produce <ReturnType>:
  <body>
```

- `given` führt die Parameterliste ein.
- Jeder Parameter wird als `<name> as <Type>` geschrieben.
- Mehrere Parameter werden durch Kommas getrennt.
- `produce` deklariert den Rückgabetyp.
- Der Doppelpunkt am Ende der Signatur öffnet den Body-Block.

Beispiel:

```
Rule calculateDiscount given amount as Int, tier as Text, produce Int:
  If tier is "gold"
    Return amount times 20 divided by 100.
  If tier is "silver"
    Return amount times 10 divided by 100.
  Return 0.
```

### Regeln ohne Parameter

Wenn eine Regel keine Parameter hat, wird die `given`-Klausel weggelassen:

```
Rule defaultRate produce Float:
  Return 3.5.
```

### Regeln mit Struct-Parametern

Parameter können benutzerdefinierte Struct-Typen verwenden:

```
Rule evaluateApplicant given applicant as Applicant, produce Bool:
  If applicant.creditScore at least 700
    Return true.
  Return false.
```

## Daten-/Struct-Definitionen

Verwenden Sie `Define`, um einen benannten Datensatztyp mit typisierten Feldern zu deklarieren. Felder werden durch Kommas getrennt. Die Definition endet mit einem Punkt.

```
Define <Name> has <field> as <Type>, <field2> as <Type2>.
```

Beispiele:

```
Define Applicant has name as Text, age as Int, creditScore as Int.
Define Vehicle has make as Text, year as Int, value as Int.
Define Address has street as Text, city as Text, postalCode as Text.
```

Struct-Typen können als Parametertypen, Rückgabetypen und Feldtypen in anderen Structs verwendet werden:

```
Define Customer has name as Text, address as Address.
```

## Typsystem

Aster CNL bietet fünf eingebaute primitive Typen und unterstützt benutzerdefinierte Struct-Typen.

### Primitive Typen

| Typ | Beschreibung | Beispielwerte |
|------|-------------|----------------|
| `Int` | Ganzzahl | `0`, `42`, `-7` |
| `Float` | Gleitkommazahl | `3.14`, `0.5`, `-1.0` |
| `Text` | String-Literal (doppelte Anführungszeichen) | `"hello"`, `"gold"` |
| `Bool` | Boolescher Wert | `true`, `false` |

::: tip DateTime-Inferenz
DateTime ist kein Schlüsselwort, das Sie im Quellcode schreiben. Der Compiler inferiert `DateTime` als Typ für Felder, deren Namen temporale Muster aufweisen (z.B. `createdAt`, `birthday`, `expiryDate`). Sie müssen es nicht explizit deklarieren.
:::

### Benutzerdefinierte Typen (Structs)

Jeder durch eine `Define`-Deklaration eingeführte Name wird zu einem gültigen Typ:

```
Define Policy has premium as Int, deductible as Int.

Rule quote given age as Int, produce Policy:
  If age less than 25
    Return Policy with premium set to 500, deductible set to 1000.
  Return Policy with premium set to 300, deductible set to 500.
```

## Kontrollfluss

### If-Anweisungen

Bedingte Logik verwendet `If` gefolgt von einer Bedingung. Der Körper muss eingerückt sein.

```
If <condition>
  <body>
```

`If`-Anweisungen können verkettet werden. Der erste Zweig, dessen Bedingung `true` ergibt, wird ausgeführt, und seine `Return`-Anweisung gibt einen Wert von der Regel zurück.

```
Rule classify given score as Int, produce Text:
  If score at least 90
    Return "excellent".
  If score at least 70
    Return "good".
  If score at least 50
    Return "average".
  Return "poor".
```

### Verschachtelte Bedingungen

Bedingungen können durch erhöhte Einrückung verschachtelt werden:

```
Rule evaluate given applicant as Applicant, tier as Text, produce Bool:
  If applicant.creditScore at least 700
    If tier is "premium"
      Return true.
  Return false.
```

## Ausdrücke und Operatoren

### Arithmetische Operatoren

| Operator | Beschreibung | Beispiel |
|----------|-------------|---------|
| `plus` | Addition | `amount plus 10` |
| `minus` | Subtraktion | `price minus discount` |
| `times` | Multiplikation | `quantity times unitPrice` |
| `divided by` | Division | `total divided by count` |

### Vergleichsoperatoren

| Operator | Beschreibung | Beispiel |
|----------|-------------|---------|
| `greater than` | Größer als | `age greater than 18` |
| `less than` | Kleiner als | `score less than 50` |
| `at least` | Größer oder gleich | `income at least 30000` |
| `at most` | Kleiner oder gleich | `balance at most 0` |
| `is` | Gleichheit | `tier is "gold"` |
| `equals to` | Gleichheit (numerisch) | `count equals to 5` |

### Logische Operatoren

| Operator | Beschreibung | Beispiel |
|----------|-------------|---------|
| `and` | Logisches UND | `age at least 18 and income at least 30000` |
| `or` | Logisches ODER | `tier is "gold" or tier is "platinum"` |
| `not` | Logisches NICHT | `not isExpired` |

## Konstruktionsausdrücke

Um einen Wert eines Struct-Typs zurückzugeben, verwenden Sie einen Konstruktionsausdruck mit `with <field> set to <value>`:

```
<TypeName> with <field> set to <value>, <field2> set to <value2>
```

## Feldzugriff

Zugriff auf Felder eines Struct-Parameters mit Punktnotation:

```
applicant.creditScore
vehicle.year
address.city
```

## Mehrsprachige Unterstützung

Aster CNL unterstützt mehrere Locales. Die folgende Tabelle zeigt Schlüsselwortäquivalente über unterstützte Locales hinweg.

| Konzept | Englisch (`EN_US`) | Chinesisch (`ZH_CN`) | Deutsch (`DE_DE`) |
|---------|-------------------|--------------------|-------------------|
| Modul | `Module` | `模块` | `Modul` |
| Regel | `Rule` | `规则` | `Regel` |
| Gegeben | `given` | `给定` | `gegeben` |
| Als (Typ) | `as` | `为` | `als` |
| Liefert | `produce` | `产出` | `liefert` |
| Definiere | `Define` | `定义` | `Definiere` |
| Hat | `has` | `包含` | `hat` |
| Wenn | `If` | `如果` | `wenn` |
| Und | `and` | `且` | `und` |
| Oder | `or` | `或` | `oder` |
| Ist | `is` | `是` | `ist` |
| Setze...auf | `set ... to` | `将 ... 设为` | `setze ... auf` |
| Gib zurück | `Return` | `返回` | `gib zurueck` |

## Vollständige Beispiele

### Beispiel 1: Kreditwürdigkeit

```
Module Loan.Approval.

Define Applicant has name as Text, age as Int, creditScore as Int, income as Int.

Rule isEligible given applicant as Applicant, requestedAmount as Int, produce Bool:
  If applicant.age less than 18
    Return false.
  If applicant.creditScore less than 650
    Return false.
  If applicant.income less than requestedAmount times 3
    Return false.
  Return true.
```

### Beispiel 2: Versicherungsangebot mit Struct-Rückgabe

```
Module Insurance.Auto.

Define Vehicle has make as Text, year as Int, value as Int.
Define Quote has premium as Int, deductible as Int, coverage as Text.

Rule generateQuote given vehicle as Vehicle, driverAge as Int, produce Quote:
  If driverAge less than 25
    If vehicle.value greater than 50000
      Return Quote with premium set to 4800, deductible set to 2000, coverage set to "basic".
    Return Quote with premium set to 3200, deductible set to 1500, coverage set to "basic".
  If vehicle.year less than 2015
    Return Quote with premium set to vehicle.value times 4 divided by 100, deductible set to 1000, coverage set to "standard".
  Return Quote with premium set to vehicle.value times 3 divided by 100, deductible set to 500, coverage set to "full".
```

### Beispiel 3: Chinesische Locale

```
模块 定价。

定义 报价 包含 单价 为 整数，折扣 为 整数。

规则 计算报价 给定 数量 为 整数，会员等级 为 文本，产出 报价：
  如果 会员等级 是 "金牌"
    返回 报价 将 单价 设为 数量 乘 80 除以 100，折扣 设为 20。
  如果 会员等级 是 "银牌"
    返回 报价 将 单价 设为 数量 乘 90 除以 100，折扣 设为 10。
  返回 报价 将 单价 设为 数量，折扣 设为 0。
```

## Syntax-Zusammenfassung

| Konstrukt | Muster |
|-----------|---------|
| Moduldeklaration | `Module <Name>.` |
| Struct-Definition | `Define <Name> has <field> as <Type>, ...` |
| Regelsignatur | `Rule <name> given <params>, produce <Type>:` |
| Parameter | `<name> as <Type>` |
| If-Bedingung | `If <condition>` |
| Rückgabewert | `Return <expr>.` |
| Andernfalls | `Otherwise` |
| Lokale Bindung | `Let <name> be <expr>.` |
| Konstruktion | `<Type> with <field> set to <value>, ...` |
| Feldzugriff | `<param>.<field>` |
| Gleichheitstest | `<expr> is <expr>` |
| Logisches UND | `<expr> and <expr>` |
| Logisches ODER | `<expr> or <expr>` |
