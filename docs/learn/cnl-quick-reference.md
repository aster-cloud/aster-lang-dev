---
outline: deep
---

# CNL Quick Reference

<!-- glossary:block id=cnl-quick-reference-cnl-quick-reference-paragraph-1 -->
This page is a comprehensive reference for Aster CNL (Controlled Natural Language) syntax. All examples use the English (`EN_US`) keyword set unless noted otherwise.
<!-- /glossary:block -->

## Module Declaration

<!-- glossary:block id=cnl-quick-reference-module-declaration-paragraph-2 -->
Every policy begins with exactly one module declaration. The module name is a dot-separated identifier that ends with a period.
<!-- /glossary:block -->

```
Module <Name>.
```

Examples:

```
Module pricing.
Module Loan.Approval.
Module Insurance.Auto.Quote.
```

<!-- glossary:block id=cnl-quick-reference-module-declaration-paragraph-3 -->
The module name is used to address the policy when deploying and evaluating via the REST API.
<!-- /glossary:block -->

## Rule Definition

<!-- glossary:block id=cnl-quick-reference-rule-definition-paragraph-4 -->
A rule is a named function with typed parameters and a return type. The body is an indented block of statements.
<!-- /glossary:block -->

```
Rule <name> given <param> as <Type>, produce <ReturnType>:
  <body>
```

<!-- glossary:block id=cnl-quick-reference-rule-definition-list-item-5 -->
- `given` introduces the parameter list.
<!-- /glossary:block -->
<!-- glossary:block id=cnl-quick-reference-rule-definition-list-item-6 -->
- Each parameter is written as `<name> as <Type>`.
<!-- /glossary:block -->
<!-- glossary:block id=cnl-quick-reference-rule-definition-list-item-7 -->
- Multiple parameters are separated by commas.
<!-- /glossary:block -->
<!-- glossary:block id=cnl-quick-reference-rule-definition-list-item-8 -->
- `produce` declares the return type.
<!-- /glossary:block -->
<!-- glossary:block id=cnl-quick-reference-rule-definition-list-item-9 -->
- The colon at the end of the signature opens the body block.
<!-- /glossary:block -->

Example:

```
Rule calculateDiscount given amount as Int, tier as Text, produce Int:
  If tier is "gold"
    Return amount times 20 divided by 100.
  If tier is "silver"
    Return amount times 10 divided by 100.
  Return 0.
```

### Rules with No Parameters

<!-- glossary:block id=cnl-quick-reference-rules-with-no-parameters-paragraph-10 -->
When a rule takes no parameters, omit the `given` clause:
<!-- /glossary:block -->

```
Rule defaultRate produce Float:
  Return 3.5.
```

### Rules with Struct Parameters

<!-- glossary:block id=cnl-quick-reference-rules-with-struct-parameters-paragraph-11 -->
Parameters can use user-defined struct types:
<!-- /glossary:block -->

```
Rule evaluateApplicant given applicant as Applicant, produce Bool:
  If applicant.creditScore at least 700
    Return true.
  Return false.
```

## Data / Struct Definitions

<!-- glossary:block id=cnl-quick-reference-data-struct-definitions-paragraph-12 -->
Use `Define` to declare a named record type with typed fields. Fields are separated by commas. The definition ends with a period.
<!-- /glossary:block -->

```
Define <Name> has <field> as <Type>, <field2> as <Type2>.
```

Examples:

```
Define Applicant has name as Text, age as Int, creditScore as Int.
Define Vehicle has make as Text, year as Int, value as Int.
Define Address has street as Text, city as Text, postalCode as Text.
```

<!-- glossary:block id=cnl-quick-reference-data-struct-definitions-paragraph-13 -->
Struct types can be used as parameter types, return types, and field types in other structs:
<!-- /glossary:block -->

```
Define Customer has name as Text, address as Address.
```

## Type System

<!-- glossary:block id=cnl-quick-reference-type-system-paragraph-14 -->
Aster CNL provides five built-in primitive types and supports user-defined struct types.
<!-- /glossary:block -->

### Primitive Types

<!-- glossary:block id=cnl-quick-reference-primitive-types-paragraph-15 -->
| Type | Description | Example values |
|------|-------------|----------------|
| `Int` | Integer number | `0`, `42`, `-7` |
| `Float` | Floating-point number | `3.14`, `0.5`, `-1.0` |
| `Text` | String literal (double-quoted) | `"hello"`, `"gold"` |
| `Bool` | Boolean value | `true`, `false` |
<!-- /glossary:block -->

