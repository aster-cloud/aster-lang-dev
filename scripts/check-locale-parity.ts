/**
 * check-locale-parity.ts — for each hand-written English `*.md` (not in
 * ignored-surfaces), require `docs/zh/<same-relpath>.md` and
 * `docs/de/<same-relpath>.md` to exist.
 *
 * Plan: aster-cloud/.claude/plan/glossary-contract.md §5.3.
 *
 * The English path under `docs/` (NOT under `docs/zh/` or `docs/de/`)
 * is the source-of-truth. Translated mirrors live at
 * `docs/<lang>/<same-relpath>`.
 *
 * Returns exit code 0 if every covered hand-written file has both
 * mirrors; 1 otherwise.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve as resolvePath } from 'node:path';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolvePath(dirname(__filename), '..');

interface Config {
  'ignored-surfaces'?: Array<{ path: string }>;
}

function loadConfig(): Config {
  return parseYaml(readFileSync(join(repoRoot, 'glossary.config.yaml'), 'utf8')) as Config;
}

interface LocaleParityConfig extends Config {
  'locale-dirs'?: string[];
}

/**
 * Discover non-backbone locale directories under docs/. The locale token
 * set is derived from `@aster-cloud/glossary`'s `glossary.export.json` —
 * single source of truth. Adding a new locale to the glossary
 * automatically extends parity coverage with no script edits.
 */
function discoverLocaleDirs(cfg: LocaleParityConfig): string[] {
  // 1. Explicit config wins (recommended post-rollout).
  if (Array.isArray(cfg['locale-dirs']) && cfg['locale-dirs'].length > 0) {
    return [...cfg['locale-dirs']].sort();
  }
  // 2. Derive locale tokens from the glossary, then filesystem-scan.
  const knownTokens = loadGlossaryLocaleTokens();
  const docsDir = join(repoRoot, 'docs');
  if (!existsSync(docsDir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(docsDir)) {
    if (name.startsWith('.')) continue;
    const abs = join(docsDir, name);
    let s; try { s = statSync(abs); } catch { continue; }
    if (!s.isDirectory()) continue;
    const m = /^([a-z]{2,3})(?:-[a-z]{2,4})?$/i.exec(name);
    if (m && knownTokens.has(m[1]!.toLowerCase()) && name !== 'en') {
      out.push(name);
    }
  }
  return out.sort();
}

/**
 * Read short-locale tokens (e.g. 'zh', 'de') from the glossary export.
 * Fails closed if the glossary isn't built — the parity check shouldn't
 * silently run with an empty locale set.
 */
function loadGlossaryLocaleTokens(): Set<string> {
  const candidates = [
    join(repoRoot, 'node_modules', '@aster-cloud', 'glossary', 'dist', 'glossary.export.json'),
    join(repoRoot, '..', 'aster-design-system', 'packages', 'glossary', 'dist', 'glossary.export.json'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      const raw = JSON.parse(readFileSync(p, 'utf8')) as { locales: Array<{ id: string }> };
      const tokens = new Set<string>();
      for (const l of raw.locales) tokens.add(l.id.toLowerCase().split('-')[0]!);
      return tokens;
    }
  }
  throw new Error(
    '[check-locale-parity] glossary.export.json not found; cannot derive locale set. ' +
    'Run `pnpm build` in aster-design-system/packages/glossary first.',
  );
}

function globToRegex(glob: string): RegExp {
  const escaped = glob
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*\//g, '__DOUBLESTAR_SLASH__')
    .replace(/\*\*/g, '__DOUBLESTAR__')
    .replace(/\*/g, '[^/]*')
    .replace(/__DOUBLESTAR_SLASH__/g, '(.*/)?')
    .replace(/__DOUBLESTAR__/g, '.*');
  return new RegExp(`^${escaped}$`);
}

const config = loadConfig();
const ignoreRes = (config['ignored-surfaces'] ?? []).map((s) => globToRegex(s.path));
function isIgnored(p: string): boolean {
  return ignoreRes.some((re) => re.test(p));
}

const locales = discoverLocaleDirs(config as LocaleParityConfig);
console.log(`[check-locale-parity] discovered locale directories: ${locales.join(', ') || '(none)'}`);

// Collect every backbone English .md under docs/ that's not under a locale
// subtree, and not in ignored-surfaces.
function listBackboneEnglishMd(): string[] {
  const out: string[] = [];
  const localePrefixes = locales.map((l) => `docs/${l}`);
  const walk = (dir: string): void => {
    let entries: string[];
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      if (name.startsWith('.')) continue;
      const abs = join(dir, name);
      let s; try { s = statSync(abs); } catch { continue; }
      const rel = relative(repoRoot, abs);
      // Skip locale subtrees — those are the mirrors, not backbone.
      if (localePrefixes.some((p) => rel === p || rel.startsWith(`${p}/`))) {
        continue;
      }
      if (s.isDirectory()) walk(abs);
      else if (name.endsWith('.md') && rel.startsWith('docs/') && !isIgnored(rel)) {
        out.push(rel);
      }
    }
  };
  walk(repoRoot);
  return out;
}

const backboneFiles = listBackboneEnglishMd();
const missing: Array<{ backbone: string; locale: string; expected: string }> = [];

for (const f of backboneFiles) {
  // f looks like "docs/getting-started/quickstart.md"
  // Need "docs/<locale>/getting-started/quickstart.md" for every discovered locale.
  const relUnderDocs = f.replace(/^docs\//, '');
  for (const locale of locales) {
    const expected = `docs/${locale}/${relUnderDocs}`;
    if (!existsSync(join(repoRoot, expected))) {
      missing.push({ backbone: f, locale, expected });
    }
  }
}

console.log(`[check-locale-parity] backbone English files: ${backboneFiles.length}`);
console.log(`[check-locale-parity] expected mirrors per backbone: ${locales.length} (${locales.join(', ') || 'none'}) = ${backboneFiles.length * locales.length} total`);
console.log(`[check-locale-parity] missing mirrors: ${missing.length}`);

if (missing.length > 0) {
  for (const m of missing.slice(0, 100)) {
    console.error(`  [missing-mirror] ${m.locale}: ${m.expected} (backbone: ${m.backbone})`);
  }
  if (missing.length > 100) console.error(`  … and ${missing.length - 100} more`);
}

// Always write report for CI artifact.
writeFileSync(join(repoRoot, 'locale-parity-findings.json'), JSON.stringify({
  generatedAt: new Date().toISOString(),
  backboneFileCount: backboneFiles.length,
  missingCount: missing.length,
  missing,
}, null, 2));

process.exit(missing.length === 0 ? 0 : 1);
