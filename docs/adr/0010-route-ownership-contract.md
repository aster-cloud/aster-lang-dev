# ADR 0010 — Route ownership contract between aster-lang-dev and aster-cloud

Status: Accepted (Phase 1 — schema + bootstrap manifests)
Date: 2026-06-04
Companions: `aster-cloud/docs/architecture/decisions/0014-route-ownership-contract.md`

## Context

Aster runs two public sites under one brand:

- **aster-lang.dev** (this repo, VitePress) — open-source language site:
  marketing, browser playground, language pedagogy at `/learn/*`, community
  / contributor hub at `/community/*`, blog. Cloudflare Pages.
- **aster-lang.cloud** (`aster-cloud` repo, Next.js) — commercial SaaS:
  auth, dashboard, billing, application docs at `/docs/*`.

Until now there was no declared source of truth for who owns which URL.
Cross-site links and historical redirects lived in three places (VitePress
nav, MDX bodies, `docs/public/_redirects`) with no cross-check. Recent
incidents from the sibling side:

- Cloud docs CTAs pointed at `/playground` — a path that does not exist
  on either site. Every "Try in Playground" 404'd.
- Legacy `/api/*` and `/getting-started/*` references in our own pages
  continued to render even after the 2026-Q3 IA correction moved those
  surfaces to Cloud. The `_redirects` file caught direct hits but not
  authored links.
- `/zh/zh/policies`-class double-prefix bugs surfaced on Cloud because
  there was no place to declare "this locale prefix is the canonical
  shape" for cross-site references.

These are all the same problem: no contract.

## Decision

Introduce a per-repo route ownership manifest at
**`config/routes.yaml`** (in this repo) and
**`aster-cloud/config/routes.yaml`** (in the sibling repo).

See the sibling ADR for the full rationale. This file is the lang-dev
mirror. The decision and evolution rules are identical; only the file
locations and tech stack differ.

### What this Phase 1 delivers

1. `config/routes.yaml` — hand-curated manifest of every active VitePress
   page, every entry in the locale nav, and every rule in
   `docs/public/_redirects`.
2. This ADR + its sibling on the Cloud side.
3. No generator, no link-checker, no CI enforcement yet. That is Phase 2/3.

### Status values

| status | meaning |
|---|---|
| `canonical-here` | This site owns the route and serves a VitePress page at it. |
| `mirror` | This site renders a copy of content whose canonical URL is on the other site. Used sparingly for legal/compliance pages. |
| `redirect-to` | This site only redirects to a canonical URL elsewhere. The canonical URL goes in `canonicalUrl`. |

### What Phase 2 will deliver

- Auto-generated `docs/public/.well-known/routes.json` from the YAML.
- `scripts/routes/check-route-coverage.ts` that walks `docs/**/*.md`,
  `docs/.vitepress/locales/{en,zh,de}.ts`, and `docs/public/_redirects`,
  and fails if any of them have entries missing from the manifest.

### What Phase 3 will deliver

- `scripts/routes/check-links.ts` that walks `docs/**/*.md` +
  `docs/.vitepress/**/*.{ts,vue}` and validates cross-site links against
  the sibling repo's committed manifest snapshot.
- Wired into `.github/workflows/ci.yml` with hard fail on dangling refs
  and on links to `redirect-to` URLs (callers must use the canonical URL
  directly).

## Evolution rules

- **Adding a page** — same PR that adds the markdown file must add a manifest
  entry. Phase 2 will enforce.
- **Moving a page** — old path stays as `redirect-to`. Drop after one
  deprecation cycle.
- **Adding a locale** — update `locales.prefixed`. Phase 2 generator handles
  the prefix expansion.
- **Cross-site move** — coordinate the two PRs. Update `_redirects` in
  lock-step with the manifest.

## Consequences

Positive:
- Catches the `/playground` class of bug at PR time.
- Cloudflare `_redirects` no longer the de-facto source of truth for
  cross-site routing.
- Contributors get a single place to look up "which site owns this URL".

Negative:
- Two manifests can drift between cross-site PRs. Mitigation: Phase 3
  snapshot cross-check with CI freshness.
- VitePress nav config is now duplicated information (nav links must
  also exist in the manifest). The Phase 2 verifier will keep them in
  sync; manual upkeep until then.

## Rejected alternatives

See the Cloud-side ADR. Same four alternatives, same reasoning.
