#!/usr/bin/env node
/*
 * Unit fixtures for the link-rewriting passes in sync-enterprise-docs.mjs.
 *
 * The redaction script does the actual file I/O at the module top level,
 * so we can't import it directly. Instead, this test file imports the
 * redact() function via a small refactor: sync-enterprise-docs.mjs
 * exports `redact` when imported as a module.
 *
 * Run:   node scripts/__tests__/sync-enterprise-docs.test.mjs
 * Pass:  exit 0, prints "OK: <n>/<n>"
 * Fail:  exit 1 with diff
 */

import { redact } from '../sync-enterprise-docs.mjs'
import assert from 'node:assert/strict'

let pass = 0
let total = 0
function test(name, fn) {
  total++
  try {
    fn()
    console.log(`  ✓ ${name}`)
    pass++
  } catch (e) {
    console.log(`  ✗ ${name}`)
    console.log(`    ${e.message}`)
  }
}

console.log('sync-enterprise-docs link rewriter')

test('backticked-filename label normalizes to display string', () => {
  const md = '[`telemetry-fields.md`](./telemetry-fields.md) describes…'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /\[telemetry fields\]\(\/community\/compliance\/telemetry-fields\)/)
  assert.doesNotMatch(out, /telemetry-fields\.md/)
})

test('plain-text label preserved verbatim', () => {
  const md = 'See [the privacy doc](./telemetry-fields.md).'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /\[the privacy doc\]\(\/community\/compliance\/telemetry-fields\)/)
})

test('anchor preserved through rewrite', () => {
  const md = 'See [retention rules](./telemetry-fields.md#section-7).'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /\[retention rules\]\(\/community\/compliance\/telemetry-fields#section-7\)/)
})

test('telemetry.md retargets to telemetry-fields', () => {
  const md = 'See [details](./telemetry.md).'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /\[details\]\(\/community\/compliance\/telemetry-fields\)/)
})

test('unmirrored internal doc routes to /community/compliance/', () => {
  const md = 'See [the license guide](./license-management.md) for…'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /\[the license guide\]\(\/community\/compliance\/\)/)
})

test('bare-prose filename "(see telemetry.md)" rewrites to display string', () => {
  const md = 'Optional masking (see telemetry.md).'
  const out = redact(md, 'telemetry-fields.md')
  assert.match(out, /\(see telemetry overview\)/)
})

test('docs/on-prem/ prefix path in code span becomes display link', () => {
  const md = 'Schema in `docs/on-prem/telemetry-fields.md` defines…'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /\[telemetry fields\]\(\/community\/compliance\/telemetry-fields\)/)
})

test('glossary block markers stripped', () => {
  const md = '<!-- glossary:block id=foo -->\nText\n<!-- /glossary:block -->'
  const out = redact(md, 'dpa-template.md')
  assert.doesNotMatch(out, /glossary:block/)
  assert.match(out, /Text/)
})

test('internal src paths replaced with description', () => {
  const md = 'See `src/lib/telemetry/schema-contract.ts` for the wire format.'
  const out = redact(md, 'telemetry-fields.md')
  assert.match(out, /the telemetry schema contract module/)
  assert.doesNotMatch(out, /src\/lib\/telemetry/)
})

test('no double-wrap when source has `docs/on-prem/X.md` inside link', () => {
  const md = '[`docs/on-prem/telemetry-fields.md`](./telemetry-fields.md). Next sentence.'
  const out = redact(md, 'dpa-template.md')
  // Must not contain nested `[[…](…)](…)` constructs.
  assert.doesNotMatch(out, /\[\[/)
  // Must end with one well-formed link.
  assert.match(out, /\[telemetry fields\]\(\/community\/compliance\/telemetry-fields\)/)
})

test('frontmatter title set from filename', () => {
  const md = '# Some Heading\n\nBody.'
  const out = redact(md, 'dsar.md')
  assert.match(out, /^---\ntitle: Self-service DSAR API/)
})

test('public-mirror banner injected', () => {
  const md = '# Heading\n\nBody.'
  const out = redact(md, 'dpa-template.md')
  assert.match(out, /::: info Public mirror/)
})

if (pass === total) {
  console.log(`OK: ${pass}/${total}`)
  process.exit(0)
} else {
  console.error(`FAIL: ${pass}/${total}`)
  process.exit(1)
}
