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
    text: 'Workflows',
    items: [
      { text: 'Workflow Events', link: '/api/workflows/events' },
      { text: 'Workflow State', link: '/api/workflows/state' },
      { text: 'Metrics', link: '/api/workflows/metrics' },
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
    text: 'Policy Management',
    items: [
      { text: 'Version History', link: '/api/policies/versions' },
      { text: 'Rollback', link: '/api/policies/rollback' },
      { text: 'Cache Management', link: '/api/policies/cache' },
    ],
  },
  {
    text: 'GraphQL',
    items: [
      { text: 'Overview', link: '/api/graphql/overview' },
      { text: 'Queries', link: '/api/graphql/queries' },
      { text: 'Mutations', link: '/api/graphql/mutations' },
    ],
  },
  {
    text: 'WebSocket',
    items: [
      { text: 'Preview Endpoint', link: '/api/websocket/preview' },
    ],
  },
]

const communitySidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Community',
    items: [
      { text: 'Überblick', link: '/community/' },
      { text: 'Mitwirken', link: '/community/contribute' },
      { text: 'Lexicon Packs', link: '/community/lexicons' },
      { text: 'Gewünschte Sprachen', link: '/community/wanted-languages' },
      { text: 'Blog', link: '/blog/' },
    ],
  },
  {
    text: 'Compliance',
    items: [
      { text: 'Überblick', link: '/community/compliance/' },
      { text: 'AVV/DPA-Vorlage', link: '/community/compliance/dpa-template' },
      { text: 'Self-service DSAR', link: '/community/compliance/dsar' },
      { text: 'Telemetrie-Felder', link: '/community/compliance/telemetry-fields' },
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
      { text: 'API', link: '/api/policies/evaluate' },
      { text: 'Editionen', link: '/de/editions/' },
      { text: 'Community', link: '/de/community/' },
      { text: 'Cloud', link: 'https://aster-lang.cloud' },
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
      '/community/': communitySidebar,
    },
    footer: {
      message: 'Veröffentlicht unter der Apache License 2.0.',
      copyright: 'Copyright © 2025 Aster Language Team',
    },
  },
}
