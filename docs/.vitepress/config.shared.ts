import type { UserConfig } from 'vitepress'
import { asterGrammar } from './shiki/aster-grammar'

export const sharedConfig: UserConfig = {
  base: '/',
  ignoreDeadLinks: false,
  // Files prefixed with `_` are conventional templates / partials; keep
  // them out of the render pipeline so /blog/_template doesn't end up in
  // the published site or in sitemap.
  srcExclude: ['**/_*.md'],
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
