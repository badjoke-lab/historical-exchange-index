# Scan: verified-unadded rows 0052-0100

Status: corrected scan complete / growth batches 01-04 resolved

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The scan-integrity checker verifies candidate ID, name, slug, range, and disposition counts against the source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 14 |
| needs_research | 0 |
| pending_thin | 17 |
| out_of_scope_or_duplicate | 18 |

## Resolved in batch 01

- `0066` Aphelion -> `hei_ex_000527`
- `0087` AshSwap -> `hei_ex_000528`
- `0090`-`0093` Aster -> `hei_ex_000529`
- `0099` Astrovault -> `hei_ex_000530`
- `0095`-`0097` existing Astroport -> `hei_ex_000361`, strengthened without duplicate creation

## Resolved in batch 02

- `0053` Angstrom -> `hei_ex_000531`
- `0057` Anycoin Direct -> `hei_ex_000532`
- `0058` AOFEX -> `hei_ex_000533`
- `0062`-`0063` ApertureSwap -> `hei_ex_000534`
- `0085`-`0086` Ascent Exchange -> `hei_ex_000535`

## Resolved in batch 03

- `0056` Antfarm (Ethereum) -> `hei_ex_000536` Antfarm
- `0064` apex -> `hei_ex_000537` ApeX Protocol
- `0075`-`0076` Archly V1/V2 -> `hei_ex_000538` Archly
- `0071`-`0072` Arbitrum Exchange V2/V3 -> version rows under the Arbidex identity

## Resolved in batch 04

- `0070` Arbidex -> `hei_ex_000539` Arbidex
- `0077`-`0078` Arena DEX -> `hei_ex_000540` Arena DEX
- `0065` Apex DeFi -> `pending_thin` after completed research; official launch chronology and independent event evidence remain insufficient
- `0067` AquaSpace V3 -> `pending_thin` after completed research; protocol boundary and launch chronology remain insufficient

Arbidex is modeled conservatively as `limited` because its official application remains reachable while headline activity was zero during review. Arena DEX is modeled as an active exchange embedded in The Arena ecosystem rather than as a separate representation of the social platform or launch service.

## Pending thin

`0052`, `0055`, `0065`, `0067`, `0068`, `0069`, `0073`, `0074`, `0081`, `0082`, `0083`, `0084`, `0088`, `0089`, `0094`, `0098`, `0100`.

These rows remain non-canonical until stronger evidence appears. They are not an active research queue and must not be promoted from database presence alone.

## Out of scope / duplicate / version rows

- out of scope: `0054`, `0059`, `0060`, `0061`, `0079`, `0080`
- duplicate/version rows: `0063`, `0071`, `0072`, `0076`, `0078`, `0086`, `0091`, `0092`, `0093`, `0095`, `0096`, `0097`

## Completion state

The corrected `0052-0100` range has no unresolved `needs_research` rows. Future work should move to the next rebuilt candidate range rather than repeatedly revisiting these thin rows without new evidence.
