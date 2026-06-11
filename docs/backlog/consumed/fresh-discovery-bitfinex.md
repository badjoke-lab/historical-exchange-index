> Correction: duplicate entity `hei_ex_000426` was removed and its useful event/evidence material was migrated to canonical `hei_ex_000017`. This memo remains as backlog-processing history.

# Fresh discovery: Bitfinex

Status: added

## Added record

| entity_id | record | path | source |
|---|---|---|---|
| `hei_ex_000426` | Bitfinex | `records/exchanges/bitfinex.json` | fresh discovery outside verified-unadded 1000-row backlog |

## Decision

Bitfinex was added as an event-backed active centralized exchange record.

It was not present in the current verified-unadded 1000-row candidate backlog, but the review found strong public historical value:

- 2016 CFTC order / civil monetary penalty
- 2016 major Bitfinex hack
- 2022 U.S. seizure of bitcoin connected to the 2016 hack
- active exchange identity

## Backlog handling

No `hei_unadded_*` row is consumed by this addition.

This memo prevents the record from being mistaken for an unexplained manual addition and preserves the reason it entered the canonical dataset outside the initial candidate list.

## Notes

- Bitfinex remains active; this is not a shutdown record.
- The 2022 DOJ case concerns laundering and recovery of stolen funds connected to the 2016 hack; it is not recorded as a finding that Bitfinex itself committed wrongdoing.
- Future discovery pipelines should allow strong event-backed entities outside the initial 1000-row list to enter through a documented fresh-discovery path.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should remain unaffected because no verified-unadded row is consumed.
