# D-1000 Batch BQ1 — Entity-First Review and Enrichment

Reviewed at: 2026-07-14

## Results

- `0972` Hydrometer Finance -> new `hei_ex_000898`, inactive DEX
- `0913` HbarSuite -> existing `hei_ex_000758` HSuite DEX, current metrics enrichment
- `0956` Hummus AMM -> existing `hei_ex_000766` Hummus, current metrics enrichment
- `0920` Hello DEX (Ethereum) -> existing `hei_ex_000771`, current market enrichment
- `0918` Helix Markets -> rejected as a new entity because `helixapp.com` overlaps existing `hei_ex_000697` Helix while the candidate ecosystem metadata conflicts

## Status decisions

- Hydrometer Finance is `inactive` because the current protocol registry explicitly flags a rug pull involving user funds and states that the website is down. No dated terminal event is inferred.
- HSuite DEX remains `active`; current registry data adds substantial Hedera TVL and recent DEX volume to the existing first-party evidence.
- Hummus remains `active`; current Metis TVL and recent DEX volume strengthen the existing application evidence.
- Hello DEX remains `active`; the current profile reports a recently updated Ethereum spot pair and non-zero 24-hour volume.
- Helix Markets is not added or merged because the candidate registry's ICP classification conflicts with the existing Injective Helix identity despite the same official domain.

## Stale-overlap findings

The following candidate rows were rejected or consolidated after current-main alternate-slug and entity-first checks:

```text
Fluid DEX      -> existing hei_ex_000691
Holdstation    -> existing hei_ex_000725
Haven1 hSwap   -> existing hei_ex_000721
HbarSuite      -> existing hei_ex_000758 / HSuite DEX
Helix Markets  -> domain overlap with hei_ex_000697 / Helix
Hummus Finance -> existing hei_ex_000766 / Hummus
Hello DEX      -> existing hei_ex_000771
```

Drift was deferred for a later incident and migration reconstruction rather than being added through a simplified current-state record.

## Evidence decisions

### Hydrometer Finance

The registry explicitly reports a rug pull and down website. Inactive status records the terminal condition without inventing a date.

### HSuite DEX / HbarSuite

The current HbarSuite registry profile and first-party domain were attached to the existing HSuite DEX entity, adding current TVL and volume evidence without creating a duplicate.

### Hummus

Current protocol metrics and the first-party Hummus domain were added to the existing Hummus entity.

### Hello DEX

The current CoinGecko exchange profile and market status were added to the existing Hello DEX entity.

### Helix Markets

The candidate was excluded because its registry metadata conflicts with the existing canonical Helix record. No contradictory evidence was attached.

## Batch output

- new entities: 1
- enriched existing entities: 3
- rejected conflicting candidate: 1
- new events: 0
- new evidence: 8
- projected entity count: 780
- projected event count: 1004
- projected evidence count: 3313
- projected remaining to D-1000: 220

## Operating mode

BQ1 is the seventh D-1000 growth batch during the L-2 initial HOLD period. It applies entity-first consolidation and adds reviewed canonical data only. No localization breadth, third-language authorization, Cloudflare configuration, or canonical schema changes are included.
