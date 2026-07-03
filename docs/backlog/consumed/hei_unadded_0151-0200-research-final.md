# Consumed research batch: verified-unadded 0151-0200 / final

Status: reviewed and range closed

Reviewed at: 2026-07-02

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0185`-`0186` Bit.com spot/futures | existing `hei_ex_000220` Bit.com | Mapped to the existing `dead / voluntary_shutdown` record; spot and futures are one historical exchange identity, so no duplicate entity was created. |
| `hei_unadded_0190` BitBegin | `hei_ex_000581` BitBegin | Added as an active Georgia-registered CEX launched in March 2018. |
| `hei_unadded_0195` BITCOIVA | `hei_ex_000582` BITCOIVA | Added as an active India-focused CEX launched in June 2020. |
| `hei_unadded_0197` Bitcratic | `hei_ex_000583` Bitcratic | Added as an active Ethereum and BNB Smart Chain DEX using an off-chain order book with on-chain settlement. |

## Reclassified candidates

| candidate rows | result |
|---|---|
| `hei_unadded_0189` BitAsset | `pending_thin`; historical exchange listings exist, but the original official operator and terminal lifecycle cannot be separated safely from unrelated current BitAsset-branded services. |
| `hei_unadded_0199`-`0200` Bitenium spot/futures | `pending_thin` plus duplicate product row; tracker evidence suggests the former domain became unavailable, but no reliable first-party shutdown date or operator statement was recovered. |

## Batch output

- new entities: 3
- existing entities matched: 1
- new events: 3
- new evidence records: 13
- moved to pending thin: 2
- duplicate product rows collapsed: 2
- unresolved research rows after batch: 0

## Modeling decisions

- Bit.com spot and futures map to existing `hei_ex_000220`; the source rows do not justify a second Bit.com entity.
- The existing Bit.com record already preserves the March 31, 2026 terminal date and the earlier January 31 trading cutoff.
- BitBegin uses a month-level March 2018 launch marker and Georgia origin.
- BITCOIVA uses a month-level June 2020 launch marker and is separated from its BCA token.
- Bitcratic retains a medium-confidence November 26, 2018 launch marker from contemporary community evidence and high-confidence current operating evidence.
- BitAsset and Bitenium are not forced into dead records using tracker disappearance alone.

## Range closure

```text
source rows reviewed:           50
unresolved add_now:              0
unresolved needs_research:       0
pending_thin decisions:         15
out-of-scope/duplicate rows:    15
range status:                   closed
```

## Safety checks

- existing Bit.com identity was reused rather than duplicated
- spot and futures product rows were collapsed before entity creation
- current official sites and interfaces were checked for active entities
- tracker-only disappearance was not converted into invented terminal dates
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
