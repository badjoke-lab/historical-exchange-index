# HEI B3 count-semantics audit — 2026-06-22

## Result

B3 established one reviewed-count meaning across canonical JSON, reviewed record bundles, monitoring aggregation, machine-readable output, human-facing static output, exchange detail pages, and sitemap generation.

```text
Canonical entities:  306
Canonical events:    513
Canonical evidence: 1172

Reviewed bundles: 152
New-entity bundles: 106
Repair bundles:      46

Projected entities:  412
Projected events:    691
Projected evidence: 1620
```

All checked layers returned the same projected counts.

## Layer consistency

```text
Monitoring:        412 / 691 / 1620
Machine-readable:  412 / 691 / 1620
Built public data: 412 / 691 / 1620
Exchange pages:    412
Sitemap routes:    412 exchange routes / 419 total routes
```

The projected entity, event, and evidence ID sets are identical across monitoring, machine-readable output, and built public output.

## Reviewed-bundle semantics

The regression gate verifies:

- repair bundles do not increase entity count;
- genuinely new reviewed bundles increase entity count exactly once;
- reviewed events and evidence are included exactly once;
- identical duplicate IDs count once;
- conflicting duplicate IDs fail validation;
- all event and evidence `exchange_id` values resolve to projected entities;
- exchange detail-page count equals projected entity count;
- sitemap exchange-route count equals projected entity count;
- sitemap routes are unique and cover every projected entity slug.

## Hidden ID collisions discovered

The first B3 run exposed 16 canonical-versus-bundle ID conflicts that earlier merge behavior silently skipped:

```text
Event conflicts:    4
Evidence conflicts: 12
```

Affected bundles:

- CoinLoan — 2 events and 4 evidence records;
- Zipmex — 2 events and 3 evidence records;
- Garantex — 5 evidence records.

The conflicting records were assigned unused IDs above the previous maximums, and all internal `event_id` references were updated.

New maximum IDs:

```text
Maximum event ID:    hei_ev_002083
Maximum evidence ID: hei_src_003209
```

After remediation:

```text
Event ID conflicts:    0
Evidence ID conflicts: 0
```

The corrected records were previously omitted from projected output because their reused IDs collided with unrelated canonical records. Restoring them increased the reviewed supporting-record counts without changing entity count:

```text
Entities: unchanged at 412
Events:   687 -> 691
Evidence: 1608 -> 1620
```

## Permanent safeguards

B3 adds:

- `npm run counts:test` for synthetic repair/new-bundle and duplicate-ID behavior;
- `npm run counts:check` for full repository count and ID-set regression;
- `npm run records:check-id-collisions` for strict bundle ID collision checks;
- collision checking inside the normal `records:validate` command;
- a permanent pull-request, `main`, weekly, and manual count-semantics workflow;
- diagnostic artifacts containing count summaries and collision reports.

## Public count impact

```text
Entities:  412
Events:    691
Evidence: 1620
```

## Next phase

Phase B is complete. The next phase is Phase C, beginning with candidate scans and reviewed growth planning toward at least 550 entities.
