# Consumed batch: verified-unadded 0052-0100 / batch 02

Status: promoted and resolved

Reviewed at: 2026-06-28

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0053` | `hei_ex_000531` Angstrom | Active Ethereum / Uniswap v4 DEX with launch and current-operation evidence. |
| `hei_unadded_0057` | `hei_ex_000532` Anycoin Direct | Acquired identity with Finst transaction and legacy customer migration. |
| `hei_unadded_0058` | `hei_ex_000533` AOFEX | Dead exchange with regulatory exit, investigation, and account-access disruption history. |
| `hei_unadded_0062`-`0063` | `hei_ex_000534` ApertureSwap | One protocol-level Manta Pacific DEX; duplicate source row collapsed. |
| `hei_unadded_0085`-`0086` | `hei_ex_000535` Ascent Exchange | One protocol-level record covering V1/V3 rows and the Horizen EON deprecation impact. |

## Batch output

- new entities: 5
- new events: 10
- new evidence records: 22
- duplicate entities created: 0

## Modeling decisions

- Anycoin Direct uses `acquired / acquisition`; the 2025 migration is retained as a later transition event.
- AOFEX uses `dead / regulation`; the terminal record distinguishes application removal from later access and withdrawal disruption.
- ApertureSwap database rows are one protocol identity.
- Ascent Exchange V1 and V3 are one protocol identity.
- Ascent uses `dead / chain_failure` because its only verified production deployment was on the discontinued EON chain; the record does not claim a formal operator shutdown announcement.

## Safety checks

- candidate IDs were checked against the machine-bound scan manifest
- record paths were checked before creation
- event source counts were matched to linked evidence
- projected-public overlap validation is required before merge
- no Cloudflare or deployment changes are included
