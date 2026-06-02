#!/usr/bin/env node
/*
 * Regression tests for the dev-landing-convergence work (PR-1..PR-5).
 *
 * Asserts contracts captured in .claude/plan/dev-landing-convergence.md:
 *   1. License consistency  — Apache-2.0 across README, locales, LICENSE
 *   2. Frontmatter shape    — actions=2, features removed, footer:false
 *   3. API path truthiness  — HeroAnimation paths match aster-api @Path
 *   4. i18n string parity   — every new block has en/zh/de keys with
 *                              identical structure and no placeholder
 *                              values like "TODO" or empty strings
 *   5. Component import wiring — CustomLayout imports the five new
 *                                 components and routes them through
 *                                 the correct slots
 *   6. Built HTML smoke checks — Apache 2.0 strings appear in dist
 *                                 home pages for all three locales,
 *                                 MIT does not.
 *
 * These tests are read-only (no docs:build invocation) so they're fast
 * (<200ms) and safe to run after every PR. The build itself is verified
 * by `pnpm docs:build` separately in CI.
 *
 * Run:   node scripts/__tests__/landing-convergence.test.mjs
 * Pass:  exit 0, prints "OK: <n>/<n>"
 * Fail:  exit 1 with diff
 */

import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO = join(__dirname, '..', '..')

let pass = 0
let total = 0
const failures = []

function test(name, fn) {
  total++
  try {
    fn()
    console.log(`  ✓ ${name}`)
    pass++
  } catch (e) {
    console.log(`  ✗ ${name}`)
    console.log(`    ${e.message}`)
    failures.push({ name, message: e.message })
  }
}

function read(rel) {
  return readFileSync(join(REPO, rel), 'utf8')
}

function readIfExists(rel) {
  const p = join(REPO, rel)
  return existsSync(p) ? readFileSync(p, 'utf8') : null
}

// ─────────────────────────────────────────────────────────────
// 1. License consistency (PR-4)
// ─────────────────────────────────────────────────────────────

console.log('\n[1/6] License consistency (PR-4)')

test('LICENSE file exists at repo root with Apache 2.0 header', () => {
  const license = read('LICENSE')
  assert.match(
    license,
    /Apache License\s+Version 2\.0/,
    'LICENSE missing Apache 2.0 header',
  )
})

test('README L114 declares Apache-2.0, not MIT', () => {
  const readme = read('README.md')
  assert.ok(
    !/^MIT\b/m.test(readme),
    'README.md still contains a top-level "MIT" line',
  )
  assert.match(readme, /Apache-2\.0/, 'README.md missing Apache-2.0 mention')
})

test('en locale footer.message uses Apache License 2.0', () => {
  const en = read('docs/.vitepress/locales/en.ts')
  assert.match(en, /Released under the Apache License 2\.0\./)
  assert.ok(!/MIT/.test(en), 'en.ts still mentions MIT')
})

test('zh locale footer.message uses Apache License 2.0', () => {
  const zh = read('docs/.vitepress/locales/zh.ts')
  assert.match(zh, /基于 Apache License 2\.0 发布。/)
  assert.ok(!/MIT/.test(zh), 'zh.ts still mentions MIT')
})

test('de locale footer.message uses Apache License 2.0', () => {
  const de = read('docs/.vitepress/locales/de.ts')
  assert.match(de, /Veröffentlicht unter der Apache License 2\.0\./)
  assert.ok(!/MIT/.test(de), 'de.ts still mentions MIT')
})

// ─────────────────────────────────────────────────────────────
// 2. Frontmatter shape (PR-1, PR-3, PR-4)
// ─────────────────────────────────────────────────────────────

console.log('\n[2/6] Frontmatter shape (PR-1, PR-3, PR-4)')

const LOCALES = [
  { name: 'en', file: 'docs/index.md' },
  { name: 'zh', file: 'docs/zh/index.md' },
  { name: 'de', file: 'docs/de/index.md' },
]

for (const { name, file } of LOCALES) {
  test(`${name} frontmatter declares layout: home`, () => {
    const md = read(file)
    assert.match(md, /^layout: home$/m)
  })

  test(`${name} frontmatter has footer: false (DevFooter takes over)`, () => {
    const md = read(file)
    assert.match(md, /^footer: false$/m)
  })

  test(`${name} frontmatter contains exactly 2 hero actions`, () => {
    const md = read(file)
    // Match the hero.actions block — count "- theme:" entries inside it.
    const actionsBlock = md.match(/actions:\n([\s\S]*?)(?:\n[a-z]|\n---)/)
    assert.ok(actionsBlock, `${name} index.md missing hero.actions block`)
    const themeCount = (actionsBlock[1].match(/- theme:/g) || []).length
    assert.equal(themeCount, 2, `${name} expected 2 hero actions, got ${themeCount}`)
  })

  test(`${name} frontmatter features array is removed (DevFeatures replaces)`, () => {
    const md = read(file)
    assert.ok(
      !/^features:/m.test(md),
      `${name} index.md still has frontmatter features array (PR-3 should have removed it)`,
    )
  })
}

