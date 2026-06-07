# Fresh discovery: Nobitex

Status: added

## Added record

| entity_id | record | path | source |
|---|---|---|---|
| `hei_ex_000423` | Nobitex | `records/exchanges/nobitex.json` | fresh discovery outside verified-unadded 1000-row backlog |

## Decision

Nobitex was added as an event-backed active centralized exchange record.

It was not present in the current verified-unadded 1000-row candidate backlog, but the review found strong public historical value:

- June 2025 major security breach
- June 2026 U.S. sanctions designation
- active exchange identity and founding/background reporting

## Backlog handling

No `hei_unadded_*` row is consumed by this addition.

This memo prevents the record from being mistaken for an unexplained manual addition and preserves the reason it entered the canonical dataset outside the initial candidate list.

## Notes

- Nobitex remains active; this is not a shutdown record.
- Regulatory descriptions are attributed to the U.S. Treasury and reporting sources.
- Nobitex's denials and alternative explanations are reflected in record notes where relevant.
- Future discovery pipelines should allow strong event-backed entities outside the initial 1000-row list to enter through a documented fresh-discovery path.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should remain unaffected because no verified-unadded row is consumed.
