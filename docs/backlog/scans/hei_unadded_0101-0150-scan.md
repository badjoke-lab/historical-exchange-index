# Scan: verified-unadded rows 0101-0150

Status: corrected scan / growth batches 01-03 resolved

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0101-0150-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The integrity checker verifies candidate ID, name, slug, range, and disposition counts against the source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 10 |
| needs_research | 15 |
| pending_thin | 5 |
| out_of_scope_or_duplicate | 20 |

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

ATOMARS is modeled as `dead / scam_rug` after the May 2021 wallet-access and withdrawal failure. Azbit remains active based on first-party 2026 product and listing updates. B2BX is `inactive`, not dead, because its site and license ceased normal operation but no definitive shutdown announcement was recovered.

## Existing canonical and version rows

- `0129`-`0132` Balancer deployments and versions -> existing `hei_ex_000228`
- `0134` Bancor V3 -> existing `hei_ex_000358`
- `0123` BabyDoge Algebra -> BabyDogeSwap product/version row
- `0110`, `0112`, `0119`, `0125`, `0127`, `0143` -> duplicate rows paired with the primary identity in this range

## Out of scope

- `0104` Atmos Studio: launchpad rather than exchange
- `0115` Ave.ai: trading application and aggregator
- `0117` Axiom: trading application
- `0121` b402: payments protocol
- `0122` B4U Wallet: wallet product
- `0133` Banana Gun: trading bot interface
- `0138` Based Predict: prediction-market interface

## Needs research

`0101`, `0102`, `0103`, `0108`, `0109`, `0137`, `0139`, `0140`, `0141`, `0142`, `0144`, `0145`, `0148`, `0149`, `0150`.

These rows require stronger launch, status, or event evidence before promotion.

## Pending thin

`0106`, `0113`, `0135`, `0146`, `0147`.

These rows remain non-canonical until stronger evidence appears.

## Next action

Research the 15 remaining candidates in small batches.
