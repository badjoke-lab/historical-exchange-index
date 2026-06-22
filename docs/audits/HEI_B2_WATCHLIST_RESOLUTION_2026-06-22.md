# HEI B2 watchlist and resolution audit — 2026-06-22

## Result

B2 reorganized monitoring candidates around stable identity keys and one authoritative current-resolution index.

```text
Projected entities: 412
Resolution index entries: 66
Historical resolution files: 7
Historical coverage errors: 0
Validation failures: 0
```

No canonical entity, event, or evidence record was added, removed, or modified.

## Stable candidate identity

New monitoring candidates use normalized, date-independent keys such as:

```text
candidate:txbit
candidate:hashkey-exchange
candidate:dx-exchange
```

Date-local IDs remain only in historical monitoring files. Candidate discovery, news monitoring, monitoring-health, and staging-draft generation now use the stable identity layer.

## Resolution model

`data-staging/watchlists/resolution/index.json` is the authoritative current-state file.

Allowed states:

```text
promoted
held
out_of_scope
duplicate
already_canonical
needs_research
```

Terminal states are `promoted`, `out_of_scope`, `duplicate`, and `already_canonical`. `held` and `needs_research` remain visible as open work without returning as newly discovered candidates on every run.

Final state counts:

```text
promoted:          14
held:              31
out_of_scope:       8
duplicate:          0
already_canonical:  2
needs_research:    11
```

## Reviewed queue migration

The previously reviewed June 14 candidate queues are fully represented in the authoritative index.

```text
existing reviewed:          2
out-of-scope reviewed:      7
priority research reviewed: 10
active/later reviewed:      41
```

The gate verifies the required state for every reviewed name:

- existing candidates must be `promoted` or `already_canonical`;
- out-of-scope candidates must be `out_of_scope`;
- priority research candidates must be `needs_research`;
- active/later candidates must be `held` or `needs_research`.

## Watchlist aggregation

Historical auto-watchlists are aggregated by stable candidate identity.

```text
Watchlist files: 7
Raw candidate rows: 193
Unique candidate identities: 162
Repeated occurrences collapsed: 31
```

Candidate class counts in the aggregated history:

```text
A: 10
B: 148
C: 4
Unknown: 0
```

Lifecycle counts:

```text
Terminally resolved: 23
Open tracked:        37
Unresolved:         102
Aged A candidates:    0
Open reviews due:     0
```

## Permanent safeguards

B2 adds permanent checks for:

- resolution schema and allowed states;
- duplicate candidate keys and conflicting aliases;
- source-file existence;
- projected entity matches for `promoted` and `already_canonical`;
- historical resolution coverage;
- reviewed queue coverage and state consistency;
- stable aggregation of repeated watchlist rows;
- terminal-candidate exclusion from staging drafts;
- preservation of the stable candidate key in generated drafts.

The gate runs on pull requests, `main`, a weekly schedule, and manual dispatch.

## Monitoring behavior

- terminally resolved candidates are excluded from new candidate work;
- `held` and `needs_research` candidates retain their review schedule;
- new and recurring unresolved candidates are distinguishable;
- aged A and stale B candidates are surfaced by monitoring-health;
- candidate discovery and news monitoring use stable dedupe keys;
- resolved candidates cannot be regenerated as staging drafts.

## Public count impact

```text
Entities:  412
Events:    687
Evidence: 1608
```

## Next phase

B3 verifies count semantics across canonical JSON, reviewed bundles, public page loaders, monitoring aggregates, machine-readable output, and sitemap generation.
