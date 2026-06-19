# Cloudflare Deployment Policy

Status: required operational source of truth
Scope: Historical Exchange Index (HEI)

## Purpose

Preserve development speed while reducing unnecessary Cloudflare Pages builds on the Free plan.

## Core rules

1. GitHub commits and GitHub Actions checks may run as often as needed.
2. Cloudflare preview deployments are disabled by default.
3. Preview deployment is allowed only when Cloudflare-specific behavior must be verified, such as routing, redirects, metadata, build configuration, or major UI changes.
4. Production deployment targets the latest reviewed `main` state, not every intermediate commit.
5. Documentation, monitoring output, staging data, backlog work, and internal audit changes must not trigger a Pages deployment unless they also change public output.
6. While Git integration remains enabled, intermediate commits that must not deploy use the `[CF-Pages-Skip]` commit prefix.
7. A stale production result is not automatically a code failure. Compare `/version.json` with the expected Git commit before diagnosing the build.
8. Production verification begins only after the deployed commit matches the expected `main` commit.
9. Do not create temporary audit PRs that trigger Cloudflare builds unless preview deployment is explicitly required.
10. Any change to deployment-sensitive files must review this policy in the same PR.

## Deployment-sensitive files

- `next.config.ts`
- `package.json`
- `package-lock.json`
- `wrangler.toml`
- `.github/workflows/**`
- `public/_redirects`
- `scripts/build-*`
- `scripts/validate-*`
- `scripts/check-machine-readable-production.mjs`

## Immediate Cloudflare configuration

- Production branch: `main`
- Production deployments: enabled
- Preview deployments: disabled by default
- Optional preview branch pattern: `preview/*`
- Build watch paths: include public-output paths and exclude docs, staging, monitoring reports, and internal audits

Recommended deploy-relevant paths:

- `src/**`
- `public/**`
- `data/**`
- `records/**`
- `scripts/build-*/**`
- `scripts/validate-*/**`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`

Recommended non-deploy paths:

- `docs/**`
- `data-staging/**`
- `review/**`
- internal backlog files
- monitoring reports

## Preview decision

Preview is normally required for:

- major UI changes
- route changes
- redirect changes
- sitemap or metadata generation changes
- Next.js or Cloudflare build configuration changes
- Cloudflare-specific runtime behavior

Preview is normally unnecessary for:

- reviewed entity, event, or evidence additions
- documentation-only changes
- roadmap updates
- monitoring reports
- backlog cleanup
- internal audit output
- enum normalization already covered by CI

## Production verification

After deployment, verify:

1. `/version.json` reports the expected `main` commit.
2. `/data/manifest.json` matches canonical counts.
3. Public entity, event, and evidence dataset lengths match the manifest.
4. HTML counts match the machine-readable layer.
5. `/llms.txt` and `/ai.txt` expose current authority endpoints and counts.
6. `/sitemap.xml` and `/robots.txt` return HTTP 200.
7. Legacy routes redirect as defined.
8. No obsolete count is presented as current.

## Future controlled deployment

The preferred later architecture is:

1. GitHub Actions validates every commit.
2. Automatic Cloudflare preview deployment remains off.
3. A reviewed `main` state is deployed through Wrangler.
4. GitHub Actions uses deployment concurrency and cancels superseded deploys.
5. Production smoke tests poll until `/version.json` matches the expected commit.

For the wider ledger series, a shared deployment queue should eventually serialize Cloudflare deployments and collapse repeated requests to the newest commit per site.

## Prohibited practices

- treating every commit as a required Pages preview
- diagnosing stale production as a code defect before checking deployed commit identity
- merging deployment-sensitive changes without successful GitHub CI
- bypassing canonical data review because deployment is delayed
- increasing Cloudflare plan cost before reducing unnecessary builds

## PR checklist

- [ ] This policy was reviewed.
- [ ] GitHub CI passed.
- [ ] Preview necessity was explicitly decided.
- [ ] The PR does not create unnecessary Cloudflare builds.
- [ ] A production verification plan exists.
- [ ] Temporary deployment or audit files are removed.

## Precedence

If another repository document conflicts with this file on Cloudflare deployment behavior, this file takes precedence until it is deliberately amended by a reviewed PR.
