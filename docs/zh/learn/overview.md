---
outline: deep
---

# 学习 Aster Lang

Aster CNL（受控自然语言）是一种专为以可读、可审计的语句表达业务规则而设计的语言。用 Aster CNL 编写的策略会编译为确定性的核心表示，可通过 REST API、GraphQL、WebSocket 或直接在浏览器中评估。

本节涵盖从初次接触到生产部署所需的一切。

## 什么是 Aster CNL？

Aster CNL 介于纯英语和传统编程语言之间。它对机器来说足够严格，可以无歧义地解析；同时对领域专家 — 承保人、合规官、产品经理 — 来说足够自然，无需开发人员协助即可阅读和编写。

一个最简策略如下：

```
Module pricing.

Rule discountedPrice given amount as Int, tier as Text, produce Int:
  If tier is "gold"
    Return amount times 80 divided by 100.
  Return amount.
```

Aster CNL 的关键特性：

- **确定性** — 相同的输入始终产生相同的输出，无副作用。
- **类型化** — 每个参数和返回值都携带显式类型（`Int`、`Float`、`Text`、`Bool`、`DateTime` 或用户定义的结构体）。
- **多语言** — 策略可以用英语（`EN_US`）、简体中文（`ZH_CN`）或德语（`DE_DE`）使用本地化关键字编写。
- **可审计** — 引擎为每次评估记录防篡改的决策追踪。

## 从哪里开始

| 目标 | 页面 |
|------|------|
| 立即在浏览器中尝试 Aster CNL | [演练场](./playground) |
| 通过示例学习完整语法 | [CNL 快速参考](./cnl-quick-reference) |
| 在 JavaScript/TypeScript 中编译和验证策略 | [浏览器 API 参考](./browser-api) |
| 将策略部署到引擎并大规模调用 | [部署指南](./deployment-guide) |

## Aster CNL 如何协同工作

```
                                 +------------------+
  编写策略 (CNL)           --->   |  浏览器 API      |  <--- 验证、提取 schema、
                                 |  (aster-lang-ts)  |       生成示例输入
                                 +--------+---------+
                                          |
                                    部署源码
                                          |
                                          v
                                 +------------------+
                                 |  REST API        |  <--- 评估策略、
                                 |  (aster-api)     |       管理版本、审计
                                 +------------------+
```

1. **编写** — 使用演练场或任何文本编辑器编写 Aster CNL 策略。
2. **验证** — 使用浏览器 API 或演练场在部署前捕获语法错误。
3. **部署** — 将策略源码提交到 REST API。引擎编译并存储它。
4. **评估** — 使用输入数据调用已部署的策略。引擎返回类型化结果和审计记录。
5. **监控** — 查询版本历史、审计日志和异常检测端点以维持合规。

## 多语言支持

Aster CNL 不仅限于英语。相同的逻辑策略可以用任何支持的区域设置表达：

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

浏览器 API 和 REST API 接受 `locale` 或 `lexicon` 参数，告诉编译器使用哪个关键字集。所有区域设置都编译为相同的核心表示。

## 下一步

- [演练场](./playground) — 体验实时编译和 schema 提取。
- [CNL 快速参考](./cnl-quick-reference) — 完整语法一页通。
- [浏览器 API 参考](./browser-api) — 将 Aster CNL 集成到你的前端或 Node.js 工具中。
- [部署指南](./deployment-guide) — 将策略从源码带到生产环境。
