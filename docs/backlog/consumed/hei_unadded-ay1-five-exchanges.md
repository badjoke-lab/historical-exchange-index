# D-750 Batch AY1 — Cyberperp, Cypher, Cytoswap, Dano Finance, and DDEX

Reviewed at: 2026-07-10

## Results

- `0503` Cyberperp -> `hei_ex_000807`, active DEX
- `0504` Cypher -> `hei_ex_000808`, active DEX
- `0506` Cypher V2 -> consolidated under `hei_ex_000808`
- `0507` Cypher V4 -> consolidated under `hei_ex_000808`
- `0508` cytoswap -> `hei_ex_000809`, active DEX represented as Cytoswap
- `0509` Cytoswap duplicate/domain row -> consolidated under `hei_ex_000809`
- `0515` Dano Finance -> `hei_ex_000810`, active DEX
- `0524` DDEX -> `hei_ex_000811`, active DEX

## Entity-first consolidation

- Cyberperp remains one spot and perpetual exchange entity across IOTA EVM and IOTA activity.
- Cypher V2 and V4 source rows remain one Ethereum DEX entity.
- cytoswap and Cytoswap source representations remain one HeLa DEX entity.
- Dano Finance remains one Cardano AMM exchange entity.
- DDEX margin trading, lending, and protocol surfaces remain one Ethereum DEX entity.

## Evidence decisions

### Cyberperp

The current first-party Cyberperp application endpoint remains reachable. DefiLlama identifies Cyberperp as a decentralized spot and perpetual exchange on IOTA EVM and IOTA and reports current TVL, recent fees, and perpetual volume. Confidence is `medium` because detailed first-party documentation was not recovered in this review pass.

### Cypher

The current first-party Cypher website and application remain reachable. DefiLlama identifies Cypher V4 as an Ethereum CLMM DEX with current TVL and active DEX volume. HEI consolidates Cypher V2 and V4 source rows into one entity. Confidence is `high`.

### Cytoswap

The current first-party Cytoswap domain remains reachable. DefiLlama identifies Cytoswap as a HeLa CLMM DEX and reports current TVL and recent DEX volume. CoinGecko independently identifies the exchange under the cytoswap.com domain. Confidence is `medium` because detailed first-party documentation was not recovered in this review pass.

### Dano Finance

The current first-party Dano Finance domain remains reachable. DefiLlama identifies Dano Finance as a Cardano AMM DEX for listing and trading Optim bond tokens and reports current TVL, fees, revenue, and active DEX volume. Confidence is `medium` because detailed first-party documentation was not recovered in this review pass.

### DDEX

The current first-party DDEX website remains reachable and exposes trading and lending entry points, leveraged ETH and BTC trading, borrowing, lending, limit and stop-limit orders, audit links, developer documentation, and smart-contract resources. DefiLlama independently reports current Ethereum TVL. Confidence is `high`.

## Current-main overlap findings

Direct current-main checks and permanent path/name/domain review prevented stale scan assumptions from creating duplicate drafts:

- DackieSwap -> existing `hei_ex_000673`
- DeDust -> existing `hei_ex_000674`
- DeepBook -> existing `hei_ex_000671`
- DeGate -> existing `hei_ex_000672`
- DefiTuna -> existing `hei_ex_000676`
- Defibox -> existing `hei_ex_000734`
- DeFiChain DEX -> existing `hei_ex_000735`

Darb Finance, Dcoin, Decoin, and other CEX candidates remain lifecycle-research candidates and were not forced into routine active-growth classification. Thinner aggregator-only rows remain outside this reviewed batch.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 695
- projected event count: 1004
- projected evidence count: 3054
- remaining to D-750 after projected merge: 55

## Operating mode

AY1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.