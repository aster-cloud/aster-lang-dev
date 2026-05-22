#!/usr/bin/env node
/*
 * Sync + redact enterprise public docs from aster-cloud's on-prem docs.
 *
 * Source of truth lives in aster-cloud/docs/on-prem/. This script copies a
 * curated subset into aster-lang-dev/docs/enterprise/ with:
 *   1. glossary:block HTML comments stripped (those are aster-cloud's
 *      internal glossary tracking and are noise for the public site).
 *   2. Internal-only references redacted (e.g. docs/saas/* paths,
 *      internal runbooks).
 *   3. Relative `./<file>.md` links rewritten to absolute /enterprise/<file>
 *      so VitePress's locale base resolves correctly.
 *
 * Run from aster-lang-dev repo root:
 *   node scripts/sync-enterprise-docs.mjs [--check]
 *
 * --check: fail (exit 1) if any file would change. Used in CI to ensure
 *          /enterprise content stays in sync with the upstream source.
 *
 * Usage assumption: aster-cloud is checked out as a sibling repo, i.e.
 *   ../aster-cloud/docs/on-prem/. Override with ASTER_CLOUD_REPO env var.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..')
const SOURCE_REPO = process.env.ASTER_CLOUD_REPO
  ? resolve(process.env.ASTER_CLOUD_REPO)
  : resolve(REPO_ROOT, '..', 'aster-cloud')
const SOURCE_DIR = resolve(SOURCE_REPO, 'docs', 'on-prem')
const TARGET_DIR = resolve(REPO_ROOT, 'docs', 'enterprise')

// Curated list of files to mirror. Anything not in this list stays internal.
const FILES = [
  { src: 'dpa-template.md', dest: 'dpa-template.md' },
  { src: 'dsar.md', dest: 'dsar.md' },
  { src: 'telemetry-fields.md', dest: 'telemetry-fields.md' },
]

const checkMode = process.argv.includes('--check')

function redact(markdown, basename) {
  let out = markdown

  // 1. Strip aster-cloud's glossary:block tracking comments — these are
  //    noise on the public site.
  out = out.replace(/<!--\s*glossary:block[^>]*-->\n?/g, '')
  out = out.replace(/<!--\s*\/glossary:block\s*-->\n?/g, '')

  // 2. Internal-only references — replace with a neutral note so the
  //    customer-facing text still reads cleanly.
  out = out.replace(
    /`docs\/saas\/kek-rotation\.md`(?:\s*\([^)]*\))?/g,
    'an internal runbook (available to enterprise customers under NDA)',
  )

  // 3. Source-tree code references — they don't resolve on a public docs
  //    site. Rewrite to "the telemetry uploader" / "the schema contract"
  //    style descriptions.
  out = out.replace(
    /`src\/lib\/telemetry\/schema-contract\.ts`/g,
    'the telemetry schema contract module',
  )
  out = out.replace(
    /`src\/lib\/telemetry\/payload-builder\.ts`/g,
    'the telemetry payload builder',
  )
  out = out.replace(
    /`src\/app\/api\/v1\/telemetry\/route\.ts`/g,
    'the telemetry ingest route',
  )
  out = out.replace(
    /`src\/lib\/telemetry\/access-audit\.ts`/g,
    'the access-audit module',
  )

  // 4. Bare-prose path references — handled BEFORE link rewriting.
  //    Substitutions produce a clickable Markdown link with the display
  //    label. Pass A's outer-link regex uses a balanced-bracket pattern
  //    that tolerates inner `[…]` constructs, so substitutions that sit
  //    inside an outer `[…](./X.md)` get unwrapped via normalizeLabel
  //    instead of producing `[[…](inner)](outer)`.
  out = out.replace(
    /`docs\/on-prem\/telemetry\.md`/g,
    'the telemetry overview (internal)',
  )
  out = out.replace(
    /`docs\/on-prem\/telemetry-fields\.md`/g,
    '[telemetry fields](/enterprise/telemetry-fields)',
  )
  out = out.replace(
    /`docs\/on-prem\/dpa-template\.md`/g,
    '[DPA template](/enterprise/dpa-template)',
  )
  out = out.replace(
    /`docs\/on-prem\/dsar\.md`/g,
    '[DSAR](/enterprise/dsar)',
  )

  // 5. Rewrite relative links to absolute /enterprise/ paths so the
  //    locale-aware VitePress router resolves them correctly.
  //
  //    Mirrored docs (in MIRRORED_DOCS):
  //       ./<file>.md[#anchor]            → /enterprise/<file>[#anchor]
  //       ./<file>.md                     in any link shape (label may
  //                                       have backticks, "filename.md",
  //                                       descriptive text, etc.)
  //
  //    Unmirrored internal docs: redirect to the enterprise index, with
  //    the descriptive label preserved.
  //
  //    Generic relative .md fallback: any leftover `./<unknown>.md`
  //    becomes a /enterprise/ index link, so internal paths never leak
  //    to the public site as broken links.
  const MIRRORED_DOCS = new Set(['dpa-template', 'dsar', 'telemetry-fields']);
  // `telemetry.md` isn't mirrored standalone, but the closest public
  // equivalent is the fields doc.
  const TELEMETRY_OVERVIEW_RETARGET = '/enterprise/telemetry-fields';

  // Pass A: handle `[label](./<file>.md[#anchor])` for any label form.
  //
  // [^\]]+ inside [] keeps the label as-is (preserves backticked or
  //   plain text). For mirrored docs, target is /enterprise/<file><anchor>.
  // For labels that are *bare filenames* like `` `telemetry.md` `` or
  // `telemetry.md`, we normalize to a human-readable phrase so customers
  // don't see the internal file path leaking into the prose.
  const FILENAME_DISPLAY = {
    'dpa-template': 'DPA template',
    'dsar': 'DSAR (data subject access requests)',
    'telemetry-fields': 'telemetry fields',
    'telemetry': 'telemetry overview',
    'license-management': 'license management',
  };
  function normalizeLabel(label, slug) {
    // Case A: the label already contains an embedded `[inner](url)` link
    //   — this happens when step 4 substituted `\`docs/on-prem/X.md\``
    //   *inside* what later turns out to be an outer `[…](./X.md)` link.
    //   Strip the embedding: use just the inner label text.
    const embedded = /^\[([^\]]+)\]\([^)]+\)$/.exec(label);
    if (embedded) {
      return embedded[1];
    }
    // Case B: bare filename labels like `<file>.md` (with optional
    //   backticks) or `docs/on-prem/<file>.md`. Swap in the human-
    //   readable display string.
    const stripped = label
      .replace(/^`+|`+$/g, '')          // strip surrounding backticks
      .replace(/^docs\/on-prem\//, '');  // strip internal dir prefix
    if (/^[a-z0-9-]+\.md$/i.test(stripped)) {
      return FILENAME_DISPLAY[slug] || stripped.replace(/\.md$/i, '');
    }
    return label;
  }
  // Outer-label pattern: tolerates one level of inline `[…](…)` link
  //   embedded in the label, which is what step 4 generates when its
  //   substitution lands inside an existing `[…](./X.md)` link.
  //   Pattern:
  //     [               literal '['
  //     (               capture label content:
  //       (?:                  alternations:
  //         [^[\]]                   — chars not bracket
  //         | \[[^\]]*\]\([^)]*\)    — an inner `[X](Y)` link
  //         | \[[^\]]*\]             — an inner `[X]` (e.g. `[foo]`)
  //       )+
  //     )
  //     \] \( \. \/ <slug> .md (#anchor)? \)
  const OUTER_LINK_PATTERN =
    /\[((?:[^[\]]|\[[^\]]*\]\([^)]*\)|\[[^\]]*\])+)\]\(\.\/([a-z0-9-]+)\.md(#[^)]+)?\)/gi;
  out = out.replace(
    OUTER_LINK_PATTERN,
    (_m, label, file, hash) => {
      const slug = file.toLowerCase();
      const anchor = hash || '';
      const display = normalizeLabel(label, slug);
      if (MIRRORED_DOCS.has(slug)) {
        return `[${display}](/enterprise/${slug}${anchor})`;
      }
      if (slug === 'telemetry') {
        return `[${display}](${TELEMETRY_OVERVIEW_RETARGET}${anchor})`;
      }
      // Unmirrored internal doc — point at the enterprise index, label
      // preserved (already normalized when it was a bare filename).
      return `[${display}](/enterprise/)`;
    },
  );

  // Pass B: handle `./<file>.md` references that weren't link-formatted
  // (bare paths in prose, code spans, etc.). Restricted to the directory
  // names we know to avoid collateral damage on unrelated `.md` text.
  out = out.replace(
    /\.\/(dpa-template|dsar|telemetry-fields)\.md\b/g,
    '/enterprise/$1',
  );
  out = out.replace(/\.\/telemetry\.md\b/g, TELEMETRY_OVERVIEW_RETARGET);
  out = out.replace(/\.\/license-management\.md\b/g, '/enterprise/');

  // Pass C: bare-prose filename references like "(see telemetry.md)" or
  // "Read dpa-template.md for…" with no link, no backticks, no leading
  // path. Use a word-boundary regex restricted to the known filenames so
  // we don't touch unrelated text. Replacement is the human-readable
  // display string from FILENAME_DISPLAY — no link, since the original
  // author already provided their own surrounding sentence shape.
  out = out.replace(
    /\b(dpa-template|dsar|telemetry-fields|telemetry|license-management)\.md\b/g,
    (_m, slug) => FILENAME_DISPLAY[slug] || slug,
  );

  // 6. Drop the "How to add a new field" / "How to remove a field"
  //    sections from telemetry-fields.md — they're maintainer-facing
  //    and reveal internal source paths.
  if (basename === 'telemetry-fields.md') {
    out = out.replace(/\n## How to add a new field[\s\S]*?(?=\n## Related documents|\n## Schema|$)/, '\n')
    out = out.replace(/\n## How to remove a field[\s\S]*?(?=\n## Related documents|\n## Schema|$)/, '\n')
  }

  // 7. Collapse the runs of blank lines created by the strips.
  out = out.replace(/\n{3,}/g, '\n\n')

  // 8. Prepend a public-mirror banner so readers know where to file
  //    corrections.
  const banner = `---
title: ${frontmatterTitleFor(basename)}
description: ${frontmatterDescFor(basename)}
---

::: info Public mirror
This page is a redacted public mirror of an internal aster-cloud document. For executed copies, customer-specific terms, or unredacted internal references, contact [hello@aster-lang.dev](mailto:hello@aster-lang.dev).
:::

`
  // Strip any pre-existing H1 so the VitePress page title comes from
  // frontmatter only.
  out = out.replace(/^#\s+.*\n+/, '')
  return banner + out.trimStart()
}

function frontmatterTitleFor(basename) {
  switch (basename) {
    case 'dpa-template.md':
      return 'Data Processing Agreement (DPA) Template'
    case 'dsar.md':
      return 'Self-service DSAR API'
    case 'telemetry-fields.md':
      return 'Telemetry fields — data minimization'
    default:
      return basename.replace(/\.md$/, '')
  }
}

function frontmatterDescFor(basename) {
  switch (basename) {
    case 'dpa-template.md':
      return 'Template GDPR Art 28 controller-processor agreement for Aster Lang Cloud telemetry. Customer-redactable public mirror.'
    case 'dsar.md':
      return 'Self-service Data Subject Access Request endpoint — exercise GDPR Art 15 (access) and Art 17 (erasure) against Aster Lang Cloud telemetry data.'
    case 'telemetry-fields.md':
      return 'Per-field justification for the opt-in telemetry uploaded by self-hosted Aster Lang deployments to Aster Lang Cloud. GDPR Art 5(1)(c) evidence.'
    default:
      return ''
  }
}

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
}

// Public: redact() is the unit under test for scripts/__tests__/.
// Exported so unit fixtures can import the function without triggering
// the file-I/O main loop.
export { redact }

// Only run the sync loop when invoked as a script (node scripts/sync-...).
// When imported (tests), the module loads silently.
const isMain = import.meta.url === `file://${process.argv[1]}` ||
  (process.argv[1] && process.argv[1].endsWith('sync-enterprise-docs.mjs'))
if (isMain) {
  let drift = 0
  ensureDir(TARGET_DIR)

  for (const { src, dest } of FILES) {
    const srcPath = resolve(SOURCE_DIR, src)
    const destPath = resolve(TARGET_DIR, dest)
    if (!existsSync(srcPath)) {
      console.error(`[sync-enterprise-docs] missing source: ${srcPath}`)
      process.exit(2)
    }
    const input = readFileSync(srcPath, 'utf8')
    const redacted = redact(input, src)
    const current = existsSync(destPath) ? readFileSync(destPath, 'utf8') : ''
    if (current === redacted) {
      console.log(`[sync-enterprise-docs] unchanged ${dest}`)
      continue
    }
    if (checkMode) {
      console.error(`[sync-enterprise-docs] drift detected in ${dest}`)
      drift++
      continue
    }
    writeFileSync(destPath, redacted, 'utf8')
    console.log(`[sync-enterprise-docs] wrote ${dest}`)
  }

  if (checkMode && drift > 0) {
    console.error(`[sync-enterprise-docs] ${drift} file(s) out of date. Run: node scripts/sync-enterprise-docs.mjs`)
    process.exit(1)
  }
}
