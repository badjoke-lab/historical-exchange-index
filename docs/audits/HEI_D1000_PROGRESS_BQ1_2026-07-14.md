# HEI D-1000 Progress Checkpoint — BQ1

Date: 2026-07-14  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BQ1 is the seventh reviewed growth batch during the L-2 initial HOLD period. It adds one reviewed exchange entity and strengthens three existing entities with current evidence without expanding localization scope.

## 2. Batch contents

```text
new entity:
  Hydrometer Finance hei_ex_000898 inactive

existing enrichments:
  HSuite DEX          hei_ex_000758 active
  Hummus              hei_ex_000766 active
  Hello DEX           hei_ex_000771 active
```

Helix Markets was excluded after a blocking domain overlap with the existing Helix entity exposed conflicting ecosystem metadata.

## 3. Projected reviewed state

```text
Entities: 780
Events:   1004
Evidence: 3313
```

Batch delta:

```text
Entities: +1
Events:   +0
Evidence: +8
```

Remaining to D-1000:

```text
220 reviewed entities
```

## 4. Status discipline

- Hydrometer Finance is inactive because the current registry explicitly flags a rug pull involving user funds and a down website. No terminal date is guessed.
- HSuite DEX remains active; current HbarSuite registry data adds substantial Hedera TVL and non-zero recent DEX volume to the existing first-party evidence.
- Hummus remains active; current Metis TVL and 24-hour, 7-day, and 30-day DEX volume strengthen the existing application evidence.
- Hello DEX remains active; its current exchange profile reports a recently updated spot pair and non-zero 24-hour volume while the trading endpoint remains live_unverified.

## 5. Backlog freshness and overlap finding

BQ1 identified these alternate-path or entity-first overlaps:

```text
Fluid DEX      -> hei_ex_000691
Holdstation    -> hei_ex_000725
Haven1 hSwap   -> hei_ex_000721
HbarSuite      -> hei_ex_000758 / HSuite DEX
Helix Markets  -> hei_ex_000697 domain overlap with Helix
Hummus Finance -> hei_ex_000766 / Hummus
Hello DEX      -> hei_ex_000771
```

The four duplicate draft records were removed. HSuite, Hummus, and Hello evidence was merged into their existing entities. Helix Markets evidence was not merged because the candidate's ICP classification conflicts with the existing Injective Helix identity despite the shared domain.

Drift was deferred because its incident and migration context requires a dedicated lifecycle reconstruction.

## 6. Safety boundaries

BQ1 changes reviewed exchange bundles and growth checkpoint documentation only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 7. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BP1:           COMPLETE
D-1000 BQ1:           validation pending
Language Selection:  blocked until later gate
```

## 8. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_D1000_PROGRESS_BP1_2026-07-13.md
docs/backlog/consumed/hei_unadded-bq1-five-exchanges.md
records/exchanges/hydrometer-finance.json
records/exchanges/hsuite-dex.json
records/exchanges/hummus-amm.json
records/exchanges/hello-dex-ethereum.json
```
