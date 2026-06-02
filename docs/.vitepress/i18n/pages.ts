import type { HeadConfig, TransformContext } from 'vitepress'

/**
 * Per-page hreflang alternate + canonical link generator.
 *
 * Emits <link rel="alternate" hreflang="..."> tags for each fully
 * translated page so search engines can surface the right locale per
 * market and avoid treating zh/de versions as duplicate content.
 *
 * Also emits a self-referential <link rel="canonical"> so the active
 * URL is locked in (defense against scraper-injected querystrings and
 * Cloudflare auto-redirect artifacts).
 *
 * The `translated` set lists pages that have authoritative content in
 * all three locales. Pages outside this set are en-only by editorial
 * policy (blog, compliance) — we deliberately omit hreflang on those
 * so crawlers don't claim a non-existent zh/de variant.
 *
 * 2026-Q3: getting-started/* and api/* were moved to aster-lang.cloud
 * (cloud-docs-subsite Phase 1). Those entries no longer belong here.
 */

const SITE_URL = 'https://aster-lang.dev'

const translated = new Set([
  'index.md',
  'learn/overview.md',
  'learn/cnl-quick-reference.md',
  'learn/playground.md',
  'learn/deployment-guide.md',
  'learn/browser-api.md',
  'community/index.md',
  'community/contribute.md',
  'community/lexicons.md',
  'community/wanted-languages.md',
  'editions/index.md',
])

function stripLocalePrefix(path: string): string {
  return path.replace(/^(zh|de)\//, '')
}

function pathToUrl(path: string): string {
  return path.replace(/\.md$/, '.html').replace(/index\.html$/, '')
}

function detectLocale(path: string): 'en' | 'zh' | 'de' {
  if (path.startsWith('zh/')) return 'zh'
  if (path.startsWith('de/')) return 'de'
  return 'en'
}

export function buildHreflangLinks(ctx: TransformContext): HeadConfig[] {
  const rel = ctx.pageData.relativePath || ''
  if (!rel) return []
  const localeRel = stripLocalePrefix(rel)
  const locale = detectLocale(rel)

  // Canonical for the current URL (every page gets one).
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const suffix = pathToUrl(localeRel)
  const canonicalHref = `${SITE_URL}${localePrefix}/${suffix}`
  const head: HeadConfig[] = [
    ['link', { rel: 'canonical', href: canonicalHref }],
  ]

  // hreflang alternates only for pages that have all 3 locales.
  if (translated.has(localeRel)) {
    head.push(
      ['link', { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/${suffix}` }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/${suffix}` }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}/zh/${suffix}` }],
      ['link', { rel: 'alternate', hreflang: 'de-DE', href: `${SITE_URL}/de/${suffix}` }],
    )
  }
  return head
}
