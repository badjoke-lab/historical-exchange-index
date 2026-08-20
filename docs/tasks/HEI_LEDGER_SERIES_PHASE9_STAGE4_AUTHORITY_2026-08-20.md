# HEI Ledger Series Phase 9 Stage 4 Authority — 2026-08-20

Status: **review required; no Stage 4 runtime write until this authority merges**

Coordination authority: HEI Issue #780  
Stage 3 accepted implementation main: `6b94227a3427e7255b8cb72244ae526b91a0899e`  
Stage 3 production verifier: PR #783 / run `32334424438` / job `96321057178`

## Purpose

Authorize one bounded Phase 9 Stage 4 implementation: a deterministic registry-level Series index referencing the eight production Series registry descriptors.

This authority does not make HEI the semantic owner of MAG, SOG, CYA, BIR, WLR, AI Tools or API Deprecation. HEI is only a temporary publication host because the connected GitHub capabilities cannot create a dedicated Series repository.

## Publication boundary

Temporary public route:

`https://hei.badjoke-lab.com/data/series/registries.json`

Semantic owner/family:

`badjoke-lab-ledger-series`

The index is explicitly portable. A later reviewed migration may move the same contract to a dedicated Series repository/origin without changing native registry ownership.

## Source descriptor set

Stage 4 is limited to the eight Stage 3 production-accepted descriptors:

1. HEI — `https://hei.badjoke-lab.com/data/series/registry.json`
2. MAG — `https://mag.badjoke-lab.com/data/series/registry.json`
3. SOG — `https://www.stableorgone.com/data/series/registry.json`
4. CYA — `https://cya.badjoke-lab.com/data/series/registry.json`
5. BIR — `https://bir.badjoke-lab.com/data/series/registry.json`
6. WLR — `https://wlr.badjoke-lab.com/data/series/registry.json`
7. AI Tools — `https://ai-tools-history-archive.pages.dev/data/series/registry.json`
8. API Deprecation — `https://api-deprecation-archive.pages.dev/data/series/registry.json`

## Index contract

The public index may contain registry-level discovery and synchronization facts only:

- stable registry id, name and type;
- public origin;
- descriptor URL;
- Series index/record route metadata exposed by the descriptor;
- Series schema/native schema facts exposed by the descriptor;
- synchronized primary/Series record counts;
- supported common capabilities such as Search, Compare, Stats and typed relationships;
- verification/build/revision facts actually exposed by the descriptor;
- synchronization metadata for the reviewed snapshot.

The index must not contain copied canonical records or newly inferred lifecycle/relationship claims.

## Deterministic source design

Normal HEI builds must remain network-independent.

Stage 4 implementation therefore uses a reviewed tracked registry-index source/lock populated from the eight accepted production descriptors. The normal build transforms that source deterministically into `/data/series/registries.json`.

A separate read-only synchronization verifier performs network reads after merge/at acceptance and compares the central snapshot with all eight live production descriptors. Network fetch is not part of normal site generation.

## Allowed implementation surface

A single Stage 4 implementation PR may:

- add the reviewed Stage 4 registry-index source/lock;
- add one deterministic index builder;
- add one fail-close validator;
- add a build hook after the native HEI Series adapter generator;
- add read-only CI for the new index;
- add a verification-only production workflow in a separate one-shot PR after implementation merge.

## Hard prohibitions

This authority does **not** allow:

- canonical exchange/entity/event/evidence changes;
- changes to any other registry repository;
- copying native records into the central index;
- Stage 5 cross-registry relationship publication;
- candidate/private/monitoring publication;
- HEI native schema/taxonomy changes;
- public UI, Explorer, Compare or Stats behavior changes;
- Cloudflare account/project/DNS/hostname mutations;
- touching PR #777 or other unrelated vertical branches;
- claiming HEI owns other registries;
- automatic Stage 5 implementation.

## Required validation

Before implementation merge:

1. exactly eight unique registry ids;
2. exactly eight unique public origins and descriptor URLs;
3. descriptor URLs use HTTPS and `/data/series/registry.json`;
4. central entries contain registry metadata only and no record arrays/canonical payloads;
5. counts/capabilities/verification fields are copied from reviewed descriptor snapshots without inference;
6. deterministic rebuild produces identical public index content;
7. existing HEI CI remains green;
8. dedicated Stage 4 validator/CI is green on exact final head.

After implementation merge:

1. production `/version.json` must report the exact accepted implementation main;
2. production `/data/series/registries.json` must equal the exact-main build output;
3. a read-only verifier must fetch all eight live descriptors and confirm identity/origin/count/capability/verification agreement at the acceptance snapshot;
4. accepted run/job and synchronized registry facts must be recorded in Issue #780.

## Completion rule

After production acceptance, this authority is exhausted. Stage 5 relationship work requires separately reviewed authority and must not begin automatically from this HEI-local authority.
