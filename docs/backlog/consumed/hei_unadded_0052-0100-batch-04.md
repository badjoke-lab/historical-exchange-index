# Consumed batch: verified-unadded 0052-0100 / batch 04

Status: promoted and scan closed

Reviewed at: 2026-06-28

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0070` | `hei_ex_000539` Arbidex | Added as a limited Arbitrum DEX with conservative year-level launch dating and a documented Orbs order-type integration. |
| `hei_unadded_0077`-`0078` | `hei_ex_000540` Arena DEX | Added once at protocol level as the active permissionless DEX embedded in The Arena ecosystem. |

## Thin-candidate closure

| candidate row | result |
|---|---|
| `hei_unadded_0065` Apex DeFi | Moved to `pending_thin`; no sufficiently strong first-party launch chronology or independent event package. |
| `hei_unadded_0067` AquaSpace V3 | Moved to `pending_thin`; protocol boundary and launch chronology remain insufficient. |

## Batch output

- new entities: 2
- new events: 3
- new evidence records: 11
- duplicate entities created: 0
- remaining `needs_research`: 0

## Modeling decisions

- Arbitrum Exchange V2 and V3 remain aliases and versions of Arbidex rather than separate entities.
- Arbidex uses `limited`, not `active`, because the live interface displayed zero headline TVL and volume during review and its token lacked current listed markets.
- The Arena social network, token launcher, and DEX are related but not interchangeable. The canonical record covers the DEX only.
- Arena DEX uses a month-level `2025-05-01` launch marker because the exact May 2025 launch day was not recovered.
- Thin rows remain non-canonical until new evidence appears; database listings alone are insufficient.

## Range completion

The corrected `0052-0100` scan is fully classified:

```text
add_now:                  14
needs_research:            0
pending_thin:             17
out_of_scope_or_duplicate:18
```

## Safety checks

- exact record paths were checked before creation
- event source counts match linked evidence
- duplicate and version rows were collapsed before entity creation
- projected-public overlap validation is required before merge
- no Cloudflare or deployment changes are included
