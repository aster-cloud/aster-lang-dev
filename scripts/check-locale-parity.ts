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

// Collect every backbone English .md under docs/ that's not under
// docs/zh/, docs/de/, and not in ignored-surfaces.
function listBackboneEnglishMd(): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    let entries: string[];
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      if (name.startsWith('.')) continue;
      const abs = join(dir, name);
      let s; try { s = statSync(abs); } catch { continue; }
      const rel = relative(repoRoot, abs);
      // Skip locale subtrees — those are the mirrors, not backbone.
      if (rel === 'docs/zh' || rel === 'docs/de' ||
          rel.startsWith('docs/zh/') || rel.startsWith('docs/de/')) {
        if (s.isDirectory()) continue;
        else continue;
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
  // Need "docs/zh/getting-started/quickstart.md" and "docs/de/..."
  const relUnderDocs = f.replace(/^docs\//, '');
  for (const locale of ['zh', 'de']) {
    const expected = `docs/${locale}/${relUnderDocs}`;
    if (!existsSync(join(repoRoot, expected))) {
      missing.push({ backbone: f, locale, expected });
    }
  }
}

console.log(`[check-locale-parity] backbone English files: ${backboneFiles.length}`);
console.log(`[check-locale-parity] expected mirrors per backbone: 2 (zh, de) = ${backboneFiles.length * 2} total`);
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