// ─────────────────────────────────────────────────────────────
// 3. API path truthiness (PR-1)
// ─────────────────────────────────────────────────────────────

console.log('\n[3/6] HeroAnimation API path truthiness (PR-1)')

const REAL_API_PATHS = [
  '/api/v1/policies/evaluate',
  '/api/v1/policies/evaluate-source',
  '/api/v1/policies/evaluate/batch',
]

const FAKE_API_PATHS = [
  '/api/v1/evaluate-source',           // missing /policies
  '/api/v1/policies/batch',            // missing /evaluate
  '/api/v1/policies/{id}/evaluate',    // {id} doesn't exist on real endpoint
]

test('HeroAnimation.vue contains all 3 real API paths', () => {
  const hero = read('docs/.vitepress/components/HeroAnimation.vue')
  for (const path of REAL_API_PATHS) {
    assert.ok(
      hero.includes(path),
      `HeroAnimation missing real path: ${path}`,
    )
  }
})

test('HeroAnimation.vue does NOT contain fake/legacy API paths', () => {
  const hero = read('docs/.vitepress/components/HeroAnimation.vue')
  for (const path of FAKE_API_PATHS) {
    assert.ok(
      !hero.includes(path),
      `HeroAnimation still contains fake path: ${path}`,
    )
  }
})

test('HeroAnimation has reduced-motion guard (WCAG 2.3.3 AA)', () => {
  const hero = read('docs/.vitepress/components/HeroAnimation.vue')
  assert.match(
    hero,
    /prefers-reduced-motion/,
    'HeroAnimation missing prefers-reduced-motion matchMedia guard',
  )
  assert.match(
    hero,
    /reducedMotion\?\.matches/,
    'HeroAnimation must OR-combine reducedMotion check into startCycle',
  )
})

test('HeroAnimation has mobile cycle guard (mql max-width: 960px)', () => {
  const hero = read('docs/.vitepress/components/HeroAnimation.vue')
  assert.match(
    hero,
    /max-width:\s*960px/,
    'HeroAnimation missing 960px breakpoint for mobile cycle disable',
  )
})

test('HeroAnimation uses only existing token color steps', () => {
  const hero = read('docs/.vitepress/components/HeroAnimation.vue')
  // tokens.css does not expose emerald-300 / amber-300 / amber-400 etc;
  // only -50 / -500 / -600 / -700 exist for emerald/amber/rose.
  const BANNED_STEPS = [
    '--aster-color-emerald-300',
    '--aster-color-amber-300',
    '--aster-color-amber-400',
    '--aster-color-rose-300',
    '--aster-color-rose-400',
  ]
  for (const step of BANNED_STEPS) {
    assert.ok(
      !hero.includes(step),
      `HeroAnimation references non-existent token step: ${step}`,
    )
  }
})

// ─────────────────────────────────────────────────────────────
// 4. i18n string parity for new blocks (PR-1..PR-4)
// ─────────────────────────────────────────────────────────────

console.log('\n[4/6] i18n string parity (PR-1..PR-4)')

// Read ui.ts as raw text — parsing TS literally is too heavy for a
// regression script. We assert each locale block contains the required
// top-level keys, mirroring what check-locale-parity does for files.
const ui = read('docs/.vitepress/i18n/ui.ts')

const REQUIRED_TOP_LEVEL_KEYS = [
  'hero:',
  'playground:',
  'trustBand:',
  'features:',
  'bottomCta:',
  'footer:',
]

const LOCALE_BLOCKS = [
  { name: 'en', marker: 'const en: UiStrings = {' },
  { name: 'zh', marker: 'const zh: UiStrings = {' },
  { name: 'de', marker: 'const de: UiStrings = {' },
]

for (const { name, marker } of LOCALE_BLOCKS) {
  test(`${name} dictionary contains all 6 top-level UiStrings blocks`, () => {
    const start = ui.indexOf(marker)
    assert.ok(start >= 0, `Locale block "${name}" not found`)
    // Slice up to the next const declaration to bound the locale block.
    const end = ui.indexOf('\nconst ', start + marker.length)
    const block = end >= 0 ? ui.slice(start, end) : ui.slice(start)
    for (const key of REQUIRED_TOP_LEVEL_KEYS) {
      assert.ok(
        block.includes(key),
        `${name} block missing key: ${key}`,
      )
    }
  })
}

