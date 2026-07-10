# D-750 Batch AX1 — DeltaTrade, DeltaSwap, Dex-Trade, dexie, and DerpDEX

Reviewed at: 2026-07-10

## Results

- `0553` DeltaTrade -> `hei_ex_000802`, active DEX
- `0551` DeltaSwap -> `hei_ex_000803`, active DEX
- `0552` DeltaSwap (Arbitrum) -> consolidated under `hei_ex_000803`
- `0560` Dex-Trade -> `hei_ex_000804`, active CEX
- `0561` Dex-Trade duplicate/domain row -> consolidated under `hei_ex_000804`
- `0564` dexie -> `hei_ex_000805`, active DEX
- `0557` DerpDEX -> `hei_ex_000806`, active DEX
- `0558` DerpDEX (opBNB) -> consolidated under `hei_ex_000806`

## Entity-first consolidation

- DeltaTrade remains one multichain decentralized trading-protocol entity across NEAR and Solana strategy surfaces.
- DeltaSwap source rows and chain-specific discovery representations remain one exchange entity using GammaSwap application infrastructure.
- Dex-Trade duplicate exchange source rows remain one centralized exchange entity.
- dexie remains one Chia offer-market and exchange entity.
- DerpDEX chain-specific discovery rows remain one multichain CLMM DEX entity.

## Evidence decisions

### DeltaTrade

Current first-party website and documentation identify DeltaTrade as a multichain decentralized trading protocol with fully on-chain strategies, grid trading, DCA, rebalancing, order-book execution, market making, and AI-assisted trading workflows. DefiLlama independently reports current TVL and recent DEX volume across NEAR and Solana. Confidence is `high`.

### DeltaSwap

The current GammaSwap application endpoint remains reachable and is the application domain associated with DeltaSwap exchange discovery. DefiLlama independently identifies DeltaSwap as a commission-free spot DEX and reports current TVL and recent volume across Arbitrum, Base, and Ethereum. Confidence is `medium` because a standalone first-party DeltaSwap documentation surface was not recovered in this review pass.

### Dex-Trade

Current first-party Dex-Trade website and API documentation remain reachable. CoinGecko and CoinPaprika candidate sources independently preserve Dex-Trade as an exchange venue. Confidence is `medium` because this review pass did not reconstruct jurisdictional or corporate-registration history.

### dexie

The current first-party dexie application remains reachable and identifies the service as Chia Offers / Chia DEX. CoinGecko independently preserves dexie as an exchange venue under the dexie.space domain. Confidence is `medium` because detailed first-party documentation was not recovered in this review pass.

### DerpDEX

CoinGecko candidate data identifies the dedicated app.derpdex.com exchange domain. DefiLlama independently classifies DerpDEX as a multichain CLMM DEX across ZKsync Era, opBNB, and Base and reports current TVL, fees, and recent DEX volume. Confidence is `medium`; URL status is `live_unverified` because the first-party application could not be fully fetched during this review pass.

## Current-main overlap findings

Direct current-main checks and permanent path/name/domain review prevented stale scan assumptions from creating duplicate drafts:

- Demex -> existing `hei_ex_000678`
- Derive -> existing `hei_ex_000679`
- Dexalot -> existing `hei_ex_000680`
- DODO -> existing `hei_ex_000522`
- Dfyn -> existing `hei_ex_000736`
- Dexlab -> existing `hei_ex_000737`
- digitalexchange.id -> existing `hei_ex_000738`

The initial Demex candidate was removed from AX1 before drafting after the existing `records/exchanges/demex.json` identity was confirmed. DeltaSwap replaced it while preserving the five-entity batch size.

DeversiFi remains a lineage-reconstruction candidate and was not forced into routine growth. Thinner aggregator-only candidates remain outside this reviewed batch.

## Batch output

- new entities: 5
- new events: 0
- new evidence: 15
- projected entity count: 690
- projected event count: 1004
- projected evidence count: 3039
- remaining to D-750 after projected merge: 60

## Operating mode

AX1 continues normal D-750 multi-entity batching. Routine growth work targets approximately five reviewed entities per PR, normally 4–6. Single-entity PRs remain reserved for corrections, high-impact lifecycle updates, integrity repairs, or similarly exceptional work.

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.