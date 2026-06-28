# Consumed batch: verified-unadded 0052-0100 / batch 03

Status: promoted and resolved

Reviewed at: 2026-06-28

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0056` | `hei_ex_000536` Antfarm | Added as an active Ethereum-origin DEX and onchain rebalancing protocol. |
| `hei_unadded_0064` | `hei_ex_000537` ApeX Protocol | Added as one continuing protocol identity covering beta, ApeX Pro, ApeX Omni, and the Pro product sunset. |
| `hei_unadded_0075`-`0076` | `hei_ex_000538` Archly | Added once at protocol level with V1 and V2 launch history. |

## Duplicate resolution

| candidate rows | result |
|---|---|
| `hei_unadded_0071`-`0072` | Arbitrum Exchange V2/V3 are version rows under the Arbidex identity and are not separate v0 entities. |

## Batch output

- new entities: 3
- new events: 7
- new evidence records: 17
- duplicate entities created: 0

## Modeling decisions

- Antfarm uses the verified Ethereum launch marker while retaining its later multichain identity.
- CCXT's `apex` identifier is resolved to ApeX Protocol rather than Apex DeFi.
- ApeX Pro sunset is a product-generation transition; the continuing ApeX entity remains active through ApeX Omni.
- Archly V1 and V2 are versions of one cross-chain exchange protocol.
- Arbitrum Exchange and Arbidex are treated as one identity; the exact Arbidex launch chronology remains under research.

## Safety checks

- candidate IDs were checked against the machine-bound scan manifest
- event source counts match linked evidence
- version rows were collapsed before entity creation
- projected-public overlap validation is required before merge
- no Cloudflare or deployment changes are included