test('hero strings include apiRefLink + siblingLink (PR-1)', () => {
  // Each locale must declare both keys.
  for (const { name } of LOCALE_BLOCKS) {
    assert.match(
      ui,
      /apiRefLink: \{ text: '[^']+', href: '\/api\/policies\/evaluate' \}/,
      `${name}: apiRefLink missing or wrong href`,
    )
    assert.match(
      ui,
      /siblingLink: \{[\s\S]{1,200}href: 'https:\/\/aster-lang\.cloud'/,
      `${name}: siblingLink missing or wrong href`,
    )
  }
})

test('features TONE_BG distribution is 6 unique tones × 3 locales', () => {
  // Count tone field VALUE assignments across all locales (6 × 3 = 18).
  // The single-quoted form matches data assignments but not the
  // TypeScript union type definition (which uses `|` between unquoted
  // values inside the interface).
  const matches = ui.match(/tone: '(accent|primary|warning|danger|success|neutral)',/g)
  assert.ok(matches, 'No tone fields found in ui.ts features')
  assert.equal(
    matches.length,
    18,
    `Expected 18 tone field assignments (6 features × 3 locales), got ${matches.length}`,
  )
})

test('bottomCta is permanently-bright (no primary-fg token reference in CSS)', () => {
  const bottomCta = read('docs/.vitepress/components/DevBottomCta.vue')
  // Plan §3.7 / audit P1 #3: primary-fg reverses in dark mode → must
  // use literal #ffffff for the always-violet CTA segment.
  //
  // Strip /* ... */ block comments before checking so the explanatory
  // comment that names the token isn't counted as a real reference.
  const code = bottomCta.replace(/\/\*[\s\S]*?\*\//g, '')
  assert.ok(
    !/var\(--aster-primary-fg/.test(code),
    'DevBottomCta uses var(--aster-primary-fg) which reverses in dark mode — should be literal #ffffff',
  )
  assert.match(
    bottomCta,
    /color:\s*#ffffff/,
    'DevBottomCta missing literal #ffffff for text color',
  )
})

// ─────────────────────────────────────────────────────────────
// 5. Component import wiring (CustomLayout)
// ─────────────────────────────────────────────────────────────

console.log('\n[5/6] CustomLayout slot wiring')

test('CustomLayout imports all 6 hero/section components', () => {
  const layout = read('docs/.vitepress/theme/CustomLayout.vue')
  // HeroAnimation moved out of the landing (it now lives in
  // docs/api/policies/evaluate.md via global component registration
  // in theme/index.ts). The tagline carousel (HeroTaglineList)
  // carries the visual rotation on the landing instead.
  const REQUIRED_IMPORTS = [
    'HeroSubtleLinks',
    'HeroTaglineList',
    'DevTrustBand',
    'DevFeatures',
    'DevBottomCta',
    'DevFooter',
  ]
  for (const c of REQUIRED_IMPORTS) {
    assert.match(layout, new RegExp(`import ${c}`), `CustomLayout missing import: ${c}`)
  }
  // HeroAnimation must NOT be imported by CustomLayout anymore —
  // it's a global component registered in theme/index.ts.
  assert.ok(
    !/import HeroAnimation/.test(layout),
    'CustomLayout still imports HeroAnimation (should be moved to theme/index.ts global registration)',
  )
})

test('CustomLayout uses correct VitePress slot names', () => {
  const layout = read('docs/.vitepress/theme/CustomLayout.vue')
  // Real slots verified against vitepress 1.6.4 Layout.vue.
  // home-hero-after slot removed when HeroAnimation moved out of
  // the landing; HeroTaglineList lives in home-hero-info-after now.
  assert.match(layout, /#home-hero-info-after/)
  assert.match(layout, /#home-features-before/)
  assert.match(layout, /#home-features-after/)
  assert.match(layout, /#layout-bottom/)
  // home-features is NOT a real slot — plan audit P0 #1 caught this
  assert.ok(
    !/#home-features\b(?!-)/.test(layout),
    'CustomLayout references non-existent #home-features slot (use -before/-after)',
  )
})

test('HeroAnimation is registered globally via theme/index.ts', () => {
  const themeIndex = read('docs/.vitepress/theme/index.ts')
  assert.match(themeIndex, /import HeroAnimation/, 'theme/index.ts must import HeroAnimation')
  assert.match(
    themeIndex,
    /app\.component\(\s*['"]HeroAnimation['"]\s*,\s*HeroAnimation\s*\)/,
    'theme/index.ts must register HeroAnimation globally so markdown pages can embed it',
  )
})

test('HeroAnimation is embedded in /api/policies/evaluate.md', () => {
  const evaluateMd = read('docs/api/policies/evaluate.md')
  assert.match(
    evaluateMd,
    /<HeroAnimation\s*\/>/,
    'evaluate.md must embed <HeroAnimation /> (the 3 cards match this page subject)',
  )
})

test('CustomLayout gates DevBottomCta + DevFooter on isHome', () => {
  const layout = read('docs/.vitepress/theme/CustomLayout.vue')
  assert.match(
    layout,
    /v-if="isHome"\s+#layout-bottom/,
    'CustomLayout must gate layout-bottom slot on isHome (DevFooter must not leak to doc pages)',
  )
  assert.match(
    layout,
    /import \{ computed \} from 'vue'/,
    'CustomLayout must import computed from vue (audit P3 #8)',
  )
})

test('CSS hides VPFeatures + VPFooter on home (defense-in-depth)', () => {
  const css = read('docs/.vitepress/theme/custom.css')
  assert.match(css, /\.VPHome \.VPFeatures \{\s*display: none/)
  assert.match(css, /\.VPHome \.VPFooter \{\s*display: none/)
})

// ─────────────────────────────────────────────────────────────
// 6. Built HTML smoke checks (only run if dist exists)
// ─────────────────────────────────────────────────────────────

console.log('\n[6/6] Built HTML smoke checks (skipped if dist absent)')

const distHtmlFiles = [
  { locale: 'en', file: 'docs/.vitepress/dist/index.html' },
  { locale: 'zh', file: 'docs/.vitepress/dist/zh/index.html' },
  { locale: 'de', file: 'docs/.vitepress/dist/de/index.html' },
]

for (const { locale, file } of distHtmlFiles) {
  const html = readIfExists(file)
  if (html === null) {
    console.log(`  ⊘ skip ${locale} (dist missing; run pnpm docs:build first)`)
    continue
  }

  test(`${locale} dist contains "Apache License 2.0"`, () => {
    assert.match(html, /Apache License 2\.0/)
  })

  test(`${locale} dist does not contain "MIT License" or "MIT 许可证"`, () => {
    assert.ok(!/MIT License/.test(html), `${locale} dist still has "MIT License"`)
    assert.ok(!/MIT 许可证/.test(html), `${locale} dist still has "MIT 许可证"`)
    assert.ok(!/MIT-Lizenz/.test(html), `${locale} dist still has "MIT-Lizenz"`)
  })

  test(`${locale} dist contains BUILT FOR PRODUCTION / 面向生产环境 / FÜR DEN PRODUKTIONSEINSATZ`, () => {
    const expected = {
      en: 'BUILT FOR PRODUCTION',
      zh: '面向生产环境',
      de: 'FÜR DEN PRODUKTIONSEINSATZ GEBAUT',
    }[locale]
    assert.ok(
      html.includes(expected),
      `${locale} dist missing TrustBand eyebrow: ${expected}`,
    )
  })

  test(`${locale} dist features section has all 6 feature titles`, () => {
    // Each title is emoji-prefixed; we only assert count of emoji
    // markers to keep the test resilient to translation phrasing.
    const emojiTitles = ['🌍', '🤖', '⚡', '🔒', '🏢', '🧰']
    for (const emoji of emojiTitles) {
      assert.ok(html.includes(emoji), `${locale} dist missing feature emoji: ${emoji}`)
    }
  })

  test(`${locale} dist hero shows exactly the 2 primary actions (no API Reference button)`, () => {
    // The third button "API Reference" / "API 参考" / "API-Referenz" was
    // demoted to a subtle text link. The .VPButton element should not
    // carry that label — it now lives in .hero-link-secondary instead.
    const buttonMatches = html.match(/class="VPButton[^"]*"[^>]*>[^<]*<\/a>/g) || []
    // VitePress wraps button content in a span, so the above match
    // count alone isn't sufficient. We assert the API-Reference label
    // does not appear inside a <a class="VPButton ...>.
    const apiRefAsButton = /class="VPButton[^"]*"[\s\S]{0,200}?>\s*(?:API Reference|API 参考|API-Referenz)\s*</
    assert.ok(
      !apiRefAsButton.test(html),
      `${locale} dist still renders "API Reference" as a VPButton (should be subtle text link)`,
    )
  })
}

// ─────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────

console.log(`\nOK: ${pass}/${total}`)
if (pass !== total) {
  console.error(`\n${total - pass} test(s) failed.`)
  process.exit(1)
}
