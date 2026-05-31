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
    // Nav uses logo-mark.svg (transparent bg, tight viewBox) so the A
    // reads cleanly on the ~24px nav slot in both light and dark mode.
    // /logo.svg keeps the 1024-square white-background variant for
    // favicons and social share cards (see config.shared.ts head).
    logo: '/logo-mark.svg',
    search: { provider: 'local' },
    // Right-rail table of contents. The VitePress default shows H2 only,
    // which is too coarse for API reference pages with H2 endpoint + H3
    // parameters/responses. [2, 3] gives a 2-level hierarchy; deeper
    // (h4) would be noisy on dense pages. The 'On this page' label is
    // the conventional cross-docs phrasing.
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
  },
  transformHead: (ctx) => buildHreflangLinks(ctx),
})
