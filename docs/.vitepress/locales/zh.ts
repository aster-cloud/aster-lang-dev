import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

const apiSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Policy Evaluation',
    items: [
      { text: 'Evaluate Policy', link: '/api/policies/evaluate' },
      { text: 'Evaluate Source', link: '/api/policies/evaluate-source' },
      { text: 'Evaluate JSON', link: '/api/policies/evaluate-json' },
      { text: 'Batch Evaluate', link: '/api/policies/batch' },
      { text: 'Extract Schema', link: '/api/policies/schema' },
      { text: 'Validate Policy', link: '/api/policies/validate' },
    ],
  },
  {
    text: 'Policy Management',
    items: [
      { text: 'Version History', link: '/api/policies/versions' },
      { text: 'Rollback', link: '/api/policies/rollback' },
      { text: 'Cache Management', link: '/api/policies/cache' },
    ],
  },
  {
    text: 'Audit',
    items: [
      { text: 'Audit Logs', link: '/api/audit/logs' },
      { text: 'Hash Chain Verification', link: '/api/audit/verify-chain' },
      { text: 'Version Usage', link: '/api/audit/version-usage' },
      { text: 'Anomaly Detection', link: '/api/audit/anomalies' },
      { text: 'Version Comparison', link: '/api/audit/compare' },
    ],
  },
  {
    text: 'Workflows',
    items: [
      { text: 'Workflow Events', link: '/api/workflows/events' },
      { text: 'Workflow State', link: '/api/workflows/state' },
      { text: 'Metrics', link: '/api/workflows/metrics' },
    ],
  },
]

const graphqlSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'GraphQL API',
    items: [
      { text: 'Overview', link: '/graphql/overview' },
      { text: 'Queries', link: '/graphql/queries' },
      { text: 'Mutations', link: '/graphql/mutations' },
    ],
  },
]

const websocketSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'WebSocket',
    items: [
      { text: 'Preview Endpoint', link: '/websocket/preview' },
    ],
  },
]

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  title: 'Aster Lang',
  description: 'Aster 策略引擎 API 参考与开发者文档',
  themeConfig: {
    nav: [
      { text: '学习', link: '/zh/learn/overview' },
      { text: '演练场', link: '/zh/learn/playground' },
      { text: 'REST API', link: '/api/policies/evaluate' },
      { text: 'GraphQL', link: '/graphql/overview' },
      { text: '语言文档', link: 'https://aster-lang.org' },
      { text: 'GitHub', link: 'https://github.com/aster-cloud/aster-lang-dev' },
    ],
    sidebar: {
      '/zh/learn/': [
        {
          text: '学习 Aster',
          items: [
            { text: '概述', link: '/zh/learn/overview' },
            { text: 'CNL 快速参考', link: '/zh/learn/cnl-quick-reference' },
            { text: '演练场', link: '/zh/learn/playground' },
            { text: '部署指南', link: '/zh/learn/deployment-guide' },
            { text: '浏览器 API', link: '/zh/learn/browser-api' },
          ],
        },
      ],
      '/zh/getting-started/': [
        {
          text: '快速入门',
          items: [
            { text: '概述', link: '/zh/getting-started/overview' },
            { text: '认证', link: '/zh/getting-started/authentication' },
            { text: '快速开始', link: '/zh/getting-started/quickstart' },
            { text: '错误处理', link: '/zh/getting-started/errors' },
          ],
        },
      ],
      '/api/': apiSidebar,
      '/graphql/': graphqlSidebar,
      '/websocket/': websocketSidebar,
    },
    footer: {
      message: '基于 MIT 许可证发布。',
      copyright: '版权所有 © 2025 Aster Language 团队',
    },
    editLink: {
      pattern: 'https://github.com/aster-cloud/aster-lang-dev/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },
}
