# Range 0251-0300 research cluster 03

Reviewed at: 2026-07-04

## Rows

- `0251` Blocktane
- `0255` Blue Planet
- `0260` BMEX
- `0261` BMX Classic AMM

## Results

- Blocktane -> moved to `pending_thin`; no canonical record.
- Blue Planet -> added as `hei_ex_000605`, `active`.
- BMEX -> moved to `pending_thin`; no canonical record.
- BMX Classic AMM -> product/protocol surface under BMX by Morphex; no standalone canonical record. Keep for parent-protocol identity review.

## Blocktane decision

The verified-unadded row originates from a CoinPaprika exchange listing, but this review did not recover enough independent or first-party evidence to establish a reliable operator, official domain, launch marker, or lifecycle. The row remains non-canonical.

## Blue Planet decision

DefiLlama classifies Blue Planet as an AMM DEX on BSC and reports non-zero TVL and recent DEX volume. The associated first-party Planet Finance application remains reachable. HEI therefore promotes Blue Planet as an active DEX, while leaving launch_date null because no reliable launch marker was recovered.

## BMEX decision

The candidate name is ambiguous and the recovered material is insufficient to distinguish a defensible exchange identity from similarly named platforms and products. No reliable operator, official domain, or lifecycle source set was recovered. The row remains non-canonical.

## BMX Classic AMM decision

DefiLlama describes BMX Classic AMM as an AMM surface of BMX by Morphex and points to the BMX trading application. HEI should not create a standalone entity from this product-specific row before reviewing the parent BMX protocol identity and its relationship to Morphex.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 2
- moved to pending_thin: 2
- deferred to parent identity review: 1

No Cloudflare or deployment changes are included.
