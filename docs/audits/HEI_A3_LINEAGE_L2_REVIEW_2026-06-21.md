# HEI A3 lineage L2 review — 2026-06-21

## Scope

L2 reviews the twenty-five projected-public entities that have a structured lineage signal but no existing `predecessor_id` or `successor_id`.

Structured signals include:

- `acquired`, `merged`, or `rebranded` entity status;
- `acquisition`, `merger`, or `rebrand` death reason;
- `acquired`, `merged`, `rebranded`, or `token_migration` events.

Canonical relationship fields are not changed in this PR. The reviewed actions are passed to A4.

## Disposition summary

```text
link_now:       7
document_only:  8
unresolved:    10
total:         25
```

The machine-readable source of truth is `config/lineage-l2-dispositions.json`.

## Link in A4

### BitBay ↔ zondacrypto

BitBay changed its brand through Zonda to zondacrypto. This is direct one-to-one identity continuity.

```text
BitBay successor_id = zondacrypto
zondacrypto predecessor_id = BitBay
```

### BTCChina ↔ BTCC

BTCChina officially adopted the BTCC brand.

```text
BTCChina successor_id = BTCC
BTCC predecessor_id = BTCChina
```

### CHBTC ↔ ZB.com

CHBTC transitioned to the ZB.com brand.

```text
CHBTC successor_id = ZB.com
ZB.com predecessor_id = CHBTC
```

### LiteBit → Bitvavo

Bitvavo acquired LiteBit's customer base and supported customer migration. Keep this as a one-way documented endpoint because the target-side predecessor field is singular.

```text
LiteBit successor_id = Bitvavo
```

### BitTrade Australia → Kraken

Kraken acquired Bit Trade Australia and integrated it into its Australian operation. Keep this one-way because Kraken has several acquired lineages.

```text
BitTrade Australia successor_id = Kraken
```

### BCM Exchange → Kraken

Kraken acquired BCM Exchange and migrated or transitioned its users. Keep this one-way for the same target-cardinality reason.

```text
BCM Exchange successor_id = Kraken
```

## Keep as event or narrative history only

### Poloniex

Circle acquired Poloniex and later spun it out, but the Poloniex identity continued.

### Justcoin

ANX acquired and revived the Justcoin brand and domain. This is ownership history, not a clean successor identity to ANXPRO.

### CoinMKT

ANX acquired CoinMKT while the CoinMKT brand continued under the group. The acquisition does not establish direct succession to ANXPRO.

### LocalCryptos

LocalEthereum changed its name to LocalCryptos within the same service identity already represented by one HEI record.

### Crypto Facilities

Kraken acquired Crypto Facilities, but the regulated venue continued inside the group rather than being replaced by the Kraken exchange identity.

### Huobi Korea

Huobi Korea separated from the wider Huobi or HTX group through ownership restructuring. Independence did not create a successor identity.

### dYdX

The v3 to dYdX Chain transition was a protocol and token migration within the same umbrella identity.

### LFJ

Trader Joe changed its public brand to LFJ while remaining the same protocol family represented by one HEI entity.

## Keep unresolved

The following named successors are not currently separate canonical HEI entities. HEI will not create thin records merely to fill relationship fields.

```text
Coinfloor          -> CoinCorner
Bgogo              -> Gogoswap
Bitholic           -> Bithumb Singapore
CryptalDash        -> DLTify
Atomic Trade       -> Banx.io
Qryptos            -> Liquid
BarterDEX          -> AtomicDEX
BayBit.io          -> Vero Exchange
AlfaCashier        -> Alfacash
Anyswap            -> Multichain
```

Bithumb Singapore must not be conflated with the general Bithumb entity. Atomic Trade and BayBit.io also retain source-quality limitations beyond the missing canonical target.

## Validation gate

`scripts/check-lineage-l2-dispositions.mjs` requires:

- exact coverage of all twenty-five structured candidates;
- one disposition per entity and no stale extras;
- the fixed `7 / 8 / 10` classification baseline;
- canonical target existence for every `link_now` item;
- no occupied or conflicting relationship field;
- unresolved items to retain a named target and reason;
- all cited event and evidence IDs to exist and belong to the reviewed entity or canonical target.

## Next step

A3-L3 consolidates L1 and L2 into one closure report and verifies that all thirty-six structured candidates have reviewed dispositions. A4 then applies only the approved relationship-field changes.