<!-- glossary:block id=cnl-quick-reference-primitive-types-paragraph-16 -->
::: tip DateTime Inference
DateTime is not a keyword you write in source code. The compiler infers `DateTime` as the type for fields whose names match temporal patterns (e.g. `createdAt`, `birthday`, `expiryDate`). You do not need to declare it explicitly.
:::
<!-- /glossary:block -->

### Custom Types (Structs)

<!-- glossary:block id=cnl-quick-reference-custom-types-structs-paragraph-17 -->
Any name introduced by a `Define` declaration becomes a valid type:
<!-- /glossary:block -->

```
Define Policy has premium as Int, deductible as Int.

Rule quote given age as Int, produce Policy:
  If age less than 25
    Return Policy with premium set to 500, deductible set to 1000.
  Return Policy with premium set to 300, deductible set to 500.
```

## Control Flow

### If Statements

<!-- glossary:block id=cnl-quick-reference-if-statements-paragraph-18 -->
Conditional logic uses `If` followed by a condition. The body must be indented.
<!-- /glossary:block -->

```
If <condition>
  <body>
```

<!-- glossary:block id=cnl-quick-reference-if-statements-paragraph-19 -->
`If` statements can be chained. The first branch whose condition evaluates to `true` executes, and its `Return` statement returns a value from the rule.
<!-- /glossary:block -->

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

### Nested Conditions

<!-- glossary:block id=cnl-quick-reference-nested-conditions-paragraph-20 -->
Conditions can be nested by increasing indentation:
<!-- /glossary:block -->

```
Rule evaluate given applicant as Applicant, tier as Text, produce Bool:
  If applicant.creditScore at least 700
    If tier is "premium"
      Return true.
  Return false.
```

## Expressions and Operators

### Arithmetic Operators

<!-- glossary:block id=cnl-quick-reference-arithmetic-operators-paragraph-21 -->
| Operator | Description | Example |
|----------|-------------|---------|
| `plus` | Addition | `amount plus 10` |
| `minus` | Subtraction | `price minus discount` |
| `times` | Multiplication | `quantity times unitPrice` |
| `divided by` | Division | `total divided by count` |
<!-- /glossary:block -->

<!-- glossary:block id=cnl-quick-reference-arithmetic-operators-paragraph-22 -->
Arithmetic expressions follow standard precedence: `times` and `divided by` bind tighter than `plus` and `minus`. Use grouping where needed for clarity.
<!-- /glossary:block -->

### Comparison Operators

<!-- glossary:block id=cnl-quick-reference-comparison-operators-paragraph-23 -->
| Operator | Description | Example |
|----------|-------------|---------|
| `greater than` | Greater than | `age greater than 18` |
| `less than` | Less than | `score less than 50` |
| `at least` | Greater than or equal | `income at least 30000` |
| `at most` | Less than or equal | `balance at most 0` |
| `is` | Equality | `tier is "gold"` |
| `equals to` | Equality (numeric) | `count equals to 5` |
<!-- /glossary:block -->

### Logical Operators

<!-- glossary:block id=cnl-quick-reference-logical-operators-paragraph-24 -->
| Operator | Description | Example |
|----------|-------------|---------|
| `and` | Logical AND | `age at least 18 and income at least 30000` |
| `or` | Logical OR | `tier is "gold" or tier is "platinum"` |
| `not` | Logical NOT | `not isExpired` |
<!-- /glossary:block -->

<!-- glossary:block id=cnl-quick-reference-logical-operators-paragraph-25 -->
Logical operators can be combined in a single condition:
<!-- /glossary:block -->

```
If applicant.age at least 18 and applicant.creditScore at least 650 and applicant.income at least 25000
  Return true.
```

## Construction Expressions

<!-- glossary:block id=cnl-quick-reference-construction-expressions-paragraph-26 -->
To return a value of a struct type, use a construction expression with `with <field> set to <value>`:
<!-- /glossary:block -->

```
<TypeName> with <field> set to <value>, <field2> set to <value2>
```

Example:

```
Define Quote has premium as Int, deductible as Int.

Rule calculateQuote given vehicleValue as Int, year as Int, produce Quote:
  If year less than 2015
    Return Quote with premium set to vehicleValue times 5 divided by 100, deductible set to 1000.
  Return Quote with premium set to vehicleValue times 3 divided by 100, deductible set to 500.
```

