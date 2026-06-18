# HEI production deployment diagnosis — 2026-06-19

## Scope

This audit follows PR #393, which unified the human-readable pages and machine-readable registry outputs, and PR #394, which normalized the canonical `official_url_status` vocabulary.

## Confirmed repository state

- current reviewed entities: 412
- dead-side: 189
- active-side: 223
- events: 687
- evidence: 1594
- machine-readable generation and static-output consistency checks pass in GitHub Actions
- PR #393 merge: `cb3d80e4b5751537b7589d140821262a740bb491`
- PR #394 merge: `40353a503c64d4f24af449d989b6cbd70192cb03`

## Confirmed production state before this repair

The custom domain and the production `pages.dev` origin both served the current human-readable counts:

- `/`: 412 total / 189 dead-side / 223 active-side
- `/dead/`: 189
- `/active/`: 223
- `/stats/`: 412 entities / 687 events / 1594 evidence

However, the following PR #393 outputs returned HTTP 404:

- `/version.json`
- `/data/manifest.json`
- `/data/entities.json`
- `/data/events.json`
- `/data/evidence.json`
- `/llms.txt`
- `/ai.txt`

The legacy routes `/all`, `/registry`, and `/exchanges` also returned 404 rather than the repository-defined redirect to `/`.

This means the visible HTML was current, but the authoritative machine-readable layer and redirect artifact from PR #393 had not reached production.

## Deployment boundary

- PR #390 has a recorded successful Cloudflare Pages preview deployment.
- PR #391 and PR #392 do not have a recorded successful Cloudflare deployment comment.
- PR #393, PR #394, and the temporary production-audit PR remained at `Build in progress` in the GitHub bot comment while the production origins continued to omit the PR #393 files.

The first deployment-relevant code change in this interval was PR #393 adding a side-effect import of `scripts/build-machine-readable-layer.mjs` from `next.config.ts`.

## Repair

The production build contract is now explicit:

1. a direct Next.js build invokes the machine-readable generator through the exported Next configuration function
2. Next.js performs the static export
3. `npm run build` validates the generated machine-readable layer
4. `npm run build` validates the built HTML and JSON count consistency

Cloudflare Pages may invoke the static-export preset as `npx next build` rather than `npm run build`. The generator is therefore attached to the direct Next build path itself, while the npm build command adds the post-export validation gates used by GitHub Actions.

The generator is executed as an isolated Node process once per configuration process. This avoids the previous module-import side effect while ensuring that both Cloudflare's direct Next build and GitHub's npm build produce the same public files.

## Completion gate

This repair is complete only after the deployed custom domain directly confirms:

- HTML counts 412 / 189 / 223
- event and evidence totals 687 / 1594
- all seven machine-readable endpoints return 200
- `version.json` identifies the deployed main commit and current generated timestamp
- `manifest.json` reports canonical-only data and current counts
- public datasets contain 412 / 687 / 1594 reviewed records
- no public output presents 386 as the current count
- sitemap, robots, canonical metadata, discovery links, JSON-LD, and legacy redirects pass the production audit
