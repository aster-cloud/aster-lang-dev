import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  title: 'Aster Lang',
  description: 'API Reference & Developer Documentation for Aster Policy Engine',
  themeConfig: {
    nav: [
      { text: 'Learn', link: '/learn/overview' },
      { text: 'Playground', link: '/learn/playground' },
      { text: 'API', link: '/api/policies/evaluate' },
      { text: 'Editions', link: '/editions/' },
      { text: 'Community', link: '/community/' },
      { text: 'Cloud', link: 'https://aster-lang.cloud' },
    ],
    sidebar: {
      '/learn/': [
        {
          text: 'Learn Aster',
          items: [
            { text: 'Overview', link: '/learn/overview' },
            { text: 'CNL Quick Reference', link: '/learn/cnl-quick-reference' },
            { text: 'Playground', link: '/learn/playground' },
            { text: 'Deployment Guide', link: '/learn/deployment-guide' },
            { text: 'Browser API', link: '/learn/browser-api' },
          ],
        },
      ],
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Overview', link: '/getting-started/overview' },
            { text: 'Authentication', link: '/getting-started/authentication' },
            { text: 'Quick Start', link: '/getting-started/quickstart' },
            { text: 'Error Handling', link: '/getting-started/errors' },
          ],
        },
      ],
      '/api/': [
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
      ],
      '/community/': [
        {
          text: 'Community',
          items: [
            { text: 'Overview', link: '/community/' },
            { text: 'Contribute', link: '/community/contribute' },
            { text: 'Lexicon Packs', link: '/community/lexicons' },
            { text: 'Wanted Languages', link: '/community/wanted-languages' },
            { text: 'Blog', link: '/blog/' },
          ],
        },
        {
          text: 'Compliance',
          items: [
            { text: 'Overview', link: '/community/compliance/' },
            { text: 'DPA Template', link: '/community/compliance/dpa-template' },
            { text: 'Self-service DSAR', link: '/community/compliance/dsar' },
            { text: 'Telemetry Fields', link: '/community/compliance/telemetry-fields' },
          ],
        },
      ],
    },
    footer: {
      message: 'Released under the Apache License 2.0.',
      copyright: 'Copyright © 2025 Aster Language Team',
    },
  },
}
