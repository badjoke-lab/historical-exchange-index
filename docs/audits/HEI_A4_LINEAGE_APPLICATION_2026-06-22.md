# HEI A4 lineage application — 2026-06-22

## Result

A4 applies only the predecessor and successor changes approved by the completed A3 review.

```text
Reviewed field changes: 14
Affected entities:       14
Projected entities:     412
Projected events:       687
Projected evidence:    1608
Missing targets:          0
Self relationships:       0
```

No entity, event, or evidence count changes in this phase.

## Applied changes

### Reciprocal or direct-continuity links

- Bter → Gate.io, with Gate.io receiving Bter as predecessor.
- Bitbox → BITFRONT, with BITFRONT receiving Bitbox as predecessor.
- Bingbon → BingX, with BingX receiving Bingbon as predecessor.
- BitBay ↔ zondacrypto.
- BTCChina ↔ BTCC.
- CHBTC ↔ ZB.com.

### One-way documented endpoints

- LiteBit → Bitvavo.
- BitTrade Australia → Kraken.
- BCM Exchange → Kraken.

These remain one-way because the destination-side predecessor field is singular and cannot safely represent every acquired or migrated service.

### Removed forced successor fields

- Coinbase Pro no longer forces Coinbase Exchange as its canonical successor.
- CoinFLEX no longer forces OPNX as its canonical successor.

Their historical relationship remains available through events, evidence, and narrative text.

## Protected decisions

The eight A3 `document_only` decisions and ten A3 `unresolved` decisions remain unchanged. No thin entity was created to complete a relationship field.

## Validation

The permanent A4 gate verifies:

- exact derivation from the L1 and L2 review manifests;
- exactly fourteen approved changes across fourteen entities;
- preservation of the frozen pre-A4 A3 review baseline;
- no unreviewed relationship edges;
- zero missing relationship targets;
- zero self relationships;
- unchanged reviewed public counts.

The public loader and Node validation path both support guarded additions to previously absent optional relationship fields.

## Next phase

A5 adds a permanent entity-quality audit covering URL status, placeholder text, missing archive or domain data, URL consistency, and incomplete lineage signals.
