> Correction: duplicate entity `hei_ex_000427` was removed and its useful event/evidence material was migrated to canonical `hei_ex_000004`. This memo remains as backlog-processing history.

# Fresh discovery: QuadrigaCX

Status: added

## Added record

| entity_id | record | path | source |
|---|---|---|---|
| `hei_ex_000427` | QuadrigaCX | `records/exchanges/quadrigacx.json` | fresh discovery outside verified-unadded 1000-row backlog |

## Decision

QuadrigaCX was added as an event-backed dead centralized exchange record.

It was not present in the current verified-unadded 1000-row candidate backlog, but the review found strong public historical value:

- February 2019 creditor protection after founder death and missing-customer-funds crisis
- April 2019 bankruptcy proceedings
- June 2020 Ontario Securities Commission staff review
- archived original exchange domain

## Backlog handling

No `hei_unadded_*` row is consumed by this addition.

This memo prevents the record from being mistaken for an unexplained manual addition and preserves the reason it entered the canonical dataset outside the initial candidate list.

## Notes

- QuadrigaCX is treated as dead because the original exchange service entered creditor protection, then bankruptcy, and did not resume as the original exchange service.
- Fraud descriptions are attributed to OSC and reporting sources.
- Some source slots currently use temporary public reference material and should be improved later with trustee, court, or archived primary materials when available.
- Future discovery pipelines should allow strong event-backed entities outside the initial 1000-row list to enter through a documented fresh-discovery path.

## Validation expectation

- Records validation should pass with one new record bundle.
- Backlog dedupe should remain unaffected because no verified-unadded row is consumed.
