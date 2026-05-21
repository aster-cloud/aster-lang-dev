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

/**
 * Resolve the @aster-cloud/glossary package root ONCE so every artifact
 * (export.json, scanner.js, schema.js, locale-utils.js) comes from the
 * same package version. Loading them from independent candidate paths
 * can silently mix versions in a workspace where node_modules and the
 * sibling checkout disagree.
 *
 * Resolution order:
 *   1. node_modules/@aster-cloud/glossary (post-G8a publish)
 *   2. ../aster-design-system/packages/glossary/dist (dev path)
 */
interface GlossaryPackage {
  root: string;
  scan: CanonicalScan;
  glossaryExport: GlossaryExport;
  configSchema: { safeParse: (raw: unknown) => { success: boolean; data?: unknown; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } } };
  /** Locale utilities (BCP-47) — see @aster-cloud/glossary/locale-utils. */
  localeUtils: {
    parseLocaleTag: (tag: string) => null | { language: string; script?: string; region?: string };
    matchLocaleSegment: (segment: string, locales: ReadonlyArray<{ id: string; bcp47?: string; role?: string }>) => string | null;
    localeFromPathSegment: (path: string, rootDir: string, locales: ReadonlyArray<{ id: string }>) => string | null;
    stripLocaleSegment: (path: string, rootDir: string, locales: ReadonlyArray<{ id: string }>) => string;
    shortLocaleTokens: (locales: ReadonlyArray<{ id: string }>) => { tokens: Set<string>; ambiguous: Set<string> };
  };
}

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

async function resolveGlossaryPackage(): Promise<GlossaryPackage> {
  // node_modules takes priority — once @aster-cloud/glossary is published this
  // is the production path. Sibling checkout is the Stage-1 dev fallback.
  const roots = [
    join(repoRoot, 'node_modules', '@aster-cloud', 'glossary'),
    join(repoRoot, '..', 'aster-design-system', 'packages', 'glossary'),
  ];
  for (const root of roots) {
    const dist = join(root, 'dist');
    if (!existsSync(join(dist, 'scanner.js'))) continue;
    if (root.includes('aster-design-system')) {
      console.warn(`[check-glossary] Stage 1: resolving @aster-cloud/glossary from ${relative(repoRoot, root)}`);
    }
    return loadPackageArtifacts(root);
  }
  throw new Error(
    '[check-glossary] @aster-cloud/glossary not found. ' +
    'Run `pnpm install` (after the package publishes) or `pnpm build` in ' +
    '`aster-design-system/packages/glossary` for the dev path.',
  );
}

async function loadPackageArtifacts(root: string): Promise<GlossaryPackage> {
  const dist = join(root, 'dist');
  const exportPath = join(dist, 'glossary.export.json');
  const scannerPath = join(dist, 'scanner.js');
  const schemaPath = join(dist, 'schema.js');
  const localeUtilsPath = join(dist, 'locale-utils.js');
  const loaderPath = join(dist, 'loader.js');

  for (const [label, p] of [
    ['glossary.export.json', exportPath],
    ['scanner.js', scannerPath],
    ['schema.js', schemaPath],
    ['locale-utils.js', localeUtilsPath],
    ['loader.js', loaderPath],
  ] as const) {
    if (!existsSync(p)) {
      throw new Error(`[check-glossary] @aster-cloud/glossary at ${root} is missing ${label}; rebuild the package.`);
    }
  }

  const rawExport = JSON.parse(readFileSync(exportPath, 'utf8'));
  const scannerMod = await import(pathToFileURL(scannerPath).href);
  const schemaMod = await import(pathToFileURL(schemaPath).href);
  const localeUtilsMod = await import(pathToFileURL(localeUtilsPath).href);
  const loaderMod = await import(pathToFileURL(loaderPath).href);

  // Runtime contract checks — catches stale or mismatched dist files with a
  // specific error rather than a downstream TypeError.
  assertExport(scannerMod, 'scan', 'function', `${root}/dist/scanner.js`);
  assertExport(schemaMod, 'GlossaryConfigSchema', 'object', `${root}/dist/schema.js`);
  if (typeof schemaMod.GlossaryConfigSchema?.safeParse !== 'function') {
    throw new Error(`[check-glossary] ${root}/dist/schema.js exports GlossaryConfigSchema but it is not a Zod schema`);
  }
  for (const fn of ['parseLocaleTag', 'matchLocaleSegment', 'localeFromPathSegment', 'stripLocaleSegment', 'shortLocaleTokens']) {
    assertExport(localeUtilsMod, fn, 'function', `${root}/dist/locale-utils.js`);
  }
  assertExport(loaderMod, 'validateGlossaryExportShape', 'function', `${root}/dist/loader.js`);
  loaderMod.validateGlossaryExportShape(rawExport, exportPath);
  const glossaryExport = rawExport as GlossaryExport;

  return {
    root,
    scan: scannerMod.scan as CanonicalScan,
    glossaryExport,
    configSchema: schemaMod.GlossaryConfigSchema,
    localeUtils: {
      parseLocaleTag: localeUtilsMod.parseLocaleTag,
      matchLocaleSegment: localeUtilsMod.matchLocaleSegment,
      localeFromPathSegment: localeUtilsMod.localeFromPathSegment,
      stripLocaleSegment: localeUtilsMod.stripLocaleSegment,
      shortLocaleTokens: localeUtilsMod.shortLocaleTokens,
    },
  };
}

