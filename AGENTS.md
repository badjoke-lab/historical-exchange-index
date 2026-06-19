# HEI Agent Operating Instructions

These instructions apply to every human or AI agent working in this repository.

## Required reading order

Before changing code, data, workflows, build configuration, deployment behavior, or public output, read:

1. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`
2. `config/cloudflare-pages-project.json`
3. `docs/HEI_V1_EXECUTION_ROADMAP.md`
4. the relevant schema, monitoring, record-growth, or machine-readable specification for the task

The Cloudflare deployment policy is the human-readable operational source of truth. The JSON project policy is the machine-readable authority for branch controls and build watch paths.

## Non-negotiable deployment rules

- Do not assume every commit needs a Cloudflare preview.
- Keep GitHub CI fast and frequent; reduce Cloudflare builds instead of reducing development activity.
- Preview deployments are exceptional and must be justified by Cloudflare-specific behavior.
- Documentation, staging, monitoring, backlog, and internal audit work should not deploy by default.
- Use `[CF-Pages-Skip]` for intermediate commits while automatic Git integration is still enabled.
- Before diagnosing a production mismatch, compare the deployed `/version.json` commit with the expected Git commit.
- A stale deployment is not evidence of a code defect.
- Do not merge deployment-sensitive changes without successful GitHub CI and an explicit production verification plan.
- Do not edit Cloudflare branch controls manually without updating `config/cloudflare-pages-project.json` to the same intended state.

## Deployment-sensitive changes

Treat changes to these paths as deployment-sensitive:

- `config/cloudflare-pages-project.json`
- `scripts/configure-cloudflare-pages-project.mjs`
- `.github/workflows/configure-cloudflare-pages.yml`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `wrangler.toml`
- `.github/workflows/**`
- `public/_redirects`
- `scripts/build-*`
- `scripts/validate-*`
- `scripts/check-machine-readable-production.mjs`

For such changes, record whether preview is required and why.

## Cloudflare configuration changes

Use the repository commands or the manual `Configure Cloudflare Pages` workflow:

```bash
npm run cloudflare:config:print
npm run cloudflare:config:plan
npm run cloudflare:config:apply
```

Never print, commit, or copy Cloudflare credentials into issues, PRs, logs, or files.

## Canonical data safety

The canonical public data is:

- `data/entities.json`
- `data/events.json`
- `data/evidence.json`

Monitoring and ingestion automation must not publish unreviewed candidates directly into canonical data. Staging and monitoring outputs remain non-canonical until reviewed and merged.

## Pull request discipline

Every PR must state:

- canonical count impact
- deployment impact
- whether preview is required
- GitHub validation performed
- production verification plan when public output changes

Temporary scripts, workflows, audit files, and diagnostic branches must be removed or closed after use.

## Conflict rule

If another instruction conflicts with `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md` on deployment behavior, follow the deployment policy until a reviewed PR deliberately changes it.
