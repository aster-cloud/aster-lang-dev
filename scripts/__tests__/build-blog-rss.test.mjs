#!/usr/bin/env node
/*
 * Unit fixtures for the frontmatter parser + XML helpers in build-blog-rss.mjs.
 *
 * Run:   node scripts/__tests__/build-blog-rss.test.mjs
 */

import { parseFrontmatter, escapeXml, cdata } from '../build-blog-rss.mjs'
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

console.log('build-blog-rss helpers')

test('parseFrontmatter handles basic key/value', () => {
  const raw = '---\ntitle: Hello\ndate: 2026-01-15\n---\n\nBody'
  const fm = parseFrontmatter(raw)
  assert.equal(fm.title, 'Hello')
  assert.equal(fm.date, '2026-01-15')
})

test('parseFrontmatter strips surrounding quotes', () => {
  const raw = '---\ntitle: "Quoted Title"\nauthor: \'Single Quoted\'\n---'
  const fm = parseFrontmatter(raw)
  assert.equal(fm.title, 'Quoted Title')
  assert.equal(fm.author, 'Single Quoted')
})

test('parseFrontmatter does not strip mid-string quotes', () => {
  const raw = '---\ntitle: "What\'s up"\n---'
  const fm = parseFrontmatter(raw)
  assert.equal(fm.title, "What's up")
})

test('parseFrontmatter ignores trailing # comments', () => {
  const raw = '---\ndraft: true # publish after review\n---'
  const fm = parseFrontmatter(raw)
  assert.equal(fm.draft, 'true')
})

test('parseFrontmatter returns null when no frontmatter block', () => {
  const raw = '# Just a heading, no frontmatter'
  const fm = parseFrontmatter(raw)
  assert.equal(fm, null)
})

test('parseFrontmatter single-quote edge case (length=1)', () => {
  // A single quote char alone is not a quoted string. Old code stripped
  // it producing empty string; new guard requires length≥2.
  const raw = '---\ntitle: "\n---'
  const fm = parseFrontmatter(raw)
  assert.equal(fm.title, '"')
})

test('escapeXml escapes all 5 XML special chars', () => {
  assert.equal(escapeXml('a & b'), 'a &amp; b')
  assert.equal(escapeXml('<a>'), '&lt;a&gt;')
  assert.equal(escapeXml('"x"'), '&quot;x&quot;')
  assert.equal(escapeXml("'y'"), '&apos;y&apos;')
})

test('cdata wraps content in CDATA section', () => {
  assert.equal(cdata('plain'), '<![CDATA[plain]]>')
})

test('cdata splits ]]> across two CDATA sections', () => {
  // "abc]]>def" → "<![CDATA[abc]]]]><![CDATA[>def]]>"
  // The CDATA terminator ]]> is broken so the resulting XML is valid.
  const out = cdata('abc]]>def')
  assert.equal(out, '<![CDATA[abc]]]]><![CDATA[>def]]>')
  // Verify no unescaped ]]> appears in the middle (a single ]]> at the
  // very end is the legitimate close of the outer CDATA).
  const occurrences = (out.match(/]]>/g) || []).length
  assert.equal(occurrences, 2, 'expect one ]]> from each section close')
})

test('cdata handles content with multiple ]]> sequences', () => {
  const out = cdata('x]]>y]]>z')
  // Output should be a well-formed series of CDATA sections; every
  // internal ]]> from the input must be split. Two splits + the
  // closing terminator = 3 ]]> occurrences total in the output.
  const occurrences = (out.match(/]]>/g) || []).length
  assert.equal(occurrences, 3, 'expect 2 splits + final CDATA close')
  // Round-tripping through a relaxed CDATA parser would yield the
  // original string: every "]]]]><![CDATA[>" sequence in the output
  // represents one ]]> in the input.
  const reconstructed = out.replace(/^<!\[CDATA\[|]]>$/g, '')
    .replace(/]]]]><!\[CDATA\[>/g, ']]>')
  assert.equal(reconstructed, 'x]]>y]]>z')
})

if (pass === total) {
  console.log(`OK: ${pass}/${total}`)
  process.exit(0)
} else {
  console.error(`FAIL: ${pass}/${total}`)
  process.exit(1)
}
