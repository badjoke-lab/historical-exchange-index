# Scan: verified-unadded rows 0052-0100

Status: corrected scan / growth batches 01-03 resolved

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The scan-integrity checker verifies candidate ID, name, slug, range, and disposition counts against the source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 12 |
| needs_research | 4 |
| pending_thin | 15 |
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
- `0071`-`0072` Arbitrum Exchange V2/V3 -> duplicate/version rows under the Arbidex identity; no separate entity created

Batch 03 keeps ApeX beta, ApeX Pro, ApeX Omni, and the ApeX Pro sunset within one continuing protocol identity. Archly V1 and V2 are likewise retained as versions of one cross-chain DEX.

## Needs research

| candidate_id | name | reason |
|---|---|---|
| `hei_unadded_0065` | Apex DeFi | Identity is clear, but a sufficiently strong launch or historical-event date is still missing. |
| `hei_unadded_0067` | AquaSpace V3 | Current identity is visible, but exchange-vs-launchpad scope and launch chronology remain insufficient. |
| `hei_unadded_0070` | Arbidex | Official identity is established; a strong exact launch or major-event record is still required. |
| `hei_unadded_0077` | Arena DEX | Current venue is visible, but launch chronology and meaningful event evidence remain insufficient. |

## Pending thin

`0052`, `0055`, `0068`, `0069`, `0073`, `0074`, `0081`, `0082`, `0083`, `0084`, `0088`, `0089`, `0094`, `0098`, `0100`.

## Out of scope / duplicate / version rows

- out of scope: `0054`, `0059`, `0060`, `0061`, `0079`, `0080`
- duplicate/version rows: `0063`, `0071`, `0072`, `0076`, `0078`, `0086`, `0091`, `0092`, `0093`, `0095`, `0096`, `0097`

## Next action

Resolve the final four research candidates. Promote only records with a clear entity boundary, meaningful historical events, at least two evidence records, and no projected-public overlap.
