import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

const communitySidebar: DefaultTheme.SidebarItem[] = [
  {
    text: '社区',
    items: [
      { text: '概览', link: '/community/' },
      { text: '贡献', link: '/community/contribute' },
      { text: '词典包', link: '/community/lexicons' },
      { text: '征集中的语言', link: '/community/wanted-languages' },
      { text: '博客', link: '/blog/' },
    ],
  },
  {
    text: '合规',
    items: [
      { text: '概览', link: '/community/compliance/' },
      { text: 'DPA 模板', link: '/community/compliance/dpa-template' },
      { text: '自助 DSAR', link: '/community/compliance/dsar' },
      { text: '遥测字段', link: '/community/compliance/telemetry-fields' },
    ],
  },
]

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  title: 'Aster Lang',
  description: 'Aster Lang CNL 编程语言指南 — 多语言策略 / 流程 / 决策编写。',
  themeConfig: {
    nav: [
      { text: '学习', link: '/zh/learn/overview' },
      { text: '演练场', link: '/zh/learn/playground' },
      { text: '版本对比', link: '/zh/editions/' },
      { text: '社区', link: '/zh/community/' },
      { text: 'Cloud', link: 'https://aster-lang.cloud' },
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
      '/community/': communitySidebar,
    },
    footer: {
      message: '基于 Apache License 2.0 发布。',
      copyright: '版权所有 © 2025 Aster Language 团队',
    },
  },
}
