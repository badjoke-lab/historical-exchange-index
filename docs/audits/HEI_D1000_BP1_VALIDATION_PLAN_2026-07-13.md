# HEI D-1000 BP1 Validation Plan

Date: 2026-07-13

## Scope

Validate the BP1 reviewed growth batch:

```text
BitcoinVN
Currency.com
CrossTower
CoinDeal
Coingi
```

## Required checks

```text
record schema validation
overlap audit
name/slug/domain/alias duplicate audit
entity/event/evidence ID collision audit
verified-unadded scan integrity
candidate consumption integrity
country/origin strict gate
projected enum validation
entity quality gate
URL safety
count semantics regression
machine-readable build and validation
public build and validation
Japanese route count parity
L-2 evaluation remains HOLD
maintainer recovery counts == 779 / 1004 / 3305
```

## Expected projected state

```text
Entities: 779
Events:   1004
Evidence: 3305
English dossiers:  779
Japanese dossiers: 779
Sitemap routes:     1582
```

## Status expectations

```text
BitcoinVN     active
Currency.com  active
CrossTower    limited
CoinDeal      limited
Coingi        limited
```

## Overlap expectation

The verified-unadded backlog and older scan dispositions are stale relative to current main. BP1 was assembled only after checking exact slugs, alternate slugs, names, aliases, and domains against current reviewed records. Bitocto, Bankera Exchange, BitPreço, Buda, and Bitex.la were rejected as already represented under existing records.

Records validation must report zero blocking overlaps.

## Merge rule

Do not merge if any reviewed-data, count-semantics, machine/public consistency, URL safety, localization, L-2 HOLD, or recovery gate fails.
