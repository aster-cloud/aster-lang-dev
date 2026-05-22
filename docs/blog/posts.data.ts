/*
 * VitePress build-time data loader for blog posts.
 *
 * VitePress invokes load() once per build (and on file change in dev).
 * The watch glob tells VitePress which files to re-trigger on. Posts are
 * plain Markdown with YAML frontmatter — see ./_template.md for the
 * expected shape.
 *
 * Posts are sorted by date desc; drafts (`draft: true`) are excluded
 * unless DOCS_INCLUDE_DRAFTS=1 is set (used by preview builds).
 *
 * Consumed by:
 *   - docs/blog/index.md  (list page, via <script setup> + data())
 *   - docs/blog/feed.xml  (Vite-built RSS, populated post-render)
 */

import { createContentLoader } from 'vitepress'

export interface BlogPost {
  url: string
  title: string
  description: string
  date: string          // ISO yyyy-mm-dd
  dateText: string      // human-readable, locale-neutral
  author?: string
  tags?: string[]
  draft?: boolean
}

declare const data: BlogPost[]
export { data }

const includeDrafts = process.env.DOCS_INCLUDE_DRAFTS === '1'
// Today in ISO yyyy-mm-dd. Build-time capture is fine — the loader runs
// once per build and post lists are static thereafter. Future-dated posts
// are filtered to match RSS feed behavior; lexical compare on ISO dates
// is correct without timezone parsing.
const todayIso = new Date().toISOString().slice(0, 10)

export default createContentLoader('blog/posts/*.md', {
  excerpt: false,
  transform(raw): BlogPost[] {
    return raw
      .map(({ url, frontmatter }): BlogPost | null => {
        const fm = (frontmatter ?? {}) as Record<string, unknown>
        const title = typeof fm.title === 'string' ? fm.title : ''
        const description = typeof fm.description === 'string' ? fm.description : ''
        const date = typeof fm.date === 'string' ? fm.date : ''
        const author = typeof fm.author === 'string' ? fm.author : undefined
        const tags = Array.isArray(fm.tags) ? fm.tags.filter((t): t is string => typeof t === 'string') : undefined
        const draft = fm.draft === true

        if (!title || !date) return null
        if (draft && !includeDrafts) return null
        if (date > todayIso && !includeDrafts) return null

        return {
          url,
          title,
          description,
          date,
          dateText: formatDate(date),
          author,
          tags,
          draft,
        }
      })
      .filter((p): p is BlogPost => p !== null)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  },
})

function formatDate(iso: string): string {
  // Locale-neutral: "YYYY-MM-DD" → "Mon DD, YYYY" using a fixed English
  // formatter to avoid the per-locale date-format whiplash that ICU
  // Intl.DateTimeFormat introduces on different runners.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!m) return iso
  const [, y, mo, d] = m
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(mo, 10) - 1]} ${parseInt(d, 10)}, ${y}`
}
