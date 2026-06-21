# HEI B1 full monitoring audit — 2026-06-22

## Result

The full post-Phase-A monitoring run completed successfully against the projected public registry.

```text
Projected entities:  412
Projected events:    687
Projected evidence: 1608
Monitoring groups:   7 / 7 ok
Monitoring errors:   0
Critical findings:   0
Canonical changes:   0
Invalid projected event fields:    0
Invalid projected evidence fields: 0
```

The run used the full external-check configuration with bounded limits for candidate lists, news RSS, regulatory RSS, official domains, evidence URLs, and public site/SEO checks.

## Completion-gate checks

B1 completion requirements all passed:

- all registered monitoring groups produced an `ok` report;
- no monitor returned an execution error;
- no critical finding remained;
- monitoring did not modify `data/entities.json`, `data/events.json`, or `data/evidence.json`;
- the eight missing-entity-reference findings from the first B1 attempt were eliminated by applying reviewed bundle entity-ID remapping to events and evidence;
- legacy event, evidence, and claim-scope enum findings were eliminated from the projected public dataset;
- no closed Phase A structural category was rediscovered.

## Permanent safeguards added

- `npm run data:check-projected-enums` validates canonical data plus reviewed bundles;
- `npm run monitor:check` validates the latest monitoring manifest and all seven monitor reports;
- scheduled monitoring now fails when a monitor errors, a critical finding appears, canonical data is modified, or closed structural debt reappears;
- A3 lineage review checks retain their frozen pre-B1 event baseline after enum normalization.

## Reviewed bundle normalization

B1 normalized legacy values in reviewed record bundles without changing public counts. The normalization covered:

- legacy event types such as `listed_reference`, `rebrand`, `legal_proceeding`, `security_breach`, `recovery_or_settlement`, `acquisition_announced`, and `launch_or_public_operation`;
- legacy `event_status_effect` value `inactive_or_unchanged`;
- legacy evidence source types including `archived_website`, `regulator_statement`, `secondary_report`, `news_report`, `regulatory_statement`, and `legal_document`;
- legacy claim scope `background`.

## Non-blocking monitoring queue

The final run reported 504 findings in total:

```text
Critical:   0
High:       5
Medium:   346
Low:      153
```

The five high findings are not B1 structural failures:

- ArcherSwap: official-site DNS check failure;
- CoinLoan: no projected evidence records;
- Garantex: no projected evidence records;
- Zipmex: no projected evidence records;
- sitemap: required static routes were not all present.

These remain visible for later evidence, status, and public-surface work.

## Candidate and watchlist output

The run produced 61 candidates across discovery and news/regulatory monitoring. Monitoring-health output also confirmed that watchlist and resolution data require reorganization, which is the subject of B2.

## Count impact

```text
Entities:  412
Events:    687
Evidence: 1608
```

No canonical record was added, removed, or directly modified by monitoring.

## Next phase

B2 reorganizes watchlists and resolutions so promoted, held, out-of-scope, duplicate, already-canonical, and needs-research candidates do not repeatedly return as new work.
