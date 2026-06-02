import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

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
  description: 'CNL-Sprachleitfaden für Aster Lang — mehrsprachige Policy/Workflow/Decision-Erstellung.',
  themeConfig: {
    nav: [
      { text: 'Lernen', link: '/de/learn/overview' },
      { text: 'Spielplatz', link: '/de/learn/playground' },
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
      '/community/': communitySidebar,
    },
    footer: {
      message: 'Veröffentlicht unter der Apache License 2.0.',
      copyright: 'Copyright © 2025 Aster Language Team',
    },
  },
}
