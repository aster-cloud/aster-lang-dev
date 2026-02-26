import { defineConfig } from 'vitepress'
import { sharedConfig } from './config.shared'
import { enConfig } from './locales/en'
import { zhConfig } from './locales/zh'
import { deConfig } from './locales/de'
import { buildHreflangLinks } from './i18n/pages'

export default defineConfig({
  ...sharedConfig,
  locales: {
    root: { label: 'English', lang: 'en-US', ...enConfig },
    zh: { label: '简体中文', lang: 'zh-CN', link: '/zh/', ...zhConfig },
    de: { label: 'Deutsch', lang: 'de-DE', link: '/de/', ...deConfig },
  },
  themeConfig: {
    logo: '/logo.svg',
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aster-cloud/aster-lang-dev' },
    ],
  },
  transformHead: (ctx) => buildHreflangLinks(ctx),
})
