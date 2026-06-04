/**
 * Verify every public VitePress page has a `config/routes.yaml` entry,
 * every `_redirects` rule has a matching `redirect-to` entry, and
 * every manifest entry's `source:` resolves to a real file.
 *
 * VitePress route conventions:
 *   docs/index.md                → /
 *   docs/learn/playground.md     → /learn/playground
 *   docs/community/index.md      → /community
 *
 * Locale routes:
 *   docs/zh/learn/playground.md  → /learn/playground (same canonical
 *                                  URL; the manifest's `locales` field
 *                                  expresses the prefix policy)
 *
 * We only check the *default-locale* tree (no zh/ or de/ prefix) for
 * coverage. The translated trees are expected mirrors; failing on
 * them would just double-count.
 *
 * `_redirects` validation:
 *   - Every redirect source path must appear as `redirect-to` in the
 *     manifest. Phase 3 will also verify the redirect *destination*
 *     points at a real `canonical-here` on the OTHER site, but that
 *     requires the cross-repo snapshot and lives in check-links.ts.
 *
 * Exit:
 *   0 = OK
 *   1 = coverage gap or unresolved source
 *   2 = infra failure
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import {
  routePatternToRegex,
  validateManifest,
  type RoutesManifest,
} from './types';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const YAML_PATH = resolve(REPO_ROOT, 'config', 'routes.yaml');
const DOCS_ROOT = resolve(REPO_ROOT, 'docs');
const REDIRECTS_PATH = resolve(DOCS_ROOT, 'public', '_redirects');

function fail(msg: string, code = 2): never {
  console.error(`::error::${msg}`);
  process.exit(code);
}

/**
 * Convert a markdown file path under `docs/` to its canonical URL.
 *   docs/index.md             → /
 *   docs/learn/playground.md  → /learn/playground
 *   docs/community/index.md   → /community
 *
 * Returns null when the file is in a locale tree, hidden, or
 * non-routable (e.g. blog/_template.md, anything under .vitepress/,
 * anything under .glossary/).
 */
function mdToRoute(absPath: string): string | null {
  const rel = relative(DOCS_ROOT, absPath);
  if (rel.startsWith('.vitepress/')) return null;
  if (rel.includes('/.glossary/')) return null;
  if (rel.startsWith('public/')) return null;
  if (rel.startsWith('zh/') || rel.startsWith('de/')) return null; // locale mirrors
  if (rel.startsWith('adr/')) return null; // internal architecture docs, not public site
  if (rel.split('/').some((seg) => seg.startsWith('_'))) return null; // _template.md
  const base = rel.split('/').pop() ?? '';
  if (!base.endsWith('.md')) return null;

  // Drop trailing `.md` and any `/index` suffix.
  let trimmed = rel.replace(/\.md$/, '');
  if (trimmed.endsWith('/index')) trimmed = trimmed.slice(0, -'/index'.length);
  if (trimmed === 'index' || trimmed === '') return '/';
  return `/${trimmed}`;
}

function walkFiles(dir: string, predicate: (name: string) => boolean, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const s = statSync(abs);
    if (s.isDirectory()) {
      walkFiles(abs, predicate, out);
    } else if (predicate(entry)) {
      out.push(abs);
    }
  }
  return out;
}

/**
 * Parse the Cloudflare `_redirects` file. Format per line:
 *   <source>  <destination>  <code>
 * Comments start with `#`. Blank lines ignored.
 *
 * Returns the SOURCE paths only (we care that each redirect rule
 * has a manifest twin; the destination is for Phase 3).
 */
function parseRedirects(text: string): string[] {
  const sources: string[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const cols = trimmed.split(/\s+/);
    if (cols.length < 2) continue;
    sources.push(cols[0]);
  }
  return sources;
}

/**
 * Normalize a `_redirects` source path to the same shape used in the
 * manifest. Cloudflare uses `:splat` for wildcards; the manifest uses
 * `*`. Locale prefixes are part of the source path on Cloudflare
 * because matching is prefix-first; but in the manifest we treat
 * locale prefixes as a property (`locales: all` expands them), so we
 * strip the prefix here.
 */
