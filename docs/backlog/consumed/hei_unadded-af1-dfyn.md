# D-750 Batch AF1 — Dfyn

Reviewed at: 2026-07-09

## Results

- `0574` Dfyn -> `hei_ex_000736`, active DEX
- `0575` Dfyn duplicate source row -> consolidated under `hei_ex_000736`
- `0576` Dfyn Network -> consolidated under `hei_ex_000736`

## Consolidation and classification

- Dfyn, duplicate Dfyn source rows, and the Dfyn Network protocol-name representation are modeled as one exchange entity.
- RFQ, concentrated-liquidity AMM, on-chain limit-order, smart-routing, and chain-deployment surfaces are products or implementations under the same entity.
- Current first-party website and live exchange application support `active` status and `high` confidence.

## Decision notes

Dfyn is promoted from the current first-party website, first-party documentation, and reachable live exchange application.

The current website identifies Dfyn as an on-chain limit-order DEX combining RFQ matching, concentrated-liquidity AMM design, and smart order routing. It also documents advanced AMM execution, on-chain limit orders, and multichain route selection across Dfyn versions and external DEXes.

First-party documentation describes a trustless DEX coupled with a multichain AMM and provides exchange RFQ, API, audit, limit-order, liquidity, farming, contract, gasless-mode, and analytics documentation. The live exchange application is linked directly from the current website and is reachable at review time.

Exact bundle-path checks on current main found no existing `records/exchanges/dfyn.json`. The completed 0551-0600 scan classifies `0574` as `add_now` and requires `0575` and `0576` to be consolidated under one Dfyn entity.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 3
- projected entity count: 620
- projected event count: 1004
- projected evidence count: 2829
- remaining to D-750 after projected merge: 130

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
