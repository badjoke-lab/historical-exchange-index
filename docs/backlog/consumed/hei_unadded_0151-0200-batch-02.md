# Consumed batch: verified-unadded 0151-0200 / batch 02

Status: promoted and resolved

Reviewed at: 2026-06-30

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0178`-`0179` | `hei_ex_000570` Binance JEX | Added once as `dead / regulation` with the 2019 Binance acquisition and December 1, 2021 platform cessation. |
| `hei_unadded_0193` | `hei_ex_000571` BitcoinTrade | Added as `rebranded / rebrand`; launched October 20, 2017, acquired by Ripio in January 2021, and formally renamed Ripio Trade on June 19, 2023. |
| `hei_unadded_0194` | `hei_ex_000572` VBTC | Added as `limited`; maps the BitcoinVN candidate to the actual exchange platform VBTC, with a staged full shutdown scheduled for the end of 2026. |

## Batch output

- new entities: 3
- new events: 8
- new evidence records: 14
- duplicate entities created: 0

## Modeling decisions

- Binance JEX spot and futures rows are one exchange identity.
- Binance JEX uses `regulation` because its own shutdown notice tied the staged exit to new regulatory requirements.
- BitcoinTrade remains a historical predecessor record even though the active Ripio entity already records the acquisition. Its terminal marker is the 2023 Ripio Trade rebrand, not the 2021 acquisition.
- The old BitcoinTrade domain now serves Ripio-branded trading content and is classified as `repurposed`.
- The BitcoinVN candidate maps to VBTC, the actual centralized trading platform; BitcoinVN remains the wider group.
- VBTC remains `limited`, with no death date or death reason, because its announced end-of-2026 full shutdown has not yet occurred.
- Bit.com is deferred because current first-party material still shows active BIT-branded financial services and the exact boundary between any exchange wind-down and continuing OTC operations requires separate review.

## Safety checks

- future VBTC shutdown dates were not recorded as completed
- exact entity and product boundaries were reviewed before creation
- event source counts match linked evidence
- duplicate JEX spot/futures rows were collapsed
- no Cloudflare or deployment changes are included
