# Scan: verified-unadded rows 0052-0100

Status: corrected scan / machine-bound

## Integrity correction

The previous version of this scan referenced candidate IDs whose names no longer matched the current verified-unadded JSONL. This revision is rebuilt from the current source rows and is paired with a machine-readable manifest:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.json`
- source blob: `0b0f758137396cc0a21a4eb2c122b71c01b0b3c6`
- source generated_at: `2026-06-11T22:46:19.477Z`

The scan-integrity checker now verifies every candidate ID, name, slug, range, and disposition count against the current JSONL before merge.

## Policy

- Treat the verified-unadded list as a candidate pool, not a strict one-row-at-a-time queue.
- Do not promote database-only active rows without meaningful event and evidence coverage.
- Collapse duplicate registry rows and version/deployment rows into one protocol-level entity in v0.
- Promote only candidates that later satisfy the public-quality record minimum.

## Classification summary

| class | count |
|---|---:|
| add_now | 0 |
| needs_research | 18 |
| pending_thin | 15 |
| out_of_scope_or_duplicate | 16 |

## Needs research

| candidate_id | name | reason |
|---|---|---|
| `hei_unadded_0053` | Angstrom | Ethereum DEX candidate; requires official identity, launch, and current-status evidence. |
| `hei_unadded_0056` | Antfarm (Ethereum) | Application domain is present; requires entity-boundary, launch, and status research. |
| `hei_unadded_0057` | Anycoin Direct | Exchange/broker-like candidate; requires scope decision and strong official/independent evidence. |
| `hei_unadded_0058` | AOFEX | Historical CEX candidate; requires identity, operating history, and terminal-status research. |
| `hei_unadded_0062` | ApertureSwap | DEX candidate; two source rows indicate one likely entity requiring official/history research. |
| `hei_unadded_0064` | apex | CCXT identifier is ambiguous; requires identity disambiguation before any record. |
| `hei_unadded_0065` | Apex DeFi | DEX candidate requiring disambiguation from other Apex-branded venues and event evidence. |
| `hei_unadded_0066` | Aphelion | Potential historical exchange candidate; requires primary or archived operating evidence. |
| `hei_unadded_0067` | AquaSpace V3 | Domain exists, but entity boundary and exchange-vs-launchpad scope require research. |
| `hei_unadded_0070` | Arbidex | Domain exists; requires official launch, status, and historical-event evidence. |
| `hei_unadded_0071` | Arbitrum Exchange V2 | Versioned DEX candidate; research one protocol-level entity rather than separate version records. |
| `hei_unadded_0075` | Archly V1 | Versioned DEX candidate; requires protocol identity and history research. |
| `hei_unadded_0077` | Arena DEX | Domain and two independent registry rows exist; requires launch/status/event evidence. |
| `hei_unadded_0085` | Ascent Exchange V1 | Versioned DEX candidate; requires protocol identity and historical evidence. |
| `hei_unadded_0087` | Ashswap | MultiversX DEX candidate; requires official launch, status, and event evidence. |
| `hei_unadded_0090` | aster | CCXT row belongs to an Aster identity group; requires entity-boundary and launch research. |
| `hei_unadded_0095` | Astroport (Classic) | Astroport identity group has Terra/version history; research one protocol-level entity. |
| `hei_unadded_0099` | Astrovault | Domain exists; requires official launch, status, and event evidence. |

## Pending thin

| candidate_id | name | reason |
|---|---|---|
| `hei_unadded_0052` | Amsterdex | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0055` | AnonEx | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0068` | Aquifer | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0069` | AraguaneyBits | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0073` | Arch Swap | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0074` | Archer Exchange | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0081` | ArowEx | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0082` | ArtexSwap | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0083` | ArthBit | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0084` | Artis Turba | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0088` | Asia Exchange | CoinPaprika row only; generic name and no domain require identity evidence. |
| `hei_unadded_0089` | Asset Chain Swap | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0094` | Astrolescent | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0098` | AstroSwap | DefiLlama DEX row only; no domain or meaningful event is present in the verified source row. |
| `hei_unadded_0100` | Asymetrex | CoinPaprika row only; no domain or meaningful event is present in the verified source row. |

## Out of scope / duplicate / version row

| candidate_id | name | reason |
|---|---|---|
| `hei_unadded_0054` | Anome | Source category is NFT Marketplace, outside HEI v0 exchange scope. |
| `hei_unadded_0059` | Ape Church | Source category is Luck Games, outside HEI v0 exchange scope. |
| `hei_unadded_0060` | Ape Jupiter | Source category is Launchpad, outside HEI v0 exchange scope. |
| `hei_unadded_0061` | Ape.Store | Source category is Launchpad, outside HEI v0 exchange scope. |
| `hei_unadded_0063` | ApertureSwap | Duplicate source row for hei_unadded_0062; do not create a second entity. |
| `hei_unadded_0072` | Arbitrum Exchange V3 | Version/deployment duplicate of hei_unadded_0071 pending protocol-level identity research. |
| `hei_unadded_0076` | Archly V2 | Version/deployment duplicate of hei_unadded_0075 pending protocol-level identity research. |
| `hei_unadded_0078` | Arena DEX | Duplicate source row for hei_unadded_0077; do not create a second entity. |
| `hei_unadded_0079` | Arena Launch | Source category is Launchpad, outside HEI v0 exchange scope. |
| `hei_unadded_0080` | Arena SocialFi | Source category is SoFi, outside HEI v0 exchange scope. |
| `hei_unadded_0086` | Ascent Exchange V3 | Version/deployment duplicate of hei_unadded_0085 pending protocol-level identity research. |
| `hei_unadded_0091` | Aster | Likely same Aster entity as hei_unadded_0090; retain as a source row, not a separate entity. |
| `hei_unadded_0092` | Aster DEX | Likely same Aster entity as hei_unadded_0090; retain as a source row, not a separate entity. |
| `hei_unadded_0093` | Aster Spot | Likely same Aster entity as hei_unadded_0090; retain as a source row, not a separate entity. |
| `hei_unadded_0096` | Astroport (Terra 2.0) | Deployment/version row within the Astroport identity group; not a separate v0 entity. |
| `hei_unadded_0097` | Astroport (Terra) | Deployment/version row within the Astroport identity group; not a separate v0 entity. |

## Next record-growth action

Research only the `needs_research` set, then select roughly five candidates that have:

- a clear entity boundary,
- at least one meaningful launch, incident, migration, shutdown, or regulatory event,
- at least two evidence records including an official or archived primary source,
- no projected-public overlap.

First research cluster: AOFEX, Aphelion, Arena DEX, Astroport, and Astrovault. This is a research order, not approval for canonical promotion.
