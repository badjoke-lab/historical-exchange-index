# Scan: verified-unadded rows 0101-0150

Status: corrected scan complete / growth batches 01-06 resolved

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0101-0150-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The integrity checker verifies candidate ID, name, slug, range, and disposition counts against the source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 22 |
| needs_research | 0 |
| pending_thin | 7 |
| out_of_scope_or_duplicate | 21 |

## Resolved in growth batch 01

- `0111`-`0112` AutoShark / AutoShark Finance -> `hei_ex_000541` AutoShark
- `0116` Axial -> `hei_ex_000542` Axial
- `0124`-`0125` BabyDogeSwap -> `hei_ex_000543` BabyDogeSwap
- `0128` backpack -> existing `hei_ex_000068` Backpack Exchange strengthened without duplicate creation

## Resolved in growth batch 02

- `0107` Auragi Finance -> `hei_ex_000546`
- `0114` AUX Exchange -> `hei_ex_000545`
- `0126`-`0127` BabySwap -> `hei_ex_000547`
- `0136` Bankera -> `hei_ex_000544` Bankera Exchange

## Resolved in growth batch 03

- `0105` ATOMARS -> `hei_ex_000548`
- `0118`-`0119` Azbit -> `hei_ex_000549`
- `0120` B2BX -> `hei_ex_000550`

## Resolved in growth batch 04

- `0101` ATAIX -> `hei_ex_000551`
- `0102` Atlantis (Monad) -> `hei_ex_000552`
- `0103` Atmos DEX -> `hei_ex_000553`
- `0108` AuraSwap -> `hei_ex_000554` AuraSwap on Polygon
- `0109`-`0110` AuroraSwap -> `hei_ex_000555`

## Resolved in growth batch 05

- `0139` Baseline (Base) -> `hei_ex_000556` Baseline
- `0141` Basin Exchange -> `hei_ex_000557` Basin
- `0148` Beam Swap -> `hei_ex_000558` Beam Network Swap
- `0150` Bean Exchange -> `hei_ex_000559`

## Resolved in growth batch 06

- `0137` BarterSwap Superposition -> `hei_ex_000560` Barter
- `0140` BaseX -> `hei_ex_000561`
- `0142`-`0143` Batonex / Batonex Derivative Exchange -> `hei_ex_000562` Batonex
- `0149` Beamex AMM -> existing `hei_ex_000370` Beamswap, strengthened with the Beamex public-launch event
- `0144` BCEX -> `pending_thin`
- `0145` BCoin.sg -> `pending_thin`

BarterSwap Superposition is modeled under the current Barter protocol identity. The basex.fi BaseX protocol is separated from unrelated BaseX and BSX projects. Wisebitcoin and Batonex remain one continuing exchange entity. Beamex is a Beamswap-developed perpetual product and does not receive a separate entity. BCEX and BCoin.sg remain non-canonical because their current or terminal state cannot be supported to the public-quality threshold.

## Existing canonical and version rows

- `0129`-`0132` Balancer deployments and versions -> existing `hei_ex_000228`
- `0134` Bancor V3 -> existing `hei_ex_000358`
- `0123` BabyDoge Algebra -> BabyDogeSwap product/version row
- `0110`, `0112`, `0119`, `0125`, `0127`, `0143`, `0149` -> duplicate or product rows represented by their primary canonical identity

## Out of scope

- `0104` Atmos Studio: launchpad rather than exchange
- `0115` Ave.ai: trading application and aggregator
- `0117` Axiom: trading application
- `0121` b402: payments protocol
- `0122` B4U Wallet: wallet product
- `0133` Banana Gun: trading bot interface
- `0138` Based Predict: prediction-market interface

## Pending thin

`0106`, `0113`, `0135`, `0144`, `0145`, `0146`, `0147`.

These rows remain non-canonical until stronger evidence appears. They are not an active research queue and must not be promoted from database presence alone.

## Completion state

The corrected `0101-0150` range has no unresolved `needs_research` rows. Future growth work should move to the rebuilt `0151-0200` range.
