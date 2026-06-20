# HEI A3 lineage inventory — 2026-06-20

## Purpose

A3 identifies identity-succession candidates before A4 changes any canonical relationship field. The audit reads the projected public entity and event layers and does not modify canonical records.

## Primary classifications

```text
linked_existing
  predecessor_id or successor_id already exists and needs review.

link_now
  structured event data identifies an existing HEI counterparty and may support a link.

document_only
  ownership change or same-entity migration does not establish identity succession.

unresolved
  a structured signal exists, but target or direction is not yet safe.
```

Keyword-only matches are kept in a separate watchlist and do not enter the primary A3 queue.

## Verified inventory

GitHub Actions run `27866135573` generated the inventory from head `89606a7079c0df16c2f611f58c8870bcb1050f62`.

```text
Projected public entities:          412
Projected public events:            687
Lineage status entities:             27
Lineage death-reason entities:       29
Lineage events:                      38
Existing relationship edges:         11
Missing relationship targets:         0
Self relationships:                   0
Non-reciprocal relationships:         9
Invalid event counterparty targets:   0

linked_existing:                     11
link_now:                             0
document_only:                        2
unresolved:                           23
Structured review queue:             36
Text-only watchlist:                 52
```

## L1 — existing relationship queue

```text
Coinsetter      -> Kraken
Cavirtex        -> Kraken
CleverCoin      -> Kraken
Bitomat         -> Mt. Gox
Bter            -> Gate.io
Coinbase Pro    -> Coinbase Exchange
CCEDK           -> OpenLedger DEX
OpenLedger DEX  <- CCEDK
Bitbox          -> BITFRONT
Bingbon         -> BingX
CoinFLEX        -> OPNX
```

CCEDK and OpenLedger DEX are reciprocal. Nine other edges are one-way. A one-way edge is not automatically invalid because the schema has only one `predecessor_id`, while one target may have several acquired services.

L1 dispositions:

```text
keep_bidirectional
add_reciprocal
keep_one_way_documented
remove_to_event_only
unresolved
```

## L2 — structured event/state queue

Current `document_only` cases:

```text
Poloniex — ownership changes while the exchange remained active
dYdX     — same-entity token or protocol migration
```

Current unresolved cases:

```text
BitBay
Coinfloor
Bgogo
Bitholic
Justcoin
zondacrypto
CoinMKT
CryptalDash
Atomic Trade
BTCChina
LocalCryptos
CHBTC
LiteBit
Crypto Facilities
BitTrade Australia
Qryptos
BarterDEX
BayBit.io
BCM Exchange
AlfaCashier
Anyswap
Huobi Korea
LFJ
```

No item is automatically `link_now` because current event records do not identify an existing `counterparty_exchange_id`. Narrative names must not be converted to canonical IDs without record review.

## Text-only watchlist

The separate 52-record watchlist contains words such as predecessor, successor, rebrand, acquisition, merger, migration, or lineage without a structured lineage field, status, death reason, or event.

Many are technical migrations, ownership history, or general prose. A3 must not expand its primary queue from 36 to 88 merely to clear keyword matches.

## Next steps

1. Review all eleven L1 relationships.
2. Review the twenty-five L2 candidates.
3. Commit a machine-readable disposition list.
4. Keep unresolved cases unresolved rather than forcing links.
5. Pass only reviewed `link_now` items to A4.

## Safety rules

- Acquisition is not automatically succession.
- A rebrand is not automatically a new entity.
- Same-entity product migration is not lineage.
- Narrative similarity does not establish continuity.
- Do not create thin successor entities to fill relationship fields.
- Do not force reciprocity where a singular predecessor field cannot represent the history.
- CoinFLEX and OPNX remain unresolved until their continuity evidence is reviewed explicitly.
