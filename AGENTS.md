# HEI Agent Operating Instructions

These instructions apply to every human or AI agent working in this repository.

## Required reading order

Before changing code, data, workflows, build configuration, deployment behavior, public output, localization, or growth priorities, read:

1. `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md`
2. `config/cloudflare-pages-project.json`
3. `docs/HEI_V1_EXECUTION_ROADMAP.md`
4. `docs/HEI_PRODUCT_SURFACES_SPEC.md` when changing public product surfaces, routes, Explorer behavior, Change-layer output, Compare, AI-assisted query behavior, or related navigation
5. `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md` before changing entity-growth priorities, 750/1000 milestone gates, count semantics, or the relationship between data growth and localization
6. `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md` before changing locale configuration, dictionaries, overlays, locale routes, language switchers, hreflang, translated public copy, Japanese Pilot scope, evaluation, or additional-language rollout
7. `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md` before Phase G accessibility, URL-safety, cross-surface integration, public/machine consistency, production verification, recovery, or v1.0 baseline work
8. the relevant schema, monitoring, record-growth, machine-readable, audit, feed, or other task-specific specification

The Cloudflare deployment policy is the human-readable operational source of truth. The JSON project policy is the machine-readable authority for branch controls and build watch paths.

The roadmap is the execution-order source of truth. The product-surfaces specification is the behavior and non-goal source of truth for public Registry, Analysis, Research, Change, Compare, and later query surfaces. The data-growth milestone specification is the source of truth for reviewed-count semantics and the 750/1000 release gates. The localization strategy specification is the source of truth for locale architecture, rollout gates, fallback, Japanese Pilot scope, evaluation, and additional-language safety. The v1 integration baseline specification is the source of truth for Phase G audit scope, severity, completion gates, production verification, and recovery requirements.

Repository state is authoritative when a document checkpoint and current GitHub state disagree. Inspect current state first, then repair stale repository authority in the next appropriate reviewed PR.

## Work-item traceability

Every implementation pull request must identify:

- the roadmap item being advanced;
- the relevant specification section or task-specific source of truth;
- canonical count impact;
- deployment impact;
- validation performed;
- production verification plan when public output changes.

Do not use remembered chat history as implementation authority when repository documents and current GitHub state can be inspected.

When a change materially alters phase order, active work, route contracts, Explorer query semantics, public publishing safety, data-growth milestone gates, localization rollout order, locale architecture, Phase G completion gates, or post-v1 priorities, update the roadmap and relevant specification together.

## Fixed post-v1 priority rule

Unless a reviewed roadmap/specification change deliberately replaces it, the fixed priority sequence after G-7 is:

```text
H Compare v1
        ↓
D-750 Reviewed Entity Milestone
        ↓
L-1 Japanese Pilot
        ↓
L-2 Localization Evaluation Gate
        ↓
D-1000 Reviewed Entity Milestone
        ↓
Language Selection Gate
```

Data growth may continue during product and localization work, but:

- Japanese public pilot must not launch before 750 reviewed entities;
- no third-language pilot may launch before 1000 reviewed entities;
- no third language is preselected;
- only one additional language pilot should be introduced at a time under current operating capacity.

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

The reviewed public data is built from:

```text
base canonical arrays
reviewed records/exchanges bundles
reviewed entity corrections
reviewed aggregation/identity-resolution semantics
```

Do not use base-array lengths alone as the reviewed public entity count.

Monitoring and ingestion automation must not publish unreviewed candidates directly into reviewed public data. Staging and monitoring outputs remain non-canonical until reviewed and merged.

Public product surfaces, Explorer results, Stats deep links, Timeline output, Registry Updates, monthly snapshots, public feeds, localized presentation layers, and Phase G audits must preserve the reviewed-public boundary defined by the relevant specification.

Localization dictionaries and overlays must not become alternate canonical data stores. IDs, slugs, enum values, domains, source URLs, archive URLs, and reviewed factual fields remain locale-independent unless the localization specification is deliberately revised.

## Pull request discipline

Every PR must state:

- roadmap item;
- relevant specification reference;
- canonical count impact;
- deployment impact;
- whether preview is required;
- GitHub validation performed;
- production verification plan when public output changes.

Temporary scripts, workflows, audit files, and diagnostic branches must be removed or closed after use.

## Conflict rules

If another instruction conflicts with `docs/operations/CLOUDFLARE_DEPLOYMENT_POLICY.md` on deployment behavior, follow the deployment policy until a reviewed PR deliberately changes it.

If a public product implementation conflicts with `docs/HEI_PRODUCT_SURFACES_SPEC.md`, stop that implementation path and reconcile the product specification and roadmap before proceeding.

If data-growth work conflicts with `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`, stop that path and reconcile the growth specification and roadmap before proceeding.

If localization implementation or rollout conflicts with `docs/HEI_LOCALIZATION_STRATEGY_AND_FOUNDATION_SPEC.md`, stop that path and reconcile the localization specification, growth milestone specification, and roadmap before proceeding.

If Phase G implementation or completion claims conflict with `docs/HEI_V1_INTEGRATION_BASELINE_SPEC.md`, stop that path and reconcile the integration specification and roadmap before proceeding.
