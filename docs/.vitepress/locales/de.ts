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

export const deConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  title: 'Aster Lang',
  description: 'API-Referenz & Entwicklerdokumentation für die Aster Policy Engine',
  themeConfig: {
    nav: [
      { text: 'Lernen', link: '/de/learn/overview' },
      { text: 'Spielplatz', link: '/de/learn/playground' },
      { text: 'REST API', link: '/api/policies/evaluate' },
      { text: 'GraphQL', link: '/graphql/overview' },
      { text: 'Sprachdokumentation', link: 'https://aster-lang.org' },
      { text: 'GitHub', link: 'https://github.com/aster-cloud/aster-lang-dev' },
    ],
    sidebar: {
      '/de/learn/': [
        {
          text: 'Aster lernen',
          items: [
            { text: 'Überblick', link: '/de/learn/overview' },
            { text: 'CNL-Kurzreferenz', link: '/de/learn/cnl-quick-reference' },
            { text: 'Spielplatz', link: '/de/learn/playground' },
            { text: 'Bereitstellungsanleitung', link: '/de/learn/deployment-guide' },
            { text: 'Browser-API', link: '/de/learn/browser-api' },
          ],
        },
      ],
      '/de/getting-started/': [
        {
          text: 'Erste Schritte',
          items: [
            { text: 'Überblick', link: '/de/getting-started/overview' },
            { text: 'Authentifizierung', link: '/de/getting-started/authentication' },
            { text: 'Schnellstart', link: '/de/getting-started/quickstart' },
            { text: 'Fehlerbehandlung', link: '/de/getting-started/errors' },
          ],
        },
      ],
      '/api/': apiSidebar,
      '/graphql/': graphqlSidebar,
      '/websocket/': websocketSidebar,
    },
    footer: {
      message: 'Veröffentlicht unter der MIT-Lizenz.',
      copyright: 'Copyright © 2025 Aster Language Team',
    },
    editLink: {
      pattern: 'https://github.com/aster-cloud/aster-lang-dev/edit/main/docs/:path',
      text: 'Diese Seite auf GitHub bearbeiten',
    },
  },
}
