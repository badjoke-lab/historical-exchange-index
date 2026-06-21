# HEI A3 lineage L1 review — 2026-06-21

## Scope

This review covers every existing projected-public `predecessor_id` and `successor_id` edge identified by the A3 inventory.

```text
Existing edges reviewed: 11
Missing targets:           0
Self references:           0
```

Canonical relationship fields are not changed in this PR. The reviewed actions are passed to A4.

## Disposition summary

```text
keep_one_way_documented: 4
add_reciprocal:           3
keep_bidirectional:       2
remove_to_event_only:     2
unresolved edge action:   0
```

The machine-readable source of truth is `config/lineage-l1-dispositions.json`.

## Keep one-way and document

### Coinsetter → Kraken

Kraken acquired Coinsetter and transferred customer accounts. The edge is valid from Coinsetter to Kraken. A reciprocal `predecessor_id` on Kraken would lose the other acquired lineages because the current field is singular.

### CAVIRTEX → Kraken

Kraken acquired CAVIRTEX and transferred customer accounts. Keep the one-way edge for the same cardinality reason.

### CleverCoin → Kraken

Kraken acquired CleverCoin and transferred customer accounts. Keep the one-way edge rather than forcing one of several acquisitions into Kraken's singular predecessor field.

### Bitomat → Mt. Gox

Mt. Gox acquired Bitomat after its wallet-loss crisis and migrated users. The endpoint is valid from Bitomat to Mt. Gox, but Mt. Gox should not receive a singular reciprocal predecessor assignment.

## Add reciprocal links in A4

### Bter ↔ Gate.io

The Bter exchange lineage continued under Gate.io, and Bter users were migrated to Gate.io. This is a one-to-one brand succession.

Planned A4 change:

```text
Gate.io predecessor_id = Bter
```

### Bitbox ↔ BITFRONT

LINE closed or replaced BITBOX and launched BITFRONT as the succeeding global platform. This is a reviewed one-to-one succession.

Planned A4 change:

```text
BITFRONT predecessor_id = Bitbox
```

### Bingbon ↔ BingX

Official BingX materials state that Bingbon rebranded to BingX. This is direct brand continuity.

Planned A4 change:

```text
BingX predecessor_id = Bingbon
```

## Keep the existing reciprocal pair

### CCEDK ↔ OpenLedger DEX

CCEDK ceased its original trading-engine role and relaunched into an OpenLedger-centered structure. Both sides already point to each other and the reviewed evidence supports retaining that pair.

## Remove forced successor links in A4

### Coinbase Pro → Coinbase Exchange

Coinbase Pro was replaced by Coinbase Advanced inside the broader Coinbase service. `Coinbase Exchange` is an umbrella exchange record, not the direct successor identity. The transition remains useful as event and narrative history, but the canonical `successor_id` should be removed.

Planned A4 change:

```text
Coinbase Pro successor_id = null
```

### CoinFLEX → OPNX

OPNX was connected to CoinFLEX leadership and creditor plans, but the transition was not a clean exchange-name rebrand. Existing evidence also records disputes over the degree of continuity. HEI should retain the history in events and notes without forcing OPNX as a canonical successor.

Planned A4 change:

```text
CoinFLEX successor_id = null
```

The broader CoinFLEX / OPNX continuity question remains historically documented but not represented as a predecessor/successor edge.

## Validation gate

`scripts/check-lineage-l1-dispositions.mjs` requires:

- every current projected-public relationship edge to have exactly one disposition;
- no stale or extra disposition;
- entity and target names to match current records;
- all referenced events and evidence to exist and belong to one side of the reviewed relationship;
- `keep_bidirectional` pairs to be reciprocal already;
- `add_reciprocal` actions not to overwrite a conflicting existing predecessor or successor.

## Next step

A3-L2 reviews the twenty-five structured event/state candidates that do not currently have canonical predecessor/successor fields. A4 applies only the reviewed L1 and L2 changes after A3 closes.
