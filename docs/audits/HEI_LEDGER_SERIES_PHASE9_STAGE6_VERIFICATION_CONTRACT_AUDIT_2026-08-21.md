# Ledger Series Phase 9 Stage 6 verification contract audit

Date: 2026-08-21  
Authority: `hei-ledger-series-phase9-stage6-verification-audit-2026-08-21`  
Coordination: Issue #780  
Scope: read-only contract and reviewed-baseline audit only

## Result

The eight Ledger Series registries do **not** share one legitimate universal revision field. Stage 6 must preserve each registry's strongest existing verification contract instead of normalizing everything to a timestamp or inventing a common revision.

The valid verification families are:

- exact build/hash equality: HEI, MAG, SOG, CYA, AI Tools;
- exact deterministic `data_revision`: API Deprecation Archive;
- exact regenerated content equality without an exact cross-layer revision: BIR;
- exact native/Series content and identity equality with only the weaker `last_verified_at` revision fact: WLR.

Stage 5 relationship publication remains frozen at **244 accepted relationships total**, with **0 accepted cross-registry relationships**. The per-registry counts remain HEI 21 / MAG 17 / SOG 1 / CYA 0 / BIR 44 / WLR 161 / AI 0 / API 0. These relationship counts are Stage 5 facts; native primary-record counts are **not** frozen Stage 5 constants and must be taken from the current reviewed Stage 6 baseline and live native contract.

This audit did **not** execute a new eight-registry production verifier and does not assert that every current production origin is already equal to the repository baselines below. That network execution requires a fresh post-audit Stage 6 authority.

## Concrete stale-central finding

The current HEI central descriptor lock was collected at `2026-08-21T12:54:30.900Z`. It still records CYA as:

- primary records: `119`
- Series records: `119`
- build commit: `795c32d1ede24f4f688c9a7c3712744081f81173`

The reviewed CYA repository main has since advanced to `df87a4efe16d7370e9c42be7397282ac3ae04f2a`, where the canonical platform corpus is 120 records. Therefore the central lock is already stale relative to the reviewed repository baseline.

Stage 6 must treat this as a fail-closed equality condition. This audit does **not** authorize refreshing the lock. A later Stage 6 execution must independently verify current native production, current Series production, and the central descriptor snapshot, and accept only a converged state.

## Registry matrix

| Registry | Audited main | Strongest legitimate equality | Revision fact | Stage 5 relationships |
| --- | --- | --- | --- | ---: |
| HEI | `00544ca0d80b6e7762993f9b57868ecb788811a0` | native + adapter exact | `version.build.commit` and copied Series build object | 21 |
| MAG | `f7892a04edf4cba49e4ae3d9f04109e3faf429a2` | native + adapter exact | Series `build_commit`, exact expected commit supported | 17 |
| SOG | `f86ae68772783f9930b855effefbc781ea7ecb28` | native + adapter exact | build commit + `canonical_data_hash` | 1 |
| CYA | `df87a4efe16d7370e9c42be7397282ac3ae04f2a` | native + adapter exact | native/Series build object + optional source commit | 0 |
| BIR | `38651a2961ba89dbc0aedfbdb2f13bedb08df516` | exact content without exact revision | generated/verified markers only | 44 |
| WLR | `e0e9de465a71aa54c0f6a4ec69bdac84bb3e4f8d` | exact content without exact revision | `last_verified_at` only; build commit explicitly forbidden in adapter | 161 |
| AI Tools | `76ef103329813f0174db121117c932bff53fbf8e` | native + adapter exact | `build_commit` | 0 |
| API Deprecation | `641a6d4243d30f95f48436455d2cbc12a8aded53` | native + adapter exact | deterministic `data_revision` | 0 |

## 1. Historical Exchange Index

**Identity/count.** Native identity is the canonical exchange id/slug and native record type `exchange_entity`. `/version.json` and `/data/manifest.json` own the native primary count; the Series descriptor/index are generated from the native exchange index and must carry the same record count and global identities.

