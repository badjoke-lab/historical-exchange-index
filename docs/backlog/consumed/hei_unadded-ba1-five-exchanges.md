# D-750 Batch BA1 — Buda, BMX, El Dorado Exchange, EmpireDEX, and Equation V3

Reviewed at: 2026-07-10

## Results

- `0288` Buda -> `hei_ex_000817`, active CEX represented as Buda.com
- `0261` BMX Classic AMM -> `hei_ex_000818`, active DEX represented as BMX
- `0651` El Dorado Exchange -> `hei_ex_000819`, limited DEX
- `0669` EmpireDEX -> `hei_ex_000820`, active DEX
- `0682` Equation V3 -> `hei_ex_000821`, limited DEX

## Evidence decisions

### Buda

Current first-party Buda.com website exposes local-currency crypto markets in Chile, Colombia, and Peru, BudaPRO, OTC services, mobile applications, and API access. Confidence is `high`.

### BMX

DefiLlama identifies BMX by Morphex as a decentralized perpetual exchange and reports recent 30-day, 7-day, and 24-hour Classic AMM spot volume plus substantial cumulative volume. The first-party BMX domain is preserved but could not be fully fetched in this pass, so URL status is `live_unverified`. Confidence is `medium`.

### El Dorado Exchange

DefiLlama identifies El Dorado Exchange as an on-chain spot and perpetual exchange and reports residual TVL plus substantial cumulative spot and perpetual volume across BNB Chain and Arbitrum. A stable first-party website and clear current public trading surface were not recovered, so HEI uses `limited`. Confidence is `medium`.

### EmpireDEX

DefiLlama identifies EmpireDEX as a multichain AMM DEX and reports current multichain TVL plus non-zero 30-day, 7-day, and 24-hour DEX volume. A stable first-party website was not recovered, so URL fields remain unset rather than guessed. Confidence is `medium`.

### Equation V3

DefiLlama identifies Equation V3 as an Arbitrum perpetual DEX and reports zero current TVL alongside substantial cumulative DEX volume and historical fee generation. HEI therefore uses `limited`, not `active`. Confidence is `medium`.

## Current-main overlap findings

Direct current-main checks prevented stale candidate assumptions from creating duplicate drafts:

- BrownFi -> existing `hei_ex_000606`
- BurrBear -> existing `hei_ex_000608`
- Cables Finance -> existing `hei_ex_000617`
- Caliber -> existing `hei_ex_000618`
- Canary -> existing `hei_ex_000619`
- Canto Dex -> existing `hei_ex_000624`
- Clober -> existing `hei_ex_000639`

Bitex.la, Bitocto Exchange, and BitPreço remain lifecycle-research candidates and were not forced into this routine growth batch.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 705
- projected event count: 1004
- projected evidence count: 3084
- remaining to D-750 after projected merge: 45

## Operating mode

BA1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.