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

## Machine-readable project policy

The desired Cloudflare Pages project state is stored in:

```text
config/cloudflare-pages-project.json
```

The JSON file, not a copied dashboard screenshot or old conversation, is the machine-readable authority for branch controls and build watch paths. Changes to it require review under this policy.

## Deployment-sensitive files

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

## Immediate Cloudflare configuration

- Project: `historical-exchange-index`
- Production branch: `main`
- Production deployments: enabled
- Preview deployments: disabled
- Build watch paths: include public-output paths and exclude docs, staging, monitoring reports, and internal audits
- Pull request deployment comments: disabled while automatic previews are disabled

The exact include and exclude arrays are defined in `config/cloudflare-pages-project.json`.

Cloudflare wildcard `*` matches nested path separators, so repository configuration uses patterns such as `src/*` and `docs/*`.

## Applying and checking the configuration

Repository commands:

```bash
npm run cloudflare:config:print
npm run cloudflare:config:plan
npm run cloudflare:config:apply
```

- `print` shows the desired state without credentials.
- `plan` reads the current Pages project and reports whether it differs.
- `apply` reads the current project, preserves GitHub source identity fields, patches only the governed settings, then reads the project again and verifies the result.

The manual GitHub Actions workflow is:

```text
Configure Cloudflare Pages
```

Required GitHub repository secrets:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

The token must be a scoped Cloudflare API token with Cloudflare Pages Edit / Pages Write access for the relevant account. Do not use the Global API key.

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

A necessary preview must be requested deliberately by changing the project policy or by a separately reviewed controlled deployment mechanism. Do not silently restore previews for all branches.

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
- storing Cloudflare API credentials in repository files or workflow logs
- using a Global API key when a scoped Pages token is sufficient
- increasing Cloudflare plan cost before reducing unnecessary builds

## PR checklist

- [ ] This policy was reviewed.
- [ ] The machine-readable project policy still matches the intended deployment behavior.
- [ ] GitHub CI passed.
- [ ] Preview necessity was explicitly decided.
- [ ] The PR does not create unnecessary Cloudflare preview builds.
- [ ] A production verification plan exists.
- [ ] Temporary deployment or audit files are removed.

## Precedence

If another repository document conflicts with this file on Cloudflare deployment behavior, this file takes precedence until it is deliberately amended by a reviewed PR.