function normalizeRedirectSource(src: string, prefixed: readonly string[]): string {
  // Strip locale prefix if present.
  for (const loc of prefixed) {
    if (src === `/${loc}` || src.startsWith(`/${loc}/`)) {
      src = src.slice(`/${loc}`.length) || '/';
      break;
    }
  }
  // Cloudflare-style trailing splat → manifest wildcard.
  return src.replace(/\/\*$/, '/*').replace(/\/$/, '');
}

function main(): void {
  if (!existsSync(YAML_PATH)) {
    fail(`config/routes.yaml not found at ${YAML_PATH}`);
  }
  const yaml = readFileSync(YAML_PATH, 'utf8');
  let parsed: unknown;
  try {
    parsed = parseYaml(yaml);
  } catch (e) {
    fail(`routes.yaml is not valid YAML: ${(e as Error).message}`);
  }
  const { errors } = validateManifest(parsed);
  if (errors.length > 0) {
    for (const err of errors) console.error(`::error::${err}`);
    process.exit(1);
  }
  const manifest = parsed as RoutesManifest;

  // Discover all VitePress pages in default-locale tree.
  const mdFiles = walkFiles(DOCS_ROOT, (n) => n.endsWith('.md'));
  const discoveredRoutes = new Set<string>();
  for (const abs of mdFiles) {
    const route = mdToRoute(abs);
    if (route) discoveredRoutes.add(route);
  }
  const sortedDiscovered = [...discoveredRoutes].sort();

  // Build matchers from the manifest.
  const patterns = manifest.routes.map((r) => ({
    raw: r.path,
    regex: routePatternToRegex(r.path),
    status: r.status,
    entry: r,
  }));

  const uncovered: string[] = [];
  for (const route of sortedDiscovered) {
    const match = patterns.find((p) => p.regex.test(route));
    if (!match) uncovered.push(route);
    else if (match.status === 'redirect-to') {
      uncovered.push(`${route} (has page on disk but manifest declares status=redirect-to)`);
    }
  }

  // Validate _redirects has a manifest twin for each rule.
  const redirectGaps: string[] = [];
  if (existsSync(REDIRECTS_PATH)) {
    const redirSources = parseRedirects(readFileSync(REDIRECTS_PATH, 'utf8'));
    const redirectPatterns = patterns.filter((p) => p.status === 'redirect-to');
    for (const src of redirSources) {
      const normalized = normalizeRedirectSource(src, manifest.locales.prefixed);
      const match = redirectPatterns.find((p) => {
        const norm = p.raw.replace(/\/$/, '');
        return norm === normalized || p.regex.test(normalized);
      });
      if (!match) redirectGaps.push(src);
    }
  } else {
    console.warn(`::warning::_redirects file not found at ${REDIRECTS_PATH}`);
  }

  // Source-resolution check.
  const unresolved: { path: string; source: string }[] = [];
  for (const r of manifest.routes) {
    if (!r.source) continue;
    if (r.source.includes('*')) continue;
    const abs = resolve(REPO_ROOT, r.source);
    if (!existsSync(abs)) {
      unresolved.push({ path: r.path, source: r.source });
    }
  }

  // Report.
  console.log('# Route coverage report (aster-lang-dev)\n');
  console.log(`- discovered VitePress pages (default locale): ${sortedDiscovered.length}`);
  console.log(`- manifest entries: ${manifest.routes.length}`);
  console.log(`- uncovered pages: ${uncovered.length}`);
  console.log(`- redirect rules with no manifest twin: ${redirectGaps.length}`);
  console.log(`- unresolved sources: ${unresolved.length}\n`);

  if (uncovered.length > 0) {
    console.log('## VitePress pages with no manifest entry\n');
    for (const route of uncovered) console.log(`  - ${route}`);
    console.log('');
  }
  if (redirectGaps.length > 0) {
    console.log('## _redirects rules missing from manifest\n');
    console.log('Every redirect needs a `redirect-to` entry so cross-site link checking (Phase 3) can validate it:\n');
    for (const src of redirectGaps) console.log(`  - ${src}`);
    console.log('');
  }
  if (unresolved.length > 0) {
    console.log('## Manifest entries with missing source files\n');
    for (const u of unresolved) console.log(`  - ${u.path} → ${u.source}`);
    console.log('');
  }

  if (uncovered.length > 0 || redirectGaps.length > 0 || unresolved.length > 0) {
    process.exit(1);
  }
  console.log('OK');
}

main();
