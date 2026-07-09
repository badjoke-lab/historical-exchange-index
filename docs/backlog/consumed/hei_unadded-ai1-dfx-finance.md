# D-750 Batch AI1 — DFX Finance

Reviewed at: 2026-07-09

## Results

- `0573` DFX V2 -> `hei_ex_000739`, active DEX

## Consolidation and classification

- DFX, DFX V2, and current DFX v3 application surfaces are modeled as one DFX Finance exchange entity.
- AMM versions, stablecoin pools, governance, and application endpoints remain versions/products/components under the same entity.
- Current first-party website, documentation, and live v3 application support `active` status and `high` confidence.

## Decision notes

DFX Finance is promoted from the current first-party website, current first-party documentation, and reachable v3 application.

The official website identifies DFX as an Ethereum-based decentralized exchange protocol and crypto FX trading protocol optimized for fiat-backed stablecoins. It documents bonding-curve trading, hyper-efficient swaps, and live application links.

First-party documentation describes DFX as a decentralized foreign-exchange protocol for fiat-backed stablecoins and documents AMM swaps, dynamically adjusted bonding curves, liquidity providers, liquidity mining, smart contracts, governance, audits, and official protocol links. The current v3 application endpoint is reachable at review time.

Exact bundle-path checks on current main found no existing `records/exchanges/dfx-finance.json`, and repository PR search found no prior DFX record PR. The completed 0551-0600 scan classifies candidate `0573` as `add_now` and explicitly requires entity-level modeling rather than version inflation.

## Dependency note

This branch is based on AH1 head, which follows AG1 and AF1. Reserved sequence: AF1 `hei_ex_000736`; AG1 `hei_ex_000737`; AH1 `hei_ex_000738`; AI1 `hei_ex_000739`. Evidence IDs follow the same order through `hei_src_011529`. Merge order must remain AF1 -> AG1 -> AH1 -> AI1.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count after AF1 + AG1 + AH1 + AI1: 623
- projected event count: 1004
- projected evidence count: 2838
- remaining to D-750 after projected merges: 127

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
