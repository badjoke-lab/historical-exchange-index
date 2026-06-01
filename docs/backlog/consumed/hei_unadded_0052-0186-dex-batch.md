# Consumed backlog rows: DEX/protocol batch

Status: added

## Purpose

Batch-consume verified-unadded rows for five event-backed or protocol-level DEX records under the revised HEI record-addition policy.

This batch avoids creating thin one-row active records. Version/deployment duplicate rows are collapsed into one entity where appropriate.

## Added records

| entity_id | record | path | consumed rows |
|---|---|---|---|
| `hei_ex_000357` | Balancer | `records/exchanges/balancer.json` | `hei_unadded_0175`-`hei_unadded_0181` |
| `hei_ex_000358` | Bancor | `records/exchanges/bancor.json` | `hei_unadded_0182`-`hei_unadded_0186` |
| `hei_ex_000359` | Algofi Swap | `records/exchanges/algofi-swap.json` | `hei_unadded_0054` |
| `hei_ex_000360` | ALEX | `records/exchanges/alex.json` | `hei_unadded_0052`, `hei_unadded_0053` |
| `hei_ex_000361` | Astroport | `records/exchanges/astroport.json` | `hei_unadded_0137`-`hei_unadded_0141` |

## Source confirmation

Rows were checked in `docs/backlog/verified-unadded-candidates-v1/unadded-candidates-verified-v1.jsonl` and scan memos before creation:

- `docs/backlog/scans/hei_unadded_0052-0100-scan.md`
- `docs/backlog/scans/hei_unadded_0101-0150-scan.md`
- `docs/backlog/scans/hei_unadded_0151-0200-scan.md`

## Duplicate handling

### Balancer

Consumed rows:

- `hei_unadded_0175` Balancer (Polygon)
- `hei_unadded_0176` Balancer V1
- `hei_unadded_0177` Balancer V2
- `hei_unadded_0178` Balancer V2 (Arbitrum One)
- `hei_unadded_0179` Balancer V2 (Avalanche)
- `hei_unadded_0180` Balancer V3
- `hei_unadded_0181` Balancer V3 (Plasma)

Decision: create one `Balancer` protocol-level DEX record. Do not create separate version/deployment records for v0.

### Bancor

Consumed rows:

- `hei_unadded_0182` Bancor (V2)
- `hei_unadded_0183` Bancor (V3)
- `hei_unadded_0184` Bancor Network
- `hei_unadded_0185` Bancor V2.1
- `hei_unadded_0186` Bancor V3

Decision: create one `Bancor` protocol-level DEX record. Do not create separate version records for v0.

### ALEX

Consumed rows:

- `hei_unadded_0052` ALEX / `alexgo` / `alexlab.co`
- `hei_unadded_0053` ALEX / `alex`

Decision: create one `ALEX` protocol-level DEX record.

### Astroport

Consumed rows:

- `hei_unadded_0137` Astroport
- `hei_unadded_0138` Astroport (Classic)
- `hei_unadded_0139` Astroport (Neutron)
- `hei_unadded_0140` Astroport (Terra 2.0)
- `hei_unadded_0141` Astroport (Terra)

Decision: create one `Astroport` protocol-level DEX record and treat chain/version rows as aliases or deployment context.

## Pre-add duplicate checks

Repository search before creation found no existing records for:

- `Balancer`
- `Bancor`
- `Algofi`
- `ALEX`
- `Astroport`

ID checks before creation found no hits for:

- `hei_ex_000357`-`hei_ex_000361`
- `hei_ev_000665`-`hei_ev_000669`
- `hei_src_001454` onward

## Public site / source notes

- These records are not thin `listed_reference`-only entries.
- Each record includes an entity-level official domain or documentation source.
- Each record includes database references from the verified-unadded candidate source rows.
- Event details should be strengthened later where official postmortems or launch announcements are available.

## Next action

After this batch, continue with research candidates from the scan pool, especially:

- ApeSwap
- ApolloX
- Aster
- Arbswap
- ArcherSwap
- ArthSwap
- Backpack if active CEX seed policy is used
