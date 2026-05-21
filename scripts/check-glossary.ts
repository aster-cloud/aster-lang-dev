/**
 * check-glossary.ts — Stage 1+2 scanner driver for aster-lang-dev.
 * Plan: aster-cloud/.claude/plan/glossary-contract.md §5.
 *
 * Usage:
 *   pnpm tsx scripts/check-glossary.ts            # report-only (Stage 1)
 *   pnpm tsx scripts/check-glossary.ts --strict   # Stage 4: errors fail CI
 *
 * Stage 1 resolves @aster-cloud/glossary via:
 *   1. node_modules (post-G8a publish)
 *   2. ../aster-design-system/packages/glossary/dist (dev path)
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative, resolve as resolvePath } from 'node:path';
import { parse as parseYaml } from 'yaml';

interface GlossaryExport {
  version: 1;
  localesVersion: number;
  locales: Array<{ id: string; role?: 'backbone'; bcp47: string }>;
  terms: Record<string, {
    id: string;
    translations: Record<string, string>;
    'forbidden-aliases'?: Record<string, Array<{ text: string; match: MatchSpec }>>;
    match: MatchSpec;
    'user-facing': boolean;
    lifecycle: { 'backbone-revision': number; 'backbone-change-type'?: string; 'reviewed-backbone-revision': Record<string, number> };
  }>;
}
interface MatchSpec {
  mode: 'literal' | 'phrase' | 'reviewed-regex';
  'case-sensitive'?: boolean;
  boundary?: 'unicode-word' | 'none';
  normalize?: Array<'case' | 'width' | 'punctuation' | 'whitespace'>;
}
interface Config {
  version: 1;
  tier: 'official' | 'community';
  localesVersion: number;
  surfaces: Record<string, {
    type: 'json' | 'markdown';
    paths: string | string[];
    'backbone-locale'?: string;
    'locale-from-filename'?: boolean;
    'locale-from-frontmatter'?: boolean;
    'fallback-locale'?: string;
    alignment?: 'block-id';
  }>;
  'ignored-surfaces'?: Array<{ path: string; reason: string }>;
  'untranslated-tokens'?: string[];
}
interface Issue {
  severity: 'error' | 'warning';
  rule: string;
  path: string;
  locale?: string;
  termId?: string;
  anchor?: string;
  detail: string;
}

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolvePath(dirname(__filename), '..');

// ─── resolve glossary ───
function resolveGlossary(): GlossaryExport {
  const candidates = [
    join(repoRoot, 'node_modules', '@aster-cloud', 'glossary', 'dist', 'glossary.export.json'),
    join(repoRoot, '..', 'aster-design-system', 'packages', 'glossary', 'dist', 'glossary.export.json'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      if (p.includes('aster-design-system')) {
        console.warn(`[check-glossary] Stage 1: resolving glossary from ${relative(repoRoot, p)}`);
      }
      return JSON.parse(readFileSync(p, 'utf8')) as GlossaryExport;
    }
  }
  throw new Error('[check-glossary] @aster-cloud/glossary not found in node_modules or workspace sibling');
}

/**
 * Resolve the canonical scanner from the same locations as resolveGlossary.
 * Matching semantics live there; this driver only handles I/O.
 */
type CanonicalScan = (input: any, config: { glossary: GlossaryExport; strict?: boolean }) => {
  issues: Array<{
    severity: 'error' | 'warning';
    rule: string;
    surfacePath: string;
    locale?: string;
    termId?: string;
    anchor?: string;
    detail: string;
  }>;
  errorCount: number;
  warningCount: number;
};

async function resolveScanner(): Promise<{ scan: CanonicalScan }> {
  const candidates = [
    join(repoRoot, 'node_modules', '@aster-cloud', 'glossary', 'dist', 'scanner.js'),
    join(repoRoot, '..', 'aster-design-system', 'packages', 'glossary', 'dist', 'scanner.js'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      const mod = await import(pathToFileURL(p).href);
      return { scan: mod.scan };
    }
  }
  throw new Error('[check-glossary] canonical scanner not found; run `pnpm build` in aster-design-system/packages/glossary');
}

async function loadConfig(): Promise<Config> {
  const raw = parseYaml(readFileSync(join(repoRoot, 'glossary.config.yaml'), 'utf8'));
  const schemaCandidates = [
    join(repoRoot, 'node_modules', '@aster-cloud', 'glossary', 'dist', 'schema.js'),
    join(repoRoot, '..', 'aster-design-system', 'packages', 'glossary', 'dist', 'schema.js'),
  ];
  for (const sp of schemaCandidates) {
    if (existsSync(sp)) {
      const mod = await import(pathToFileURL(sp).href);
      const parsed = mod.GlossaryConfigSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(
          `[check-glossary] glossary.config.yaml failed schema validation:\n  ${parsed.error.issues
            .map((i: any) => `${i.path.join('.')}: ${i.message}`)
            .join('\n  ')}`,
        );
      }
      return parsed.data as Config;
    }
  }
  console.warn('[check-glossary] schema module not built; skipping config Zod validation');
  return raw as Config;
}

// ─── glob ─→ regex (handles **/ for zero-depth match) ───
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

function isIgnored(path: string, config: Config): boolean {
  for (const ign of config['ignored-surfaces'] ?? []) {
    if (globToRegex(ign.path).test(path)) return true;
  }
  return false;
}

