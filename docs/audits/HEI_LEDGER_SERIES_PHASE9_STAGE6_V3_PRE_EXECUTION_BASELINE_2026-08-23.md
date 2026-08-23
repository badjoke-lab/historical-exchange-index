# Ledger Series Phase 9 Stage 6 v3 — pre-execution baseline review

Status: reviewed baseline for one bounded read-only execution  
Coordination issue: #780  
Authority: `hei-ledger-series-phase9-stage6-current-production-reverification-2026-08-23-v3`

## Purpose

This review freezes the exact repository state that the v3 Stage 6 verifier may use. It exists so vertical registry work can continue independently without allowing the verifier to silently follow `latest main`.

The network execution must fail closed if any external registry moves beyond the exact SHA recorded in `config/ledger-series-phase9-stage6-v3-execution-baseline.json`. HEI itself must be the merged implementation SHA supplied by `GITHUB_SHA`; its production/runtime data source is reviewed separately from coordination-only commits.

## Reviewed execution baseline

| Registry | Reviewed repository main | Production/runtime expectation | Classification |
| --- | --- | --- | --- |
| HEI | implementation merge must be current main; pre-implementation main `9b4e528a9c2d2dcb8d1a13987cbbb00f217ade48` | canonical/runtime source `6c476dd16d7221ad2ea31bdbcb0aa086eb1167c6` | PR #817 canonical ABCC growth + PR #818 coordination-only authority |
| MAG | `f917d5e25eedc7b2c48091c7343b7fa9cd203428` | reviewed runtime build `73dafdf78a2ca60e9329a4c6844315cafb8e55c0` | unchanged from v2 execution baseline |
| SOG | `e8663a8289033a3a6af7cb19fb31683b2545e61c` | require live build/hash equality to reviewed PR #593 maintenance state | reviewed non-growth canonical maintenance |
| CYA | `2f68c520bc1b502f351f22a71fa339b29d473ef7` | canonical corpus = 122 platforms; native/Series build equality; source commit must be reviewed main | PR #307 canonical CoinDCX Earn growth |
| BIR | `666d1f4f78b7ed12fa36e2741134523a140221c4` | exact regenerated content; no invented revision | PR #363 audit-md-only drift after canonical state |
| WLR | `8192dedeb3777894f031dcbd13d95367f5f688de` | exact canonical/native/Series content; no invented build commit | PR #256 presentation-only GA4/GSC hooks after PR #251 canonical growth |
| AI Tools | `76ef103329813f0174db121117c932bff53fbf8e` | exact build commit | unchanged |
| API Deprecation | `641a6d4243d30f95f48436455d2cbc12a8aded53` | exact deterministic `data_revision` | unchanged |

## Drift review

### HEI

Authority snapshot runtime source was `47fcb5ef...`. Since then PR #817 added `records/exchanges/abcc.json` plus its audit/consumed backlog files. This is canonical growth and must be included in current-production proof. PR #818 then merged the Stage 6 v3 authority at `9b4e528a...`; that coordination-only merge is not itself a new canonical data source.

### SOG

PR #593 moved the existing MNEE attestation-program boundary from May 2026 to June 2026. The PR explicitly preserves canonical counts while changing reviewed canonical content and provenance/checkpoint state. Therefore the v3 verifier must use the new checkout, recompute/verify its canonical hash, and still require the frozen Stage 5 relationship count of one.

### CYA

PR #307 promoted CoinDCX Earn to canonical platform 122. This is real canonical growth, not staging-only drift. The v3 verifier must derive expected counts and payloads from the reviewed checkout and require production to expose the 122-platform canonical corpus without candidate/staging leakage.

### BIR

The only delta from `5342b997...` to current `666d1f4f...` is `docs/audits/boltz-2026-security-shutdown-recheck-2026-08-23.md`. No canonical JSON changed. The execution preflight still freezes current main exactly, while production verification remains exact regenerated-content equality rather than a fabricated git revision.

### WLR

PR #256 adds conditional GA4/GSC hooks only. It does not change canonical aggregate JSON, generated public data, or Series data. Current repository main is nevertheless frozen exactly. Native/Series equality remains based on actual reviewed checkout content and legitimate native verification facts only.

### MAG / AI Tools / API Deprecation

No repository drift from the reviewed v2 execution baselines was observed in this pass.

## Relationship boundary

Stage 5 remains frozen at:

- HEI 21
- MAG 17
- SOG 1
- CYA 0
- BIR 44
- WLR 161
- AI Tools 0
- API Deprecation 0
- total 244
- accepted cross-registry relationships 0

Canonical growth or maintenance above does not imply any new Series relationship. A relationship-count/set drift is a Stage 6 failure unless separately reviewed under its own authority.

## Execution boundary

The implementation may:

- clone/read the exact reviewed repository SHAs;
- read the eight public production origins;
- run existing repository verification scripts;
- compare native public data to Series descriptors/indexes/envelopes;
- compare the HEI central registry index to the accepted live descriptor set;
- write a local result artifact for the workflow.

It may not mutate production, vertical repositories, Cloudflare/DNS, canonical records, the central descriptor lock, or any relationship. It may not refresh the baseline automatically. Any mismatch stops the one authorized execution.