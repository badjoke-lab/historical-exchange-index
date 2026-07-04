# Range 0251-0300 research cluster 04

Reviewed at: 2026-07-04

## Rows

- `0269` bopAMM
- `0271` Brexily
- `0272` BrownFi
- `0279` BTCEX

## Results

- bopAMM -> product/subprotocol surface under Bebop; no standalone canonical record. Keep for parent Bebop identity review.
- Brexily -> moved to `pending_thin`; no canonical record.
- BrownFi -> added as `hei_ex_000606`, `active`.
- BTCEX -> moved to `pending_thin`; no canonical record.

## bopAMM decision

The verified-unadded row originates from the DefiLlama DEX feed. DefiLlama links bopAMM to parent protocol Bebop. HEI should not create a standalone entity from this product/subprotocol row before reviewing the parent Bebop identity and whether bopAMM should be represented as product detail, an event, or evidence under that parent.

## Brexily decision

The candidate is present in the CoinPaprika exchange feed, but this review did not recover a reliable operator identity, official domain, launch marker, or lifecycle evidence set. The row remains non-canonical.

## BrownFi decision

DefiLlama classifies BrownFi as a DEX, describes its AMM design, lists deployments across multiple chains, and reports non-zero recent DEX volume. The first-party BrownFi website remains reachable and links to the application. HEI therefore promotes BrownFi as an active DEX, while leaving launch_date null because no reliable launch marker was recovered.

## BTCEX decision

The candidate name is ambiguous and the review did not recover enough reliable material to establish a unique exchange operator, official domain, and lifecycle. Search results mix similarly named services and do not provide a defensible source set. The row remains non-canonical.

## Batch output

- new entities: 1
- new events: 0
- new evidence: 2
- moved to pending_thin: 2
- deferred to parent identity review: 1

No Cloudflare or deployment changes are included.
