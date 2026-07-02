# Consumed research batch: verified-unadded 0151-0200 / research batch 03

Status: reviewed and resolved

Reviewed at: 2026-07-02

## Canonical entities

| candidate row | canonical entity | result |
|---|---|---|
| `hei_unadded_0162` BEVMSwap | `hei_ex_000578` BEVMSwap | Added as an active BEVM-ecosystem DEX with a year-level 2024 launch marker and current official application and documentation evidence. |
| `hei_unadded_0182` Birake | `hei_ex_000579` Birake | Added as an active interconnected exchange network launched in December 2018, with current Georgia operator records and earlier Estonia origin evidence. |

## Reclassified candidate

| candidate row | result |
|---|---|
| `hei_unadded_0184` BisonFi | `pending_thin`; current DEX-volume data and launch reporting identify an active Solana prop AMM, but a dedicated official service page and stable first-party operator identity were not recovered. |

## Batch output

- new entities: 2
- new events: 2
- new evidence records: 9
- moved to pending thin: 1
- duplicate entities created: 0

## Modeling decisions

- BEVMSwap uses a year-level 2024 launch marker because no exact first-party public launch day was recovered.
- BEVMSwap is separated from the underlying BEVM Layer 2 network.
- Birake is modeled as a DEX-style exchange network because its own materials describe a decentralized trade engine and shared order network, while noting centrally coordinated identity and infrastructure.
- Birake origin preserves both its historical Estonia description and its current Georgia operator identity.
- BisonFi is not forced into a canonical record using an analytics page as a substitute for an official project identity.

## Safety checks

- exact names, slugs, and domains were checked before creation
- exchange and underlying-chain identities were kept separate
- current legal/operator pages were preserved for Birake
- analytics-only protocol identity was not promoted
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
