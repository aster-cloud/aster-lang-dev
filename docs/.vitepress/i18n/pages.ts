import type { HeadConfig, TransformContext } from 'vitepress'

const SITE_URL = 'https://aster-lang-dev.pages.dev'

const translated = new Set([
  'index.md',
  'getting-started/overview.md',
  'getting-started/authentication.md',
  'getting-started/quickstart.md',
  'getting-started/errors.md',
  'learn/overview.md',
  'learn/cnl-quick-reference.md',
  'learn/playground.md',
  'learn/deployment-guide.md',
  'learn/browser-api.md',
])

function stripLocalePrefix(path: string): string {
  return path.replace(/^(zh|de)\//, '')
}

function pathToUrl(path: string): string {
  return path.replace(/\.md$/, '.html').replace(/index\.html$/, '')
}

export function buildHreflangLinks(ctx: TransformContext): HeadConfig[] {
  const rel = stripLocalePrefix(ctx.pageData.relativePath)
  if (!translated.has(rel)) return []

  const suffix = pathToUrl(rel)
  return [
    ['link', { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/${suffix}` }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/${suffix}` }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}/zh/${suffix}` }],
    ['link', { rel: 'alternate', hreflang: 'de-DE', href: `${SITE_URL}/de/${suffix}` }],
  ]
}
