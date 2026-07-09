# D-750 Batch AK1 — Elys DEX

Reviewed at: 2026-07-09

## Results

- `0663` Elys DEX -> `hei_ex_000741`, active DEX

## Consolidation and classification

- Elys spot AMM, liquidity-pool, perpetual, and app surfaces are modeled as one Elys DEX exchange entity.
- AMM modules, perpetual modules, liquidity pools, collateral logic, and application routes remain components under the same entity.
- Confidence is `medium` because the current public documentation site is thin and partly template-like; the record therefore relies on the live first-party app, first-party chain implementation, and June 2026 DEX discovery source.

## Decision notes

Elys DEX is promoted from the live first-party Elys application, the official `elys-network/elys` implementation repository, and the June 2026 DEX discovery source.

The first-party application endpoint is reachable. The official chain implementation contains AMM swap logic and a detailed perpetual-trading mechanism specification covering leveraged trading, collateral, synthetic liabilities, custody assets, swap logic, pool health, AMM dependency, and liquidation behavior.

The June 2026 DEX candidate source identifies Elys DEX in the DEX category. Exact bundle-path checks on current main found no existing `records/exchanges/elys-dex.json` or `records/exchanges/elys.json`, and repository PR search found no prior Elys DEX record PR.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 625
- projected event count: 1004
- projected evidence count: 2844
- remaining to D-750 after projected merge: 125

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
