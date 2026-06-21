# HEI A3 lineage closure — 2026-06-21

## Result

A3 is complete.

```text
Projected public entities:      412
Projected public events:        687
Structured candidates:           36
Reviewed structured candidates:  36
Text-only watchlist:              52
Missing relationship targets:      0
Self relationships:                0
Invalid event counterparties:      0
```

No canonical predecessor or successor field was changed during A3. The phase produced reviewed dispositions and validation gates only.

## L1 — existing relationship edges

All eleven existing predecessor/successor edges were reviewed.

```text
keep_one_way_documented: 4
add_reciprocal:           3
keep_bidirectional:       2
remove_to_event_only:     2
```

The machine-readable source of truth is `config/lineage-l1-dispositions.json`.

### A4 additions from L1

- Gate.io receives Bter as predecessor.
- BITFRONT receives Bitbox as predecessor.
- BingX receives Bingbon as predecessor.

### A4 removals from L1

- Coinbase Pro no longer forces Coinbase Exchange as its canonical successor.
- CoinFLEX no longer forces OPNX as its canonical successor.

### L1 relationships intentionally left one-way

- Coinsetter to Kraken
- CAVIRTEX to Kraken
- CleverCoin to Kraken
- Bitomat to Mt. Gox

These are valid acquired-service endpoints, but the target-side field is singular and cannot safely represent multiple acquired predecessors.

## L2 — structured candidates without existing edges

All twenty-five structured candidates were reviewed.

```text
link_now:       7
document_only:  8
unresolved:    10
```

The machine-readable source of truth is `config/lineage-l2-dispositions.json`.

### A4 links from L2

- BitBay and zondacrypto
- BTCChina and BTCC
- CHBTC and ZB.com
- LiteBit to Bitvavo
- BitTrade Australia to Kraken
- BCM Exchange to Kraken

The first three are direct brand-continuity pairs. The last three are one-way acquisition or migration endpoints because the target-side predecessor field is singular.

### L2 document-only decisions

- Poloniex
- Justcoin
- CoinMKT
- LocalCryptos
- Crypto Facilities
- Huobi Korea
- dYdX
- LFJ

These cases remain in events and narrative history because they represent ownership changes, same-identity rebrands, protocol migration, or restructuring rather than a clean predecessor/successor split.

### L2 unresolved targets

```text
Coinfloor    -> CoinCorner
Bgogo        -> Gogoswap
Bitholic     -> Bithumb Singapore
CryptalDash  -> DLTify
Atomic Trade -> Banx.io
Qryptos      -> Liquid
BarterDEX    -> AtomicDEX
BayBit.io    -> Vero Exchange
AlfaCashier  -> Alfacash
Anyswap      -> Multichain
```

These targets are not currently separate canonical HEI entities, or source quality remains insufficient. HEI does not create thin entities merely to complete lineage fields.

## Text-only watchlist

The inventory also contains fifty-two text-only lineage signals.

These records contain words or narrative hints related to acquisition, rebranding, migration, predecessor, successor, merger, or lineage, but they do not currently have structured status, death-reason, event, or relationship-field signals strong enough for A3 disposition work.

They remain a secondary watchlist and do not block A3 closure. Future evidence or structured events may promote individual records into a new review queue.

## Closure gate

`scripts/check-lineage-a3-closure.mjs` verifies:

- exactly 36 structured candidates;
- exact coverage by 11 L1 and 25 L2 dispositions;
- no overlap or omission between L1 and L2;
- exact disposition baselines;
- exact preservation of the 52-item text-only watchlist;
- zero missing targets, self relationships, and invalid event counterparties.

The lineage audit workflow stores the closure report as an artifact on every relevant run.

## Next phase

A4 applies only the reviewed canonical-field changes listed above. Unresolved and document-only cases remain unchanged.
