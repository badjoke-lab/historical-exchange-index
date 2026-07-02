# Consumed research batch: verified-unadded 0151-0200 / research batch 02

Status: reviewed and resolved

Reviewed at: 2026-07-02

## Canonical entities

| candidate row | canonical entity | result |
|---|---|---|
| `hei_unadded_0166` Biconomy | existing `hei_ex_000094` Biconomy Exchange | Mapped to the existing active centralized-exchange record; no duplicate entity created. |
| `hei_unadded_0187` BIT.TEAM | `hei_ex_000577` BIT.TEAM | Added as an active exchange ecosystem with a 2016 platform launch and early-2022 centralized-exchange expansion. |

## Reclassified candidates

| candidate row | result |
|---|---|
| `hei_unadded_0159` BETCONIX | `pending_thin`; historical exchange directories identify a crypto exchange, but the current domain presents materially different gaming and information services and a reliable first-party exchange shutdown or transition record was not recovered. |
| `hei_unadded_0171` BIKA | `pending_thin`; historical exchange and later BIKA Global references exist, but the former official domain is unavailable and the exact terminal or successor state is not supported by stable first-party lifecycle evidence. |

## Batch output

- new entities: 1
- existing entities matched: 1
- new events: 2
- new evidence records: 5
- moved to pending thin: 2
- duplicate entities created: 0

## Modeling decisions

- Biconomy is not added again because the current exchange is already represented by `hei_ex_000094`.
- BIT.TEAM uses a year-level 2016 platform launch marker and separately records the early-2022 expansion into a centralized crypto exchange.
- BIT.TEAM origin records both UK registration and its principal Russia/CIS operating footprint.
- BETCONIX is not forced into a dead or repurposed canonical record without a reliable terminal date and first-party lifecycle statement.
- BIKA is not merged with the separate historical BiKi identity and is not declared dead solely from an unavailable domain and zero-volume directories.

## Safety checks

- existing Biconomy identity was reused rather than duplicated
- BIKA and BiKi were not conflated
- current domain repurposing was not treated as a confirmed exchange shutdown date
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
