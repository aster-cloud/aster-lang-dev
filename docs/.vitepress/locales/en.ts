import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  title: 'Aster Lang',
  description: 'CNL language guide for Aster Lang — multilingual policy/workflow/decision authoring.',
  themeConfig: {
    nav: [
      { text: 'Learn', link: '/learn/overview' },
      { text: 'Playground', link: '/learn/playground' },
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
