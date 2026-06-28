# Scan: verified-unadded rows 0052-0100

Status: corrected scan / first growth batch resolved

## Integrity binding

This scan is paired with:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The scan-integrity checker verifies candidate ID, name, slug, range, and disposition counts against the source JSONL.

## Classification summary

| class | count |
|---|---:|
| add_now | 4 |
| needs_research | 13 |
| pending_thin | 15 |
| out_of_scope_or_duplicate | 17 |

## Promoted in batch 01

| candidate_id | canonical result | action |
|---|---|---|
| `hei_unadded_0066` | Aphelion (`hei_ex_000527`) | Added as `dead / voluntary_shutdown` with launch, trading-halt, reopening, and closure history. |
| `hei_unadded_0087` | AshSwap (`hei_ex_000528`) | Added as an active MultiversX DEX with mainnet launch and aggregator expansion evidence. |
| `hei_unadded_0090` | Aster (`hei_ex_000529`) | Added as one protocol-level entity; related Aster Spot / Aster DEX rows remain duplicate source rows. |
| `hei_unadded_0099` | Astrovault (`hei_ex_000530`) | Added as an active Archway DEX with a conservative month-level launch date and protocol-upgrade history. |

## Existing canonical entity strengthened

| candidate rows | canonical result | action |
|---|---|---|
| `hei_unadded_0095`–`0097` | Astroport (`hei_ex_000361`) | No duplicate entity added. Corrected full-launch date, raised confidence, and added Terra 2.0 migration and Sei expansion evidence. |

## Needs research

| candidate_id | name | reason |
|---|---|---|
| `hei_unadded_0053` | Angstrom | Requires official identity, launch, and current-status evidence. |
| `hei_unadded_0056` | Antfarm (Ethereum) | Requires entity-boundary, launch, and status research. |
| `hei_unadded_0057` | Anycoin Direct | Requires broker/exchange scope decision and strong evidence. |
| `hei_unadded_0058` | AOFEX | Requires identity, operating history, and terminal-status research. |
| `hei_unadded_0062` | ApertureSwap | Two source rows indicate one likely entity requiring official/history research. |
| `hei_unadded_0064` | apex | Ambiguous CCXT identifier; requires identity disambiguation. |
| `hei_unadded_0065` | Apex DeFi | Requires disambiguation and event evidence. |
| `hei_unadded_0067` | AquaSpace V3 | Requires exchange-vs-launchpad scope and identity research. |
| `hei_unadded_0070` | Arbidex | Requires official launch, status, and historical-event evidence. |
| `hei_unadded_0071` | Arbitrum Exchange V2 | Research one protocol-level entity rather than separate versions. |
| `hei_unadded_0075` | Archly V1 | Requires protocol identity and history research. |
| `hei_unadded_0077` | Arena DEX | Requires launch, status, and meaningful event evidence. |
| `hei_unadded_0085` | Ascent Exchange V1 | Requires protocol identity and historical evidence. |

## Pending thin

The following remain unconsumed because the current source row is database-only, lacks a clear domain, or has no meaningful event:

`0052`, `0055`, `0068`, `0069`, `0073`, `0074`, `0081`, `0082`, `0083`, `0084`, `0088`, `0089`, `0094`, `0098`, `0100`.

## Out of scope / duplicate / version rows

The following are excluded from separate v0 entity creation:

- out of scope: `0054`, `0059`, `0060`, `0061`, `0079`, `0080`
- duplicate/version rows: `0063`, `0072`, `0076`, `0078`, `0086`, `0091`, `0092`, `0093`, `0095`, `0096`, `0097`

## Next action

Continue with the remaining `needs_research` group. The next batch should again target approximately five candidates with a clear entity boundary, meaningful historical events, at least two evidence records, and no projected-public overlap.
