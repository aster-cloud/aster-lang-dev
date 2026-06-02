import type { UserConfig } from 'vitepress'
import { asterGrammar } from './shiki/aster-grammar'

const SITE_URL = 'https://aster-lang.dev'

export const sharedConfig: UserConfig = {
  base: '/',
  ignoreDeadLinks: false,
  // Files prefixed with `_` are conventional templates / partials; keep
  // them out of the render pipeline so /blog/_template doesn't end up in
  // the published site or in sitemap.
  srcExclude: ['**/_*.md'],
  // VitePress's built-in sitemap generator. Crawls the rendered page
  // graph at build time and emits docs/.vitepress/dist/sitemap.xml.
  // Cloudflare Pages serves it from the static asset root, so the URL
  // becomes https://aster-lang.dev/sitemap.xml.
  sitemap: {
    hostname: SITE_URL,
    lastmodDateOnly: true,
    // Drop legacy/redirected paths that vitepress might otherwise emit
    // (none currently, but defense-in-depth for future restructures).
    transformItems(items) {
      return items.filter((it) => {
        const url = it.url || ''
        return !url.startsWith('api/')
          && !url.startsWith('zh/api/')
          && !url.startsWith('de/api/')
          && !url.startsWith('getting-started/')
          && !url.startsWith('zh/getting-started/')
          && !url.startsWith('de/getting-started/')
      })
    },
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    // Register the Aster CNL grammar so ```aster fenced code blocks
    // throughout /learn /api /blog highlight keywords properly instead
    // of falling back to plain text. See ./shiki/aster-grammar.ts for
    // the lexicon coverage rationale.
    //
    // The cast is necessary because Shiki's `LanguageInput` is the union
    // `MaybeGetter<MaybeArray<LanguageRegistration>>`. Our grammar is
    // structurally a LanguageRegistration but we declare it as a plain
    // literal object to keep the grammar file dependency-free. TS won't
    // narrow the structural compat down to LanguageRegistration without
    // help, hence the unknown bridge.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    languages: [asterGrammar as any],
  },
  head: [
    // Use the transparent nav mark so the favicon inherits whatever
    // background the browser tab / share card draws behind it,
    // matching the nav logo's appearance on both light and dark
    // chromes.
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo-mark.svg' }],
  ],
  // Note: hreflang + canonical injection lives in
  // docs/.vitepress/i18n/pages.ts and is wired via the top-level
  // `transformHead` in config.ts. Don't add a competing transformHead
  // here — vitepress only invokes one.
  vite: {
    optimizeDeps: {
      include: ['@codemirror/state', '@codemirror/view'],
    },
    ssr: {
      noExternal: ['@aster-cloud/aster-lang-ts'],
    },
  },
}
