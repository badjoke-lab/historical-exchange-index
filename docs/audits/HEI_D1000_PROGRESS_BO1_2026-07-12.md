# HEI D-1000 Progress Checkpoint — BO1

Date: 2026-07-12  
Status: IN PROGRESS  
Project: Historical Exchange Index (HEI)

## 1. Current milestone

```text
D-1000 Reviewed Entity Milestone
```

BO1 is the fifth reviewed growth batch during the L-2 initial HOLD period. It adds four new entities, enriches the existing BMX Trade entity through entity-first consolidation, and includes one URL-safety repair.

## 2. Batch contents

New entities:

```text
AstroSwap      hei_ex_000887  limited
BCSwap         hei_ex_000888  limited
Beamex AMM     hei_ex_000889  limited
BLEX           hei_ex_000890  active
```

Existing entity enrichment:

```text
BMX Trade      hei_ex_000610  active
BMX Classic AMM -> alias/product evidence consolidated into BMX Trade
```

URL-safety repair:

```text
AutoShark      hei_ex_000541  dead / official URL unsafe
```

## 3. Projected reviewed state

```text
Entities: 774
Events:   1004
Evidence: 3295
```

Batch delta:

```text
Entities: +4
Events:   +0
Evidence: +16
```

Remaining to D-1000:

```text
226 reviewed entities
```

## 4. Status discipline

- BLEX is active from current Arbitrum TVL, fee generation, and perpetual-market history.
- AstroSwap, BCSwap, and Beamex AMM remain limited because identity or historical activity persists while strong recent exchange activity is insufficient.
- BMX Trade remains active from the reviewed first-party platform evidence. The BMX Classic AMM product surface is not counted as a separate entity; its Base and Mode aliases and cumulative-volume evidence are consolidated into BMX Trade.
- AutoShark remains dead because the first-party shutdown announcement is authoritative; residual metrics do not revive the entity.

## 5. URL safety finding

The former AutoShark official domain now serves unrelated gambling content.

BO1 marks the domain `unsafe` while preserving the historical original URL and archive wildcard. Public URL-safety rules must suppress it as a current safe destination.

## 6. Backlog freshness and overlap finding

The verified-unadded backlog contains extensive already-reviewed version, product, slug, and alias rows. BO1 overlap runs rejected or consolidated the following proposed additions:

```text
AuraSwap
BarterSwap Superposition
Basin Exchange
Beam Swap
Baseline (Base)
Blitz AMM
BMX Classic AMM
```

BMX Classic AMM resolves to the existing BMX Trade identity through the shared `bmx.trade` domain and Morphex/BMX branding. Its research is retained as an enrichment of `hei_ex_000610`, not discarded and not counted as a new entity.

This confirms that current-main canonical, alias, and domain checks must override the generated backlog's historical `hei_existing_check` field.

## 7. Safety boundaries

BO1 changes reviewed exchange bundles, one existing entity enrichment, and one URL-safety classification only.

It does not change:

```text
Cloudflare configuration
localization route scope
L-2 HOLD decision
third-language authorization
canonical schema
public machine-readable safety rules
```

## 8. Current execution state

```text
L-2 initial decision: HOLD
D-1000 growth:        CURRENT
D-1000 BK1:           COMPLETE
D-1000 BL1:           COMPLETE
D-1000 BM1:           COMPLETE
D-1000 BN1:           COMPLETE
D-1000 BO1:           validation pending
Language Selection:  blocked until later gate
```

## 9. Authority references

```text
docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md
docs/HEI_L2_LOCALIZATION_EVALUATION_PLAN.md
docs/audits/HEI_L2_INITIAL_HOLD_CHECKPOINT_2026-07-11.md
docs/audits/HEI_D1000_PROGRESS_BN1_2026-07-12.md
docs/backlog/consumed/hei_unadded-bo1-five-exchanges.md
records/exchanges/astroswap.json
records/exchanges/bcswap.json
records/exchanges/beamex-amm.json
records/exchanges/blex.json
records/exchanges/bmx-trade.json
records/exchanges/autoshark.json
```
