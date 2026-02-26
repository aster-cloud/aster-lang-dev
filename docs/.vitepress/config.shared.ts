import type { UserConfig } from 'vitepress'

export const sharedConfig: UserConfig = {
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
}
