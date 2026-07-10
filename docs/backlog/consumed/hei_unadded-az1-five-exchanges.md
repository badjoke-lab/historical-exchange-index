# D-750 Batch AZ1 — Crodex, CronaSwap, Cropper CLMM, CurrentX, and CUBISwap

Reviewed at: 2026-07-10

## Results

- `0456` Crodex -> `hei_ex_000812`, active DEX
- `0457` Crodex duplicate row -> consolidated under `hei_ex_000812`
- `0458` CronaSwap -> `hei_ex_000813`, active DEX
- `0459` Cropper CLMM -> `hei_ex_000814`, limited DEX
- `0489` CurrentX V2 -> `hei_ex_000815`, limited DEX represented as CurrentX
- `0490` CurrentX V3 -> consolidated under `hei_ex_000815`
- `0487` CUBISwap -> `hei_ex_000816`, limited DEX

## Entity-first consolidation

- duplicate Crodex source rows remain one Cronos DEX entity.
- CronaSwap remains one Cronos AMM entity.
- Cropper CLMM remains one Solana DEX entity.
- CurrentX V2 and V3 source rows remain one MegaETH DEX entity.
- CUBISwap remains one opBNB AMM exchange entity.

## Evidence decisions

### Crodex

The current first-party application remains reachable. DefiLlama classifies Crodex as a Cronos AMM DEX and reports current TVL, fees, and recent DEX volume. Confidence is `medium` because detailed first-party protocol documentation was not recovered in this review pass.

### CronaSwap

The current first-party application redirects to the live swap route. DefiLlama identifies CronaSwap as a Cronos AMM DEX and reports current TVL and staked value. Confidence is `medium` because detailed first-party protocol documentation and current DEX-volume metrics were not recovered in this review pass.

### Cropper CLMM

The first-party Cropper Finance domain remains reachable. DefiLlama classifies Cropper as a Solana CLMM and reports residual current TVL, negligible 30-day volume, zero 7-day and 24-hour volume, and substantial historical cumulative volume. HEI therefore uses `limited`, not `active`. Confidence is `medium`.

### CurrentX

The first-party CurrentX application remains reachable. DefiLlama identifies CurrentX V3 as a MegaETH CLMM DEX with residual current TVL and historical cumulative volume, but zero 30-day, 7-day, and 24-hour DEX volume. HEI consolidates V2 and V3 source rows and uses `limited`. Confidence is `medium`.

### CUBISwap

CoinGecko candidate data preserves the cubiswap.finance domain. DefiLlama classifies CUBISwap as an opBNB AMM DEX/DAO and reports current TVL, but the first-party website could not be fully verified and no recent DEX-volume surface was available in this review pass. HEI therefore uses `limited` and `live_unverified`. Confidence is `medium`.

## Current-main overlap findings

Direct current-main checks and cross-repository searches confirmed the five AZ1 identities were absent before drafting.

Known stale candidates in the same scan range were excluded:

- Cryptal -> existing `hei_ex_000667`
- Cube Exchange -> existing `hei_ex_000668`
- Cryptomus -> existing `hei_ex_000669`
- Cryptonex -> existing `hei_ex_000670`

CrossTower, Currency.com, and other lifecycle-sensitive CEX candidates remain separate research work and were not forced into routine active growth.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 700
- projected event count: 1004
- projected evidence count: 3069
- remaining to D-750 after projected merge: 50

## Operating mode

AZ1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.