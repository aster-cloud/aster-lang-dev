/**
 * Generate `docs/public/.well-known/routes.json` from
 * `config/routes.yaml`.
 *
 * Mirrors `aster-cloud/scripts/routes/build-routes.ts`. The published
 * JSON lives under `docs/public/` so VitePress copies it into the
 * built site, making it fetchable as `/.well-known/routes.json` after
 * deploy. Phase 3's link checker on the sibling repo reads this URL
 * (or a committed snapshot) to validate cross-site links.
 *
 * Determinism: identical to the cloud generator. Same YAML → same JSON.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { validateManifest, type RoutesManifest } from './types.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const YAML_PATH = resolve(REPO_ROOT, 'config', 'routes.yaml');
const JSON_PATH = resolve(REPO_ROOT, 'docs', 'public', '.well-known', 'routes.json');

function fail(msg: string, code = 2): never {
  console.error(`::error::${msg}`);
  process.exit(code);
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

  const { errors, warnings } = validateManifest(parsed);
  if (warnings.length > 0) {
    for (const w of warnings) console.warn(`::warning::${w}`);
  }
  if (errors.length > 0) {
    for (const err of errors) console.error(`::error::${err}`);
    process.exit(1);
  }

  const manifest = parsed as RoutesManifest;
  const json = JSON.stringify(manifest, null, 2) + '\n';
  writeFileSync(JSON_PATH, json);
  console.log(`[build-routes] wrote ${JSON_PATH} (${manifest.routes.length} routes)`);
}

main();
