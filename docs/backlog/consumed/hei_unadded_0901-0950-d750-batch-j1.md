# Range 0901-0950 D-750 Batch J1

Reviewed at: 2026-07-08

## Results

- `0906` Hashflow -> `hei_ex_000695`, active DEX
- `0911` Hata -> `hei_ex_000696`, active CEX
- `0917` Helix plus `0919` Helix Spot -> `hei_ex_000697`, active DEX

## Consolidation and classification

- Helix and Helix Spot source rows are modeled as one Injective ecosystem exchange entity.
- Hashflow is modeled as a DEX based on its signed RFQ exchange protocol rather than an AMM-pool design.
- Hata is modeled as a centralized exchange using current first-party trading, company, and compliance material.

## Decision notes

Hashflow is promoted from current first-party documentation describing DeFi-native RFQ pricing, signed market-maker quotes, and protected trade execution. Hata is promoted from its current first-party global exchange site, About page, and compliance material; the About page describes Hata as a Malaysian crypto exchange and the global site states Labuan Financial Services Authority regulation. Helix is promoted from current first-party exchange documentation describing an on-chain order book supporting spot and perpetual markets, automated liquidity vaults, APIs, bots, and DEX-building infrastructure.

HitBTC is not consumed by this batch because its current operational and historical status requires deeper lifecycle research despite its historical importance. Honeyswap and HorizonDEX remain outside this batch until stronger current first-party material is selected.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- product/source rows consolidated: 1
- projected entity count: 581
- projected event count: 1004
- projected evidence count: 2712
- remaining to D-750 after projected merge: 169

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
