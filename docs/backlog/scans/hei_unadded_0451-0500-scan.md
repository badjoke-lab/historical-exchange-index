# HEI Unadded Candidate Scan — 0451-0500

Status: reviewed scan checkpoint  
Milestone: D-750 Reviewed Entity Milestone  
Source: `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl`  
Machine-readable companion: `docs/backlog/scans/hei_unadded_0451-0500-scan.json`

## Summary

The 50-row candidate range was reviewed as a cohort rather than processed one row at a time.

Classification result:

```text
add_now:                    12
needs_research:              7
pending_thin:               15
out_of_scope_or_duplicate:  16
--------------------------------
total:                      50
```

The range contains a large deployment/version/duplicate cluster. HEI entity-first rules materially reduce the apparent 50-row list before record drafting.

## Add-now queue

The first D-750 drafting queue from this scan is:

```text
0456 Crodex
0458 Cronaswap
0459 Cropper CLMM
0461 CrossTower
0465 Cryptal
0476 Cryptomus
0478 Cryptonex
0484 CSWAP DEX
0485 Cube
0487 CUBISwap
0488 Currency.com
0489 CurrentX V2/V3 entity
```

`add_now` means the candidate is suitable for immediate record-quality research and drafting. It does not mean aggregator data may be copied into canonical data without review.

Drafting order should prefer candidates with the clearest official identity and current-state evidence first:

```text
Cryptal
Cryptomus
Cube
CrossTower
Currency.com
Cryptonex
Crodex
Cronaswap
Cropper CLMM
CSWAP DEX
CUBISwap
CurrentX
```

The exact order may change if primary-source accessibility is poor.

## Duplicate and entity-consolidation findings

### Crodex

```text
0456 Crodex
0457 Crodex
```

One entity only. The two discovery rows must not create two HEI entities.

### Crypto.com Exchange

```text
0472 cryptocom
```

Already represented by reviewed entity:

```text
hei_ex_000020
Crypto.com Exchange
```

No new entity is created.

### Cube

```text
0485 Cube
0486 Cube
```

Treat CEX/DEX discovery representations as one Cube trading-platform entity unless reviewed lineage evidence later proves separate canonical products requiring separate HEI identities.

### CurrentX

```text
0489 CurrentX V2
0490 CurrentX V3
```

One entity. Version history belongs in events/notes if historically meaningful; version rows do not inflate entity count.

### Curve cluster

Rows 0491-0499 are deployment, product, alias, or exact-name representations of the existing reviewed Curve Finance entity:

```text
hei_ex_000511
Curve Finance
```

HEI v0 remains entity-first and does not split Curve by chain, AMM product, or deployment.

Row 0500 `Curve LlamaLend` is a lending product and is not a new exchange entity for the current HEI scope.

## Needs-research queue

```text
0453 CrescentSwap
0454 CriptoHub
0460 CROSS
0463 CRXzone
0473 Cryptohub
0481 CryptoSwap
0483 Crypxie
```

These may become valid HEI records, but current candidate metadata is not enough to safely decide identity, lifecycle, or terminal status.

Research priorities:

- distinguish exchange identity from generic service/product names;
- confirm official domain history;
- confirm launch period;
- establish current active/inactive/dead state;
- prefer official, regulatory, archive, or strong independent reporting;
- avoid forcing `dead` when terminal evidence is weak.

## Pending-thin queue

The following rows remain thin and are not promoted to immediate drafting:

```text
0451 CredoEx
0452 CreekEx
0455 Criptoswaps
0462 CroSwap
0464 Crypcore
0466 Cryptex24
0467 CryptloCEX
0468 Crypto Hub
0469 Crypto-Services
0470 Cryptoa
0471 Cryptobulls
0477 Crypton Exchange
0479 CryptoNick
0480 Cryptoplanex
0482 CryptoxxPro Exchange
```

These are held because an aggregator listing or single weak discovery row is not enough to justify a reviewed HEI entity.

## Scope exclusions in this range

### CRYPTOINDEX

Product identity is ambiguous and does not yet justify a distinct exchange entity.

### Cryptomate

Broker-style buy/sell service. It is not prioritized for the current exchange-venue growth milestone.

### Curve LlamaLend

Lending product under the broader Curve ecosystem, not a separate exchange entity for HEI entity counting.

## D-750 implications

This scan does not change reviewed public counts.

```text
Reviewed entities before scan: 550
Reviewed entities after scan:  550
D-750 remaining:                200
```

The scan creates a 12-candidate immediate drafting queue. Only reviewed merged records count toward D-750.

Recommended next execution:

```text
Batch D750-A
  research and draft the strongest 5-8 add_now candidates

Batch D750-B
  process the remaining add_now candidates

Research queue
  revisit the 7 needs_research candidates separately
```

The milestone remains governed by `docs/HEI_DATA_GROWTH_MILESTONES_SPEC.md`.
