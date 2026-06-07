# Fresh discovery: BTC-e

Status: added

## Added record

| entity_id | record | path | source |
|---|---|---|---|
| `hei_ex_000424` | BTC-e | `records/exchanges/btc-e.json` | fresh discovery outside verified-unadded 1000-row backlog |

## Decision

BTC-e was added as an event-backed dead centralized exchange record.

It was not present in the current verified-unadded 1000-row candidate backlog, but the review found strong public historical value:

- 2017 U.S. indictment and law-enforcement action
- 2017 FinCEN penalty context referenced by DOJ materials
- original BTC-e service becoming non-operational after the law-enforcement action
- 2024 Alexander Vinnik guilty plea related to BTC-e

## Backlog handling

No `hei_unadded_*` row is consumed by this addition.

This memo prevents the record from being mistaken for an unexplained manual addition and preserves the reason it entered the canonical dataset outside the initial candidate list.

## Notes

- BTC-e is treated as dead due to the original service being taken offline / law-enforcement disruption.
- WEX is not merged into this record.
- 2017 indictment-era claims are recorded as allegations unless supported by later resolution sources.
- The Vinnik guilty plea is recorded separately and does not convert every 2017 allegation into an adjudicated fact.
- Future discovery pipelines should allow strong event-backed entities outside the initial 1000-row list to enter through a documented fresh-discovery path.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should remain unaffected because no verified-unadded row is consumed.
