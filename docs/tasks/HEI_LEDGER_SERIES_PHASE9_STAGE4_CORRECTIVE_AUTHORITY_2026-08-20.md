# HEI Ledger Series Phase 9 Stage 4 Corrective Authority — 2026-08-20

Status: **review required; no corrective runtime write until this authority merges**

Coordination authority: HEI Issue #780  
Original Stage 4 authority: PR #784  
Original Stage 4 implementation: PR #785 / main `9c079dfd4bda36a2e7de2384b1578488e552ca76`  
Production verifier: PR #786

## Why a corrective authority is required

Stage 4 is not accepted yet.

The first production verifier run `32339065549` / job `96334293361` reached the exact deployed Stage 4 main commit, then the verifier itself raised:

`live descriptor drift for historical-exchange-index`

GitHub initially displayed the workflow as successful because the verifier command was piped through `tee` without Bash `pipefail`, masking the Node process failure. The verification-only branch has been corrected to fail closed, but that does not repair the Stage 4 implementation.

The implementation has a separate structural problem. The tracked registry-index source snapshots HEI's own `verification.build.commit`. Any merge that changes the Stage 4 source or builder necessarily creates a new HEI main/deployment commit. Therefore a static lock containing the temporary host's own volatile build commit can never equal the live HEI descriptor after that lock is merged. Re-locking that value would only move the mismatch to the next merge commit.

The original Stage 4 authority allowed one implementation PR. A second runtime/public-output change therefore requires this separately reviewed corrective authority rather than silently expanding the exhausted implementation permission.

## Corrective design

Normal HEI builds remain network-independent.

The build order already generates the native HEI Series descriptor before the central registry index. The corrective implementation may therefore use two input classes:

1. **HEI temporary-host row** — project from the locally generated HEI `/data/series/registry.json` produced earlier in the same deterministic build.
2. **Other seven registries** — project from the reviewed tracked descriptor lock.

This removes only the impossible host-self commit fixed point. It does not make remote registry state dynamic during normal builds and does not weaken reviewed synchronization for MAG, SOG, CYA, BIR, WLR, AI Tools, or API Deprecation.

The production acceptance verifier must still fetch all eight live descriptors and require the public central index to agree with them at the accepted snapshot.

## Known vertical drift

CYA has already advanced after its first Stage 3 adapter acceptance through reviewed vertical growth to 118 canonical platforms. Its current Series adapter was independently reverified against production on exact main `d5ffd036f52cf4789190c95848979f76ce768423`, run `32339157209`, job `96334557712`, with 118/118 live native dossier to Series envelope parity.

The corrective implementation may refresh the reviewed non-HEI descriptor lock for confirmed live registry-level drift such as this. It must not infer or silently accept unreviewed descriptor changes.

## Allowed corrective implementation

One corrective implementation PR may:

- modify the Stage 4 registry-index builder so the HEI row is sourced from the locally generated HEI Series descriptor;
- keep the other seven rows sourced from the reviewed tracked descriptor lock;
- refresh reviewed non-HEI lock snapshots only where current live production descriptor drift is confirmed;
- update the Stage 4 validator and read-only CI to enforce the local-host/remote-lock split;
- preserve deterministic network-free normal builds;
- preserve the existing public route `/data/series/registries.json` and Series v1 registry-level contract;
- run a separate fail-close exact-main production verification after merge.

## Hard prohibitions

This authority does **not** allow:

- canonical exchange/entity/event/evidence changes;
- changes to another registry repository;
- Stage 5 relationship publication or implementation;
- candidate/private/monitoring publication;
- HEI native schema or taxonomy changes;
- public UI, Explorer, Compare, or Stats behavior changes;
- Cloudflare account/project/DNS/hostname changes;
- weakening live synchronization requirements for any non-host registry;
- treating HEI as semantic owner of the Ledger Series or other registries;
- automatic continuation after Stage 4 acceptance.

## Validation and release gate

Before corrective merge:

1. HEI central index still contains exactly eight unique registry ids, origins, and descriptor URLs.
2. HEI's central row equals the locally generated HEI descriptor projection from the same build.
3. The other seven central rows equal the reviewed tracked source-lock projections.
4. The build remains network-free and deterministic.
5. No canonical record arrays, candidate/private payloads, or Stage 5 relationships enter the central index.
6. Existing HEI CI and dedicated Stage 4 validation pass on the exact corrective head.
7. Cloudflare preview is not required because no Cloudflare-specific routing, header, DNS, project, or UI behavior changes; exact-main production verification remains mandatory.

After corrective merge:

1. `/version.json` must report the exact corrective main commit.
2. `/data/series/registries.json` must be the corrective exact-main output.
3. The HEI row must equal the live HEI Series descriptor for that deployed build.
4. The other seven rows must equal their reviewed lock projections and their live production descriptors at acceptance.
5. The verifier must fail closed; a downstream `tee` or artifact-upload success may not mask verifier failure.
6. Accepted run/job and synchronized registry facts must be recorded in Issue #780.

## Completion boundary

Successful corrective production verification completes Stage 4 only. Stage 5 remains blocked until a separate reviewed authority explicitly authorizes relationship work.
