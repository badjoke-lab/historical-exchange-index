# Consumed batch: verified-unadded 0101-0150 / batch 02

Status: promoted and resolved

Reviewed at: 2026-06-28

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0107` | `hei_ex_000546` Auragi Finance | Added as a limited Arbitrum AMM with exact mainnet launch evidence and current protocol tracking. |
| `hei_unadded_0114` | `hei_ex_000545` AUX Exchange | Added as a limited Aptos DEX with AMM, order-book, and router functions. |
| `hei_unadded_0126`-`0127` | `hei_ex_000547` BabySwap | Added once as an active BNB Smart Chain AMM with current markets and volume. |
| `hei_unadded_0136` | `hei_ex_000544` Bankera Exchange | Added as a rebranded CEX with public launch and SpectroCoin transition history. |

## Batch output

- new entities: 4
- new events: 5
- new evidence records: 17
- duplicate entities created: 0

## Modeling decisions

- Bankera Exchange uses `rebranded / rebrand`; its public launch is dated 2019-01-07 and its final Bankera-name marker is 2020-12-28.
- SpectroCoin Exchange is the successor brand but no separate successor entity is created in this batch.
- AUX and Auragi use `limited` because current official surfaces remain reachable while independent liquidity tracking is low.
- BabySwap uses a month-level `2021-06-01` launch date because the exact day was not recovered; public operation is independently confirmed by mid-June 2021.
- Duplicate BabySwap database rows are collapsed before entity creation.

## Safety checks

- exact record paths were checked before creation
- event source counts match linked evidence
- candidate dispositions are synchronized with the machine-readable scan
- no Cloudflare or deployment changes are included