**Revision.** `scripts/check-machine-readable-production.mjs` supports `EXPECTED_COMMIT` and requires live `version.build.commit` to equal it, with branch `main`, a valid generated time and the HEI verification marker. `scripts/build-ledger-series-phase9-adapter.mjs` copies `version.build` into the descriptor, index and every envelope. Therefore the correct Stage 6 check is exact native commit equality plus exact Series build/count/identity equality.

**Safety/provenance.** Native production requires canonical-only data and excludes unreviewed candidates, internal monitoring and private notes. The Series descriptor preserves those data-safety facts and every envelope is canonical-only. Stage 5 relationship records remain standalone, with `native_reviewed_relationship` provenance.

**Existing reusable checks.** `scripts/check-machine-readable-production.mjs`, `scripts/build-ledger-series-phase9-adapter.mjs`, `scripts/verify-ledger-series-stage5-production.mjs`, `production-consistency.yml`, and `production-verification-gate.yml`.

**Fail closed.** Commit, build object, native/Series count, identity, canonical-only/data-safety, relationship count 21, or central descriptor mismatch all fail. The Stage 5 relationship verifier by itself is not sufficient proof of the native production commit; Stage 6 must combine the existing checks.

Classification: `native_exact`, `adapter_exact`.

## 2. Minted & Gone

`check-series-origin.mjs` maps every live Series row to the reviewed native marketplace id+slug, enforces unique global keys, verifies representative envelopes, and accepts `SERIES_EXPECTED_COMMIT` to require exact descriptor/index build commit equality. Its relationship path also requires the exact 17-row Stage 5 allowlist and deterministic IDs.

Stage 6 should require a non-empty reviewed expected commit when exact revision verification is executed. Count, identity, envelope data, commit, canonical boundary, relationship set, or central descriptor mismatch fails closed.

Classification: `native_exact`, `adapter_exact`.

## 3. Stable or Gone

SOG has one of the strongest native provenance contracts. The build object carries commit, branch, generated time, `canonical_data_hash`, canonical file/count metadata and verification markers. The current reviewed Stage 5 canonical hash is `sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798`.

`verify-stage5-production.mjs` verifies the production manifest's canonical hash and canonical-only boundary together with the Series count and the one reviewed SAI `predecessor_of` DAI relationship. The repository also has provenance, reproducible-build, output-parity and production-consistency checks.

The current Stage 5 verifier contains the reviewed 119-record/hash baseline; Stage 6 must not turn 119 into a permanent cross-stage constant. The later execution must bind to the then-reviewed current native and Series build/hash facts.

Classification: `native_exact`, `adapter_exact`.

## 4. Crypto Yield Archive

CYA's current reviewed main is `df87a4efe16d7370e9c42be7397282ac3ae04f2a`, after promotion of the 120th canonical platform.

`check-production-once.mjs` derives counts from the repository canonical corpus and can require exact deployed build commit and deployed source commit. `validate-ledger-series-phase9-adapter.mjs` requires the descriptor and index build metadata to equal the native manifest build metadata and requires every Series envelope build to equal its native dossier build. It also requires exact native/Series dossier slug-set equality and lossless record/supporting-record projection.

This gives Stage 6 an exact build/count/identity contract without freezing the old 119 count. The current central descriptor lock still carries the older 119-record build, so stale-central detection is already required in practice.

Classification: `native_exact`, `adapter_exact`.

## 5. Bridge Incident Registry

BIR must not be assigned an invented commit/hash revision. Its strongest production contract is exact content equality.

`verify-production.mjs` regenerates expected public bridges/incidents/events/evidence from the repository canonical data and compares production content exactly, with canonical counts and canonical-only markers. `verify-production-series-relationships.mjs` independently verifies the exact 44 reviewed relationship tuples, deterministic IDs and every referenced Series endpoint. `production:verify` runs the native registry verifier, record JSON verifier and Series relationship verifier together.

