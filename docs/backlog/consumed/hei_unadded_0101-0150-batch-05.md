# Consumed batch: verified-unadded 0101-0150 / batch 05

Status: promoted and resolved

Reviewed at: 2026-06-29

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0139` | `hei_ex_000556` Baseline | Added as an active protocol-level DEX spanning its Blast and Base generations. |
| `hei_unadded_0141` | `hei_ex_000557` Basin | Added as an active composable EVM DEX with the BIP-37 launch and integration marker. |
| `hei_unadded_0148` | `hei_ex_000558` Beam Network Swap | Added as the active native AMM of the Beam gaming network. |
| `hei_unadded_0150` | `hei_ex_000559` Bean Exchange | Added as an active Monad spot and perpetual exchange with a mainnet production launch marker. |

## Batch output

- new entities: 4
- new events: 5
- new evidence records: 20
- duplicate entities created: 0

## Modeling decisions

- Baseline versions and chain deployments remain one protocol-level entity.
- Baseline uses a year-level `2024-01-01` launch marker because first-party history identifies the first Blast deployment in 2024 without an exact day.
- Basin uses `2023-08-30`, when the BIP-37 integration completed and first-party material tied that integration to the protocol launch.
- Basin Ethereum and Arbitrum deployments remain one entity.
- The qualified name Beam Network Swap distinguishes the Beam gaming-network service from Beamswap on Moonbeam (`hei_ex_000370`).
- Beam Network Swap uses a month-level `2023-09-01` launch marker because Beam mainnet launched in September 2023 but an exact standalone DEX launch day was not recovered.
- Bean Exchange uses Monad's exact `2025-11-24` public-mainnet date as its production launch marker; pre-mainnet beta activity is not used as the canonical launch date.

## Safety checks

- current main was rechecked after batch 04 to avoid duplicate creation
- same-name exchange identities were separated before promotion
- exact record paths were checked before creation
- event source counts match linked evidence
- candidate dispositions are synchronized with the machine-readable scan
- no Cloudflare or deployment changes are included
