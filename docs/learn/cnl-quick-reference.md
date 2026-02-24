---
outline: deep
---

# CNL Quick Reference

This page is a comprehensive reference for Aster CNL (Controlled Natural Language) syntax. All examples use the English (`EN_US`) keyword set unless noted otherwise.

## Module Declaration

Every policy begins with exactly one module declaration. The module name is a dot-separated identifier that ends with a period.

```
Module <Name>.
```

Examples:

```
Module pricing.
Module Loan.Approval.
Module Insurance.Auto.Quote.
```

The module name is used to address the policy when deploying and evaluating via the REST API.

## Rule Definition

A rule is a named function with typed parameters and a return type. The body is an indented block of statements.

```
Rule <name> given <param> as <Type>, produce <ReturnType>:
  <body>
```

- `given` introduces the parameter list.
- Each parameter is written as `<name> as <Type>`.
- Multiple parameters are separated by commas.
- `produce` declares the return type.
- The colon at the end of the signature opens the body block.

Example:

```
Rule calculateDiscount given amount as Int, tier as Text, produce Int:
  If tier is "gold":
    produce amount * 20 / 100
  If tier is "silver":
    produce amount * 10 / 100
  produce 0
```

### Rules with No Parameters

When a rule takes no parameters, omit the `given` clause:

```
Rule defaultRate produce Float:
  produce 3.5
```

### Rules with Struct Parameters

Parameters can use user-defined struct types:

```
Rule evaluateApplicant given applicant as Applicant, produce Bool:
  If applicant.creditScore >= 700:
    produce true
  produce false
```

## Data / Struct Definitions

Use `Define` to declare a named record type with typed fields. Fields are separated by commas. The definition ends with a period.

```
Define <Name> has <field> as <Type>, <field2> as <Type2>.
```

Examples:

```
Define Applicant has name as Text, age as Int, creditScore as Int.
Define Vehicle has make as Text, year as Int, value as Int.
Define Address has street as Text, city as Text, postalCode as Text.
```

Struct types can be used as parameter types, return types, and field types in other structs:

```
Define Customer has name as Text, address as Address.
```

## Type System

Aster CNL provides five built-in primitive types and supports user-defined struct types.

### Primitive Types

| Type | Description | Example values |
|------|-------------|----------------|
| `Int` | Integer number | `0`, `42`, `-7` |
| `Float` | Floating-point number | `3.14`, `0.5`, `-1.0` |
| `Text` | String literal (double-quoted) | `"hello"`, `"gold"` |
| `Bool` | Boolean value | `true`, `false` |
| `DateTime` | Date and time value | Used for temporal comparisons |

### Custom Types (Structs)

Any name introduced by a `Define` declaration becomes a valid type:

```
Define Policy has premium as Int, deductible as Int.

Rule quote given age as Int, produce Policy:
  If age < 25:
    produce Policy set premium to 500, deductible to 1000
  produce Policy set premium to 300, deductible to 500
```

## Control Flow

### If Statements

Conditional logic uses `If` followed by a condition and a colon. The body must be indented.

```
If <condition>:
  <body>
```

`If` statements can be chained. The first branch whose condition evaluates to `true` executes, and its `produce` statement returns a value from the rule.

```
Rule classify given score as Int, produce Text:
  If score >= 90:
    produce "excellent"
  If score >= 70:
    produce "good"
  If score >= 50:
    produce "average"
  produce "poor"
```

### Nested Conditions

Conditions can be nested by increasing indentation:

```
Rule evaluate given applicant as Applicant, tier as Text, produce Bool:
  If applicant.creditScore >= 700:
    If tier is "premium":
      produce true
  produce false
```

## Expressions and Operators

### Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `amount + 10` |
| `-` | Subtraction | `price - discount` |
| `*` | Multiplication | `quantity * unitPrice` |
| `/` | Division | `total / count` |

Arithmetic expressions follow standard precedence: multiplication and division bind tighter than addition and subtraction. Use grouping where needed for clarity.

### Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `>` | Greater than | `age > 18` |
| `<` | Less than | `score < 50` |
| `>=` | Greater than or equal | `income >= 30000` |
| `<=` | Less than or equal | `balance <= 0` |
| `is` | Equality | `tier is "gold"` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `and` | Logical AND | `age >= 18 and income >= 30000` |
| `or` | Logical OR | `tier is "gold" or tier is "platinum"` |
| `not` | Logical NOT | `not isExpired` |

Logical operators can be combined in a single condition:

```
If applicant.age >= 18 and applicant.creditScore >= 650 and applicant.income >= 25000:
  produce true
```

## Construction Expressions

To return a value of a struct type, use a construction expression with `set ... to`:

```
<TypeName> set <field> to <value>, <field2> to <value2>
```

Example:

