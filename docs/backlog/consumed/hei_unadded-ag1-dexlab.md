# D-750 Batch AG1 — Dexlab

Reviewed at: 2026-07-09

## Results

- `0565` Dexlab -> `hei_ex_000737`, active DEX

## Consolidation and classification

- Dexlab is modeled as one Solana exchange entity.
- Token Factory, Swap/Pool, token-launch infrastructure, API surfaces, and application routes remain products/components under the same entity.
- Current first-party website, documentation, and application support `active` status and `high` confidence.

## Decision notes

Dexlab is promoted from the current first-party website, current first-party documentation, and reachable first-party application.

The website describes Dexlab's Solana token-market platform and current Swap/Pool product, including liquidity provision, trading, pool creation, and API functionality. The documentation exposes Token & Swap APIs, DEX Swap/LP Pool documentation, and the Dexlab Swap/Pool Solana program ID and service URL.

The current application endpoint is reachable and exposes active Dexlab product navigation including Trade, Token Factory, Token Hub, documentation, and wallet-connected product flows.

Exact bundle-path checks on current main found no existing `records/exchanges/dexlab.json`, and repository PR search found no prior Dexlab record PR. The completed 0551-0600 scan classifies candidate `0565` as `add_now`.

## Dependency note

This branch is based on AF1 head while PR #609 remains under CI. AF1 owns `hei_ex_000736` and evidence IDs through `hei_src_011520`; AG1 intentionally begins at `hei_ex_000737` and `hei_src_011521`. AG1 must merge after AF1.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count after AF1 + AG1: 621
- projected event count: 1004
- projected evidence count: 2832
- remaining to D-750 after projected merges: 129

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
