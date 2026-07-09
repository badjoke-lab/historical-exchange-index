# D-750 Batch U1 — Hydrex and Hypertrade

Reviewed at: 2026-07-09

## Results

- `0971` Hydrex Integral -> `hei_ex_000723`, active DEX
- `0987` Hypertrade -> `hei_ex_000724`, active DEX
- `0988` Hypertrade V3 -> consolidated under `hei_ex_000724`

## Consolidation and classification

- Hydrex Integral is modeled as the Hydrex exchange entity using the current first-party Hydrex brand and current Base-native DEX/liquidity-hub surfaces.
- Hypertrade and Hypertrade V3 are modeled as one exchange entity. The current first-party product combines v2 and v3 on-chain DEX liquidity with the Hypertrade R1 routing aggregator.
- Neither candidate is split by pool version, routing product, deployment, or registry-source row.

## Decision notes

Hydrex is promoted from current first-party pages that explicitly identify the service as a decentralized exchange and liquidity hub built for Base. The active trade surface exposes DCA, price-limit, synth-order, token-selection, and linked perpetuals functionality, while the analytics surface exposes DEX LP TVL, fees, pools, volume, and liquidity-source data.

Hypertrade is promoted from current first-party website and documentation identifying a native on-chain Hyperliquid DEX with v2 and v3 pool models plus the R1 aggregator. The documentation covers swaps, concentrated and full-range liquidity, permissionless non-custodial operation, pool mechanics, and routing across HyperEVM and HyperCore.

Exact bundle-path checks on current main found no existing `records/exchanges/hydrex-integral.json` or `records/exchanges/hypertrade.json`. The 0951-1000 scan authority already classifies Hydrex Integral and Hypertrade as `add_now` and Hypertrade V3 as a source/version row to consolidate under Hypertrade.

## Batch output

- new entities: 2
- new events: 0
- new evidence: 6
- projected entity count: 608
- projected event count: 1004
- projected evidence count: 2793
- remaining to D-750 after projected merge: 142

No Cloudflare configuration changes are included. Preview deployment is not required for reviewed record-only additions. All reviewed public-data validation gates must pass before merge.
