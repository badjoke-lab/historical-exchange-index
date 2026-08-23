# Ledger Series Phase 9 Stage 6 v5 pre-execution baseline — 2026-08-23

## Status

Stage 6 remains **NOT ACCEPTED**. This document records the separately reviewed baseline for the v5 SOG-checker correction authorized by PR #831 / authority merge `8b4b7042edb154ce394e65b98dfb1a1a0bdd9951`.

The v5 path is not a rerun of the consumed v4 workflow. It is a new, finite HEI-side correction with exactly one post-implementation read-only network execution authorized.

## Consumed v4 failure

v4 implementation PR #828 merged as `bf23ac1a8f69a9cab763a9033bf45a1fee0b9794` and consumed its single network execution in run `32620749266`, job `97148448800`.

Artifact `9488302977` (`sha256:98fa5d88fd3e98b42802ca003d5abc1cf7f42a12ac566db8532ca26f813b0335`) was downloaded and inspected directly. It showed:

- repository preflight: PASS 8/8;
- HEI native exact reviewed deployment: PASS;
- HEI Stage 5 relationships: PASS, 21;
- MAG native exact reviewed deployment: PASS at `f917d5e25eedc7b2c48091c7343b7fa9cd203428`;
- SOG exact source commit and canonical provenance: PASS at `e8663a8289033a3a6af7cb19fb31683b2545e61c` and `sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965`;
- SOG Stage 5 relationship checker: FAIL because it still expects historical canonical hash `sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798`.

The v4 run stopped there. It did not reach the remaining registry equality checks, the full 244/0 relationship aggregate, or central descriptor equality.

## SOG failure classification

Current reviewed SOG main is `e8663a8289033a3a6af7cb19fb31683b2545e61c`, merged by PR #593 (`Implement MNEE June 2026 attestation boundary`).

PR #593 performed reviewed non-growth canonical maintenance. Existing MNEE review-boundary fields moved from May 2026 to June 2026 while stable-asset, organization, event, reserve-report and known-unknown record counts did not grow.

The same PR deliberately changed the general Series adapter validator so that later separately reviewed canonical maintenance is not rejected solely because the original Stage 5 canonical hash changed. It did **not** modify `src/lib/ledgerSeriesAdapter.ts`.

Direct source review before and after #593 confirms the reviewed SOG Series relationship remains exactly one tuple:

`predecessor_of / stable-or-gone:stablecoin:sog_st_sai / stable-or-gone:stablecoin:sog_st_dai`

The current `scripts/verify-stage5-production.mjs` nevertheless still hard-codes the original Stage 5 canonical hash and compares both the frozen Stage 5 authority and the live manifest against that historical value. Therefore the v4 failure is classified as a **stale Stage 5 production-checker hash lock after reviewed non-growth canonical maintenance**, not as evidence of a changed SOG relationship set or an unreviewed production revision.

## v5 correction boundary

The v5 implementation must not edit SOG or any other vertical repository. During the post-merge GitHub Actions execution it may only derive an untracked transient checker from the exact SOG `e8663a...` checkout.

Only two semantic changes to that transient checker are authorized:

1. set `expectedCanonicalHash` to the current reviewed production hash `sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965`;
2. replace the obsolete assertion that the frozen Stage 5 authority hash must equal the current hash with an assertion that the frozen authority still contains its original historical hash `sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798`.

All other SOG relationship assertions remain derived from the reviewed checker and mandatory: authority ID, one-tuple finite allowlist, manifest identity/count/canonical-only boundary, current live manifest hash, descriptor identity/counts/route/capability, 119-entry unique Series index, exactly one relationship record, SAI→DAI tuple, directedness, native-reviewed provenance, evidence-ref array, endpoint membership, non-self-loop, deterministic relationship ID, and empty relationship arrays on both endpoint envelopes.

The existing `scripts/check-production-provenance.mjs` remains mandatory and runs before the transient Stage 5 relationship checker. It must prove exact source commit `e8663a...` and current reviewed canonical hash `bba93...`.

## Reviewed repository baseline

At v5 authority creation, repository mains were reviewed as:

- HEI: `932dea2acfee90a34d7c17390402b8b835bec621`
- MAG: `f917d5e25eedc7b2c48091c7343b7fa9cd203428`
- SOG: `e8663a8289033a3a6af7cb19fb31683b2545e61c`
- CYA: `fa35d291a67b2e367f8f7e759a635a0804116680`
- BIR: `666d1f4f78b7ed12fa36e2741134523a140221c4`
- WLR: `8192dedeb3777894f031dcbd13d95367f5f688de`
- AI: `76ef103329813f0174db121117c932bff53fbf8e`
- API: `641a6d4243d30f95f48436455d2cbc12a8aded53`

The authority-only PR #831 subsequently merged as `8b4b7042edb154ce394e65b98dfb1a1a0bdd9951`; this becomes the reviewed HEI pre-implementation main. PR #827's reviewed Hanbitco canonical growth is the current pre-authority HEI canonical state and did not alter the Stage 5 relationship set.

Before the v5 implementation is merged, all eight mains must be re-read again. Any drift must be separately reviewed and classified; latest main must never be accepted silently.

## Preserved Stage 5 relationship boundary

The frozen relationship set remains:

- HEI 21
- MAG 17
- SOG 1
- CYA 0
- BIR 44
- WLR 161
- AI 0
- API 0
- total 244
- cross-registry 0

## Prohibited changes

v5 does not authorize production mutation, SOG or any vertical repository mutation, canonical mutation, relationship mutation, central descriptor resynchronization, Cloudflare/DNS/deployment mutation, automatic repair, automatic retry, Stage 7, Stage 8, or Phase 10.

A v5 network failure consumes the single authorized execution. Stage 6 may be accepted only after a successful run whose artifact is directly inspected and proves all eight registry equalities, relationship 244/0, and central descriptor equality.
