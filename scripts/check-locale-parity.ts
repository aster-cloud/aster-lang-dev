/**
 * check-locale-parity.ts — for each hand-written English `*.md` (not in
 * ignored-surfaces), require a mirror at `docs/<locale>/<same-relpath>.md`
 * for every locale registered in `@aster-cloud/glossary`.
 *
 * Plan: aster-cloud/.claude/plan/glossary-contract.md §5.3.
 *
 * The English path under `docs/` (NOT under any locale subtree) is the
 * source-of-truth. Translated mirrors live at `docs/<locale>/<same-relpath>`.
 *
 * Locale set is derived from `glossary.export.json`. Optionally, the
 * config's `locale-dirs` field can pin an explicit allowlist — but it
 * MUST be a subset of the glossary-registered locales (drift detection).
 *
 * Returns exit code 0 if every backbone file has every locale mirror;
 * 1 otherwise.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
 * Discover non-backbone locale directories under docs/. Uses the
 * canonical `matchLocaleSegment` from `@aster-cloud/glossary/locale-utils`
 * so:
 *   - Two locales sharing a primary subtag (e.g. zh-CN and zh-TW) do NOT
 *     collide: a docs subtree named `zh-TW` matches only the registered
 *     locale `zh-TW`, not `zh-CN`.
 *   - Configured `locale-dirs` entries are validated against the FULL
 *     glossary locale set, not a primary-subtag projection.
 *
 * `locale-dirs` (when present) acts as an explicit allowlist; entries not
 * registered in `glossary.locales` cause a hard error.
 *
 * The returned list contains the discovered/declared directory NAMES (as
 * they appear under `docs/`), not the resolved full locale ids.
 */
async function discoverLocaleDirs(cfg: LocaleParityConfig): Promise<string[]> {
  const artifacts = await loadGlossaryArtifacts();

  // Degraded mode (CI without published @aster-cloud/glossary): rely on
  // config['locale-dirs'] OR raw filesystem discovery without locale-id
  // validation. The check is still useful — it ensures every backbone
  // page has a mirror in each declared locale subtree — but it cannot
  // reject locale-dirs that aren't in the glossary registry.
  if (artifacts === null) {
    const required = process.env.ASTER_GLOSSARY_REQUIRED === '1';
    if (required) {
      throw new Error(
        '[check-locale-parity] @aster-cloud/glossary dist not found. ' +
        'Run `pnpm build` in aster-design-system/packages/glossary first, ' +
        'or unset ASTER_GLOSSARY_REQUIRED to fall back to filesystem discovery.',
      );
    }
    console.warn(
      '[check-locale-parity] @aster-cloud/glossary not available; ' +
      'falling back to filesystem-only locale discovery. Set ' +
      'ASTER_GLOSSARY_REQUIRED=1 to make this fatal.',
    );
    if (Array.isArray(cfg['locale-dirs']) && cfg['locale-dirs'].length > 0) {
      return [...cfg['locale-dirs']].sort();
    }
    // Heuristic locale-dir match: BCP-47-like xx or xx-YY.
    const localePattern = /^[a-z]{2,3}(-[A-Z]{2,4})?$/;
    const docsDir = join(repoRoot, 'docs');
    const fsDiscovered: string[] = [];
    if (existsSync(docsDir)) {
      for (const name of readdirSync(docsDir)) {
        if (name.startsWith('.')) continue;
        if (!localePattern.test(name)) continue;
        const abs = join(docsDir, name);
        let s; try { s = statSync(abs); } catch { continue; }
        if (s.isDirectory()) fsDiscovered.push(name);
      }
    }
    return fsDiscovered.sort();
  }

  const { glossaryRoot, glossaryExport, matchLocaleSegment } = artifacts;
  const backboneId = glossaryExport.locales.find((l) => l.role === 'backbone')?.id;

  // Filesystem-discover candidate directory names; each is mapped through
  // matchLocaleSegment to confirm it resolves to a registered FULL locale id
  // OTHER than the backbone.
  const fsDiscovered: string[] = [];
  const docsDir = join(repoRoot, 'docs');
  if (existsSync(docsDir)) {
    for (const name of readdirSync(docsDir)) {
      if (name.startsWith('.')) continue;
      const abs = join(docsDir, name);
      let s; try { s = statSync(abs); } catch { continue; }
      if (!s.isDirectory()) continue;
      const matched = matchLocaleSegment(name, glossaryExport.locales);
      if (matched && matched !== backboneId) {
        fsDiscovered.push(name);
      }
    }
  }

  if (Array.isArray(cfg['locale-dirs']) && cfg['locale-dirs'].length > 0) {
    const invalid = cfg['locale-dirs'].filter((d) => matchLocaleSegment(d, glossaryExport.locales) === null);
    if (invalid.length > 0) {
      throw new Error(
        `[check-locale-parity] config 'locale-dirs' contains entries not registered in glossary.locales: ${invalid.join(', ')}; ` +
        `known glossary locale ids: ${glossaryExport.locales.map((l) => l.id).sort().join(', ')}`,
      );
    }
    void glossaryRoot;
    return [...cfg['locale-dirs']].sort();
  }
  return fsDiscovered.sort();
}

