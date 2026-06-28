# Consumed batch: verified-unadded 0101-0150 / batch 03

Status: promoted and resolved

Reviewed at: 2026-06-29

## Canonical entities

| candidate rows | canonical entity | result |
|---|---|---|
| `hei_unadded_0105` | `hei_ex_000548` ATOMARS | Added as `dead / scam_rug` with exact launch and May 2021 terminal wallet-access failure. |
| `hei_unadded_0118`-`0119` | `hei_ex_000549` Azbit | Added once as an active Seychelles CEX with a December 2019 launch and first-party 2026 activity. |
| `hei_unadded_0120` | `hei_ex_000550` B2BX | Added as inactive after the public site went offline and the Estonian license ended in January 2025. |

## Batch output

- new entities: 3
- new events: 6
- new evidence records: 15
- duplicate entities created: 0

## Modeling decisions

- ATOMARS uses `dead / scam_rug` because its own May 5, 2021 statement reported that the CFO and administrator disappeared with access to exchange wallets while withdrawals were blocked.
- Azbit uses `active` because first-party product and listing announcements continued through June 2026.
- Duplicate Azbit database rows are collapsed before entity creation.
- B2BX uses `inactive`, not `dead`, because the website outage and regulatory-license ending establish loss of normal operation but no definitive shutdown notice was recovered.
- B2BX uses a month-level `2018-01-01` launch marker because sources establish January 2018 without an exact day.

## Safety checks

- exact record paths were checked before creation
- event source counts match linked evidence
- candidate dispositions are synchronized with the machine-readable scan
- no Cloudflare or deployment changes are included
