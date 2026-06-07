# Fresh discovery: BitMEX

Status: added

## Added record

| entity_id | record | path | source |
|---|---|---|---|
| `hei_ex_000425` | BitMEX | `records/exchanges/bitmex.json` | fresh discovery outside verified-unadded 1000-row backlog |

## Decision

BitMEX was added as an event-backed active centralized exchange record.

It was not present in the current verified-unadded 1000-row candidate backlog, but the review found strong public historical value:

- 2021 CFTC / FinCEN civil settlement
- 2022 founder guilty pleas related to Bank Secrecy Act violations
- 2025 company fine / company plea reporting
- active exchange identity

## Backlog handling

No `hei_unadded_*` row is consumed by this addition.

This memo prevents the record from being mistaken for an unexplained manual addition and preserves the reason it entered the canonical dataset outside the initial candidate list.

## Notes

- BitMEX remains active; this is not a shutdown record.
- Company-level events and founder-level events are separated.
- Regulatory and criminal descriptions are attributed to official or reporting sources.
- Future discovery pipelines should allow strong event-backed entities outside the initial 1000-row list to enter through a documented fresh-discovery path.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should remain unaffected because no verified-unadded row is consumed.