<!-- glossary:block id=cnl-quick-reference-construction-expressions-paragraph-27 -->
Each `<field> set to <value>` clause assigns one field. Multiple clauses are separated by commas after the `with` keyword. All fields declared on the struct should be assigned.
<!-- /glossary:block -->

## Field Access

<!-- glossary:block id=cnl-quick-reference-field-access-paragraph-28 -->
Access fields on a struct parameter using dot notation:
<!-- /glossary:block -->

```
applicant.creditScore
vehicle.year
address.city
```

<!-- glossary:block id=cnl-quick-reference-field-access-paragraph-29 -->
Field access can be used in conditions, arithmetic, and as arguments to construction expressions.
<!-- /glossary:block -->

## Multi-Language Support

<!-- glossary:block id=cnl-quick-reference-multi-language-support-paragraph-30 -->
Aster CNL supports multiple locales. The same logical policy is expressed using locale-specific keywords. The following table shows keyword equivalents across supported locales.
<!-- /glossary:block -->

<!-- glossary:block id=cnl-quick-reference-multi-language-support-paragraph-31 -->
| Concept | English (`EN_US`) | Chinese (`ZH_CN`) | German (`DE_DE`) |
|---------|-------------------|--------------------|-------------------|
| Module | `Module` | `模块` | `Modul` |
| Rule | `Rule` | `规则` | `Regel` |
| Given | `given` | `给定` | `gegeben` |
| As (type) | `as` | `为` | `als` |
| Produce | `produce` | `产出` | `liefert` |
| Define | `Define` | `定义` | `Definiere` |
| Has | `has` | `包含` | `hat` |
| If | `If` | `如果` | `wenn` |
| And | `and` | `且` | `und` |
| Or | `or` | `或` | `oder` |
| Is | `is` | `是` | `ist` |
| Set...to | `set ... to` | `将 ... 设为` | `setze ... auf` |
| Return | `Return` | `返回` | `gib zurueck` |
<!-- /glossary:block -->

<!-- glossary:block id=cnl-quick-reference-multi-language-support-paragraph-32 -->
The compiler accepts a `lexicon` parameter that tells it which keyword set to use. All locales compile to the same core representation.
<!-- /glossary:block -->

## Complete Examples

### Example 1: Loan Eligibility

<!-- glossary:block id=cnl-quick-reference-example-1-loan-eligibility-paragraph-33 -->
A rule that checks multiple criteria before approving a loan application.
<!-- /glossary:block -->

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

### Example 2: Insurance Quote with Struct Return

<!-- glossary:block id=cnl-quick-reference-example-2-insurance-quote-with-struct-return-paragraph-34 -->
A rule that calculates an insurance quote and returns a structured result.
<!-- /glossary:block -->

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

### Example 3: Tiered Pricing with Multiple Rules

<!-- glossary:block id=cnl-quick-reference-example-3-tiered-pricing-with-multiple-rules-paragraph-35 -->
A module with a struct definition and a pricing rule that uses text comparison.
<!-- /glossary:block -->

```
Module Pricing.Subscription.

Define Plan has name as Text, monthlyRate as Int, userLimit as Int.

Rule resolvePlan given tier as Text, produce Plan:
  If tier is "enterprise"
    Return Plan with name set to "Enterprise", monthlyRate set to 299, userLimit set to 500.
  If tier is "team"
    Return Plan with name set to "Team", monthlyRate set to 49, userLimit set to 20.
  Return Plan with name set to "Starter", monthlyRate set to 9, userLimit set to 3.
```

### Example 4: Chinese Locale

<!-- glossary:block id=cnl-quick-reference-example-4-chinese-locale-paragraph-36 -->
The same pricing logic expressed with Chinese keywords.
<!-- /glossary:block -->

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

## Syntax Summary

<!-- glossary:block id=cnl-quick-reference-syntax-summary-paragraph-37 -->
| Construct | Pattern |
|-----------|---------|
| Module declaration | `Module <Name>.` |
| Struct definition | `Define <Name> has <field> as <Type>, ...` |
| Rule signature | `Rule <name> given <params>, produce <Type>:` |
| Parameter | `<name> as <Type>` |
| If condition | `If <condition>` |
| Return value | `Return <expr>.` |
| Otherwise | `Otherwise` |
| Local binding | `Let <name> be <expr>.` |
| Construction | `<Type> with <field> set to <value>, ...` |
| Field access | `<param>.<field>` |
| Equality test | `<expr> is <expr>` |
| Logical AND | `<expr> and <expr>` |
| Logical OR | `<expr> or <expr>` |
<!-- /glossary:block -->
