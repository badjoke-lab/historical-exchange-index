# Range 0851-0900 D-750 Batch I1

Reviewed at: 2026-07-08

## Results

- `0866` GMO Coin Japan -> `hei_ex_000692`, active CEX
- `0854`/`0855` Glide Finance source rows -> `hei_ex_000693`, active DEX
- `0877` GooseFX V2 source row -> `hei_ex_000694`, active DEX

## Consolidation and classification

- Glide Finance duplicate exchange/DEX source rows are modeled as one entity.
- GooseFX is modeled under its current GAMMA AMM core. Current first-party documentation states that earlier perpetual futures, single-sided liquidity pools, and the NFT aggregator were sunsetted, so those retired product surfaces are not split into separate entities.
- GMO Coin Japan is modeled as one centralized exchange entity using first-party company registration and current exchange-product pages.

## Decision notes

GMO Coin Japan is promoted from official company information showing Japanese crypto-asset exchange business registration and from the current exchange service page documenting spot order-book trading, leverage exchange trading, WebTrader, and API access. Glide Finance is promoted from its official application domain and first-party documentation identifying a DEX/AMM on the Elastos Smart Chain with swap, liquidity, farming, staking, and bridge functions; confidence is medium because the documentation pages are old. GooseFX is promoted from current first-party documentation that identifies GAMMA AMM as the current core offering and documents a recently updated hybrid CPAMM/CLMM design.

GOPAX remains outside this batch pending stronger public regulatory/corporate evidence extraction despite its current official exchange site being live. GRVT remains outside this batch pending a stronger first-party architecture/product-description source beyond the current trading surface.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- duplicate/product rows consolidated: 2
- projected entity count: 578
- projected event count: 1004
- projected evidence count: 2703
- remaining to D-750 after projected merge: 172

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
