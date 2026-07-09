# D-750 Batch X1 — Hybra Finance

Reviewed at: 2026-07-09

## Results

- `0962` Hybra Finance V4 -> `hei_ex_000729`, active DEX
- `0963` Hybra V2 -> consolidated under `hei_ex_000729`
- `0964` Hybra V3 -> consolidated under `hei_ex_000729`
- `0965` Hybra V4 -> consolidated under `hei_ex_000729`

## Consolidation and classification

- Hybra Finance, Hybra V2, Hybra V3, and Hybra V4 are modeled as one exchange entity.
- Pool implementations, AMM versions, and discovery-source rows are not split into separate HEI entities.
- Current first-party product and liquidity documentation support active DEX classification.

## Decision notes

Hybra Finance is promoted from the current first-party website and Hybra Foundation documentation. The whitepaper identifies Hybra as a Hyperliquid/HyperEVM ve(3,3) DEX and documents concentrated liquidity, trading, fees, liquidity incentives, and routing infrastructure.

The current Trade documentation describes Hybra as HyperEVM's public liquidity layer and documents swap execution, aggregator comparison, route previews, price impact, slippage controls, connected-wallet execution, and the live trade surface. The Liquidity documentation links the current liquidity surface and pool-management workflow.

Exact bundle-path checks on current main found no existing `records/exchanges/hybra-finance.json`. Repository PR search found only the completed 0951-1000 scan, which explicitly requires Hybra V2/V3/V4 consolidation into one entity.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 613
- projected event count: 1004
- projected evidence count: 2808
- remaining to D-750 after projected merge: 137

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
