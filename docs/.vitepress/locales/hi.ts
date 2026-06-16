import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

const communitySidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'समुदाय',
    items: [
      { text: 'अवलोकन', link: '/community/' },
      { text: 'योगदान करें', link: '/community/contribute' },
      { text: 'Lexicon पैक', link: '/community/lexicons' },
      { text: 'वांछित भाषाएँ', link: '/community/wanted-languages' },
      { text: 'ब्लॉग', link: '/blog/' },
    ],
  },
]

export const hiConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  title: 'Aster Lang',
  description: 'Aster Lang के लिए CNL भाषा गाइड — बहुभाषी policy/workflow/decision लेखन।',
  themeConfig: {
    nav: [
      { text: 'सीखें', link: '/hi/learn/overview' },
      { text: 'प्लेग्राउंड', link: '/hi/learn/playground' },
      { text: 'संस्करण', link: '/hi/editions/' },
      { text: 'समुदाय', link: '/hi/community/' },
      { text: 'Cloud', link: 'https://aster-lang.cloud' },
    ],
    sidebar: {
      '/hi/learn/': [
        {
          text: 'Aster सीखें',
          items: [
            { text: 'अवलोकन', link: '/hi/learn/overview' },
            { text: 'CNL त्वरित संदर्भ', link: '/hi/learn/cnl-quick-reference' },
            { text: 'प्लेग्राउंड', link: '/hi/learn/playground' },
            { text: 'परिनियोजन गाइड', link: '/hi/learn/deployment-guide' },
            { text: 'Browser API', link: '/hi/learn/browser-api' },
          ],
        },
      ],
      '/community/': communitySidebar,
    },
    footer: {
      message: 'Apache License 2.0 के अंतर्गत जारी।',
      copyright: 'Copyright © 2025 Aster Language Team',
    },
  },
}
