---
outline: deep
---

# CNL 快速参考

本页是 Aster CNL（受控自然语言）语法的综合参考。除非另有说明，所有示例使用英语（`EN_US`）关键字集。

## 模块声明

每个策略以一个模块声明开始。模块名是以句号结尾的点分隔标识符。

```
Module <Name>.
```

示例：

```
Module pricing.
Module Loan.Approval.
Module Insurance.Auto.Quote.
```

模块名用于通过 REST API 部署和评估策略时的寻址。

## 规则定义

规则是一个带有类型化参数和返回类型的命名函数。主体是一个缩进的语句块。

```
Rule <name> given <param> as <Type>, produce <ReturnType>:
  <body>
```

- `given` 引入参数列表。
- 每个参数写成 `<name> as <Type>`。
- 多个参数用逗号分隔。
- `produce` 声明返回类型。
- 签名末尾的冒号打开主体块。

示例：

```
Rule calculateDiscount given amount as Int, tier as Text, produce Int:
  If tier is "gold"
    Return amount times 20 divided by 100.
  If tier is "silver"
    Return amount times 10 divided by 100.
  Return 0.
```

### 无参数规则

当规则不接受参数时，省略 `given` 子句：

```
Rule defaultRate produce Float:
  Return 3.5.
```

### 结构体参数规则

参数可以使用用户定义的结构体类型：

```
Rule evaluateApplicant given applicant as Applicant, produce Bool:
  If applicant.creditScore at least 700
    Return true.
  Return false.
```

## 数据/结构体定义

使用 `Define` 声明带有类型化字段的命名记录类型。字段用逗号分隔。定义以句号结尾。

```
Define <Name> has <field> as <Type>, <field2> as <Type2>.
```

示例：

```
Define Applicant has name as Text, age as Int, creditScore as Int.
Define Vehicle has make as Text, year as Int, value as Int.
Define Address has street as Text, city as Text, postalCode as Text.
```

结构体类型可用作参数类型、返回类型和其他结构体中的字段类型：

```
Define Customer has name as Text, address as Address.
```

## 类型系统

Aster CNL 提供五种内置原始类型并支持用户定义的结构体类型。

### 原始类型

| 类型 | 描述 | 示例值 |
|------|-------------|----------------|
| `Int` | 整数 | `0`、`42`、`-7` |
| `Float` | 浮点数 | `3.14`、`0.5`、`-1.0` |
| `Text` | 字符串字面量（双引号） | `"hello"`、`"gold"` |
| `Bool` | 布尔值 | `true`、`false` |

::: tip DateTime 推断
DateTime 不是你在源代码中编写的关键字。编译器会为名称匹配时间模式的字段（如 `createdAt`、`birthday`、`expiryDate`）推断 `DateTime` 类型。你不需要显式声明它。
:::

### 自定义类型（结构体）

通过 `Define` 声明引入的任何名称都成为有效类型：

```
Define Policy has premium as Int, deductible as Int.

Rule quote given age as Int, produce Policy:
  If age less than 25
    Return Policy with premium set to 500, deductible set to 1000.
  Return Policy with premium set to 300, deductible set to 500.
```

## 控制流

### If 语句

条件逻辑使用 `If` 后跟条件。主体必须缩进。

```
If <condition>
  <body>
```

`If` 语句可以链式连接。第一个条件为 `true` 的分支执行，其 `Return` 语句从规则返回值。

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

### 嵌套条件

通过增加缩进可以嵌套条件：

```
Rule evaluate given applicant as Applicant, tier as Text, produce Bool:
  If applicant.creditScore at least 700
    If tier is "premium"
      Return true.
  Return false.
```

## 表达式和运算符

### 算术运算符

| 运算符 | 描述 | 示例 |
|----------|-------------|---------|
| `plus` | 加法 | `amount plus 10` |
| `minus` | 减法 | `price minus discount` |
| `times` | 乘法 | `quantity times unitPrice` |
| `divided by` | 除法 | `total divided by count` |

算术表达式遵循标准优先级：`times` 和 `divided by` 的绑定比 `plus` 和 `minus` 更紧。需要时使用分组以保持清晰。

### 比较运算符

