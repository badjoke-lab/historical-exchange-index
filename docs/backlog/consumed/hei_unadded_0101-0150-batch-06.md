# Consumed batch: verified-unadded 0101-0150 / batch 06

Status: promoted and scan closed

Reviewed at: 2026-06-29

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0137` | `hei_ex_000560` Barter | Added as the active Ethereum execution and distributed-liquidity protocol represented by the BarterSwap Superposition candidate. |
| `hei_unadded_0140` | `hei_ex_000561` BaseX | Added as the active basex.fi concentrated-liquidity DEX on Base. |
| `hei_unadded_0142`-`0143` | `hei_ex_000562` Batonex | Added once as the continuing Wisebitcoin-to-Batonex centralized exchange identity. |
| `hei_unadded_0149` | existing `hei_ex_000370` Beamswap | Strengthened with the July 2023 public launch of the Beamex perpetual product; no separate entity created. |

## Thin-candidate closure

| candidate row | result |
|---|---|
| `hei_unadded_0144` BCEX | Moved to `pending_thin`; current and terminal-state evidence remains contradictory and the historical domain is repurposed. |
| `hei_unadded_0145` BCoin.sg | Moved to `pending_thin`; no sufficiently strong first-party status or shutdown chronology was recovered. |

## Batch output

- new entities: 3
- existing entities strengthened: 1
- new events: 5
- new evidence records: 20
- duplicate entities created: 0
- remaining `needs_research`: 0

## Modeling decisions

- BarterSwap Superposition is normalized to the current Barter protocol identity, with exact candidate wording retained as an alias.
- Barter uses `2025-03-31`, the independently documented Superposition introduction date, as its public launch marker.
- BaseX uses a month-level `2023-12-01` marker because first-party December material documents active pools, traders, and liquidity providers while no exact first-trade day was recovered.
- BaseX is the basex.fi protocol tracked by DefiLlama and is separated from unrelated BaseX and BSX products.
- Wisebitcoin's exact `2018-05-26` launch and the `2023-02-01` Batonex rebrand remain events of one continuing CEX entity.
- Beamex AMM is a product of Beamswap and is represented through an event and evidence on `hei_ex_000370`.
- Database presence alone was not sufficient to promote BCEX or BCoin.sg.

## Range completion

The corrected `0101-0150` scan is fully classified:

```text
add_now:                    22
needs_research:              0
pending_thin:                7
out_of_scope_or_duplicate:  21
```

## Safety checks

- exact record paths were checked before creation
- same-name protocol identities were separated before promotion
- event source counts match linked evidence
- candidate dispositions are synchronized with the machine-readable scan
- no Cloudflare or deployment changes are included
