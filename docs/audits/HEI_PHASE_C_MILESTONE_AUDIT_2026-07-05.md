# HEI Phase C Milestone Audit — 2026-07-05

Status: audit in progress on `phase-c-milestone-audit`

## Scope

This audit verifies the Phase C reviewed-registry-growth milestone after the repository reached 550 projected public entities.

The audit covers:

- reviewed entity threshold
- count consistency across canonical projection, monitoring, machine-readable output, built output, detail routes, and sitemap routes
- duplicate and reviewed-bundle ID collision checks
- entity quality findings
- country/origin strict review
- active CEX and DEX readiness gates
- lineage and watchlist gates
- archive, URL-state, confidence, and evidence-depth follow-up queues

## Milestone counts

The successful count-semantics run for the 550-entity milestone reported:

```text
Projected:   550 entities / 1004 events / 2621 evidence
Monitoring:  550 entities / 1004 events / 2621 evidence
Machine:     550 entities / 1004 events / 2621 evidence
Built:       550 entities / 1004 events / 2621 evidence
Detail pages: 550
Sitemap exchange routes: 550
Sitemap total routes: 557
Status: pass
```

Reviewed-bundle projection details:

```text
reviewed bundles: 406
new entity bundles: 244
repair bundles: 162
event ID conflicts: 0
evidence ID conflicts: 0
bundle collision status: pass
```

## CI and gate baseline

The 550-entity milestone PR passed the following required workflows after duplicate correction:

- Records validation
- Count semantics regression
- CI build and public validation
- Backlog dedupe
- Permanent entity quality audit
- Country origin strict gate
- Canonical-only active CEX queue
- Active CEX repair audit
- Canonical-only DEX repair queue
- DEX seed readiness audit
- Lineage inventory audit
- Candidate scan gate
- Watchlist resolution gate

## Entity quality baseline

The milestone entity-quality artifact reported:

```text
projected public entities: 550
critical findings: 0
high findings: 2
medium findings: 17
low findings: 60
```

Categories:

```text
active_side_url_status_conflict: 2
missing_original_domain: 11
provisional_text: 6
lineage_text_without_structured_link: 60
```

The two high findings were:

- `hei_ex_000289` BKEX — `limited` with `dead_domain`
- `hei_ex_000290` ZB.com — `limited` with `dead_domain`

This audit branch reclassifies both entities from `limited` to `inactive`. It does not mark either entity dead because the reviewed evidence supports prolonged non-operation but does not establish a sufficiently strong terminal closure marker.

## Archive and URL-state review

The milestone quality baseline contains no critical URL-format or archive-integrity finding. The two high URL/status conflicts are addressed in this audit branch.

The remaining medium queue includes eleven records without a known original official domain. These are not filled with guessed domains. They remain a documented quality-improvement queue for future source-backed repair.

## Confidence and evidence-depth review

The public projection contains 2621 evidence records for 550 entities, an overall average of approximately 4.77 evidence records per entity. This average is descriptive only and is not treated as proof that every entity has equal source depth.

The milestone batch itself added 18 evidence records for nine new entities, giving each new milestone entity two evidence records. Reviewed-bundle collision audit reported zero evidence ID conflicts.

The existing record-quality monitor separately treats zero-evidence entities as high findings and thin dead-side evidence as a review finding. Phase C completion does not erase those future quality queues; it establishes that growth to 550 did not bypass the existing validation and quality gates.

## Country/origin review

The Country origin strict gate passed at the 550-entity milestone. Explicit `Unknown` values are controlled by the reviewed allowlist and corresponding audit document rather than guessed origins.

## Duplicate and identity review

Records validation and backlog dedupe passed after the CoinExchange overlap was detected and removed from the milestone batch. The existing `CoinExchange.io` entity remained canonical, and Coindelta was reviewed and added instead.

The successful reviewed-bundle collision report found zero event or evidence ID conflicts.

## Remaining non-blocking quality backlog

After this audit branch resolves the two high entity-quality findings, the known baseline still contains medium and low follow-up work:

- 11 missing original-domain findings
- 6 provisional-text findings
- 60 low-severity lineage-text review signals

These are quality-improvement queues, not reasons to fabricate values or delay all subsequent product work. They should be handled in reviewed repair batches.

## Phase C conclusion

The reviewed growth milestone of 550 entities is achieved.

Phase C is complete when this audit PR passes the repository gates and merges. The next work is:

1. finish the remaining research rows in range `0401-0450` and close the range;
2. begin Phase D public update surfaces and publication-oriented registry outputs;
3. continue quality-repair batches without reopening count-driven growth as the primary milestone.
