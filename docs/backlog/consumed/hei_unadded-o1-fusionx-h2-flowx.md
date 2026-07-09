# D-750 Batch O1 — FusionX, H2 Finance, and FlowX

Reviewed at: 2026-07-09

## Results

- `0813` FusionX V2 plus `0814`/`0815` V3 rows -> `hei_ex_000705`, active DEX
- `0896` H2 Finance plus `0897` V2 and `0898` V3 rows -> `hei_ex_000706`, active DEX
- `0776` FlowX CLMM plus `0777` V2 and `0778` V3 rows -> `hei_ex_000707`, active DEX

## Consolidation and classification

- FusionX V2/V3 rows are modeled as one FusionX exchange entity on Mantle.
- H2 Finance base/V2/V3 rows are modeled as one Cronos zkEVM exchange entity because current first-party trade and liquidity documentation presents V2 and V3 pools as liquidity modes within one platform.
- FlowX CLMM and V2/V3 discovery rows are modeled as one FlowX exchange entity on Sui. Current first-party documentation presents swap, aggregation, liquidity, farming, and perpetual services under the same protocol identity.

## Decision notes

FusionX is promoted from current first-party documentation identifying a Mantle Network DEX/AMM and documenting swap, liquidity, farming, analytics, perpetual trading, and limit-order products.

H2 Finance is promoted from first-party documentation identifying the platform as a Cronos zkEVM DEX and documenting token swaps, multihop and split routing, Classic V2 pools, and Flexible V3 concentrated-liquidity pools.

FlowX is promoted from current first-party documentation identifying a Sui DEX and documenting its core swap product, DEX aggregation across integrated Sui liquidity sources, CLMM-related liquidity functionality, and broader trading services.

## Batch output

- new entities: 3
- new events: 0
- new evidence: 9
- version/product rows consolidated: 6
- projected entity count: 591
- projected event count: 1004
- projected evidence count: 2742
- remaining to D-750 after projected merge: 159

No Cloudflare configuration changes are included. All reviewed public-data validation gates must pass before merge.
