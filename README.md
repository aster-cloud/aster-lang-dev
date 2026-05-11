# aster-lang-dev

> 开发者门户与公开文档站点 —— 部署在 [aster-lang.dev](https://aster-lang.dev)

Aster Lang 生态的开源开发者入口。基于 [VitePress](https://vitepress.dev/) 构建，包含：

- 📖 **API 文档**：REST / GraphQL / WebSocket 全量参考
- 🎮 **Playground**：内嵌 CodeMirror 编辑器，浏览器内编译并执行 Aster CNL（基于 [`@aster-cloud/aster-lang-ts`](https://www.npmjs.com/package/@aster-cloud/aster-lang-ts)）
- 🌍 **多语言**：英文 / 中文 / 德语 三语对齐
- 🚀 **入门指南**：5 分钟从零到第一条规则上线

---

## 在生态中的位置

```
        🏢 Enterprise (k3s + ArgoCD)
              ↑
       💼 SaaS (aster-cloud)
              ↑
       🎮 Playground / 文档    ← 你在这里
              ↑
       📖 开发者发现 / 学习
```

aster-lang-dev 是开发者**第一次接触 Aster** 的地方。它的目标不是覆盖所有功能，而是让访客在 **5 分钟内**理解：

1. Aster CNL 长什么样
2. 它能解决什么业务问题
3. 怎么 5 行代码接入 REST API

更复杂的工作流（团队协作、审计、计费）由 [aster-cloud](https://aster-lang.cloud) SaaS 承接。

---

## 快速开始（本地开发）

```bash
# 安装依赖
pnpm install

# 启动开发服务器（默认 http://localhost:5173）
pnpm docs:dev

# 构建静态站点
pnpm docs:build

# 预览构建产物
pnpm docs:preview
```

> **要求**：Node.js ≥ 20，pnpm ≥ 10。

---

## 目录结构

```
docs/
├── index.md              # 英文主页（VitePress home layout）
├── zh/index.md           # 中文主页
├── de/index.md           # 德语主页
├── getting-started/      # 入门：quickstart / authentication / errors
├── api/                  # REST API 参考
├── graphql/              # GraphQL Schema 与示例
├── websocket/            # WebSocket 流式评估
├── learn/                # 概念文档：CNL 速查、Playground 教程、部署指南
└── public/               # 静态资源
```

---

## Playground 工作原理

Playground 使用同一个 npm 包 `@aster-cloud/aster-lang-ts`（aster-lang-ts 仓库发布），意味着：

- ✅ Playground 演示的语义 = 生产 SaaS 实际运行的语义
- ✅ 浏览器内编译执行，无后端依赖
- ✅ 离线也能用

代码集成参考 `docs/learn/playground.md`。

---

## 翻译协作

每种语言的页面在 `docs/<lang>/` 下。新增条目时：

1. 先写英文版本（`docs/<page>.md`），它是事实来源（source of truth）
2. 再同步翻译到 `zh/` 和 `de/`
3. 三语标题与 frontmatter（如 `outline`, `aside`）保持一致

---

## 部署

部署到 Cloudflare Pages（详见 aster-deploy 仓库 `docs/local-debug.md` 的 Cloudflare 部分）。`main` 分支推送后自动构建。

---

## 关联仓库

| 仓库 | 关系 |
|---|---|
| [aster-lang-ts](../aster-lang-ts) | 提供 `@aster-cloud/aster-lang-ts` npm 包，Playground 编译核心 |
| [aster-api](../aster-api) | API 文档对应的真实后端 |
| [aster-cloud](../aster-cloud) | 文档中"Sign Up"按钮的目的地 |
| [aster-deploy](../aster-deploy) | 整体部署编排，含本仓库的 build/release 任务 |

---

## License

MIT —— 文档与示例代码可自由使用。