function listMatches(glob: string | string[]): string[] {
  const patterns = Array.isArray(glob) ? glob : [glob];
  const results: string[] = [];
  for (const pat of patterns) {
    const re = globToRegex(pat);
    const walk = (dir: string): void => {
      let entries: string[];
      try { entries = readdirSync(dir); } catch { return; }
      for (const name of entries) {
        if (name.startsWith('.') || name === 'node_modules') continue;
        const abs = join(dir, name);
        let s; try { s = statSync(abs); } catch { continue; }
        if (s.isDirectory()) walk(abs);
        else {
          const rel = relative(repoRoot, abs);
          if (re.test(rel)) results.push(rel);
        }
      }
    };
    walk(repoRoot);
  }
  return [...new Set(results)];
}

// Contract semantics — matching, surface extraction, parity, pairing,
// freshness — live in @aster-cloud/glossary/scanner.scan(). This driver
// only handles I/O. Do NOT add local matchers or extractors.

function extractFrontmatterLocale(md: string): string | null {
  const m = /^---\n([\s\S]*?)\n---/.exec(md);
  if (!m) return null;
  const fm = m[1]!;
  const line = /^locale:\s*(\S+)\s*$/m.exec(fm);
  return line ? line[1]! : null;
}

// VitePress uses path-based locale conventions: docs/zh/foo.md is zh-CN, docs/de/foo.md is de-DE.
function localeFromPath(p: string): string {
  if (p.startsWith('docs/zh/')) return 'zh-CN';
  if (p.startsWith('docs/de/')) return 'de-DE';
  return 'en-US';
}

// ─── main ───
async function main(): Promise<void> {
  const strict = process.argv.includes('--strict');
  const glossary = resolveGlossary();
  const config = await loadConfig();
  const { scan } = await resolveScanner();
  const issues: Issue[] = [];

  console.log(`[check-glossary] glossary v${glossary.localesVersion} loaded ${Object.keys(glossary.terms).length} terms × ${glossary.locales.length} locales`);
  console.log(`[check-glossary] config tier=${config.tier} strict=${strict}`);

  // Build ScanInput from markdown surfaces. The canonical scan() handles
  // forbidden-alias detection AND cross-locale parity (which the previous
  // hand-written driver lacked entirely — Round-2 Codex finding).
  const markdownSurfaces: Array<{ path: string; locale: string; content: string; pairKey?: string }> = [];

  for (const [surfaceName, surface] of Object.entries(config.surfaces)) {
    if (surface.type !== 'markdown') continue;
    const files = listMatches(surface.paths).filter((f) => !isIgnored(f, config));
    const annotated = files.filter((f) => /<!--\s*glossary:block\s+id=/.test(readFileSync(join(repoRoot, f), 'utf8')));
    console.log(`[check-glossary] markdown surface "${surfaceName}" matched ${files.length} files (${annotated.length} annotated)`);

    for (const f of annotated) {
      const content = readFileSync(join(repoRoot, f), 'utf8');
      const fileLocale = extractFrontmatterLocale(content) ?? localeFromPath(f);
      // pairKey scope: `<surfaceName>:<path with locale segment stripped>`.
      // Cross-surface namespacing prevents two surfaces that happen to share
      // a relative path from being falsely paired (Round-3 codex finding).
      const relativeWithoutLocale = f
        .replace(/^docs\/(zh|de|ja|ko|fr|es|pt|it|ru|ar|hi)(-[a-z]{2,4})?\//i, 'docs/')
        .replace(/^docs\//, '');
      const pairKey = `${surfaceName}:${relativeWithoutLocale}`;
      markdownSurfaces.push({ path: f, locale: fileLocale, content, pairKey });
    }
  }

  const scanResult = scan({ markdownSurfaces }, { glossary, strict });
  for (const i of scanResult.issues) {
    issues.push({
      severity: i.severity,
      rule: i.rule,
      path: i.surfacePath,
      locale: i.locale,
      termId: i.termId,
      anchor: i.anchor,
      detail: i.detail,
    });
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  if (issues.length > 0) {
    console.log(`\n[check-glossary] findings (${errorCount} errors, ${warningCount} warnings):`);
    for (const i of issues.slice(0, 200)) {
      const loc = i.locale ? ` [${i.locale}]` : '';
      const term = i.termId ? ` term=${i.termId}` : '';
      const anchor = i.anchor ? ` @${i.anchor}` : '';
      console.log(`  [${i.severity}] ${i.rule}${loc}${term} ${i.path}${anchor}: ${i.detail}`);
    }
    if (issues.length > 200) console.log(`  … and ${issues.length - 200} more`);
  } else {
    console.log('[check-glossary] no findings');
  }

  writeFileSync(join(repoRoot, 'glossary-findings.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    config: { tier: config.tier, localesVersion: config.localesVersion },
    glossary: { localesVersion: glossary.localesVersion, termCount: Object.keys(glossary.terms).length },
    counts: { error: errorCount, warning: warningCount },
    issues,
  }, null, 2));
  console.log(`[check-glossary] wrote glossary-findings.json`);

  if (config.tier === 'community') process.exit(0);
  const failable = strict ? issues.length > 0 : errorCount > 0;
  process.exit(failable ? 1 : 0);
}

main().catch((err) => {
  console.error('[check-glossary] fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});