Generated time, last-verified time and verification marker remain observable facts, but Stage 6 must not treat them as cryptographic revisions. Any canonical-content, Series identity/count, relationship or central-descriptor mismatch fails closed.

Classification: `content_exact_without_revision`, `observable_weaker_fact`.

## 6. Wallet Lifecycle Registry

WLR also has no legitimate exact build revision in the Series contract. `validate-series-adapter.mjs` explicitly fails if `descriptor.verification.build_commit` exists: the adapter is forbidden from inventing one. The legitimate observable revision fact is `last_verified_at`.

At the same time, content equality is strong. The validator compares wallet/product global identities, native dossier fields, status, events, evidence and parent/product relationships to the Series envelopes, and checks the exact wallet/product Series file set. The Stage 5 production verifier checks all 161 reviewed relationships and their referenced endpoints.

Stage 6 must therefore preserve exact content/count/identity verification while treating `last_verified_at` only as the weaker fact it is. A timestamp mismatch fails, but timestamp equality must never be presented as equivalent to a build commit or data hash.

Classification: `content_exact_without_revision`, `observable_weaker_fact`.

## 7. AI Tools History Archive

The native version exposes `build_commit`, and `validate-series-adapter.mjs` requires that commit in the descriptor, Series index and every envelope. It also requires native/Series record count and identity equality and structurally equal event/evidence payloads.

`check-series-origin.mjs` accepts `SERIES_EXPECTED_COMMIT` and can enforce exact live descriptor/index/envelope build commit equality. No typed relationships are authorized.

Classification: `native_exact`, `adapter_exact`.

## 8. API Deprecation Archive

API Deprecation Archive uses a deterministic `data_revision` rather than a Git commit as its strongest public revision anchor.

`check-machine-origin.mjs` requires live version, machine manifest and machine index to equal the reviewed local `data_revision`, counts and canonical-only/safety facts. `check-series-origin.mjs` requires the live Series descriptor and index to equal the local reviewed artifacts and then compares every live Series envelope against its local generated envelope; Series verification also carries the same `data_revision`.

This is exact revision equality without inventing a commit-based convention.

Classification: `native_exact`, `adapter_exact`.

## Stage 6 execution contract derived from this audit

A later Stage 6 execution authority may authorize a read-only cross-registry verifier, but it must follow these rules:

1. Pin or derive the **current reviewed repository baseline** for each registry. Native primary counts are dynamic and must not be copied from Stage 5 as permanent constants.
2. Use each registry's strongest existing equality mechanism: HEI/MAG/SOG/CYA/AI build/hash facts, API `data_revision`, BIR regenerated-content equality, and WLR exact content/count identity plus only the actual `last_verified_at` fact.
3. Verify native production and Series production in the same bounded execution so mixed revisions cannot pass by being checked at unrelated times.
4. Verify the HEI central Stage 4 registry index against the accepted live descriptor set. A stale central descriptor is an error; Stage 6 verification authority alone does not authorize an automatic refresh.
5. Preserve the Stage 5 exact relationship counts/sets: 21/17/1/0/44/161/0/0, total 244, with cross-registry accepted relationships still zero.
6. Fail closed on missing endpoints, timeout, malformed JSON, identity/count/revision/content mismatch, weakened canonical-only/provenance facts, stale central descriptor, or mixed-revision observation.
7. Do not mutate vertical repositories, production, Cloudflare configuration, Search, Compare, Stats, UI, localization or Stage 5 relationship semantics under this audit.

## Gate

This audit is evidence for review, not execution authority. Stage 6 network execution remains blocked until these two audit files are reviewed and merged. After merge, a **fresh** Stage 6 execution authority must be proposed from the merged evidence. Closed PR #803 is not reusable because it predated this audit evidence and the merged #802 ordering gate.