interface GlossaryExportShape {
  localesVersion: number;
  locales: Array<{ id: string; role?: 'backbone'; bcp47?: string }>;
}

interface GlossaryArtifacts {
  glossaryRoot: string;
  glossaryExport: GlossaryExportShape;
  matchLocaleSegment: (segment: string, locales: ReadonlyArray<{ id: string }>) => string | null;
}

/**
 * Resolve the @aster-cloud/glossary package once and load both the export
 * JSON and the canonical locale-utils. Both come from the same package
 * root, avoiding cross-version mixing.
 *
 * <p>Returns <code>null</code> when neither node_modules nor a sibling
 * checkout has the package. Callers may either degrade to a filesystem-
 * only discovery mode (the {@link main} default) or hard-fail. The
 * historical fatal-error behaviour is restored by setting the env var
 * <code>ASTER_GLOSSARY_REQUIRED=1</code>, which strict CI gates can pin.
 */
async function loadGlossaryArtifacts(): Promise<GlossaryArtifacts | null> {
  const roots = [
    join(repoRoot, 'node_modules', '@aster-cloud', 'glossary'),
    join(repoRoot, '..', 'aster-design-system', 'packages', 'glossary'),
  ];
  for (const root of roots) {
    const exportPath = join(root, 'dist', 'glossary.export.json');
    const localeUtilsPath = join(root, 'dist', 'locale-utils.js');
    const loaderPath = join(root, 'dist', 'loader.js');
    if (!existsSync(exportPath) || !existsSync(localeUtilsPath) || !existsSync(loaderPath)) continue;
    const raw = JSON.parse(readFileSync(exportPath, 'utf8'));
    const loaderMod = await import(pathToFileURL(loaderPath).href);
    if (typeof loaderMod.validateGlossaryExportShape !== 'function') {
      throw new Error(`[check-locale-parity] ${loaderPath} does not export validateGlossaryExportShape — rebuild @aster-cloud/glossary`);
    }
    loaderMod.validateGlossaryExportShape(raw, exportPath);
    const mod = await import(pathToFileURL(localeUtilsPath).href);
    if (typeof mod.matchLocaleSegment !== 'function') {
      throw new Error(`[check-locale-parity] ${localeUtilsPath} does not export matchLocaleSegment — rebuild @aster-cloud/glossary`);
    }
    return {
      glossaryRoot: root,
      glossaryExport: raw as unknown as GlossaryExportShape,
      matchLocaleSegment: mod.matchLocaleSegment,
    };
  }
  return null;
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

async function main(): Promise<void> {
  const config = loadConfig();
  const ignoreRes = (config['ignored-surfaces'] ?? []).map((s) => globToRegex(s.path));
  const isIgnored = (p: string): boolean => ignoreRes.some((re) => re.test(p));

  const locales = await discoverLocaleDirs(config as LocaleParityConfig);
  console.log(`[check-locale-parity] discovered locale directories: ${locales.join(', ') || '(none)'}`);

  // Collect every backbone English .md under docs/ that's not under a locale
  // subtree, and not in ignored-surfaces.
  const localePrefixes = locales.map((l) => `docs/${l}`);
  const backboneFiles: string[] = [];
  const walk = (dir: string): void => {
    let entries: string[];
    try { entries = readdirSync(dir); } catch { return; }
    for (const name of entries) {
      if (name.startsWith('.')) continue;
      const abs = join(dir, name);
      let s; try { s = statSync(abs); } catch { continue; }
      const rel = relative(repoRoot, abs);
      if (localePrefixes.some((p) => rel === p || rel.startsWith(`${p}/`))) continue;
      if (s.isDirectory()) walk(abs);
      else if (name.endsWith('.md') && rel.startsWith('docs/') && !isIgnored(rel)) {
        backboneFiles.push(rel);
      }
    }
  };
  walk(repoRoot);

  const missing: Array<{ backbone: string; locale: string; expected: string }> = [];
  for (const f of backboneFiles) {
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

  writeFileSync(join(repoRoot, 'locale-parity-findings.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    backboneFileCount: backboneFiles.length,
    missingCount: missing.length,
    missing,
  }, null, 2));

  process.exit(missing.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('[check-locale-parity] fatal:', err instanceof Error ? err.message : err);
  process.exit(1);
});