```
Define Quote has premium as Int, deductible as Int.

Rule calculateQuote given vehicleValue as Int, year as Int, produce Quote:
  If year < 2015:
    produce Quote set premium to vehicleValue * 5 / 100, deductible to 1000
  produce Quote set premium to vehicleValue * 3 / 100, deductible to 500
```

Each `set <field> to <value>` clause assigns one field. Multiple clauses are separated by commas. All fields declared on the struct should be assigned.

## Field Access

Access fields on a struct parameter using dot notation:

```
applicant.creditScore
vehicle.year
address.city
```

Field access can be used in conditions, arithmetic, and as arguments to construction expressions.

## Multi-Language Support

Aster CNL supports multiple locales. The same logical policy is expressed using locale-specific keywords. The following table shows keyword equivalents across supported locales.

| Concept | English (`EN_US`) | Chinese (`ZH_CN`) | German (`DE_DE`) |
|---------|-------------------|--------------------|-------------------|
| Module | `Module` | `模块` | `Modul` |
| Rule | `Rule` | `规则` | `Regel` |
| Given | `given` | `给定` | `gegeben` |
| As (type) | `as` | `为` | `als` |
| Produce | `produce` | `产出` | `gibt` |
| Define | `Define` | `定义` | `Definiere` |
| Has | `has` | `有` | `hat` |
| If | `If` | `如果` | `Wenn` |
| And | `and` | `且` | `und` |
| Or | `or` | `或` | `oder` |
| Is | `is` | `是` | `ist` |
| Set...to | `set ... to` | `设 ... 为` | `setze ... auf` |

The compiler accepts a `lexicon` parameter that tells it which keyword set to use. All locales compile to the same core representation.

## Complete Examples

### Example 1: Loan Eligibility

A rule that checks multiple criteria before approving a loan application.

```
Module Loan.Approval.

Define Applicant has name as Text, age as Int, creditScore as Int, income as Int.

Rule isEligible given applicant as Applicant, requestedAmount as Int, produce Bool:
  If applicant.age < 18:
    produce false
  If applicant.creditScore < 650:
    produce false
  If applicant.income < requestedAmount * 3:
    produce false
  produce true
```

### Example 2: Insurance Quote with Struct Return

A rule that calculates an insurance quote and returns a structured result.

```
Module Insurance.Auto.

Define Vehicle has make as Text, year as Int, value as Int.
Define Quote has premium as Int, deductible as Int, coverage as Text.

Rule generateQuote given vehicle as Vehicle, driverAge as Int, produce Quote:
  If driverAge < 25:
    If vehicle.value > 50000:
      produce Quote set premium to 4800, deductible to 2000, coverage to "basic"
    produce Quote set premium to 3200, deductible to 1500, coverage to "basic"
  If vehicle.year < 2015:
    produce Quote set premium to vehicle.value * 4 / 100, deductible to 1000, coverage to "standard"
  produce Quote set premium to vehicle.value * 3 / 100, deductible to 500, coverage to "full"
```

### Example 3: Tiered Pricing with Multiple Rules

A module with a struct definition and a pricing rule that uses text comparison.

```
Module Pricing.Subscription.

Define Plan has name as Text, monthlyRate as Int, userLimit as Int.

Rule resolvePlan given tier as Text, produce Plan:
  If tier is "enterprise":
    produce Plan set name to "Enterprise", monthlyRate to 299, userLimit to 500
  If tier is "team":
    produce Plan set name to "Team", monthlyRate to 49, userLimit to 20
  produce Plan set name to "Starter", monthlyRate to 9, userLimit to 3
```

### Example 4: Chinese Locale

The same pricing logic expressed with Chinese keywords.

```
模块 定价。

定义 报价 有 单价 为 整数，折扣 为 整数。

规则 计算报价 给定 数量 为 整数，会员等级 为 文本，产出 报价：
  如果 会员等级 是 "金牌"：
    产出 报价 设 单价 为 数量 * 80 / 100，折扣 为 20
  如果 会员等级 是 "银牌"：
    产出 报价 设 单价 为 数量 * 90 / 100，折扣 为 10
  产出 报价 设 单价 为 数量，折扣 为 0
```

## Syntax Summary

| Construct | Pattern |
|-----------|---------|
| Module declaration | `Module <Name>.` |
| Struct definition | `Define <Name> has <field> as <Type>, ...` |
| Rule signature | `Rule <name> given <params>, produce <Type>:` |
| Parameter | `<name> as <Type>` |
| If condition | `If <expr>:` |
| Return value | `produce <expr>` |
| Construction | `<Type> set <field> to <value>, ...` |
| Field access | `<param>.<field>` |
| Equality test | `<expr> is <expr>` |
| Logical AND | `<expr> and <expr>` |
| Logical OR | `<expr> or <expr>` |
