import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Aster Lang',
  description: 'API Reference & Developer Documentation for Aster Policy Engine',
  base: '/',
  ignoreDeadLinks: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],
  vite: {
    optimizeDeps: {
      include: ['@codemirror/state', '@codemirror/view'],
    },
    ssr: {
      noExternal: ['@aster-cloud/aster-lang-ts'],
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Learn', link: '/learn/overview' },
      { text: 'Playground', link: '/learn/playground' },
      { text: 'REST API', link: '/api/policies/evaluate' },
      { text: 'GraphQL', link: '/graphql/overview' },
      { text: 'Language Docs', link: 'https://aster-lang.org' },
      { text: 'GitHub', link: 'https://github.com/aster-cloud/aster-lang-dev' },
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
      ],
      '/graphql/': [
        {
          text: 'GraphQL API',
          items: [
            { text: 'Overview', link: '/graphql/overview' },
            { text: 'Queries', link: '/graphql/queries' },
            { text: 'Mutations', link: '/graphql/mutations' },
          ],
        },
      ],
      '/websocket/': [
        {
          text: 'WebSocket',
          items: [
            { text: 'Preview Endpoint', link: '/websocket/preview' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aster-cloud/aster-lang-dev' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright \u00a9 2025 Aster Language Team',
    },
    editLink: {
      pattern: 'https://github.com/aster-cloud/aster-lang-dev/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
