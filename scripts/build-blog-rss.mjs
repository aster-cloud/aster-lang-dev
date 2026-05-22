#!/usr/bin/env node
/*
 * Build /blog/feed.xml at the end of `pnpm docs:build`.
 *
 * We scan docs/blog/posts/*.md, parse YAML frontmatter (no dependency on
 * gray-matter — frontmatter here is small and shape is fixed), and emit
 * an RSS 2.0 feed into the VitePress build output.
 *
 * Why post-build instead of a VitePress data loader: VitePress's
 * createContentLoader runs at build-graph time and is consumed inside the
 * Vue app, but we want a static .xml file at /blog/feed.xml — generating
 * it separately keeps the loader (which is consumed by the index page)
 * and the RSS feed independent.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const POSTS_DIR = resolve(REPO_ROOT, 'docs', 'blog', 'posts')
const OUT_DIR = resolve(REPO_ROOT, 'docs', '.vitepress', 'dist', 'blog')
const SITE_URL = process.env.DOCS_SITE_URL || 'https://aster-lang.dev'
const FEED_TITLE = 'Aster Lang Blog'
const FEED_DESC = 'Product updates, language deep dives, and design notes from the Aster Lang team.'

// Helpers exported for unit testing — kept declared early because they're
// used by main() below, and `function` declarations hoist anyway.
export { parseFrontmatter, escapeXml, cdata }

// Detect direct invocation vs being imported. When imported (tests), this
// module loads silently without running the I/O loop.
const isMain = import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && process.argv[1].endsWith('build-blog-rss.mjs'))

if (isMain) main()

function main() {
  if (!existsSync(POSTS_DIR)) {
    console.log('[build-blog-rss] no posts directory, skipping')
    process.exit(0)
  }

  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))

// Filter future-dated posts unless DOCS_INCLUDE_DRAFTS=1. The comparison is
// lexicographic on ISO yyyy-mm-dd, which works correctly for any
// well-formed date and avoids timezone surprises that Date parsing
// introduces. Captured once per run, not per post.
const todayIso = new Date().toISOString().slice(0, 10)
const includeFuture = process.env.DOCS_INCLUDE_DRAFTS === '1'

const posts = []
for (const f of files) {
  const raw = readFileSync(join(POSTS_DIR, f), 'utf8')
  const fm = parseFrontmatter(raw)
  if (!fm || !fm.title || !fm.date) continue
  if (fm.draft === 'true' && process.env.DOCS_INCLUDE_DRAFTS !== '1') continue
  if (fm.date > todayIso && !includeFuture) {
    console.log(`[build-blog-rss] skipping future-dated ${f} (date=${fm.date}, today=${todayIso})`)
    continue
  }
  const slug = basename(f, '.md')
  posts.push({
    slug,
    title: fm.title,
    description: fm.description ?? '',
    date: fm.date,
    author: fm.author ?? 'Aster Lang Team',
    url: `${SITE_URL}/blog/posts/${slug}`,
  })
}

posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

const items = posts
  .map(
    (p) => `    <item>
      <title>${cdata(p.title)}</title>
      <link>${escapeXml(p.url)}</link>
      <guid isPermaLink="true">${escapeXml(p.url)}</guid>
      <description>${cdata(p.description)}</description>
      <dc:creator>${cdata(p.author)}</dc:creator>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`,
  )
  .join('\n')

const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()

// dc:creator (Dublin Core) is the convention for display-name authors;
// the RSS 2.0 <author> element expects an email-form value, and we don't
// publish emails per post.
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${cdata(FEED_TITLE)}</title>
    <link>${escapeXml(SITE_URL + '/blog/')}</link>
    <atom:link href="${escapeXml(SITE_URL + '/blog/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${cdata(FEED_DESC)}</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>
`

  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(join(OUT_DIR, 'feed.xml'), xml, 'utf8')
  console.log(`[build-blog-rss] wrote ${posts.length} item(s) to ${join(OUT_DIR, 'feed.xml')}`)
}

// ---- helpers ----

function parseFrontmatter(raw) {
  const m = /^---\n([\s\S]*?)\n---/.exec(raw)
  if (!m) return null
  const fm = {}
  for (const line of m[1].split('\n')) {
    const kv = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line)
    if (!kv) continue
    const [, key, valRaw] = kv
    // Strip line-end YAML comments (e.g. `draft: true # to be published`)
    // — but only if the # is outside quotes. The simple heuristic here is
    // fine for our content: blog post frontmatter values are short and
    // never contain a literal '#'.
    let val = valRaw.replace(/\s+#.*$/, '').trim()
    // Strip surrounding quotes for string values.
    if (val.length >= 2 &&
        ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))) {
      val = val.slice(1, -1)
    }
    fm[key] = val
  }
  return fm
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Wrap a string in a CDATA section, splitting any literal `]]>` sequence
 * across two CDATA sections so the resulting XML stays valid.
 *
 * "abc]]>def" → "<![CDATA[abc]]]]><![CDATA[>def]]>"
 *               ^^^^^^^^^^^^         ^^^^^^^^^^^^
 *               first section ends      second section
 *
 * Without this, a future post whose title legitimately contains "]]>"
 * (e.g. "Why I love XML: ]]> and other quirks") would emit invalid XML
 * and silently break the RSS feed.
 */
function cdata(s) {
  const safe = String(s).replace(/]]>/g, ']]]]><![CDATA[>')
  return `<![CDATA[${safe}]]>`
}
