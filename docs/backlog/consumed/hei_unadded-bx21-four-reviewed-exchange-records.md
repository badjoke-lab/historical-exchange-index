# HEI reviewed backlog consumption — D-1000 BX21

Date: 2026-07-22  
State: consumed by reviewed BX21 branch

## Starting checkpoint

BX21 starts from merged BX20 `main` commit `9880d98a9076cdebc6661c4ae6423c1099cd6ed7`.

```text
Entities: 877
Events:   1004
Evidence: 3513
English dossiers:  877
Japanese dossiers: 877
Next entity ID:     hei_ex_000998
Next evidence ID:   hei_src_012210
```

## Reviewed additions

```text
Ambient        hei_ex_000998 active
Nabla Finance hei_ex_000999 active
BarterSwap     hei_ex_001000 active
Beam Swap      hei_ex_001001 active
```

## Candidate sources

```text
docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl
  Ambient
  BarterSwap Superposition
  Beam Swap

current external discovery review
  Nabla Finance
```

## Duplicate controls

The BX21 screening pass rejected or consolidated the following candidates after direct canonical inspection:

```text
Angstrom       -> hei_ex_000531
Clober          -> hei_ex_000639
Amped Finance   -> hei_ex_000877
Basin           -> hei_ex_000557
Backpack        -> hei_ex_000068
Baseline        -> hei_ex_000556
Antfarm         -> hei_ex_000536
BabyDogeSwap    -> hei_ex_000543
BaseX           -> hei_ex_000561
Bean Exchange   -> hei_ex_000559
Biconomy        -> hei_ex_000094
Bilaxy          -> hei_ex_000568
Beethoven X     -> Beets hei_ex_000371
BetterSwap      -> hei_ex_000576
BurrBear        -> hei_ex_000608
Bulla Exchange  -> hei_ex_000412
BrownFi         -> hei_ex_000606
Beralis V3      -> deprecated / insufficient active evidence
```

Direct canonical path, alias, domain, and product-lineage review found no existing entity for Ambient, Nabla Finance, BarterSwap, or Beam Swap.

## Entity-first boundaries

- Ambient consolidates the former CrocSwap identity, single-contract DEX architecture, and current multichain deployments.
- Nabla Finance consolidates the Nabla AMM, yield products, agent-facing liquidity, and all current deployments.
- BarterSwap consolidates intent matching, direct DEX execution, aggregation, and the Superposition-labelled discovery representation.
- Beam Swap is the Beam-chain DEX at `swap.onbeam.com` and remains distinct from Moonbeam Beamswap `hei_ex_000370` at `app.beamswap.io`.

## Projected reviewed delta

```text
Entities: +4
Events:   +0
Evidence: +8
```

Projected state:

```text
Entities: 881
Events:   1004
Evidence: 3521
English dossiers:  881
Japanese dossiers: 881
Sitemap routes:     1810
Remaining to D-1000: 119
```