function assertExport(mod: any, name: string, kind: 'function' | 'object', source: string): void {
  const v = mod[name];
  const ok = kind === 'function' ? typeof v === 'function' : (v !== null && typeof v === 'object');
  if (!ok) {
    throw new Error(
      `[check-glossary] contract break: ${source} does not export ${kind} '${name}'. ` +
      `Likely a stale build or an incompatible @aster-cloud/glossary version.`,
    );
  }
}

function loadConfig(pkg: GlossaryPackage): Config {
  const raw = parseYaml(readFileSync(join(repoRoot, 'glossary.config.yaml'), 'utf8'));
  const parsed = pkg.configSchema.safeParse(raw) as { success: boolean; data?: Config; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } };
  if (!parsed.success) {
    throw new Error(
      `[check-glossary] glossary.config.yaml failed schema validation:\n  ${parsed.error!.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('\n  ')}`,
    );
  }
  return parsed.data as Config;
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

// localeFromPath / stripLocaleSegment now come from @aster-cloud/glossary/locale-utils
// (see resolveGlossaryPackage). The previous hand-rolled regexes only handled
// `xx[-XXXX]` and collapsed `zh-CN` and `zh-TW` to the same token; the
// canonical helpers parse full BCP-47 tags.

// ─── main ───
async function main(): Promise<void> {
  const strict = process.argv.includes('--strict');
  const pkg = await resolveGlossaryPackage();
  const glossary = pkg.glossaryExport;
  const config = loadConfig(pkg);
  const { scan } = pkg;
  const { matchLocaleSegment, stripLocaleSegment } = pkg.localeUtils;
  const issues: Issue[] = [];

  console.log(`[check-glossary] glossary v${glossary.localesVersion} loaded ${Object.keys(glossary.terms).length} terms × ${glossary.locales.length} locales`);
  console.log(`[check-glossary] config tier=${config.tier} strict=${strict}`);

  const registeredFullLocales = new Set(glossary.locales.map((l) => l.id));
  const backboneLocale = glossary.locales.find((l) => l.role === 'backbone')?.id ?? 'en-US';
  const officialTier = config.tier === 'official';
  const localeMismatchSeverity: 'error' | 'warning' = (strict || officialTier) ? 'error' : 'warning';

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
      const declared = extractFrontmatterLocale(content);
      // Try the declared locale first; fall back to deriving from path under
      // `docs/<locale>/...` using the canonical BCP-47 matcher.
      const candidate = declared ?? deriveLocaleFromPath(f);
      const fileLocale = candidate && registeredFullLocales.has(candidate)
        ? candidate
        : backboneLocale;
      if (candidate && !registeredFullLocales.has(candidate)) {
        // Surface the typo loudly. In strict/official we DO NOT skip the
        // file — we still scan it under backboneLocale so the diagnostic
        // doesn't suppress alias/parity findings.
        issues.push({
          severity: localeMismatchSeverity,
          rule: 'surface-coverage',
          path: f,
          detail: `markdown locale "${candidate}" not registered in glossary.locales (known: ${[...registeredFullLocales].join(', ')}); falling back to backbone for scanning`,
        });
      }
      // pairKey scope: `<surfaceName>:<path with locale segment stripped>`.
      // stripLocaleSegment now uses the canonical full-BCP-47 matcher from
      // @aster-cloud/glossary/locale-utils — `zh-CN` and `zh-TW` no longer
      // collapse onto the same key.
      const relativeWithoutLocale = stripLocaleSegment(f, 'docs', glossary.locales as any);
      const pairKey = `${surfaceName}:${relativeWithoutLocale}`;
      markdownSurfaces.push({ path: f, locale: fileLocale, content, pairKey });
    }
  }

  function deriveLocaleFromPath(p: string): string | null {
    // Treat the first path segment after `docs/` as a candidate locale tag.
    // Returns null if it doesn't parse as a BCP-47 tag at all, which lets
    // `docs/api/`, `docs/learn/`, etc. fall through cleanly.
    const m = /^docs\/([^/]+)\//.exec(p);
    if (!m) return null;
    const seg = m[1]!;
    return matchLocaleSegment(seg, glossary.locales as any);
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
