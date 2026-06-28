# Consumed batch: verified-unadded 0101-0150 / batch 04

Status: promoted and resolved

Reviewed at: 2026-06-29

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0101` | `hei_ex_000551` ATAIX | Added as an active Estonian CEX with verified public operation and historical licensing milestones. |
| `hei_unadded_0102` | `hei_ex_000552` Atlantis | Added as an active Monad V4 DEX using the public-mainnet day-one marker. |
| `hei_unadded_0103` | `hei_ex_000553` Atmos DEX | Added as an active Supra-native trading ecosystem with an exact mainnet launch date. |
| `hei_unadded_0108` | `hei_ex_000554` AuraSwap | Added as the inactive Polygon protocol, distinct from the unrelated Aura Network product. |
| `hei_unadded_0109`-`0110` | `hei_ex_000555` AuroraSwap | Added once as an active Aurora-chain AMM with early cross-chain history. |

## Batch output

- new entities: 5
- new events: 7
- new evidence records: 26
- duplicate entities created: 0

## Modeling decisions

- ATAIX uses `2018-10-26` as its first verified public-operation marker because first-party exchange, listing, and licensing materials were all published on that date.
- Atlantis uses Monad's `2025-11-24` public-mainnet date with medium confidence because ecosystem material identifies it as a day-one liquidity provider.
- Atmos Studio remains excluded as a launchpad component of the Atmos ecosystem.
- AuraSwap is the Polygon protocol sourced by DefiLlama, not the unrelated Aura Network AMM at `auraswap.io`.
- Polygon AuraSwap is `inactive` with `death_date: null`; no definitive shutdown announcement or exact terminal date was recovered.
- AuroraSwap uses a month-level `2021-12-01` launch marker because the exact day was not recovered, while contemporaneous December 2021 operation is independently preserved.

## Safety checks

- exact record paths were checked before creation
- same-name protocol identities were separated before promotion
- event source counts match linked evidence
- candidate dispositions are synchronized with the machine-readable scan
- no Cloudflare or deployment changes are included
