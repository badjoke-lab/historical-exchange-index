# Scan: verified-unadded rows 0052-0100

Status: corrected scan / growth batches 01-02 resolved

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The scan-integrity checker verifies candidate ID, name, slug, range, and disposition counts against the source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 9 |
| needs_research | 8 |
| pending_thin | 15 |
| out_of_scope_or_duplicate | 17 |

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

Batch 02 preserves the acquisition and migration history of Anycoin Direct, the terminal access disruption of AOFEX, and the EON chain-deprecation impact on Ascent Exchange. Duplicate registry and version rows remain collapsed into protocol-level entities.

## Needs research

| candidate_id | name | reason |
|---|---|---|
| `hei_unadded_0056` | Antfarm (Ethereum) | Requires stronger launch and current-status evidence. |
| `hei_unadded_0064` | apex | Ambiguous CCXT identifier; requires identity disambiguation. |
| `hei_unadded_0065` | Apex DeFi | Requires disambiguation and event evidence. |
| `hei_unadded_0067` | AquaSpace V3 | Requires exchange-vs-launchpad scope and identity research. |
| `hei_unadded_0070` | Arbidex | Requires official launch, status, and historical-event evidence. |
| `hei_unadded_0071` | Arbitrum Exchange V2 | Research one protocol-level entity rather than separate versions. |
| `hei_unadded_0075` | Archly V1 | Requires protocol identity and history research. |
| `hei_unadded_0077` | Arena DEX | Requires launch, status, and meaningful event evidence. |

## Pending thin

`0052`, `0055`, `0068`, `0069`, `0073`, `0074`, `0081`, `0082`, `0083`, `0084`, `0088`, `0089`, `0094`, `0098`, `0100`.

## Out of scope / duplicate / version rows

- out of scope: `0054`, `0059`, `0060`, `0061`, `0079`, `0080`
- duplicate/version rows: `0063`, `0072`, `0076`, `0078`, `0086`, `0091`, `0092`, `0093`, `0095`, `0096`, `0097`

## Next action

Research the remaining eight candidates. Promote only records with a clear entity boundary, meaningful historical events, at least two evidence records, and no projected-public overlap.