| 运算符 | 描述 | 示例 |
|----------|-------------|---------|
| `greater than` | 大于 | `age greater than 18` |
| `less than` | 小于 | `score less than 50` |
| `at least` | 大于或等于 | `income at least 30000` |
| `at most` | 小于或等于 | `balance at most 0` |
| `is` | 相等 | `tier is "gold"` |
| `equals to` | 相等（数值） | `count equals to 5` |

### 逻辑运算符

| 运算符 | 描述 | 示例 |
|----------|-------------|---------|
| `and` | 逻辑与 | `age at least 18 and income at least 30000` |
| `or` | 逻辑或 | `tier is "gold" or tier is "platinum"` |
| `not` | 逻辑非 | `not isExpired` |

逻辑运算符可以在单个条件中组合：

```
If applicant.age at least 18 and applicant.creditScore at least 650 and applicant.income at least 25000
  Return true.
```

## 构造表达式

要返回结构体类型的值，使用带 `with <field> set to <value>` 的构造表达式：

```
<TypeName> with <field> set to <value>, <field2> set to <value2>
```

示例：

```
Define Quote has premium as Int, deductible as Int.

Rule calculateQuote given vehicleValue as Int, year as Int, produce Quote:
  If year less than 2015
    Return Quote with premium set to vehicleValue times 5 divided by 100, deductible set to 1000.
  Return Quote with premium set to vehicleValue times 3 divided by 100, deductible set to 500.
```

每个 `<field> set to <value>` 子句分配一个字段。多个子句在 `with` 关键字后用逗号分隔。结构体上声明的所有字段都应赋值。

## 字段访问

使用点符号访问结构体参数上的字段：

```
applicant.creditScore
vehicle.year
address.city
```

字段访问可用于条件、算术运算和作为构造表达式的参数。

## 多语言支持

Aster CNL 支持多种区域设置。相同的逻辑策略使用特定区域的关键字表达。下表显示了支持的区域设置之间的关键字等价对照。

| 概念 | 英语 (`EN_US`) | 中文 (`ZH_CN`) | 德语 (`DE_DE`) |
|---------|-------------------|--------------------|-------------------|
| 模块 | `Module` | `模块` | `Modul` |
| 规则 | `Rule` | `规则` | `Regel` |
| 给定 | `given` | `给定` | `gegeben` |
| 类型 | `as` | `为` | `als` |
| 产出 | `produce` | `产出` | `liefert` |
| 定义 | `Define` | `定义` | `Definiere` |
| 包含 | `has` | `包含` | `hat` |
| 如果 | `If` | `如果` | `wenn` |
| 且 | `and` | `且` | `und` |
| 或 | `or` | `或` | `oder` |
| 是 | `is` | `是` | `ist` |
| 设为 | `set ... to` | `将 ... 设为` | `setze ... auf` |
| 返回 | `Return` | `返回` | `gib zurueck` |

编译器接受 `lexicon` 参数，告诉它使用哪个关键字集。所有区域设置编译为相同的核心表示。

## 完整示例

### 示例 1：贷款资格审查

一个在批准贷款申请前检查多个条件的规则。

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

### 示例 2：带结构体返回的保险报价

一个计算保险报价并返回结构化结果的规则。

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

### 示例 3：分级定价与多规则

一个包含结构体定义和使用文本比较的定价规则的模块。

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

### 示例 4：中文区域设置

相同的定价逻辑用中文关键字表达。

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

## 语法总结

| 构造 | 模式 |
|-----------|---------|
| 模块声明 | `Module <Name>.` |
| 结构体定义 | `Define <Name> has <field> as <Type>, ...` |
| 规则签名 | `Rule <name> given <params>, produce <Type>:` |
| 参数 | `<name> as <Type>` |
| If 条件 | `If <condition>` |
| 返回值 | `Return <expr>.` |
| 否则 | `Otherwise` |
| 局部绑定 | `Let <name> be <expr>.` |
| 构造 | `<Type> with <field> set to <value>, ...` |
| 字段访问 | `<param>.<field>` |
| 相等测试 | `<expr> is <expr>` |
| 逻辑与 | `<expr> and <expr>` |
| 逻辑或 | `<expr> or <expr>` |
