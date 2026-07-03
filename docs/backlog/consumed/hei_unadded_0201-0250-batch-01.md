# Consumed batch: verified-unadded 0201-0250 / batch 01

Status: reviewed and promoted

Reviewed at: 2026-07-03

## Canonical entities

| candidate row | canonical entity | result |
|---|---|---|
| `hei_unadded_0202` Bitex.la | `hei_ex_000584` Bitex.la | Added as `acquired / acquisition`; launched in Buenos Aires in May 2014 and acquired by Huobi Global on 2022-05-26. |
| `hei_unadded_0223` Bitpanda Pro | `hei_ex_000585` Bitpanda Pro | Added as `rebranded / rebrand`; launched as Bitpanda Global Exchange on 2019-08-07, renamed Bitpanda Pro in 2020, and became One Trading on 2023-06-28. |
| `hei_unadded_0243` BL3P | `hei_ex_000586` BL3P | Added as `dead / voluntary_shutdown`; launched in 2014 and closed trading on 2024-12-20 with balances transferred to Bitonic. |

## Batch output

- new entities: 3
- new events: 9
- new evidence records: 19
- duplicate entities created: 0

## Modeling decisions

- Bitex.la uses the Huobi acquisition as the terminal marker for its independent exchange identity; the announcement did not establish an immediate same-day brand shutdown.
- Bitpanda Global Exchange and Bitpanda Pro are modeled as one continuous identity. One Trading is not yet canonical, so `successor_id` remains null.
- BL3P uses a year-level 2014 launch marker because first-party sources do not establish one definitive public-launch day.
- BL3P's exchange death date is 2024-12-20. The later May 2026 account-history portal removal is preserved as a post-shutdown event rather than replacing the exchange death date.

## Safety checks

- names, aliases, slugs, and historical domains were checked against the projected registry
- acquisition and rebrand successors were not created prematurely
- original domains are not treated as proof of current active trading
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
