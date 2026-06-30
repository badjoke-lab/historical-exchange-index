# Consumed batch: verified-unadded 0151-0200 / batch 03

Status: promoted and add-now queue closed

Reviewed at: 2026-06-30

## Canonical entities

| candidate row | canonical entity | result |
|---|---|---|
| `hei_unadded_0165` | `hei_ex_000573` Bibox | Added as active with a November 2017 launch marker and current official trading interfaces. |
| `hei_unadded_0192` | `hei_ex_000574` BitcoinToYou | Added as limited because current public service pages coexist with a documented 2024 withdrawal interruption whose complete resolution was not independently confirmed. |

## Reclassified candidate

| candidate rows | result |
|---|---|
| `hei_unadded_0185`-`0186` Bit.com spot/futures | Moved to `needs_research`; reports of a phased exchange wind-down coexist with current first-party BIT trading, OTC, and financial-service pages. |

## Batch output

- new entities: 2
- new events: 3
- new evidence records: 9
- candidates moved to needs research: 1
- duplicate entities created: 0

## Modeling decisions

- Bibox uses a month-level November 2017 launch marker and `Global` origin.
- Bibox remains active because its official site and trading interface remain available.
- BitcoinToYou uses a year-level 2010 launch marker from first-party material.
- BitcoinToYou remains limited until stronger public evidence resolves the conflict between the 2024 interruption report and current service documentation.
- Bit.com is not assigned a canonical record until the historical exchange wind-down and continuing BIT services can be separated safely.

## Range state

```text
promoted new entities:        8
existing entity strengthened: 1
moved to needs_research:       1
remaining unresolved add_now: 0
```

## Safety checks

- current official interfaces were checked before classification
- conflicting status evidence was retained
- ambiguous terminal states were not forced into dead
- event source counts match linked evidence
- no Cloudflare or deployment changes are included
