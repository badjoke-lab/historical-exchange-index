# Ledger Series Phase 9 Stage 6 — superseding pre-execution baseline review

Date: 2026-08-23 JST  
Coordination issue: #780  
Execution authority: `hei-ledger-series-phase9-stage6-production-equality-2026-08-21-v2`

## Why this review supersedes the first Stage 6 pre-execution review

PR #807 correctly kept Stage 6 read-only, but its verifier assumed that reviewed GitHub commits directly track every deployed `public/version.json` and `public/data/series/*` object. That assumption is false for registries that generate public machine-readable output during build. A correct production deployment could therefore be reported as HTTP 404 against `raw.githubusercontent.com` even when production itself is valid.

This review supersedes that execution implementation. It does **not** expand Stage 6 authority. Production mutation, vertical-repository mutation, Cloudflare/DNS changes, canonical descriptor resync, and any remediation remain unauthorized.

## Re-reviewed repository mains before corrected execution

| Registry | Re-reviewed repository main | Stage 6 production revision rule |
| --- | --- | --- |
| HEI | `3972c817694a51badfa0c183dcc58e1c4dfaba66` | exact reviewed post-EXMO runtime revision `3972c817694a51badfa0c183dcc58e1c4dfaba66`; corrected verifier merge itself is coordination-only |
| MAG | `f917d5e25eedc7b2c48091c7343b7fa9cd203428` | exact reviewed runtime build `73dafdf78a2ca60e9329a4c6844315cafb8e55c0` |
| SOG | `9a4f853cca85efff1c7ae4303b07c7af224e65bd` | exact reviewed runtime build `a3cf1e51a00b70d867a6579ea9602343016ad58a` plus canonical data hash |
| CYA | `de0f7cab8b519f745d153add3a04b16394ecb8b1` | exact reviewed runtime build `66b9ae8ac1fc8487d30f649f489f892b047f30e5`; current platform count derived from reviewed `data/platforms*.json`, never hard-coded |
| BIR | `ef2767ee5fb55339e530d90fcdf3eff88becbc41` | no invented commit; existing canonical-content verifier regenerates public JSON from the reviewed checkout and compares live content exactly |
| WLR | `919a759a4f3077ffecac5464cbb61eae41cd1f0e` | no invented commit; reviewed canonical `data/{entities,products,events,evidence}.json` must equal live canonical JSON and wallet/product adapters must preserve the reviewed projection |
| AI Tools | `76ef103329813f0174db121117c932bff53fbf8e` | exact reviewed `build_commit` across native and Series |
| API Deprecation | `641a6d4243d30f95f48436455d2cbc12a8aded53` | deterministic reviewed `data_revision` across native machine and Series |

## Drift review

- HEI advanced after the earlier review through PR #812, `Correct EXMO wind-down lifecycle status`, merged as `3972c817694a51badfa0c183dcc58e1c4dfaba66`. The PR changes only `records/exchanges/exmo.json`: EXMO moves from `active` to `limited`, two reviewed lifecycle events are added, and two primary-source evidence rows are added. `death_reason` and `death_date` remain null.
- PR #812 exact head `7eacf5c0a2b4d4f903a2902a860c76a4f7b3aaa9` passed all 19 observed PR workflows, including CI, Records validation, Machine/public consistency, Ledger Series Phase 9 Adapter, Project network integrity, Count semantics, metadata, URL safety, localization, and quality gates.
- The post-EXMO HEI build reports 1038 primary records, 1047 events, 3892 evidence rows and 21 reviewed Stage 5 relationships. The Stage 6 execution baseline therefore adopts merge `3972c817...` rather than the earlier `242e60a5...` runtime revision.
- MAG, CYA, and WLR advanced only through project-network display/integrity work; no canonical or Series corpus changed.
- SOG advanced through project-network/deployment workflow work and the MNEE June 2026 implementation **authority** merge; the reviewed drift did not itself publish new canonical MNEE data.
- BIR did contain a real canonical change: PR #355 added the reviewed AFX Trade July 2026 bridge incident. Its exact head `77e57cd2b6bfb738540daa052905abaf0878c14a` passed Check, SEO, V1 Release Readiness, and representative screenshot gates before merge as `fe41d1adc79d18039f41cfbcd21451c8695a7e23`. Later BIR changes were project-network/review-only changes; current reviewed main is `ef2767ee...`.
- AI Tools and API Deprecation did not advance from the authority audit baselines.

## Corrected verifier boundary

The corrected HEI verifier does the following in one execution window:

1. re-reads all eight GitHub `main` refs and fails if any vertical repo has advanced beyond the re-reviewed execution baseline;
2. runs existing reviewed per-registry production checkers from exact read-only checkouts, preserving each registry's native revision semantics;
3. compares every live Series envelope with its live native dossier using only the projection defined by that registry's existing adapter generator;
4. derives CYA current primary count from the reviewed canonical corpus rather than a fixed number;
5. requires WLR live canonical aggregate JSON to equal the reviewed canonical JSON exactly;
6. requires Stage 5 relationship total `244` with zero cross-registry relationships, while existing Stage 5 verifiers retain finite-allowlist enforcement where already implemented;
7. compares HEI's live central eight-registry descriptor index against the eight accepted live descriptors using the same Stage 4 descriptor normalization.

The workflow performs no build, deploy, repository write, descriptor resync, Cloudflare change, or production mutation. It checks out reviewed repositories read-only and performs HTTP GET verification only.

Because PR #812 merged immediately before this corrected execution, the workflow applies two exact, reviewed workspace-only substitutions before running the verifier: HEI `repo_main` / `production_revision` are advanced to `3972c817...`, and the HEI native deployment convergence check is widened from 3×5 seconds to at most 40×15 seconds. The substitution fails closed if the expected pre-EXMO markers are absent. This does not mutate the repository or production and prevents the previously observed deployment-race false failure.

## One-shot execution rule

The network job is allowed only on the main-branch push whose commit message begins `Phase 9 Stage 6 corrected verifier one-shot`. Pull requests run the same workspace-only baseline substitution, script syntax validation, and authority-boundary checks, but do not perform network equality execution. If that one-shot run fails for any missing route, timeout, malformed JSON, revision mismatch, native/Series mismatch, relationship mismatch, or stale central descriptor, Stage 6 is **FAIL** and stops. No automatic remediation or resync is authorized.
